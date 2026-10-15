"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      if (!url || !key) {
        setStatus("Configuration missing. Check .env.local.");
        return;
      }

      try {
        const response = await fetch(`${url}/auth/v1/settings`, {
          headers: {
            apikey: key,
          },
        });

        if (response.ok) {
          setStatus("Supabase API is reachable!");
        } else {
          setStatus(`Supabase responded with HTTP ${response.status}.`);
        }
      } catch {
        setStatus("Could not reach Supabase. Check your URL and internet.");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-[#151916] p-8 text-[#F4F5F0]">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
      <p className="mt-4">{status}</p>
    </main>
  );
}
