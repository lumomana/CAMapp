import { ScrollView, Text, View, ImageBackground } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometerContext as usePedometer } from "@/lib/pedometer-context";
import { useMilestoneAlerts } from "@/hooks/use-milestone-alerts";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { Svg, Circle } from "react-native-svg";

// URL CDN de l'image d'artefact archéologique
const ARTIFACT_IMAGE_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663402291429/aUnfUTG5yx838KHmhDMMCR/artifact-background_4c7a51a9.jpg";

/**
 * Composant de compteur circulaire animé avec image de fond
 */
function StepCounter({ steps, totalSteps, distance, totalDistance }: any) {
  const colors = useColors();
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = totalDistance > 0 ? (distance / totalDistance) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center gap-4">
      {/* Conteneur avec image de fond */}
      <ImageBackground
        source={{ uri: ARTIFACT_IMAGE_URL }}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          overflow: "hidden",
          justifyContent: "center",
          alignItems: "center",
        }}
        imageStyle={{ borderRadius: 100 }}
      >
        {/* Overlay semi-transparent pour la lisibilité */}
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: 100,
          }}
        />
        
        {/* SVG avec cercles */}
        <Svg width={200} height={200} viewBox="0 0 200 200" style={{ position: "absolute" }}>
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
        <View className="items-center justify-center z-10">
          <Text className="text-5xl font-bold text-white" style={{ textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
            {steps.toLocaleString()}
          </Text>
          <Text className="text-sm text-white" style={{ textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
            pas
          </Text>
          <Text className="text-xs text-white mt-2" style={{ textShadowColor: "rgba(0, 0, 0, 0.75)", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
            {distance.toFixed(1)} m / {totalDistance.toFixed(0)} m
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

/**
 * Écran d'accueil principal
 */
export default function HomeScreen() {
  const colors = useColors();
  const { state, settings, currentPeriod, nextMilestone, isPedometerAvailable } =
    usePedometer();
  const { triggerAlert } = useMilestoneAlerts(settings);
  // Déclencher les alertes quand un jalon est atteint
  useEffect(() => {
    if (state.milestonesReached.length > 0) {
      const lastMilestone = state.milestonesReached[state.milestonesReached.length - 1];
      triggerAlert(lastMilestone);
    }
  }, [state.milestonesReached.length, triggerAlert]);

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


        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
