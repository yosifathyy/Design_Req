export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'designer' | 'admin' | 'super-admin'
          status: 'active' | 'inactive' | 'suspended'
          xp: number
          level: number
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'designer' | 'admin' | 'super-admin'
          status?: 'active' | 'inactive' | 'suspended'
          xp?: number
          level?: number
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'designer' | 'admin' | 'super-admin'
          status?: 'active' | 'inactive' | 'suspended'
          xp?: number
          level?: number
          created_at?: string
          last_login?: string | null
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string
          description: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon: string
          description: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string
          description?: string
          unlocked_at?: string
        }
      }
      design_requests: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          priority: 'low' | 'medium' | 'high'
          status: 'draft' | 'submitted' | 'in-progress' | 'completed' | 'delivered'
          user_id: string
          designer_id: string | null
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'draft' | 'submitted' | 'in-progress' | 'completed' | 'delivered'
          user_id: string
          designer_id?: string | null
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'draft' | 'submitted' | 'in-progress' | 'completed' | 'delivered'
          user_id?: string
          designer_id?: string | null
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          name: string
          url: string
          type: string
          size: number
          thumbnail: string | null
          request_id: string | null
          message_id: string | null
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          type: string
          size: number
          thumbnail?: string | null
          request_id?: string | null
          message_id?: string | null
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          type?: string
          size?: number
          thumbnail?: string | null
          request_id?: string | null
          message_id?: string | null
          uploaded_by?: string
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          request_id: string
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          created_at?: string
        }
      }
      chat_participants: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          text?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          request_id: string
          amount: number
          status: 'pending' | 'paid' | 'overdue'
          due_date: string
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          request_id: string
          amount: number
          status?: 'pending' | 'paid' | 'overdue'
          due_date: string
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          request_id?: string
          amount?: number
          status?: 'pending' | 'paid' | 'overdue'
          due_date?: string
          created_at?: string
          paid_at?: string | null
        }
      }
      system_alerts: {
        Row: {
          id: string
          type: 'info' | 'warning' | 'error' | 'success'
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          source: 'system' | 'payment' | 'user' | 'project'
          created_at: string
        }
        Insert: {
          id?: string
          type: 'info' | 'warning' | 'error' | 'success'
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          source: 'system' | 'payment' | 'user' | 'project'
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'info' | 'warning' | 'error' | 'success'
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
          source?: 'system' | 'payment' | 'user' | 'project'
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource: string
          resource_id: string | null
          details: Json
          ip_address: string
          user_agent: string
          created_at: string
          severity: 'low' | 'medium' | 'high' | 'critical'
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource: string
          resource_id?: string | null
          details: Json
          ip_address: string
          user_agent: string
          created_at?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource?: string
          resource_id?: string | null
          details?: Json
          ip_address?: string
          user_agent?: string
          created_at?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          created_at: string
          status: 'new' | 'read' | 'replied' | 'archived'
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          created_at?: string
          status?: 'new' | 'read' | 'replied' | 'archived'
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          created_at?: string
          status?: 'new' | 'read' | 'replied' | 'archived'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}