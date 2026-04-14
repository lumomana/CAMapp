import { useEffect, useRef, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { setAudioModeAsync, AudioPlayer, createAudioPlayer } from "expo-audio";
import { Platform } from "react-native";
import { Milestone, AppSettings } from "@/lib/types/milestone";

const ALERT_SOUNDS = [
  require("../assets/sounds/alert-1.mp3"),
  require("../assets/sounds/alert-2.mp3"),
  require("../assets/sounds/alert-3.mp3"),
  require("../assets/sounds/alert-4.mp3"),
  require("../assets/sounds/alert-5.mp3"),
];

export function useMilestoneAlerts(settings: AppSettings) {
  const lastAlertTimeRef = useRef<number>(0);
  const lastSoundIndexRef = useRef<number>(-1);
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    return () => {
      playerRef.current?.remove();
    };
  }, []);

  const triggerAlert = useCallback(
    async (milestone: Milestone) => {
      const now = Date.now();
      if (now - lastAlertTimeRef.current < 1500) return;
      lastAlertTimeRef.current = now;

      try {
        if (settings.vibrationEnabled && Platform.OS !== "web") {
          await triggerHaptics(settings.vibrationIntensity);
        }

        if (settings.soundEnabled) {
          // Choisir un son aléatoire différent du précédent
          let index;
          do {
            index = Math.floor(Math.random() * ALERT_SOUNDS.length);
          } while (index === lastSoundIndexRef.current && ALERT_SOUNDS.length > 1);
          lastSoundIndexRef.current = index;

          // Arrêter le son précédent si encore en cours
          if (playerRef.current) {
            playerRef.current.remove();
          }

          // Créer et jouer le nouveau son
          const player = createAudioPlayer(ALERT_SOUNDS[index]);
          player.volume = settings.soundVolume;
          player.play();
          playerRef.current = player;
        }

        console.log(`Alert: ${milestone.title}`);
      } catch (error) {
        console.error("Alert error:", error);
      }
    },
    [settings]
  );

  return { triggerAlert };
}

async function triggerHaptics(intensity: number) {
  try {
    if (intensity > 0.7) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (intensity > 0.3) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (e) {
    console.error("Haptics error:", e);
  }
}
