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
      // Departments table
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Users table
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'employee' | 'manager' | 'hr'
          department_id: string | null
          status: string
          profile_image: string | null
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'employee' | 'manager' | 'hr'
          department_id?: string | null
          status?: string
          profile_image?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          role?: 'admin' | 'employee' | 'manager' | 'hr'
          department_id?: string | null
          status?: string
          profile_image?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }

      // AI Events table
      ai_events: {
        Row: {
          id: string
          event_type: string
          category: string
          severity: string
          user_id: string | null
          user_role: string | null
          action: string
          description: string | null
          content_sanitized: string | null
          metadata: Json | null
          context: Json | null
          ai_analysis: Json | null
          risk_score: number | null
          threat_level: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          category: string
          severity: string
          user_id?: string | null
          user_role?: string | null
          action: string
          description?: string | null
          content_sanitized?: string | null
          metadata?: Json | null
          context?: Json | null
          ai_analysis?: Json | null
          risk_score?: number | null
          threat_level?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          category?: string
          severity?: string
          user_id?: string | null
          user_role?: string | null
          action?: string
          description?: string | null
          content_sanitized?: string | null
          metadata?: Json | null
          context?: Json | null
          ai_analysis?: Json | null
          risk_score?: number | null
          threat_level?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // AI Alerts table
      ai_alerts: {
        Row: {
          id: string
          type: string
          severity: string
          title: string
          description: string | null
          user_id: string | null
          status: string
          related_events: Json | null
          assigned_to: string | null
          resolution: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          severity: string
          title: string
          description?: string | null
          user_id?: string | null
          status?: string
          related_events?: Json | null
          assigned_to?: string | null
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          severity?: string
          title?: string
          description?: string | null
          user_id?: string | null
          status?: string
          related_events?: Json | null
          assigned_to?: string | null
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_alerts_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }

      // Employees table
      employees: {
        Row: {
          id: string
          name: string
          position: string | null
          department_id: string | null
          level: string | null
          qualification: string | null
          certifications: string | null
          date_of_birth: string | null
          job_description: string | null
          date_of_resumption: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
          email: string | null
          phone: string | null
          address: string | null
          nationality: string | null
          religion: string | null
          sex: string | null
          next_of_kin: string | null
          next_of_kin_email: string | null
          emergency_contact: string | null
          emergency_contact_email: string | null
        }
        Insert: {
          id?: string
          name: string
          position?: string | null
          department_id?: string | null
          level?: string | null
          qualification?: string | null
          certifications?: string | null
          date_of_birth?: string | null
          job_description?: string | null
          date_of_resumption?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          nationality?: string | null
          religion?: string | null
          sex?: string | null
          next_of_kin?: string | null
          next_of_kin_email?: string | null
          emergency_contact?: string | null
          emergency_contact_email?: string | null
        }
        Update: {
          id?: string
          name?: string
          position?: string | null
          department_id?: string | null
          level?: string | null
          qualification?: string | null
          certifications?: string | null
          date_of_birth?: string | null
          job_description?: string | null
          date_of_resumption?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          nationality?: string | null
          religion?: string | null
          sex?: string | null
          next_of_kin?: string | null
          next_of_kin_email?: string | null
          emergency_contact?: string | null
          emergency_contact_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }

      // App settings table
      app_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          category: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          category: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          category?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Conversations table
      conversations: {
        Row: {
          id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Messages table
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_name: string
          sender_initials: string
          message: string
          is_own: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_name: string
          sender_initials: string
          message: string
          is_own?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_name?: string
          sender_initials?: string
          message?: string
          is_own?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          }
        ]
      }

      // Incidents table
      incidents: {
        Row: {
          id: string
          title: string
          description: string
          employee_id: string
          date: string
          severity: string
          status: string
          action_taken: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          employee_id: string
          date: string
          severity: string
          status?: string
          action_taken?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          employee_id?: string
          date?: string
          severity?: string
          status?: string
          action_taken?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incidents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }

      rewards_punishments: {
        Row: {
          id: string
          employee_id: string
          type: string
          reason: string
          date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          type: string
          reason: string
          date: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          type?: string
          reason?: string
          date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_punishments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }

      chat_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }

      chat_group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          is_admin: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          is_admin?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          is_admin?: boolean
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          }
        ]
      }

      chat_messages: {
        Row: {
          id: string
          group_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          }
        ]
      }

      ai_risk_assessments: {
        Row: {
          id: string
          employee_id: string
          risk_level: "low" | "medium" | "high" | "critical"
          assessment_type: "behavioral" | "performance" | "compliance"
          analysis_data: Json
          confidence_score: number | null
          recommendations: string[] | null
          requires_action: boolean
          reviewed_by: string | null
          reviewed_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          risk_level: "low" | "medium" | "high" | "critical"
          assessment_type: "behavioral" | "performance" | "compliance"
          analysis_data?: Json
          confidence_score?: number | null
          recommendations?: string[] | null
          requires_action?: boolean
          reviewed_by?: string | null
          reviewed_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          risk_level?: "low" | "medium" | "high" | "critical"
          assessment_type?: "behavioral" | "performance" | "compliance"
          analysis_data?: Json
          confidence_score?: number | null
          recommendations?: string[] | null
          requires_action?: boolean
          reviewed_by?: string | null
          reviewed_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_risk_assessments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }

      ai_analytics: {
        Row: {
          id: string
          metric_name: string
          metric_category: string
          metric_value: number | null
          metric_data: Json
          entity_id: string | null
          period_start: string
          period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_category: string
          metric_value?: number | null
          metric_data?: Json
          entity_id?: string | null
          period_start: string
          period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_category?: string
          metric_value?: number | null
          metric_data?: Json
          entity_id?: string | null
          period_start?: string
          period_end?: string
          created_at?: string
        }
        Relationships: []
      }

      company_policies: {
        Row: {
          id: string
          title: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      data_processing_logs: {
        Row: {
          id: string
          data_type: string
          processing_status: string
          message: string
          category: string
          priority: string
          status?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: string
          data_type: string
          processing_status: string
          message: string
          category: string
          priority: string
          status?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          data_type?: string
          processing_status?: string
          message?: string
          category?: string
          priority?: string
          status?: string
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      holidays: {
        Row: {
          id: string
          name: string
          date: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      leave_requests: {
        Row: {
          id: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          reason: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          type: string
          start_date: string
          end_date: string
          reason: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          type?: string
          start_date?: string
          end_date?: string
          reason?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }

      notifications: {
        Row: {
          id: string
          title: string
          message: string
          type: string
          read: boolean
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: string
          read?: boolean
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          user_id?: string | null
          created_at?: string
        }
        Relationships: []
      }

      permissions: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          created_at?: string
        }
        Relationships: []
      }

      resignations_terminations: {
        Row: {
          id: string
          employee_id: string
          type: string
          reason: string
          status: string
          requested_date: string
          effective_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          type: string
          reason: string
          status?: string
          requested_date: string
          effective_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          type?: string
          reason?: string
          status?: string
          requested_date?: string
          effective_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resignations_terminations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          }
        ]
      }

      risk_incidents: {
        Row: {
          id: string
          title: string
          description: string
          risk_level: "low" | "medium" | "high" | "critical"
          department_id: string | null
          reported_by: string
          reported_at: string
          status: string
          resolution: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          risk_level: "low" | "medium" | "high" | "critical"
          department_id?: string | null
          reported_by: string
          reported_at: string
          status?: string
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          risk_level?: "low" | "medium" | "high" | "critical"
          department_id?: string | null
          reported_by?: string
          reported_at?: string
          status?: string
          resolution?: string | null
          resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_incidents_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }

      role_permissions: {
        Row: {
          id: string
          role_id: string
          permission_id: string
          created_at: string
        }
        Insert: {
          id?: string
          role_id: string
          permission_id: string
          created_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          permission_id?: string
          created_at?: string
        }
        Relationships: []
      }

      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          is_custom: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_custom?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_custom?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }

      permission_logs: {
        Row: {
          id: string
          permission_id: string
          role_id: string
          action: 'added' | 'removed' | 'modified'
          changed_by: string
          changed_at: string
          details: string | null
        }
        Insert: {
          id?: string
          permission_id: string
          role_id: string
          action: 'added' | 'removed' | 'modified'
          changed_by: string
          changed_at?: string
          details?: string | null
        }
        Update: {
          id?: string
          permission_id?: string
          role_id?: string
          action?: 'added' | 'removed' | 'modified'
          changed_by?: string
          changed_at?: string
          details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permission_logs_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permission_logs_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }

      // KPIs table
      kpis: {
        Row: {
          id: string
          category: string
          description: string
          target: number
          current: number
          score: number
          department_name: string | null
          employee_name: string | null
          last_updated: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          description: string
          target: number
          current: number
          score: number
          department_name?: string | null
          employee_name?: string | null
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          description?: string
          target?: number
          current?: number
          score?: number
          department_name?: string | null
          employee_name?: string | null
          last_updated?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Approvals table
      approvals: {
        Row: {
          id: string
          employee_id: string
          type: string
          title: string
          description: string
          status: "pending" | "approved" | "rejected"
          current_approver_id: string | null
          approval_flow: string[] // Array of approver IDs in order
          approvers_completed: string[] // Array of approver IDs who have approved
          rejection_reason: string | null
          department_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          type: string
          title: string
          description: string
          status?: "pending" | "approved" | "rejected"
          current_approver_id?: string | null
          approval_flow: string[] // Array of approver IDs in order
          approvers_completed?: string[] // Array of approver IDs who have approved
          rejection_reason?: string | null
          department_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          type?: string
          title?: string
          description?: string
          status?: "pending" | "approved" | "rejected"
          current_approver_id?: string | null
          approval_flow?: string[] // Array of approver IDs in order
          approvers_completed?: string[] // Array of approver IDs who have approved
          rejection_reason?: string | null
          department_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }

      // Meetings table
      meetings: {
        Row: {
          id: string
          group_id: string
          title: string
          description: string | null
          organizer_id: string
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          title: string
          description?: string | null
          organizer_id: string
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          title?: string
          description?: string | null
          organizer_id?: string
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          }
        ]
      }

      // Calls table
      calls: {
        Row: {
          id: string
          group_id: string
          caller_id: string
          callee_id: string
          type: 'voice' | 'video'
          status: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'missed' | 'declined'
          start_time: string | null
          end_time: string | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          caller_id: string
          callee_id: string
          type: 'voice' | 'video'
          status?: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'missed' | 'declined'
          start_time?: string | null
          end_time?: string | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          caller_id?: string
          callee_id?: string
          type?: 'voice' | 'video'
          status?: 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'missed' | 'declined'
          start_time?: string | null
          end_time?: string | null
          duration?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "chat_groups"
            referencedColumns: ["id"]
          }
        ]
      }

      // Pending employees table for onboarding
      pending_employees: {
        Row: {
          id: string
          firstName: string
          lastName: string
          email: string
          password: string
          status: "pending" | "approved" | "rejected"
          rejection_reason: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          firstName: string
          lastName: string
          email: string
          password: string
          status?: "pending" | "approved" | "rejected"
          rejection_reason?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          firstName?: string
          lastName?: string
          email?: string
          password?: string
          status?: "pending" | "approved" | "rejected"
          rejection_reason?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Relationships: []
      }
    }
  }
}

// Export helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums = Record<string, unknown>