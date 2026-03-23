/**
 * Types pour la Chronologie Archéologique Marchée (CAM)
 */

export interface DateInfo {
  year: number;
  era: "BC" | "AD";
  years_bp: number;
  date_str: string;
}

export interface Milestone {
  id: number;
  title: string;
  start_date: DateInfo;
  end_date: DateInfo | null;
  intro: string;
  full_text: string;
  category: string;
  external_link: string;
  images: string;
  distance_m: number;
}

export interface PedometerState {
  totalSteps: number;
  currentDistance: number; // en mètres
  isWalking: boolean;
  milestonesReached: Milestone[];
  lastUpdateTime: number;
}

export interface AppSettings {
  totalDistance: number; // en mètres (1000 par défaut)
  soundVolume: number; // 0-1
  vibrationIntensity: number; // 0-1
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  distanceUnit: "m" | "km"; // mètres ou kilomètres
}

export interface PeriodInfo {
  name: string;
  startYear: number;
  endYear: number;
  era: "BC" | "AD";
  description: string;
  nextMilestone: Milestone | null;
  distanceToNext: number; // en mètres
}
