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
      cases: {
        Row: {
          created_at: string
          id: number
          person_id: number
          status: "High Priority" | "Active Search" | "New" | "Closed"
          reported_by: string | null
          contact_name: string | null
          contact_role: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          person_id: number
          status: "High Priority" | "Active Search" | "New" | "Closed"
          reported_by: string | null
          contact_name: string | null
          contact_role: string | null
        }
        Update: {
          created_at?: string
          id?: number
          person_id?: number
          status?: "High Priority" | "Active Search" | "New" | "Closed"
          reported_by?: string | null
          contact_name?: string | null
          contact_role?: string | null
        }
      }
      persons: {
        Row: {
          id: number
          created_at: string
          name: string
          age: number
          description: string
          last_seen_location: string
          last_seen_date: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          age: number
          description: string
          last_seen_location: string
          last_seen_date: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          age?: number
          description?: string
          last_seen_location?: string
          last_seen_date?: string
        }
      }
      photos: {
        Row: {
          id: number
          created_at: string
          person_id: number
          image_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          person_id: number
          image_url: string
        }
        Update: {
          id?: number
          created_at?: string
          person_id?: number
          image_url?: string
        }
      }
      sightings: {
        Row: {
          id: number
          created_at: string
          location: string | null
          image_url: string
          notes: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          location?: string | null
          image_url: string
          notes?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          location?: string | null
          image_url?: string
          notes?: string | null
        }
      }
      potential_matches: {
        Row: {
          id: number
          created_at: string
          sighting_id: number
          photo_id: number
          confidence_score: number
          verification_status: "pending" | "confirmed" | "rejected"
        }
        Insert: {
          id?: number
          created_at?: string
          sighting_id: number
          photo_id: number
          confidence_score: number
          verification_status?: "pending" | "confirmed" | "rejected"
        }
        Update: {
          id?: number
          created_at?: string
          sighting_id?: number
          photo_id?: number
          confidence_score?: number
          verification_status?: "pending" | "confirmed" | "rejected"
        }
      }
      users: {
        Row: {
          id: string // uuid
          email: string
          role: "officer" | "admin"
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role: "officer" | "admin"
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: "officer" | "admin"
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: number
          case_id: number
          reporter_name: string
          reporter_relation: string
          reporter_whatsapp: string | null
          reporter_address: string | null
          reporter_contact: string | null
          reporter_email: string | null
          missing_person_identification: string | null
          missing_person_social_media: string | null
          created_at: string
        }
        Insert: {
          id?: number
          case_id: number
          reporter_name: string
          reporter_relation: string
          reporter_whatsapp?: string | null
          reporter_address?: string | null
          reporter_contact?: string | null
          reporter_email?: string | null
          missing_person_identification?: string | null
          missing_person_social_media?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          case_id?: number
          reporter_name?: string
          reporter_relation?: string
          reporter_whatsapp?: string | null
          reporter_address?: string | null
          reporter_contact?: string | null
          reporter_email?: string | null
          missing_person_identification?: string | null
          missing_person_social_media?: string | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
