import { supabase } from "./supabase";
import { Database } from "./database.types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type ProjectTask = Database["public"]["Tables"]["project_tasks"]["Row"];
export type ProjectTaskInsert =
  Database["public"]["Tables"]["project_tasks"]["Insert"];
export type ProjectTaskUpdate =
  Database["public"]["Tables"]["project_tasks"]["Update"];
export type ProjectTimeline =
  Database["public"]["Tables"]["project_timeline"]["Row"];

// Projects API
export const projectsApi = {
  // Get all projects with designer information
  async getAll() {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        designer:designer_id(id, name, email, avatar_url),
        tasks:project_tasks(id, title, status, priority),
        timeline:project_timeline(id, message, type, created_at)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }

    return data || [];
  },

  // Get project by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        designer:designer_id(id, name, email, avatar_url),
        tasks:project_tasks(*),
        timeline:project_timeline(*, user:user_id(name, avatar_url))
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
      throw error;
    }

    return data;
  },

  // Create new project
  async create(project: ProjectInsert) {
    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      throw error;
    }

    // Log timeline entry
    if (data) {
      await this.addTimelineEntry(data.id, "Project created", "status_change");
    }

    return data;
  },

  // Update project
  async update(id: string, updates: ProjectUpdate) {
    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating project:", error);
      throw error;
    }

    // Log status change if status was updated
    if (updates.status && data) {
      await this.addTimelineEntry(
        data.id,
        `Status changed to ${updates.status}`,
        "status_change",
      );
    }

    return data;
  },

  // Delete project
  async delete(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("Error deleting project:", error);
      throw error;
    }

    return true;
  },

  // Update project status (for drag and drop)
  async updateStatus(id: string, status: Project["status"]) {
    return this.update(id, { status });
  },

  // Add timeline entry
  async addTimelineEntry(
    projectId: string,
    message: string,
    type: ProjectTimeline["type"] = "comment",
  ) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated");
      return null;
    }

    const { data, error } = await supabase
      .from("project_timeline")
      .insert({
        project_id: projectId,
        created_by: user.id,
        message,
        type,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding timeline entry:", error);
      throw error;
    }

    return data;
  },
};

// Project Tasks API
export const projectTasksApi = {
  // Get tasks for a project
  async getByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from("project_tasks")
      .select(
        `
        *,
        assigned_user:assigned_to(id, name, email, avatar_url)
      `,
      )
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching project tasks:", error);
      throw error;
    }

    return data || [];
  },

  // Create task
  async create(task: ProjectTaskInsert) {
    const { data, error } = await supabase
      .from("project_tasks")
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      throw error;
    }

    // Log timeline entry
    if (data) {
      await projectsApi.addTimelineEntry(
        data.project_id,
        `Task created: ${data.title}`,
        "task_update",
      );
    }

    return data;
  },

  // Update task
  async update(id: string, updates: ProjectTaskUpdate) {
    const { data, error } = await supabase
      .from("project_tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
      throw error;
    }

    // Log timeline entry for status changes
    if (updates.status && data) {
      await projectsApi.addTimelineEntry(
        data.project_id,
        `Task "${data.title}" status changed to ${updates.status}`,
        "task_update",
      );
    }

    return data;
  },

  // Delete task
  async delete(id: string) {
    const { error } = await supabase
      .from("project_tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      throw error;
    }

    return true;
  },
};

// Real-time subscriptions
export const subscribeToProjects = (
  callback: (projects: Project[]) => void,
) => {
  const channel = supabase
    .channel("projects-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "projects",
      },
      () => {
        // Refetch all projects when any change occurs
        projectsApi.getAll().then(callback).catch(console.error);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
