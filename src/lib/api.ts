import { supabase } from "./supabase";

// User related functions
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows

    if (error) {
      if (error.message?.includes('relation "users" does not exist')) {
        console.warn("users table does not exist yet");
        return null;
      }
      throw error;
    }

    // If no user found, return null
    if (!data) {
      console.warn(
        `No user profile found for ID: ${userId}. User may need to complete profile setup.`,
      );
      return null;
    }

    return data;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      console.warn(
        "Could not fetch user profile (table may not exist):",
        error.message,
      );
      return null;
    }
    if (error.message?.includes("JSON object requested, multiple")) {
      console.warn(
        `Multiple users found with ID: ${userId}. This indicates a data integrity issue.`,
      );
      return null;
    }
    throw error;
  }
};

export const createUserProfileIfMissing = async (
  userId: string,
  email: string,
  name?: string,
) => {
  try {
    // Check if profile already exists
    const existingProfile = await getUserProfile(userId);
    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    const newProfile = {
      id: userId,
      email: email,
      name: name || email.split("@")[0] || "User",
      role: "user",
      status: "active",
      xp: 0,
      level: 1,
      bio: null,
      skills: null,
      hourly_rate: null,
    };

    const { data, error } = await supabase
      .from("users")
      .insert([newProfile])
      .select()
      .single();

    if (error) {
      console.error("Failed to create user profile:", error.message);
      return null;
    }

    console.log(`Created user profile for ${email}`);
    return data;
  } catch (error: any) {
    console.error("Error creating user profile:", error.message);
    return null;
  }
};

export const updateUserXP = async (userId: string, xpAmount: number) => {
  // First get current XP and level
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("xp, level")
    .eq("id", userId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate new XP and check if level up is needed
  const newXP = user.xp + xpAmount;
  let newLevel = user.level;

  // Simple level up logic: level up every 1000 XP
  if (Math.floor(newXP / 1000) > Math.floor(user.xp / 1000)) {
    newLevel = Math.floor(newXP / 1000) + 1;
  }

  // Update user
  const { data, error } = await supabase
    .from("users")
    .update({ xp: newXP, level: newLevel })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return { data, leveledUp: newLevel > user.level };
};

// Design requests functions
export const createDesignRequest = async (requestData: any) => {
  const { data, error } = await supabase
    .from("design_requests")
    .insert([requestData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getDesignRequests = async (userId: string, filter?: string) => {
  try {
    let query = supabase
      .from("design_requests")
      .select("*, files(*)")
      .eq("user_id", userId);

    if (filter && filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      // If table doesn't exist, return empty array instead of throwing
      if (
        error.message?.includes('relation "design_requests" does not exist')
      ) {
        console.warn(
          "design_requests table does not exist yet. Returning empty array.",
        );
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      console.warn(
        "Could not fetch design requests (table may not exist):",
        error.message,
      );
      return [];
    }
    throw error;
  }
};

export const getDesignRequestById = async (requestId: string) => {
  const { data, error } = await supabase
    .from("design_requests")
    .select("*, files(*)")
    .eq("id", requestId)
    .single();

  if (error) throw error;
  return data;
};

export const updateDesignRequest = async (requestId: string, updates: any) => {
  const { data, error } = await supabase
    .from("design_requests")
    .update(updates)
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// File upload functions
export const uploadFile = async (file: File, path: string) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from("files")
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("files").getPublicUrl(filePath);

  return { path: filePath, url: publicUrl };
};

export const saveFileMetadata = async (fileData: any) => {
  const { data, error } = await supabase
    .from("files")
    .insert([fileData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Chat and messages functions
export const getChatByRequestId = async (requestId: string) => {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("request_id", requestId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    throw error;
  }

  return data;
};

export const createChat = async (requestId: string, participants: string[]) => {
  // First create the chat
  const { data: chat, error: chatError } = await supabase
    .from("chats")
    .insert([{ request_id: requestId }])
    .select()
    .single();

  if (chatError) throw chatError;

  // Then add participants
  const participantRecords = participants.map((userId) => ({
    chat_id: chat.id,
    user_id: userId,
  }));

  const { error: participantError } = await supabase
    .from("chat_participants")
    .insert(participantRecords);

  if (participantError) throw participantError;

  return chat;
};

export const getMessages = async (chatId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:sender_id(id, name, email, avatar_url, role),
      files(*)
    `,
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ chat_id: chatId, sender_id: senderId, text }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Invoice functions
export const getInvoices = async (userId: string, status?: string) => {
  try {
    let query = supabase
      .from("invoices")
      .select(
        `
        *,
        request:request_id(id, title, user_id, designer_id)
      `,
      )
      .eq("request.user_id", userId);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      // If table doesn't exist, return empty array instead of throwing
      if (error.message?.includes('relation "invoices" does not exist')) {
        console.warn(
          "invoices table does not exist yet. Returning empty array.",
        );
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      console.warn(
        "Could not fetch invoices (table may not exist):",
        error.message,
      );
      return [];
    }
    throw error;
  }
  return data;
};

export const createInvoice = async (invoiceData: any) => {
  const { data, error } = await supabase
    .from("invoices")
    .insert([invoiceData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateInvoice = async (invoiceId: string, updates: any) => {
  const { data, error } = await supabase
    .from("invoices")
    .update(updates)
    .eq("id", invoiceId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Contact form submissions
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from("contact_submissions")
    .insert([formData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Admin functions
export const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getAdminProjects = async () => {
  const { data, error } = await supabase
    .from("design_requests")
    .select(
      `
      *,
      client:user_id(id, name, email),
      designer:designer_id(id, name, email),
      files(*)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getSystemAlerts = async () => {
  const { data, error } = await supabase
    .from("system_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getAuditLogs = async () => {
  const { data, error } = await supabase
    .from("audit_logs")
    .select(
      `
      *,
      user:user_id(name)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createAuditLog = async (logData: any) => {
  // Check if Supabase is properly configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "your-supabase-url" ||
    supabaseAnonKey === "your-supabase-anon-key" ||
    supabaseUrl.includes("placeholder")
  ) {
    // Return mock audit log for development
    console.warn("Supabase not configured - skipping audit log");
    return {
      id: `audit_${Date.now()}`,
      ...logData,
      created_at: new Date().toISOString(),
    };
  }

  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .insert([logData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    // Don't fail user creation if audit log fails
    console.error("Failed to create audit log:", error);
    return {
      id: `audit_${Date.now()}`,
      ...logData,
      created_at: new Date().toISOString(),
    };
  }
};

export const createAdminUser = async (userData: {
  name: string;
  email: string;
  role: "user" | "designer" | "admin" | "super-admin";
  status?: "active" | "inactive" | "suspended";
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
}) => {
  // Check if Supabase is properly configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "your-supabase-url" ||
    supabaseAnonKey === "your-supabase-anon-key" ||
    supabaseUrl.includes("placeholder")
  ) {
    // Return mock data for development when Supabase is not configured
    const mockUser = {
      id: `user_${Date.now()}`,
      ...userData,
      status: userData.status || "active",
      xp: 0,
      level: 1,
      created_at: new Date().toISOString(),
      last_login: null,
    };

    console.warn("Supabase not configured - returning mock user data");
    return mockUser;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          status: userData.status || "active",
          xp: 0,
          level: 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    if (error.message?.includes("Failed to fetch")) {
      throw new Error(
        "Unable to connect to database. Please check your internet connection or contact support.",
      );
    }
    throw error;
  }
};

export const updateAdminUser = async (
  userId: string,
  userData: {
    name?: string;
    email?: string;
    role?: "user" | "designer" | "admin" | "super-admin";
    status?: "active" | "inactive" | "suspended";
    avatar_url?: string;
  },
) => {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const uploadUserAvatar = async (file: File, userId: string) => {
  // Check if Supabase is properly configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "your-supabase-url" ||
    supabaseAnonKey === "your-supabase-anon-key" ||
    supabaseUrl.includes("placeholder")
  ) {
    // Return mock avatar URL for development
    console.warn("Supabase not configured - returning mock avatar URL");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error: any) {
    if (error.message?.includes("Failed to fetch")) {
      throw new Error(
        "Unable to upload avatar. Please check your internet connection or contact support.",
      );
    }
    throw error;
  }
};
