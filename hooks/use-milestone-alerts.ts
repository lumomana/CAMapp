import { useEffect, useRef, useCallback } from "react";
import * as Haptics from "expo-haptics";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { Platform } from "react-native";
import { Milestone, AppSettings } from "@/lib/types/milestone";

/**
 * Hook pour gérer les alertes sonores et haptiques aux jalons
 */
export function useMilestoneAlerts(settings: AppSettings) {
  const audioPlayerRef = useRef<any>(null);
  const lastAlertTimeRef = useRef<number>(0);

  // Initialiser le mode audio au démarrage
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Permettre la lecture audio en mode silencieux sur iOS
        await setAudioModeAsync({
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error("Error initializing audio mode:", error);
      }
    };

    initAudio();
  }, []);

  /**
   * Déclencher une alerte pour un jalon atteint
   */
  const triggerAlert = useCallback(
    async (milestone: Milestone) => {
      // Éviter les alertes multiples rapides (debounce)
      const now = Date.now();
      if (now - lastAlertTimeRef.current < 1000) {
        return;
      }
      lastAlertTimeRef.current = now;

      try {
        // Vibration haptique
        if (settings.vibrationEnabled && Platform.OS !== "web") {
          await triggerHaptics(settings.vibrationIntensity);
        }

        // Son d'alerte
        if (settings.soundEnabled) {
          await playAlertSound(settings.soundVolume);
        }

        console.log(`Alert triggered for milestone: ${milestone.title}`);
      } catch (error) {
        console.error("Error triggering alert:", error);
      }
    },
    [settings.vibrationEnabled, settings.vibrationIntensity, settings.soundEnabled, settings.soundVolume]
  );

  return {
    triggerAlert,
  };
}

/**
 * Déclencher une vibration haptique
 */
async function triggerHaptics(intensity: number) {
  try {
    if (intensity > 0.7) {
      // Vibration forte
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (intensity > 0.3) {
      // Vibration moyenne
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      // Vibration légère
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Notification haptique de succès
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.error("Error triggering haptics:", error);
  }
}

/**
 * Jouer un son d'alerte
 * Note: Pour une implémentation complète, il faudrait télécharger ou générer un fichier audio
 */
async function playAlertSound(volume: number) {
  try {
    // Son d'alerte: baleines
    const soundUrl =
      require("../assets/sounds/milestone-alert.mp3");

    // Créer un lecteur audio
    const { sound } = await require("expo-av").Audio.Sound.createAsync(
      soundUrl,
      { volume, shouldPlay: true }
    );

    // Jouer le son
    await sound.playAsync();

    // Nettoyer après la lecture
    setTimeout(() => {
      sound.unloadAsync();
    }, 2000);
  } catch (error) {
    console.error("Error playing alert sound:", error);
  }
}
