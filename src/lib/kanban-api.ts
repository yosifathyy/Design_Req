import { supabase } from "./supabase";
import { Database } from "./database.types";

export type DesignRequest =
  Database["public"]["Tables"]["design_requests"]["Row"];
export type DesignRequestUpdate =
  Database["public"]["Tables"]["design_requests"]["Update"];

// Map design request statuses to Kanban columns
export const KANBAN_STATUS_MAP = {
  draft: "new",
  submitted: "new",
  "in-progress": "in-progress",
  completed: "needs-feedback",
  delivered: "completed",
} as const;

// Reverse mapping for updating database
export const DATABASE_STATUS_MAP = {
  new: "submitted",
  "in-progress": "in-progress",
  "needs-feedback": "completed",
  revisions: "in-progress", // Custom status for revisions
  completed: "delivered",
} as const;

export interface KanbanProject {
  id: string;
  title: string;
  description: string;
  status: "new" | "in-progress" | "needs-feedback" | "revisions" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  clientName: string;
  clientEmail?: string;
  designerId?: string;
  designerName?: string;
  budget: number;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  tasks: any[]; // We'll simulate tasks for now
  timeline: any[]; // We'll simulate timeline for now
}

export const kanbanApi = {
  // Get all design requests formatted for Kanban
  async getAllProjects(): Promise<KanbanProject[]> {
    try {
      const { data: requests, error } = await supabase
        .from("design_requests")
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching design requests:", error);
        throw error;
      }

      if (!requests) return [];

      // Transform to Kanban format
      return requests.map((request): KanbanProject => {
        const kanbanStatus = this.getKanbanStatus(request.status);

        return {
          id: request.id,
          title: request.title,
          description: request.description,
          status: kanbanStatus,
          priority:
            request.priority === "high" ? "urgent" : (request.priority as any),
          clientName: (request.client as any)?.name || "Unknown Client",
          clientEmail: (request.client as any)?.email || "",
          designerId: request.designer_id || undefined,
          designerName: (request.designer as any)?.name || "Unassigned",
          budget: request.price,
          estimatedHours: this.estimateHours(request.price),
          actualHours: Math.floor(Math.random() * 20), // Simulated for now
          dueDate: this.calculateDueDate(request.created_at),
          createdAt: request.created_at,
          updatedAt: request.updated_at,
          category: request.category,
          tasks: this.generateTasks(request.id, kanbanStatus), // Simulated tasks
          timeline: [], // Simulated timeline
        };
      });
    } catch (error) {
      console.error("Error in getAllProjects:", error);
      return [];
    }
  },

  // Update project status
  async updateProjectStatus(
    projectId: string,
    newKanbanStatus: KanbanProject["status"],
  ): Promise<void> {
    try {
      const dbStatus = this.getDatabaseStatus(newKanbanStatus);

      const { error } = await supabase
        .from("design_requests")
        .update({
          status: dbStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) {
        console.error("Error updating project status:", error);
        throw error;
      }

      console.log(
        `✅ Updated project ${projectId} to status: ${newKanbanStatus} (DB: ${dbStatus})`,
      );
    } catch (error) {
      console.error("Error in updateProjectStatus:", error);
      throw error;
    }
  },

  // Create new project
  async createProject(project: Partial<KanbanProject>): Promise<KanbanProject> {
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("design_requests")
        .insert({
          title: project.title || "New Project",
          description: project.description || "",
          category: project.category || "general",
          priority:
            project.priority === "urgent"
              ? "high"
              : (project.priority as any) || "medium",
          status: "submitted",
          user_id: user.id,
          price: project.budget || 1000,
        })
        .select(
          `
          *,
          client:user_id(id, name, email),
          designer:designer_id(id, name, email)
        `,
        )
        .single();

      if (error) {
        console.error("Error creating project:", error);
        throw error;
      }

      // Transform to Kanban format
      const kanbanStatus = this.getKanbanStatus(data.status);

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        status: kanbanStatus,
        priority: data.priority === "high" ? "urgent" : (data.priority as any),
        clientName: (data.client as any)?.name || "Unknown Client",
        clientEmail: (data.client as any)?.email || "",
        designerId: data.designer_id || undefined,
        designerName: (data.designer as any)?.name || "Unassigned",
        budget: data.price,
        estimatedHours: this.estimateHours(data.price),
        actualHours: 0,
        dueDate: this.calculateDueDate(data.created_at),
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        category: data.category,
        tasks: this.generateTasks(data.id, kanbanStatus),
        timeline: [],
      };
    } catch (error) {
      console.error("Error in createProject:", error);
      throw error;
    }
  },

  // Helper methods
  getKanbanStatus(dbStatus: DesignRequest["status"]): KanbanProject["status"] {
    switch (dbStatus) {
      case "draft":
      case "submitted":
        return "new";
      case "in-progress":
        return "in-progress";
      case "completed":
        return "needs-feedback";
      case "delivered":
        return "completed";
      default:
        return "new";
    }
  },

  getDatabaseStatus(
    kanbanStatus: KanbanProject["status"],
  ): DesignRequest["status"] {
    switch (kanbanStatus) {
      case "new":
        return "submitted";
      case "in-progress":
        return "in-progress";
      case "needs-feedback":
        return "completed";
      case "revisions":
        return "in-progress";
      case "completed":
        return "delivered";
      default:
        return "submitted";
    }
  },

  estimateHours(budget: number): number {
    // Simple estimation: $50/hour rate
    return Math.ceil(budget / 50);
  },

  calculateDueDate(createdAt: string): string {
    const created = new Date(createdAt);
    const dueDate = new Date(created);
    dueDate.setDate(created.getDate() + 14); // 2 weeks from creation
    return dueDate.toISOString();
  },

  generateTasks(projectId: string, status: KanbanProject["status"]): any[] {
    const baseTasks = [
      {
        id: `${projectId}-1`,
        title: "Initial concept",
        status: "completed",
        priority: "high",
      },
      {
        id: `${projectId}-2`,
        title: "Design mockups",
        status: status === "new" ? "pending" : "completed",
        priority: "medium",
      },
      {
        id: `${projectId}-3`,
        title: "Client review",
        status:
          status === "needs-feedback"
            ? "in-progress"
            : status === "completed"
              ? "completed"
              : "pending",
        priority: "medium",
      },
      {
        id: `${projectId}-4`,
        title: "Final delivery",
        status: status === "completed" ? "completed" : "pending",
        priority: "high",
      },
    ];

    return baseTasks;
  },
};

// Real-time subscription
export const subscribeToKanbanUpdates = (
  callback: (projects: KanbanProject[]) => void,
) => {
  const channel = supabase
    .channel("kanban-updates")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "design_requests",
      },
      () => {
        // Refetch projects when changes occur
        kanbanApi.getAllProjects().then(callback).catch(console.error);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
