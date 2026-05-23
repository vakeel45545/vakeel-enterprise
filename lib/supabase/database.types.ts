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
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      cities: {
        Row: {
          id: string
          city_name: string
          slug: string
          state: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['cities']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['cities']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['service_city_pages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['service_city_pages']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['blogs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blogs']['Insert']>
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          service_slug: string | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['faqs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['faqs']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['testimonials']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['testimonials']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'status'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['navigation']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['navigation']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>
      }
      admins: {
        Row: {
          id: string
          email: string
          role: string | null
          permissions: Json | null
          created_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['admins']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['admins']['Insert']>
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
