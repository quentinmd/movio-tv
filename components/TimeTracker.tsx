"use client";

import { useEffect, useRef } from "react";
import { trackTimeSpent } from "@/lib/analytics";

interface TimeTrackerProps {
  pageName: string;
}

export default function TimeTracker({ pageName }: TimeTrackerProps) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    // Fonction pour envoyer le temps passé
    const sendTimeSpent = () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent > 5) {
        // Ne tracker que si plus de 5 secondes
        trackTimeSpent(pageName, timeSpent);
      }
    };

    // Envoyer avant de quitter la page
    const handleBeforeUnload = () => {
      sendTimeSpent();
    };

    // Envoyer quand l'utilisateur change d'onglet
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendTimeSpent();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Envoyer toutes les 30 secondes pour les sessions longues
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (timeSpent >= 30) {
        trackTimeSpent(pageName, timeSpent);
        startTimeRef.current = Date.now();
      }
    }, 30000);

    return () => {
      sendTimeSpent();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [pageName]);

  return null;
}
