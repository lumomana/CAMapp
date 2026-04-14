import { useEffect, useState, useRef, useCallback } from "react";
import { Pedometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Milestone, PedometerState, AppSettings, PeriodInfo } from "@/lib/types/milestone";
import milestonesCAM from "@/lib/data/milestones.json";
import milestonesPhotography from "@/lib/data/milestones_photography.json";

// Map des chronologies disponibles
const CHRONOLOGIES: Record<number, { data: any; baseDistance: number; title: string }> = {
  1: { data: milestonesCAM, baseDistance: 1002.050, title: "CAM" },
  2: { data: milestonesPhotography, baseDistance: 2.39, title: "Photographie" },
};

let currentChronology = CHRONOLOGIES[1];

// Fonction pour obtenir les jalons de la chronologie actuelle
function getMilestones(): Milestone[] {
  const data = currentChronology.data;
  // CAM est un tableau direct, Photographie est un objet avec propriété milestones
  return Array.isArray(data) ? data : (data.milestones as Milestone[]);
}

// Distance de référence : sera définie selon la chronologie sélectionnée
// Toutes les distance_m du JSON sont calculées sur cette base
function getBaseDistance(): number {
  return currentChronology.baseDistance;
}

const DEFAULT_SETTINGS: AppSettings = {
  totalDistance: 1002.050,
  soundVolume: 0.8,
  vibrationIntensity: 0.8,
  soundEnabled: true,
  vibrationEnabled: true,
  distanceUnit: "m",
  chronologyId: 1,
};

const KEYS = {
  STATE: "cam_pedometer_state",
  SETTINGS: "cam_app_settings",
  MILESTONES: "cam_milestones_reached",
};

// Convertit une distance JSON vers la distance réelle
// selon le totalDistance choisi par l'utilisateur
function scaleDistance(distanceJson: number, totalDistance: number): number {
  return (distanceJson / getBaseDistance()) * totalDistance;
}

export function usePedometer() {
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [milestonesReached, setMilestonesReached] = useState<Milestone[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);

  const distanceRef = useRef(0);
  const stepsRef = useRef(0);
  const triggeredRef = useRef<Set<number>>(new Set());
  const subscriptionRef = useRef<any>(null);
  const settingsRef = useRef(DEFAULT_SETTINGS);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Charger les données au démarrage
  useEffect(() => {
    const load = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(available);

        const savedSettings = await AsyncStorage.getItem(KEYS.SETTINGS);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(parsed);
          settingsRef.current = parsed;
          if (parsed.chronologyId && CHRONOLOGIES[parsed.chronologyId]) {
            currentChronology = CHRONOLOGIES[parsed.chronologyId];
          }
        }

        const savedState = await AsyncStorage.getItem(KEYS.STATE);
        if (savedState) {
          const s = JSON.parse(savedState);
          setTotalSteps(s.totalSteps || 0);
          setCurrentDistance(s.currentDistance || 0);
          distanceRef.current = s.currentDistance || 0;
          stepsRef.current = s.totalSteps || 0;
        }

        const savedMilestones = await AsyncStorage.getItem(KEYS.MILESTONES);
        if (savedMilestones) {
          const ms = JSON.parse(savedMilestones);
          setMilestonesReached(ms);
          triggeredRef.current = new Set(ms.map((m: Milestone) => m.id));
        }
      } catch (e) {
        console.error("Error loading data:", e);
      }
    };
    load();
  }, []);

  // Vérifier les jalons — les distances JSON sont recalculées selon totalDistance
  const checkMilestones = useCallback((distance: number) => {
    const total = settingsRef.current.totalDistance;
    const newlyReached: Milestone[] = [];

    getMilestones().forEach((m: Milestone) => {
      // Recalcul proportionnel : position du jalon selon la distance choisie
      const scaledDistance = scaleDistance(m.distance_m, total);
      if (distance >= scaledDistance && !triggeredRef.current.has(m.id)) {
        triggeredRef.current.add(m.id);
        newlyReached.push(m);
      }
    });

    if (newlyReached.length > 0) {
      setMilestonesReached((prev) => {
        const updated = [...prev, ...newlyReached];
        AsyncStorage.setItem(KEYS.MILESTONES, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  // Abonnement au podomètre
  useEffect(() => {
    if (!isPedometerAvailable || !isWalking) return;

    subscriptionRef.current = Pedometer.watchStepCount((result) => {
      const diff = result.steps - stepsRef.current;
      if (diff <= 0) return;

      const newDistance = Math.min(
        distanceRef.current + diff * 0.75,
        settingsRef.current.totalDistance
      );
      const newSteps = stepsRef.current + diff;

      stepsRef.current = newSteps;
      distanceRef.current = newDistance;

      setTotalSteps(newSteps);
      setCurrentDistance(newDistance);
      checkMilestones(newDistance);

      AsyncStorage.setItem(KEYS.STATE, JSON.stringify({
        totalSteps: newSteps,
        currentDistance: newDistance,
        isWalking: true,
        milestonesReached: [],
        lastUpdateTime: Date.now(),
      }));
    });

    return () => {
      subscriptionRef.current?.remove();
    };
  }, [isPedometerAvailable, isWalking, checkMilestones]);

  // Simulation de pas (émulateur/web)
  const addSimulatedSteps = useCallback((steps: number) => {
    const newDistance = Math.min(
      distanceRef.current + steps * 0.75,
      settingsRef.current.totalDistance
    );
    const newSteps = stepsRef.current + steps;

    stepsRef.current = newSteps;
    distanceRef.current = newDistance;

    setTotalSteps(newSteps);
    setCurrentDistance(newDistance);
    checkMilestones(newDistance);

    AsyncStorage.setItem(KEYS.STATE, JSON.stringify({
      totalSteps: newSteps,
      currentDistance: newDistance,
      isWalking: false,
      milestonesReached: [],
      lastUpdateTime: Date.now(),
    }));
  }, [checkMilestones]);

  const toggleWalking = useCallback(() => {
    setIsWalking((prev) => !prev);
  }, []);

  const reset = useCallback(async () => {
    setTotalSteps(0);
    setCurrentDistance(0);
    setIsWalking(false);
    setMilestonesReached([]);
    distanceRef.current = 0;
    stepsRef.current = 0;
    triggeredRef.current.clear();
    await AsyncStorage.multiRemove([KEYS.STATE, KEYS.MILESTONES]);
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      settingsRef.current = updated;
      // Reset les jalons déclenchés pour recalculer avec la nouvelle distance
      triggeredRef.current.clear();
      AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Calculs dérivés — positions recalculées selon totalDistance
  const currentPeriod = calculateCurrentPeriod(currentDistance, settings.totalDistance);
  const nextMilestone = findNextMilestone(currentDistance, settings.totalDistance);

  const state: PedometerState = {
    totalSteps,
    currentDistance,
    isWalking,
    milestonesReached,
    lastUpdateTime: Date.now(),
  };

  const changeChronology = useCallback((chronologyId: number) => {
    const chrono = CHRONOLOGIES[chronologyId];
    if (!chrono) return;
    
    currentChronology = chrono;
    const newSettings = { ...settings, chronologyId };
    setSettings(newSettings);
    AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(newSettings));
    
    // Réinitialiser les jalons atteints pour la nouvelle chronologie
    setMilestonesReached([]);
    triggeredRef.current.clear();
    AsyncStorage.setItem(KEYS.MILESTONES, JSON.stringify([]));
  }, [settings]);

  return {
    state,
    settings,
    currentPeriod,
    nextMilestone,
    isPedometerAvailable,
    toggleWalking,
    reset,
    updateSettings,
    addSimulatedSteps,
    changeChronology,
  };
}

function calculateCurrentPeriod(currentDistance: number, totalDistance: number): PeriodInfo {
  let beforeMilestone: Milestone | null = null;
  let afterMilestone: Milestone | null = null;

  for (const m of getMilestones()) {
    const scaled = scaleDistance(m.distance_m, totalDistance);
    if (scaled <= currentDistance) beforeMilestone = m;
    if (scaled > currentDistance && !afterMilestone) afterMilestone = m;
  }

  return {
    name: beforeMilestone?.title || "Début de la chronologie",
    startYear: beforeMilestone?.start_date.year || 1000000,
    endYear: afterMilestone?.start_date.year || 0,
    era: (beforeMilestone?.start_date.era || "BC") as "BC" | "AD",
    description: beforeMilestone?.intro || "",
    nextMilestone: afterMilestone || null,
    distanceToNext: afterMilestone
      ? scaleDistance(afterMilestone.distance_m, totalDistance) - currentDistance
      : 0,
  };
}

function findNextMilestone(currentDistance: number, totalDistance: number): Milestone | null {
  return getMilestones().find((m: Milestone) =>
    scaleDistance(m.distance_m, totalDistance) > currentDistance
  ) || null;
}
