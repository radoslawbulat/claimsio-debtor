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
      case_attachments: {
        Row: {
          case_id: string | null
          created_at: string
          description: string | null
          file_name: string
          id: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          id?: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          id?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_attachments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          case_description: string | null
          case_number: string
          created_at: string
          creditor_name: string
          currency: string
          debt_amount: number
          debt_date: string | null
          debt_remaining: number
          debtor_id: string | null
          due_date: string
          id: string
          payment_link_amount: number | null
          payment_link_url: string | null
          priority: Database["public"]["Enums"]["case_priority"]
          status: Database["public"]["Enums"]["case_status"]
          updated_at: string
        }
        Insert: {
          case_description?: string | null
          case_number: string
          created_at?: string
          creditor_name: string
          currency: string
          debt_amount: number
          debt_date?: string | null
          debt_remaining: number
          debtor_id?: string | null
          due_date: string
          id?: string
          payment_link_amount?: number | null
          payment_link_url?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          updated_at?: string
        }
        Update: {
          case_description?: string | null
          case_number?: string
          created_at?: string
          creditor_name?: string
          currency?: string
          debt_amount?: number
          debt_date?: string | null
          debt_remaining?: number
          debtor_id?: string | null
          due_date?: string
          id?: string
          payment_link_amount?: number | null
          payment_link_url?: string | null
          priority?: Database["public"]["Enums"]["case_priority"]
          status?: Database["public"]["Enums"]["case_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cases_debtor_id_fkey"
            columns: ["debtor_id"]
            isOneToOne: false
            referencedRelation: "debtors"
            referencedColumns: ["id"]
          },
        ]
      }
      comms: {
        Row: {
          case_id: string
          comms_type: Database["public"]["Enums"]["comms_type"]
          content: string | null
          created_at: string
          direction: Database["public"]["Enums"]["comms_direction"]
          id: string
          status: Database["public"]["Enums"]["comms_status"]
          updated_at: string
        }
        Insert: {
          case_id: string
          comms_type: Database["public"]["Enums"]["comms_type"]
          content?: string | null
          created_at?: string
          direction: Database["public"]["Enums"]["comms_direction"]
          id?: string
          status: Database["public"]["Enums"]["comms_status"]
          updated_at?: string
        }
        Update: {
          case_id?: string
          comms_type?: Database["public"]["Enums"]["comms_type"]
          content?: string | null
          created_at?: string
          direction?: Database["public"]["Enums"]["comms_direction"]
          id?: string
          status?: Database["public"]["Enums"]["comms_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commss_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      debtors: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          language: string | null
          last_name: string
          personal_id: string | null
          phone_number: string | null
          status: string | null
          total_debt_amount: number
          total_debt_remaining: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          language?: string | null
          last_name: string
          personal_id?: string | null
          phone_number?: string | null
          status?: string | null
          total_debt_amount?: number
          total_debt_remaining?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          language?: string | null
          last_name?: string
          personal_id?: string | null
          phone_number?: string | null
          status?: string | null
          total_debt_amount?: number
          total_debt_remaining?: number
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_received: number
          case_id: string | null
          created_at: string
          currency: string
          id: string
          payment_intent_id: string | null
          payment_link_id: string | null
          payment_link_url: string | null
          payment_method: string | null
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount_received: number
          case_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_intent_id?: string | null
          payment_link_id?: string | null
          payment_link_url?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount_received?: number
          case_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          payment_intent_id?: string | null
          payment_link_id?: string | null
          payment_link_url?: string | null
          payment_method?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
      case_status: "ACTIVE" | "CLOSED"
      comms_direction: "inbound" | "outbound"
      comms_status: "pending" | "completed" | "failed" | "cancelled"
      comms_type: "call" | "email" | "sms"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
