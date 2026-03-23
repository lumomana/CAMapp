import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometer } from "@/hooks/use-pedometer";
import { useMilestoneAlerts } from "@/hooks/use-milestone-alerts";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { Svg, Circle } from "react-native-svg";

/**
 * Composant de compteur circulaire animé
 */
function StepCounter({ steps, totalSteps, distance, totalDistance }: any) {
  const colors = useColors();
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDistance > 0 ? (distance / totalDistance) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center gap-4">
      <Svg width={200} height={200} viewBox="0 0 200 200">
        {/* Cercle de fond */}
        <Circle cx="100" cy="100" r={radius} stroke={colors.border} strokeWidth="4" fill="none" />
        {/* Cercle de progression */}
        <Circle
          cx="100"
          cy="100"
          r={radius}
          stroke={colors.primary}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
        />
      </Svg>

      {/* Texte au centre */}
      <View className="absolute items-center justify-center">
        <Text className="text-5xl font-bold text-primary">{steps.toLocaleString()}</Text>
        <Text className="text-sm text-muted">pas</Text>
        <Text className="text-xs text-muted mt-2">
          {distance.toFixed(1)} m / {totalDistance.toFixed(0)} m
        </Text>
      </View>
    </View>
  );
}

/**
 * Écran d'accueil principal
 */
export default function HomeScreen() {
  const colors = useColors();
  const { state, settings, currentPeriod, nextMilestone, isPedometerAvailable, toggleWalking, reset } =
    usePedometer();
  const { triggerAlert } = useMilestoneAlerts(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Déclencher les alertes quand un jalon est atteint
  useEffect(() => {
    if (state.milestonesReached.length > 0) {
      const lastMilestone = state.milestonesReached[state.milestonesReached.length - 1];
      triggerAlert(lastMilestone);
    }
  }, [state.milestonesReached.length, triggerAlert]);

  const handleReset = async () => {
    await reset();
    setShowResetConfirm(false);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-6">
          {/* En-tête */}
          <View className="items-center gap-2">
            <Text className="text-4xl font-bold text-primary">Chronologie Archéologique Marchée</Text>
            <Text className="text-sm text-muted text-center">
              Parcourez 1 million d'années d'histoire
            </Text>
          </View>

          {/* Compteur circulaire */}
          <View className="items-center justify-center py-8">
            <StepCounter
              steps={state.totalSteps}
              totalSteps={1000000}
              distance={state.currentDistance}
              totalDistance={settings.totalDistance}
            />
          </View>

          {/* Période actuelle */}
          {currentPeriod && (
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <Text className="text-lg font-semibold text-foreground mb-2">{currentPeriod.name}</Text>
              <Text className="text-sm text-muted mb-3">
                {currentPeriod.startYear} {currentPeriod.era}
              </Text>
              {currentPeriod.description && (
                <Text className="text-xs text-muted leading-relaxed">{currentPeriod.description}</Text>
              )}
            </View>
          )}

          {/* Prochain jalon */}
          {nextMilestone && (
            <View className="bg-warning/10 rounded-2xl p-4 border border-warning">
              <Text className="text-xs text-warning font-semibold mb-1">PROCHAIN JALON</Text>
              <Text className="text-base font-semibold text-foreground mb-2">{nextMilestone.title}</Text>
              <Text className="text-xs text-muted">
                À {nextMilestone.distance_m.toFixed(1)} m ({(nextMilestone.distance_m - state.currentDistance).toFixed(1)} m à parcourir)
              </Text>
            </View>
          )}

          {/* Statut du podomètre */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-xs text-muted font-semibold mb-2">STATUT</Text>
            <View className="flex-row items-center gap-2">
              <View
                className={`w-3 h-3 rounded-full ${isPedometerAvailable ? "bg-success" : "bg-error"}`}
              />
              <Text className="text-sm text-foreground">
                {isPedometerAvailable ? "Podomètre disponible" : "Podomètre non disponible"}
              </Text>
            </View>
            <Text className="text-xs text-muted mt-2">
              {state.isWalking ? "⏱️ En cours..." : "⏸️ Arrêté"}
            </Text>
          </View>

          {/* Jalons atteints */}
          {state.milestonesReached.length > 0 && (
            <View className="bg-success/10 rounded-2xl p-4 border border-success">
              <Text className="text-xs text-success font-semibold mb-2">
                🏆 JALONS ATTEINTS ({state.milestonesReached.length})
              </Text>
              <Text className="text-sm text-foreground">
                {state.milestonesReached[state.milestonesReached.length - 1].title}
              </Text>
            </View>
          )}

          {/* Boutons d'action */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={toggleWalking}
              className={`py-4 rounded-xl items-center justify-center ${
                state.isWalking ? "bg-error" : "bg-primary"
              }`}
            >
              <Text className="text-white font-semibold text-base">
                {state.isWalking ? "⏸ Arrêter" : "▶ Démarrer la marche"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowResetConfirm(true)}
              className="py-3 rounded-xl items-center justify-center border border-border"
            >
              <Text className="text-foreground font-semibold text-sm">↻ Réinitialiser</Text>
            </TouchableOpacity>
          </View>

          {/* Confirmation de réinitialisation */}
          {showResetConfirm && (
            <View className="bg-surface rounded-2xl p-4 border border-error gap-3">
              <Text className="text-sm font-semibold text-foreground">
                Êtes-vous sûr ? Cela supprimera tous les pas et jalons atteints.
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-border items-center"
                >
                  <Text className="text-foreground font-semibold">Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReset}
                  className="flex-1 py-2 rounded-lg bg-error items-center"
                >
                  <Text className="text-white font-semibold">Réinitialiser</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
