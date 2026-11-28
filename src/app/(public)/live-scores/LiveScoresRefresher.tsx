"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LiveScoresRefresher() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("live-scores-lobby-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "live_scores" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 20000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return null;
}
