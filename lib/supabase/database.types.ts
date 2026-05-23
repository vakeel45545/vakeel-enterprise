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
      services: {
        Row: {
          id: string
          title: string
          slug: string
          hero_title: string | null
          short_description: string | null
          content: Json | null
          icon: string | null
          image: string | null
          meta_title: string | null
          meta_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          hero_title?: string | null
          short_description?: string | null
          content?: Json | null
          icon?: string | null
          image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          hero_title?: string | null
          short_description?: string | null
          content?: Json | null
          icon?: string | null
          image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cities: {
        Row: {
          id: string
          city_name: string
          slug: string
          state: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          city_name: string
          slug: string
          state?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          city_name?: string
          slug?: string
          state?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      service_city_pages: {
        Row: {
          id: string
          service_id: string | null
          city_id: string | null
          meta_title: string | null
          meta_description: string | null
          hero_title: string | null
          hero_content: string | null
          pricing: Json | null
          metadata: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          service_id?: string | null
          city_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_content?: string | null
          pricing?: Json | null
          metadata?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          service_id?: string | null
          city_id?: string | null
          meta_title?: string | null
          meta_description?: string | null
          hero_title?: string | null
          hero_content?: string | null
          pricing?: Json | null
          metadata?: Json | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_city_pages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_city_pages_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          }
        ]
      }
      blogs: {
        Row: {
          id: string
          title: string
          slug: string
          category: string | null
          thumbnail: string | null
          content: string | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category?: string | null
          thumbnail?: string | null
          content?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string | null
          thumbnail?: string | null
          content?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          service_slug: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          question: string
          answer: string
          service_slug?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          service_slug?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          company: string | null
          review: string
          image: string | null
          rating: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          client_name: string
          company?: string | null
          review: string
          image?: string | null
          rating?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          client_name?: string
          company?: string | null
          review?: string
          image?: string | null
          rating?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          service: string | null
          message: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          service?: string | null
          message?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          service?: string | null
          message?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      navigation: {
        Row: {
          id: string
          title: string
          slug: string | null
          parent_id: string | null
          featured: boolean | null
          order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug?: string | null
          parent_id?: string | null
          featured?: boolean | null
          order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string | null
          parent_id?: string | null
          featured?: boolean | null
          order?: number | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation"
            referencedColumns: ["id"]
          }
        ]
      }
      site_settings: {
        Row: {
          id: string
          company_name: string | null
          phone: string | null
          email: string | null
          logo: string | null
          whatsapp: string | null
          social_links: Json | null
          address: string | null
          seo_defaults: Json | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_name?: string | null
          phone?: string | null
          email?: string | null
          logo?: string | null
          whatsapp?: string | null
          social_links?: Json | null
          address?: string | null
          seo_defaults?: Json | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string | null
          phone?: string | null
          email?: string | null
          logo?: string | null
          whatsapp?: string | null
          social_links?: Json | null
          address?: string | null
          seo_defaults?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admins: {
        Row: {
          id: string
          email: string
          role: string | null
          permissions: Json | null
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          role?: string | null
          permissions?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string | null
          permissions?: Json | null
          created_at?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
