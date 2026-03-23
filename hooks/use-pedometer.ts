import { useEffect, useState, useRef, useCallback } from "react";
import { Pedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Milestone, PedometerState, AppSettings, PeriodInfo } from "@/lib/types/milestone";
import milestonesData from "@/lib/data/milestones.json";

const DEFAULT_SETTINGS: AppSettings = {
  totalDistance: 1000, // 1000 mètres = 1 million d'années
  soundVolume: 0.8,
  vibrationIntensity: 0.8,
  soundEnabled: true,
  vibrationEnabled: true,
  distanceUnit: "m",
};

const STORAGE_KEYS = {
  PEDOMETER_STATE: "cam_pedometer_state",
  APP_SETTINGS: "cam_app_settings",
  MILESTONES_REACHED: "cam_milestones_reached",
};

/**
 * Hook principal pour gérer la logique du podomètre CAM
 */
export function usePedometer() {
  const [state, setState] = useState<PedometerState>({
    totalSteps: 0,
    currentDistance: 0,
    isWalking: false,
    milestonesReached: [],
    lastUpdateTime: Date.now(),
  });

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodInfo | null>(null);
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  const previousStepsRef = useRef(0);
  const previousDistanceRef = useRef(0);
  const milestonesTriggeredRef = useRef<Set<number>>(new Set());
  const subscriptionRef = useRef<any>(null);

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Vérifier la disponibilité du podomètre
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(available);

        // Charger les paramètres
        const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }

        // Charger l'état du podomètre
        const savedState = await AsyncStorage.getItem(STORAGE_KEYS.PEDOMETER_STATE);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setState(parsedState);
          previousStepsRef.current = parsedState.totalSteps;
          previousDistanceRef.current = parsedState.currentDistance;
        }

        // Charger les jalons atteints
        const savedMilestones = await AsyncStorage.getItem(STORAGE_KEYS.MILESTONES_REACHED);
        if (savedMilestones) {
          const milestones = JSON.parse(savedMilestones);
          setState((prev) => ({ ...prev, milestonesReached: milestones }));
          milestonesTriggeredRef.current = new Set(milestones.map((m: Milestone) => m.id));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };

    loadData();
  }, []);

  // S'abonner aux mises à jour du podomètre
  useEffect(() => {
    if (!isPedometerAvailable || !state.isWalking) return;

    const subscribe = async () => {
      try {
        subscriptionRef.current = Pedometer.watchStepCount((result) => {
          const newSteps = result.steps;
          const stepsDifference = newSteps - previousStepsRef.current;

          if (stepsDifference > 0) {
            // 1 pas ≈ 0.75 mètre
            const distanceAdded = stepsDifference * 0.75;
            const newDistance = previousDistanceRef.current + distanceAdded;
            const normalizedDistance = Math.min(newDistance, settings.totalDistance);

            setState((prev) => ({
              ...prev,
              totalSteps: newSteps,
              currentDistance: normalizedDistance,
              lastUpdateTime: Date.now(),
            }));

            previousStepsRef.current = newSteps;
            previousDistanceRef.current = normalizedDistance;

            // Vérifier les jalons atteints
            checkMilestones(normalizedDistance);

            // Sauvegarder l'état
            saveState({
              totalSteps: newSteps,
              currentDistance: normalizedDistance,
              isWalking: true,
              milestonesReached: state.milestonesReached,
              lastUpdateTime: Date.now(),
            });
          }
        });
      } catch (error) {
        console.error("Error subscribing to pedometer:", error);
      }
    };

    subscribe();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, [isPedometerAvailable, state.isWalking, settings.totalDistance, state.milestonesReached]);

  // Vérifier si des jalons ont été atteints
  const checkMilestones = useCallback(
    (currentDistance: number) => {
      const milestones = milestonesData as Milestone[];

      milestones.forEach((milestone: Milestone) => {
        if (
          currentDistance >= milestone.distance_m &&
          !milestonesTriggeredRef.current.has(milestone.id)
        ) {
          // Jalon atteint !
          milestonesTriggeredRef.current.add(milestone.id);

          setState((prev) => ({
            ...prev,
            milestonesReached: [...prev.milestonesReached, milestone],
          }));

          // Sauvegarder les jalons atteints
          saveMilestonesReached([...state.milestonesReached, milestone]);

          // Déclencher les alertes (à implémenter dans un hook séparé)
          triggerMilestoneAlert(milestone);
        }
      });
    },
    [state.milestonesReached]
  );

  // Déclencher une alerte de jalon
  const triggerMilestoneAlert = (milestone: Milestone) => {
    // Cette fonction sera appelée par un hook d'alertes séparé
    console.log("Milestone reached:", milestone.title);
  };

  // Calculer la période actuelle
  useEffect(() => {
    const period = calculateCurrentPeriod(state.currentDistance, settings.totalDistance);
    setCurrentPeriod(period);

    // Trouver le prochain jalon
    const next = findNextMilestone(state.currentDistance);
    setNextMilestone(next);
  }, [state.currentDistance, settings.totalDistance]);

  // Sauvegarder l'état
  const saveState = async (newState: PedometerState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PEDOMETER_STATE, JSON.stringify(newState));
    } catch (error) {
      console.error("Error saving state:", error);
    }
  };

  // Sauvegarder les jalons atteints
  const saveMilestonesReached = async (milestones: Milestone[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MILESTONES_REACHED, JSON.stringify(milestones));
    } catch (error) {
      console.error("Error saving milestones:", error);
    }
  };

  // Démarrer/arrêter la marche
  const toggleWalking = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isWalking: !prev.isWalking,
    }));
  }, []);

  // Réinitialiser les données
  const reset = useCallback(async () => {
    setState({
      totalSteps: 0,
      currentDistance: 0,
      isWalking: false,
      milestonesReached: [],
      lastUpdateTime: Date.now(),
    });

    previousStepsRef.current = 0;
    previousDistanceRef.current = 0;
    milestonesTriggeredRef.current.clear();

    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PEDOMETER_STATE,
        STORAGE_KEYS.MILESTONES_REACHED,
      ]);
    } catch (error) {
      console.error("Error resetting data:", error);
    }
  }, []);

  // Mettre à jour les paramètres
  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      AsyncStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    state,
    settings,
    currentPeriod,
    nextMilestone,
    isPedometerAvailable,
    toggleWalking,
    reset,
    updateSettings,
  };
}

/**
 * Calcule la période actuelle en fonction de la distance
 */
function calculateCurrentPeriod(currentDistance: number, totalDistance: number): PeriodInfo {
  const milestones = milestonesData as Milestone[];
  const yearsPerMeter = 1000000 / totalDistance;
  const currentYears = currentDistance * yearsPerMeter;

  // Trouver les jalons avant et après la position actuelle
  let beforeMilestone: Milestone | null = null;
  let afterMilestone: Milestone | null = null;

  for (const milestone of milestones) {
    if (milestone.distance_m <= currentDistance) {
      beforeMilestone = milestone;
    }
    if (milestone.distance_m > currentDistance && !afterMilestone) {
      afterMilestone = milestone;
    }
  }

  const name = beforeMilestone?.title || "Début de la chronologie";
  const startYear = beforeMilestone?.start_date.year || 1000000;
  const endYear = afterMilestone?.start_date.year || 0;

  return {
    name,
    startYear,
    endYear,
    era: beforeMilestone?.start_date.era || "BC",
    description: beforeMilestone?.intro || "",
    nextMilestone: afterMilestone || null,
    distanceToNext: afterMilestone ? afterMilestone.distance_m - currentDistance : 0,
  };
}

/**
 * Trouve le prochain jalon à atteindre
 */
function findNextMilestone(currentDistance: number): Milestone | null {
  const milestones = milestonesData as Milestone[];
  return milestones.find((m) => m.distance_m > currentDistance) || null;
}
