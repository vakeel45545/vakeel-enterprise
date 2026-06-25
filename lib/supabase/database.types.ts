export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          permissions: Json | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          permissions?: Json | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          permissions?: Json | null
          role?: string | null
        }
        Relationships: []
      }
      authors: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          featured: boolean | null
          id: string
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          published: boolean | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          status: string | null
          scheduled_at: string | null
          seo_score: number | null
          featured_image_id: string | null
          og_image_id: string | null
          published_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          published?: boolean | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          status?: string | null
          scheduled_at?: string | null
          seo_score?: number | null
          featured_image_id?: string | null
          og_image_id?: string | null
          published_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          featured?: boolean | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          published?: boolean | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          status?: string | null
          scheduled_at?: string | null
          seo_score?: number | null
          featured_image_id?: string | null
          og_image_id?: string | null
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          city_name: string
          created_at: string | null
          id: string
          slug: string
          state: string | null
        }
        Insert: {
          city_name: string
          created_at?: string | null
          id?: string
          slug: string
          state?: string | null
        }
        Update: {
          city_name?: string
          created_at?: string | null
          id?: string
          slug?: string
          state?: string | null
        }
        Relationships: []
      }
      content_relations: {
        Row: {
          created_at: string | null
          id: string
          order: number | null
          relation_type: string | null
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order?: number | null
          relation_type?: string | null
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order?: number | null
          relation_type?: string | null
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question: string
          service_slug: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question: string
          service_slug?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question?: string
          service_slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_service_slug_fkey"
            columns: ["service_slug"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["slug"]
          },
        ]
      }
      footer_links: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          open_new_tab: boolean | null
          order: number | null
          section_id: string | null
          title: string
          url: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          open_new_tab?: boolean | null
          order?: number | null
          section_id?: string | null
          title: string
          url: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          open_new_tab?: boolean | null
          order?: number | null
          section_id?: string | null
          title?: string
          url?: string
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "footer_links_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "footer_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_sections: {
        Row: {
          created_at: string | null
          id: string
          order: number | null
          title: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order?: number | null
          title: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order?: number | null
          title?: string
          visible?: boolean | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          service: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service?: string | null
          status?: string | null
        }
      }
      media_library: {
        Row: {
          id: string
          filename: string
          url: string
          source: string | null
          alt_text: string | null
          mime_type: string | null
          size_bytes: number | null
          width: number | null
          height: number | null
          tags: string[] | null
          uploaded_by: string | null
          created_at: string | null
          image_prompt: string | null
          credits: string | null
          license_url: string | null
        }
        Insert: {
          id?: string
          filename: string
          url: string
          source?: string | null
          alt_text?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          tags?: string[] | null
          uploaded_by?: string | null
          created_at?: string | null
          image_prompt?: string | null
          credits?: string | null
          license_url?: string | null
        }
        Update: {
          id?: string
          filename?: string
          url?: string
          source?: string | null
          alt_text?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          tags?: string[] | null
          uploaded_by?: string | null
          created_at?: string | null
          image_prompt?: string | null
          credits?: string | null
          license_url?: string | null
        }
        Relationships: []
      }
      navigation: {
        Row: {
          badge: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          icon: string | null
          id: string
          mega_menu_data: Json | null
          order: number | null
          parent_id: string | null
          slug: string | null
          title: string
          type: string | null
          url: string | null
          visible: boolean | null
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          mega_menu_data?: Json | null
          order?: number | null
          parent_id?: string | null
          slug?: string | null
          title: string
          type?: string | null
          url?: string | null
          visible?: boolean | null
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          icon?: string | null
          id?: string
          mega_menu_data?: Json | null
          order?: number | null
          parent_id?: string | null
          slug?: string | null
          title?: string
          type?: string | null
          url?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation"
            referencedColumns: ["id"]
          },
        ]
      }
      page_sections: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          order_index: number | null
          page_id: string | null
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
          visible: boolean | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          order_index?: number | null
          page_id?: string | null
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          visible?: boolean | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          order_index?: number | null
          page_id?: string | null
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "page_sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          canonical_url: string | null
          content: string | null
          created_at: string | null
          id: string
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          page_type: string | null
          published: boolean | null
          sections: Json | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_type?: string | null
          published?: boolean | null
          sections?: Json | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          page_type?: string | null
          published?: boolean | null
          sections?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      service_city_pages: {
        Row: {
          city_id: string | null
          created_at: string | null
          hero_content: string | null
          hero_title: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          metadata: Json | null
          pricing: Json | null
          service_id: string | null
        }
        Insert: {
          city_id?: string | null
          created_at?: string | null
          hero_content?: string | null
          hero_title?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          metadata?: Json | null
          pricing?: Json | null
          service_id?: string | null
        }
        Update: {
          city_id?: string | null
          created_at?: string | null
          hero_content?: string | null
          hero_title?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          metadata?: Json | null
          pricing?: Json | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_city_pages_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_city_pages_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          benefits: Json | null
          category: string | null
          content: Json | null
          created_at: string | null
          cta_button_text: string | null
          cta_button_url: string | null
          cta_description: string | null
          cta_title: string | null
          faq: Json | null
          featured: boolean | null
          hero_description: string | null
          hero_title: string | null
          icon: string | null
          id: string
          image: string | null
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          process_steps: Json | null
          published: boolean | null
          sections: Json | null
          short_description: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          benefits?: Json | null
          category?: string | null
          content?: Json | null
          created_at?: string | null
          cta_button_text?: string | null
          cta_button_url?: string | null
          cta_description?: string | null
          cta_title?: string | null
          faq?: Json | null
          featured?: boolean | null
          hero_description?: string | null
          hero_title?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          process_steps?: Json | null
          published?: boolean | null
          sections?: Json | null
          short_description?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          benefits?: Json | null
          category?: string | null
          content?: Json | null
          created_at?: string | null
          cta_button_text?: string | null
          cta_button_url?: string | null
          cta_description?: string | null
          cta_title?: string | null
          faq?: Json | null
          featured?: boolean | null
          hero_description?: string | null
          hero_title?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          process_steps?: Json | null
          published?: boolean | null
          sections?: Json | null
          short_description?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          company_name: string | null
          copyright_text: string | null
          email: string | null
          footer_badges: Json | null
          footer_cta_button_text: string | null
          footer_cta_button_url: string | null
          footer_cta_description: string | null
          footer_cta_title: string | null
          footer_tagline: string | null
          id: string
          logo: string | null
          phone: string | null
          seo_default_description: string | null
          seo_default_title: string | null
          seo_defaults: Json | null
          social_links: Json | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          copyright_text?: string | null
          email?: string | null
          footer_badges?: Json | null
          footer_cta_button_text?: string | null
          footer_cta_button_url?: string | null
          footer_cta_description?: string | null
          footer_cta_title?: string | null
          footer_tagline?: string | null
          id?: string
          logo?: string | null
          phone?: string | null
          seo_default_description?: string | null
          seo_default_title?: string | null
          seo_defaults?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          copyright_text?: string | null
          email?: string | null
          footer_badges?: Json | null
          footer_cta_button_text?: string | null
          footer_cta_button_url?: string | null
          footer_cta_description?: string | null
          footer_cta_title?: string | null
          footer_tagline?: string | null
          id?: string
          logo?: string | null
          phone?: string | null
          seo_default_description?: string | null
          seo_default_title?: string | null
          seo_defaults?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_name: string
          company: string | null
          created_at: string | null
          id: string
          image: string | null
          rating: number | null
          review: string
        }
        Insert: {
          client_name: string
          company?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          rating?: number | null
          review: string
        }
        Update: {
          client_name?: string
          company?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          rating?: number | null
          review?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
