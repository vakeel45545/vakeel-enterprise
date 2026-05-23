import { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Define types that will be mapped from the Supabase generation later
export type Profile = any;
export type Service = any;
export type City = any;
export type Lead = any;
