export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      bets: {
        Row: {
          id: string;
          user_id: string;
          player: string;
          market: string;
          odds: number;
          stake: number;
          result: 'win' | 'loss' | 'push' | 'open';
          placed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          player: string;
          market: string;
          odds: number;
          stake: number;
          result?: 'win' | 'loss' | 'push' | 'open';
          placed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bets']['Row']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          subscription_tier: 'free' | 'pro';
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          email: string;
          subscription_tier?: 'free' | 'pro';
          stripe_customer_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
    };
  };
};
