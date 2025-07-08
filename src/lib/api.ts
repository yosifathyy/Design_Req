import { supabase, isSupabaseConfigured } from "./supabase";

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
    // Check if profile already exists by ID
    const existingProfile = await getUserProfile(userId);
    if (existingProfile) {
      return existingProfile;
    }

    // Check if a user already exists with this email (different ID)
    const { data: emailProfile, error: emailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (emailProfile && !emailError) {
      console.log(
        `User with email ${email} already exists with ID: ${emailProfile.id}`,
      );
      console.log(`Auth user ID: ${userId}`);

      // If IDs don't match, we have a mismatch between auth and database
      if (emailProfile.id !== userId) {
        console.warn(
          `ID mismatch detected. Database ID: ${emailProfile.id}, Auth ID: ${userId}`,
        );
        console.warn(
          `Using existing profile with database ID. Consider consolidating accounts.`,
        );
      }

      // Return the existing profile as-is to avoid constraint violations
      return emailProfile;
    }

    // Create new profile if none exists
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
      // Handle duplicate email constraint error
      if (
        error.message?.includes(
          "duplicate key value violates unique constraint",
        )
      ) {
        console.warn(
          `Email ${email} already exists. Attempting to fetch existing profile.`,
        );

        // Try to get the existing profile by email
        const { data: existingByEmail } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        return existingByEmail || null;
      }

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

export const findUserProfileByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error finding user by email:", error.message);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Error finding user by email:", error.message);
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
  try {
    const { data, error } = await supabase
      .from("design_requests")
      .insert([requestData])
      .select()
      .single();

    if (error) {
      if (
        error.message?.includes('relation "design_requests" does not exist')
      ) {
        throw new Error(
          "Design requests table does not exist. Please run the database setup script.",
        );
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not create design request. Database table may not exist yet.",
      );
    }
    throw error;
  }
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
  try {
    const { data, error } = await supabase
      .from("design_requests")
      .select("*, files(*)")
      .eq("id", requestId)
      .maybeSingle();

    if (error) {
      if (
        error.message?.includes('relation "design_requests" does not exist')
      ) {
        throw new Error(
          "Design requests table does not exist. Please run the database setup script.",
        );
      }
      throw error;
    }

    if (!data) {
      throw new Error(
        "Request not found or you do not have permission to view it.",
      );
    }

    return data;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not fetch request details. Database table may not exist yet.",
      );
    }
    throw error;
  }
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
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("files")
      .upload(filePath, file);

    if (error) {
      if (error.message?.includes('bucket "files" does not exist')) {
        throw new Error(
          "File storage bucket does not exist. Please run the database setup script.",
        );
      }
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("files").getPublicUrl(filePath);

    return { path: filePath, url: publicUrl };
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("bucket") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not upload file. Storage may not be configured yet.",
      );
    }
    throw error;
  }
};

export const saveFileMetadata = async (fileData: any) => {
  try {
    const { data, error } = await supabase
      .from("files")
      .insert([fileData])
      .select()
      .single();

    if (error) {
      if (error.message?.includes('relation "files" does not exist')) {
        throw new Error(
          "Files table does not exist. Please run the database setup script.",
        );
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not save file metadata. Database table may not exist yet.",
      );
    }
    throw error;
  }
};

// Chat and messages functions
export const getChatByRequestId = async (requestId: string) => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("request_id", requestId)
      .maybeSingle();

    if (error) {
      if (error.message?.includes('relation "chats" does not exist')) {
        throw new Error(
          "Chat functionality is not available. Please run the database setup script.",
        );
      }
      throw error;
    }

    return data;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not access chat. Database tables may not exist yet.",
      );
    }
    throw error;
  }
};

export const getAllChatsForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        request:request_id(
          id,
          title,
          user_id,
          status,
          created_at,
          user:user_id(id, name, email, avatar_url)
        ),
        last_message:messages(content, created_at)
      `,
      )
      .order("updated_at", { ascending: false });

    if (error) {
      if (error.message?.includes('relation "chats" does not exist')) {
        console.warn("Chats table does not exist yet");
        return [];
      }
      throw error;
    }

    // Process the data to get the latest message for each chat
    const processedChats = (data || []).map((chat) => {
      const lastMessage =
        chat.last_message && chat.last_message.length > 0
          ? chat.last_message[chat.last_message.length - 1]
          : null;

      return {
        ...chat,
        last_message: lastMessage,
        last_message_at: lastMessage?.created_at || chat.created_at,
      };
    });

    return processedChats;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      console.warn("Could not fetch chats, returning empty array");
      return [];
    }
    throw error;
  }
};

export const createChat = async (requestId: string, participants: string[]) => {
  try {
    // First create the chat
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([{ request_id: requestId }])
      .select()
      .single();

    if (chatError) {
      if (chatError.message?.includes('relation "chats" does not exist')) {
        throw new Error(
          "Chat functionality is not available. Please run the database setup script.",
        );
      }
      if (chatError.message?.includes("row-level security policy")) {
        throw new Error(
          "Permission denied: Cannot create chat. The database policies need to be set up. Please run the fix_chat_policies_simple.sql script.",
        );
      }
      throw chatError;
    }

    // Then add participants
    const participantRecords = participants.map((userId) => ({
      chat_id: chat.id,
      user_id: userId,
    }));

    const { error: participantError } = await supabase
      .from("chat_participants")
      .insert(participantRecords);

    if (participantError) {
      if (
        participantError.message?.includes(
          'relation "chat_participants" does not exist',
        )
      ) {
        throw new Error(
          "Chat participants table does not exist. Please run the database setup script.",
        );
      }
      if (participantError.message?.includes("row-level security policy")) {
        throw new Error(
          "Cannot add participants to this chat. Please check your permissions.",
        );
      }
      throw participantError;
    }

    return chat;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not create chat. Database tables may not exist yet.",
      );
    }
    throw error;
  }
};

export const getMessages = async (chatId: string) => {
  try {
    // Start with basic messages query
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) {
      if (error.message?.includes('relation "messages" does not exist')) {
        throw new Error(
          "Messages table does not exist. Please run the database setup script.",
        );
      }
      throw error;
    }

    // If we have messages, try to enrich with sender data
    if (data && data.length > 0) {
      try {
        const enrichedMessages = await Promise.all(
          data.map(async (message) => {
            try {
              const { data: sender } = await supabase
                .from("users")
                .select("id, name, email, avatar_url, role")
                .eq("id", message.sender_id)
                .maybeSingle();

              return {
                ...message,
                sender: sender || {
                  id: message.sender_id,
                  name: "Unknown User",
                  email: "",
                  avatar_url: null,
                  role: "user",
                },
              };
            } catch {
              // If sender lookup fails, use fallback
              return {
                ...message,
                sender: {
                  id: message.sender_id,
                  name: "Unknown User",
                  email: "",
                  avatar_url: null,
                  role: "user",
                },
              };
            }
          }),
        );
        return enrichedMessages;
      } catch {
        // If enrichment fails, return basic messages
        return data.map((message) => ({
          ...message,
          sender: {
            id: message.sender_id,
            name: "Unknown User",
            email: "",
            avatar_url: null,
            role: "user",
          },
        }));
      }
    }

    return data || [];
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      // Return empty array instead of throwing error - let chat work without messages
      console.warn("Messages table not accessible, starting with empty chat");
      return [];
    }
    throw error;
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ chat_id: chatId, sender_id: senderId, text }])
      .select()
      .single();

    if (error) {
      if (error.message?.includes('relation "messages" does not exist')) {
        throw new Error(
          "Messages table does not exist. Please run the database setup script.",
        );
      }
      if (error.message?.includes("row-level security policy")) {
        throw new Error(
          "You do not have permission to send messages in this chat.",
        );
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("relation") ||
      error.message?.includes("does not exist")
    ) {
      throw new Error(
        "Could not send message. Database tables may not exist yet.",
      );
    }
    throw error;
  }
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
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message?.includes('relation "users" does not exist')) {
        console.warn("Users table does not exist yet");
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    console.warn("Could not fetch users:", error.message);
    return [];
  }
};

export const getAdminProjects = async () => {
  try {
    const { data, error } = await supabase
      .from("design_requests")
      .select(
        `
        *,
        client:user_id(id, name, email, avatar_url),
        designer:designer_id(id, name, email, avatar_url),
        files(*)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      if (
        error.message?.includes('relation "design_requests" does not exist')
      ) {
        console.warn("Design requests table does not exist yet");
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    console.warn("Could not fetch projects:", error.message);
    return [];
  }
};

export const getAdminInvoices = async () => {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        request:request_id(id, title, user_id)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message?.includes('relation "invoices" does not exist')) {
        console.warn("Invoices table does not exist yet");
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    console.warn("Could not fetch invoices:", error.message);
    return [];
  }
};

export const getSystemAlerts = async () => {
  try {
    const { data, error } = await supabase
      .from("system_alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message?.includes('relation "system_alerts" does not exist')) {
        console.warn("System alerts table does not exist yet");
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    console.warn("Could not fetch system alerts:", error.message);
    return [];
  }
};

export const getAuditLogs = async () => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select(
        `
        *,
        user:user_id(name)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message?.includes('relation "audit_logs" does not exist')) {
        console.warn("Audit logs table does not exist yet");
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error: any) {
    console.warn("Could not fetch audit logs:", error.message);
    return [];
  }
};

export const getAdminAnalytics = async () => {
  try {
    // Get basic counts and metrics from the database
    const [usersResult, projectsResult, invoicesResult] =
      await Promise.allSettled([
        supabase.from("users").select("*"),
        supabase.from("design_requests").select("*"),
        supabase.from("invoices").select("*"),
      ]);

    // Extract data or fallback to empty arrays
    const users =
      usersResult.status === "fulfilled" ? usersResult.value.data || [] : [];
    const projects =
      projectsResult.status === "fulfilled"
        ? projectsResult.value.data || []
        : [];
    const invoices =
      invoicesResult.status === "fulfilled"
        ? invoicesResult.value.data || []
        : [];

    // Calculate analytics metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentProjects = projects.filter(
      (p) => new Date(p.created_at) >= thirtyDaysAgo,
    );
    const completedProjects = projects.filter((p) => p.status === "completed");
    const activeProjects = projects.filter((p) =>
      ["submitted", "in-progress"].includes(p.status),
    );
    const paidInvoices = invoices.filter((i) => i.status === "paid");
    const pendingInvoices = invoices.filter((i) => i.status === "pending");
    const activeUsers = users.filter((u) => u.status === "active");
    const designers = users.filter(
      (u) => u.role === "designer" && u.status === "active",
    );

    // Calculate financial metrics
    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0,
    );
    const pendingRevenue = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0,
    );
    const averageInvoiceSize =
      paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

    // Calculate average turnaround time (simplified)
    const avgTurnaroundTime =
      completedProjects.length > 0
        ? completedProjects.reduce((sum, p) => {
            const created = new Date(p.created_at);
            const updated = new Date(p.updated_at);
            return sum + (updated.getTime() - created.getTime());
          }, 0) /
          completedProjects.length /
          (1000 * 60 * 60 * 24)
        : 0; // Convert to days

    return {
      clientEngagement: {
        activeSessions: activeUsers.length,
        requestsPerWeek: Math.round(recentProjects.length / 4),
        averageProjectValue:
          projects.length > 0
            ? projects.reduce((sum, p) => sum + (p.price || 0), 0) /
              projects.length
            : 0,
        clientRetentionRate:
          users.length > 0 ? activeUsers.length / users.length : 0,
      },
      designerProductivity: {
        averageTurnaroundTime: Math.round(avgTurnaroundTime * 10) / 10,
        completedRequestsThisMonth: recentProjects.filter(
          (p) => p.status === "completed",
        ).length,
        utilizationRate:
          designers.length > 0
            ? activeProjects.length / designers.length / 10
            : 0, // Rough estimate
        customerSatisfaction: 4.5, // Could be calculated from ratings if available
      },
      financialMetrics: {
        monthlyRecurringRevenue: Math.round(totalRevenue),
        averageInvoiceSize: Math.round(averageInvoiceSize),
        outstandingBalance: Math.round(pendingRevenue),
        collectionRate:
          invoices.length > 0 ? paidInvoices.length / invoices.length : 0,
      },
      systemHealth: {
        uptime: 0.999, // Mock value - would need real monitoring
        errorRate: 0.003, // Mock value - would need real monitoring
        averageLoadTime: 1.2, // Mock value - would need real monitoring
        activeUsers: activeUsers.length,
      },
    };
  } catch (error: any) {
    console.warn("Could not fetch analytics data:", error.message);
    // Return fallback data
    return {
      clientEngagement: {
        activeSessions: 0,
        requestsPerWeek: 0,
        averageProjectValue: 0,
        clientRetentionRate: 0,
      },
      designerProductivity: {
        averageTurnaroundTime: 0,
        completedRequestsThisMonth: 0,
        utilizationRate: 0,
        customerSatisfaction: 0,
      },
      financialMetrics: {
        monthlyRecurringRevenue: 0,
        averageInvoiceSize: 0,
        outstandingBalance: 0,
        collectionRate: 0,
      },
      systemHealth: {
        uptime: 0,
        errorRate: 0,
        averageLoadTime: 0,
        activeUsers: 0,
      },
    };
  }
};

export const assignProjectToDesigner = async (
  projectId: string,
  designerId: string,
) => {
  try {
    const { data, error } = await supabase
      .from("design_requests")
      .update({ designer_id: designerId, status: "in-progress" })
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;

    // Log the assignment
    await createAuditLog({
      user_id: designerId,
      action: "project.assigned",
      resource: "design_request",
      resource_id: projectId,
      details: { projectId, designerId },
      ip_address: "127.0.0.1", // Should get real IP
      user_agent: navigator.userAgent,
      severity: "low",
    });

    return data;
  } catch (error: any) {
    console.error("Failed to assign project:", error.message);
    throw error;
  }
};

export const updateProjectStatus = async (
  projectId: string,
  status: string,
) => {
  try {
    const { data, error } = await supabase
      .from("design_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", projectId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Failed to update project status:", error.message);
    throw error;
  }
};

export const createSystemAlert = async (alertData: {
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  source: "system" | "payment" | "user" | "project";
  action_url?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("system_alerts")
      .insert([{ ...alertData, is_read: false }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.warn("Could not create system alert:", error.message);
    return null;
  }
};

export const markAlertAsRead = async (alertId: string) => {
  try {
    const { data, error } = await supabase
      .from("system_alerts")
      .update({ is_read: true })
      .eq("id", alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.warn("Could not mark alert as read:", error.message);
    return null;
  }
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
