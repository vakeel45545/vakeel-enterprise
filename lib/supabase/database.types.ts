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
