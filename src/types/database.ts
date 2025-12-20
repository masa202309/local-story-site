export interface Shop {
  id: string
  name: string
  area: string
  genre: string
  address: string | null
  lat: number | null
  lng: number | null
  created_at: string
}

export interface Story {
  id: string
  shop_id: string | null
  custom_shop_name: string | null
  custom_area: string | null
  custom_genre: string | null
  title: string
  content: string
  excerpt: string | null
  author_name: string
  image_url: string | null
  reactions_visit: number
  reactions_touched: number
  reactions_warm: number
  published: boolean
  created_at: string
  shop?: Shop
}

export interface Database {
  public: {
    Tables: {
      shops: {
        Row: Shop
        Insert: Omit<Shop, 'id' | 'created_at'>
        Update: Partial<Omit<Shop, 'id' | 'created_at'>>
      }
      stories: {
        Row: Story
        Insert: Omit<Story, 'id' | 'created_at' | 'reactions_visit' | 'reactions_touched' | 'reactions_warm'>
        Update: Partial<Omit<Story, 'id' | 'created_at'>>
      }
    }
  }
}
