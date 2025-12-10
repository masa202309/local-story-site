import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type Shop = {
  id: string;
  name: string;
  area: string;
  genre: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
};

export type Story = {
  id: string;
  shop_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author_name: string;
  image_url: string | null;
  reactions_visit: number;
  reactions_touched: number;
  reactions_warm: number;
  published: boolean;
  created_at: string;
  shops?: Shop;
};
