
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCurrentBusinessId() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("business_id")
          .eq("id", user.id)
          .single();

        if (!error && data?.business_id) {
          setBusinessId(data.business_id);
        }
      } catch (error) {
        console.error("Error fetching business ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessId();
  }, []);

  return { businessId, loading };
}
