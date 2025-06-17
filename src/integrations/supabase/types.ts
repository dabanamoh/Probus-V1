export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_analytics: {
        Row: {
          created_at: string
          entity_id: string | null
          id: string
          metric_category: string
          metric_data: Json
          metric_name: string
          metric_value: number | null
          period_end: string
          period_start: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          id?: string
          metric_category: string
          metric_data?: Json
          metric_name: string
          metric_value?: number | null
          period_end: string
          period_start: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          id?: string
          metric_category?: string
          metric_data?: Json
          metric_name?: string
          metric_value?: number | null
          period_end?: string
          period_start?: string
        }
        Relationships: []
      }
      ai_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          department_id: string | null
          employee_id: string | null
          expires_at: string | null
          id: string
          outcome: string | null
          prediction_data: Json
          prediction_type: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          department_id?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          outcome?: string | null
          prediction_data?: Json
          prediction_type: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          department_id?: string | null
          employee_id?: string | null
          expires_at?: string | null
          id?: string
          outcome?: string | null
          prediction_data?: Json
          prediction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_predictions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_risk_assessments: {
        Row: {
          analysis_data: Json
          assessment_type: Database["public"]["Enums"]["ai_analysis_type"]
          confidence_score: number | null
          created_at: string
          employee_id: string
          expires_at: string | null
          id: string
          recommendations: string[] | null
          requires_action: boolean
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
        }
        Insert: {
          analysis_data?: Json
          assessment_type: Database["public"]["Enums"]["ai_analysis_type"]
          confidence_score?: number | null
          created_at?: string
          employee_id: string
          expires_at?: string | null
          id?: string
          recommendations?: string[] | null
          requires_action?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level: Database["public"]["Enums"]["risk_level"]
        }
        Update: {
          analysis_data?: Json
          assessment_type?: Database["public"]["Enums"]["ai_analysis_type"]
          confidence_score?: number | null
          created_at?: string
          employee_id?: string
          expires_at?: string | null
          id?: string
          recommendations?: string[] | null
          requires_action?: boolean
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
        }
        Relationships: [
          {
            foreignKeyName: "ai_risk_assessments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      chat_group_members: {
        Row: {
          group_id: string
          id: string
          is_admin: boolean
          joined_at: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          is_admin?: boolean
          joined_at?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          is_admin?: boolean
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_groups: {
        Row: {
          created_at: string
          created_by: string
          department_id: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          type: Database["public"]["Enums"]["chat_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          type?: Database["public"]["Enums"]["chat_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: Database["public"]["Enums"]["chat_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_groups_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string | null
          created_at: string
          edited_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          group_id: string
          id: string
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          reply_to_id: string | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          group_id: string
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          reply_to_id?: string | null
          sender_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          group_id?: string
          id?: string
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          reply_to_id?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      company_policies: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          effective_date: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by: string
          effective_date: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          effective_date?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      compliance_history: {
        Row: {
          actions_required: string[] | null
          compliance_type: string
          created_at: string
          details: Json
          id: string
          issues_found: number | null
          resolved_at: string | null
          score: number
          status: string
        }
        Insert: {
          actions_required?: string[] | null
          compliance_type: string
          created_at?: string
          details?: Json
          id?: string
          issues_found?: number | null
          resolved_at?: string | null
          score: number
          status?: string
        }
        Update: {
          actions_required?: string[] | null
          compliance_type?: string
          created_at?: string
          details?: Json
          id?: string
          issues_found?: number | null
          resolved_at?: string | null
          score?: number
          status?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_processing_logs: {
        Row: {
          action_type: string
          created_at: string
          data_category: string
          id: string
          legal_basis: string
          processor_id: string | null
          purpose: string
          retention_period: unknown | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          data_category: string
          id?: string
          legal_basis: string
          processor_id?: string | null
          purpose: string
          retention_period?: unknown | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          data_category?: string
          id?: string
          legal_basis?: string
          processor_id?: string | null
          purpose?: string
          retention_period?: unknown | null
          user_id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_departments_manager"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          certifications: string | null
          created_at: string
          date_of_birth: string | null
          date_of_resumption: string | null
          department_id: string | null
          id: string
          job_description: string | null
          level: string | null
          name: string
          position: string | null
          profile_image_url: string | null
          qualification: string | null
          updated_at: string
        }
        Insert: {
          certifications?: string | null
          created_at?: string
          date_of_birth?: string | null
          date_of_resumption?: string | null
          department_id?: string | null
          id?: string
          job_description?: string | null
          level?: string | null
          name: string
          position?: string | null
          profile_image_url?: string | null
          qualification?: string | null
          updated_at?: string
        }
        Update: {
          certifications?: string | null
          created_at?: string
          date_of_birth?: string | null
          date_of_resumption?: string | null
          department_id?: string | null
          id?: string
          job_description?: string | null
          level?: string | null
          name?: string
          position?: string | null
          profile_image_url?: string | null
          qualification?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          is_recurring: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      incidents: {
        Row: {
          created_at: string
          date_reported: string
          department_id: string | null
          description: string
          id: string
          incident_type: string
          location: string | null
          reporter_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_reported?: string
          department_id?: string | null
          description: string
          id?: string
          incident_type?: string
          location?: string | null
          reporter_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_reported?: string
          department_id?: string | null
          description?: string
          id?: string
          incident_type?: string
          location?: string | null
          reporter_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          days_requested: number
          employee_id: string
          end_date: string
          id: string
          leave_type: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          days_requested: number
          employee_id: string
          end_date: string
          id?: string
          leave_type: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          days_requested?: number
          employee_id?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string
          file_name: string | null
          file_size: string | null
          id: string
          is_own: boolean | null
          message: string
          message_type: string | null
          sender_initials: string
          sender_name: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          file_name?: string | null
          file_size?: string | null
          id?: string
          is_own?: boolean | null
          message: string
          message_type?: string | null
          sender_initials: string
          sender_name: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          file_name?: string | null
          file_size?: string | null
          id?: string
          is_own?: boolean | null
          message?: string
          message_type?: string | null
          sender_initials?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          recipient_id: string
          sender_id: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          recipient_id: string
          sender_id?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          recipient_id?: string
          sender_id?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      resignations_terminations: {
        Row: {
          created_at: string
          employee_id: string
          id: string
          request_date: string
          request_type: string
          status: string
          updated_at: string
          years_of_service: number
        }
        Insert: {
          created_at?: string
          employee_id: string
          id?: string
          request_date?: string
          request_type: string
          status?: string
          updated_at?: string
          years_of_service?: number
        }
        Update: {
          created_at?: string
          employee_id?: string
          id?: string
          request_date?: string
          request_type?: string
          status?: string
          updated_at?: string
          years_of_service?: number
        }
        Relationships: [
          {
            foreignKeyName: "resignations_terminations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards_punishments: {
        Row: {
          amount: number | null
          awarded_by: string | null
          category: string
          created_at: string
          date_awarded: string
          description: string
          employee_id: string
          id: string
          incident_id: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          awarded_by?: string | null
          category: string
          created_at?: string
          date_awarded?: string
          description: string
          employee_id: string
          id?: string
          incident_id?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          awarded_by?: string | null
          category?: string
          created_at?: string
          date_awarded?: string
          description?: string
          employee_id?: string
          id?: string
          incident_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_punishments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_punishments_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_incidents: {
        Row: {
          ai_analysis: Json | null
          assigned_to: string | null
          created_at: string
          department_id: string | null
          description: string
          employee_id: string | null
          id: string
          incident_type: string
          resolution_status: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["risk_level"]
          updated_at: string
        }
        Insert: {
          ai_analysis?: Json | null
          assigned_to?: string | null
          created_at?: string
          department_id?: string | null
          description: string
          employee_id?: string | null
          id?: string
          incident_type: string
          resolution_status?: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["risk_level"]
          updated_at?: string
        }
        Update: {
          ai_analysis?: Json | null
          assigned_to?: string | null
          created_at?: string
          department_id?: string | null
          description?: string
          employee_id?: string | null
          id?: string
          incident_type?: string
          resolution_status?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["risk_level"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_incidents_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_incidents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      ai_analysis_type:
        | "performance"
        | "behavioral"
        | "compliance"
        | "fraud"
        | "harassment"
      app_role: "admin" | "manager" | "employee" | "hr"
      chat_type: "direct" | "group" | "department"
      file_access_level: "public" | "department" | "private" | "restricted"
      message_type: "text" | "file" | "system"
      risk_level: "low" | "medium" | "high" | "critical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_analysis_type: [
        "performance",
        "behavioral",
        "compliance",
        "fraud",
        "harassment",
      ],
      app_role: ["admin", "manager", "employee", "hr"],
      chat_type: ["direct", "group", "department"],
      file_access_level: ["public", "department", "private", "restricted"],
      message_type: ["text", "file", "system"],
      risk_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
