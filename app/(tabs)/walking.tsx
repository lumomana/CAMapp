import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometerContext as usePedometer } from "@/lib/pedometer-context";
import { useMilestoneAlerts } from "@/hooks/use-milestone-alerts";
import { useColors } from "@/hooks/use-colors";
import { useEffect, useRef, useState } from "react";
import { Svg, Circle } from "react-native-svg";
import { Milestone } from "@/lib/types/milestone";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Cercle de progression animé ────────────────────────────────────────────
function ProgressRing({
  progress,
  size,
  strokeWidth,
  color,
  bgColor,
  children,
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  bgColor: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute" }}>
        {/* Piste de fond */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Arc de progression */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
}

// ─── Animation de pas (empreinte qui pulse) ───────────────────────────────────
function FootprintPulse({ isWalking }: { isWalking: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (isWalking) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scale, { toValue: 1.18, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 420, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.5, duration: 420, useNativeDriver: true }),
          ]),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      scale.setValue(1);
      opacity.setValue(0.5);
    }
  }, [isWalking]);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <Image
        source={require("../../assets/images/footprint.png")}
        style={{ width: 52, height: 52 }}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

// ─── Carte de jalon atteint (popup) ──────────────────────────────────────────
function MilestonePopup({ milestone, onDismiss }: { milestone: Milestone; onDismiss: () => void }) {
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 120, duration: 350, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start(() => onDismiss());
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const era = milestone.start_date.era === "BC"
    ? `${milestone.start_date.year.toLocaleString()} av. J.-C.`
    : `${milestone.start_date.year} ap. J.-C.`;

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        transform: [{ translateY }],
        opacity,
        backgroundColor: "#C1440E",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
      }}
    >
      <Text style={{ color: "#F5F1E8", fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: 4 }}>
        🏛️ JALON ATTEINT
      </Text>
      <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700", marginBottom: 4 }}>
        {milestone.title}
      </Text>
      <Text style={{ color: "#F5F1E8CC", fontSize: 13 }}>{era} · {milestone.category}</Text>
    </Animated.View>
  );
}

// ─── Écran principal Walking ──────────────────────────────────────────────────
export default function WalkingScreen() {
  const colors = useColors();
  const {
    state,
    settings,
    currentPeriod,
    nextMilestone,
    isPedometerAvailable,
    toggleWalking,
    addSimulatedSteps,
  } = usePedometer();

  const { triggerAlert } = useMilestoneAlerts(settings);
  const [popupMilestone, setPopupMilestone] = useState<Milestone | null>(null);
  const prevMilestoneCount = useRef(state.milestonesReached.length);

  // Déclencher alerte + popup quand un nouveau jalon est atteint
  useEffect(() => {
    if (state.milestonesReached.length > prevMilestoneCount.current) {
      const last = state.milestonesReached[state.milestonesReached.length - 1];
      triggerAlert(last);
      setPopupMilestone(last);
      prevMilestoneCount.current = state.milestonesReached.length;
    }
  }, [state.milestonesReached.length]);

  // Progression 0–100%
  const progress = settings.totalDistance > 0
    ? (state.currentDistance / settings.totalDistance) * 100
    : 0;

  // Distance restante jusqu'au prochain jalon — calculée par le hook
  // pour toutes les chronologies (CAM, Photo, etc.)
  const distToNext = currentPeriod?.distanceToNext ?? 0;

  // Position absolue du prochain jalon — reconstruite depuis la position actuelle
  const scaledNextDistance = state.currentDistance + distToNext;

  // Formatage de l'année actuelle
  const currentYearLabel = currentPeriod
    ? currentPeriod.era === "BC"
      ? `${currentPeriod.startYear.toLocaleString()} av. J.-C.`
      : `${currentPeriod.startYear} ap. J.-C.`
    : "—";

  const ringSize = Math.min(SCREEN_WIDTH - 80, 260);

  return (
    <ScreenContainer>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── En-tête ─────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground, letterSpacing: -0.5 }}>
            En avant !
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
            {isPedometerAvailable
              ? state.isWalking
                ? "Podomètre actif – bougez !"
                : "Podomètre prêt"
              : "Podomètre non disponible sur cet appareil"}
          </Text>
        </View>

        {/* ── Anneau de progression principal ─────────────────────────────── */}
        <View style={{ alignItems: "center", marginTop: 8, marginBottom: 16 }}>
          <ProgressRing
            progress={progress}
            size={ringSize}
            strokeWidth={12}
            color="#C1440E"
            bgColor={colors.border}
          >
            <View style={{ alignItems: "center", gap: 4 }}>
              <FootprintPulse isWalking={state.isWalking} />

              <Text style={{ fontSize: 44, fontWeight: "800", color: colors.foreground, lineHeight: 48 }}>
                {state.totalSteps.toLocaleString()}
              </Text>
              <Text style={{ fontSize: 13, color: colors.muted, fontWeight: "500" }}>pas</Text>

              <View style={{
                backgroundColor: "#C1440E18",
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                marginTop: 4,
              }}>
                <Text style={{ fontSize: 12, color: "#C1440E", fontWeight: "700" }}>
                  {state.currentDistance.toFixed(1)} m · {progress.toFixed(1)} %
                </Text>
              </View>
            </View>
          </ProgressRing>
        </View>

        {/* ── Période actuelle ─────────────────────────────────────────────── */}
        <View style={{
          marginHorizontal: 20,
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
          marginBottom: 12,
        }}>
          <Text style={{ fontSize: 10, color: colors.muted, fontWeight: "700", letterSpacing: 2, marginBottom: 6 }}>
            PÉRIODE ACTUELLE
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
            {currentPeriod?.name || "Début de la chronologie"}
          </Text>
          <Text style={{ fontSize: 13, color: "#C1440E", fontWeight: "600", marginTop: 2 }}>
            {currentYearLabel}
          </Text>
          {currentPeriod?.description ? (
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 6, lineHeight: 18 }} numberOfLines={2}>
              {currentPeriod.description}
            </Text>
          ) : null}
        </View>

        {/* ── Prochain jalon ───────────────────────────────────────────────── */}
        {nextMilestone && (
          <View style={{
            marginHorizontal: 20,
            backgroundColor: "#D4AF3712",
            borderRadius: 16,
            padding: 14,
            borderWidth: 1,
            borderColor: "#D4AF37",
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, color: "#D4AF37", fontWeight: "700", letterSpacing: 2, marginBottom: 4 }}>
                PROCHAIN JALON
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "700", color: colors.foreground }} numberOfLines={1}>
                {nextMilestone.title}
              </Text>
              <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                {distToNext.toFixed(1)} m restant
              </Text>
            </View>
            {/* Mini barre de progression vers ce jalon */}
            <View style={{ width: 48, alignItems: "center" }}>
              <ProgressRing
                progress={scaledNextDistance > 0
                  ? (state.currentDistance / scaledNextDistance) * 100
                  : 100}
                size={44}
                strokeWidth={5}
                color="#D4AF37"
                bgColor={colors.border}
              >
                <Text style={{ fontSize: 9, color: "#D4AF37", fontWeight: "700" }}>
                  {scaledNextDistance > 0
                    ? Math.min(100, Math.round((state.currentDistance / scaledNextDistance) * 100))
                    : 100}%
                </Text>
              </ProgressRing>
            </View>
          </View>
        )}

        {/* ── Boutons ──────────────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 8, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={toggleWalking}
            disabled={!isPedometerAvailable}
            style={{
              backgroundColor: state.isWalking ? "#e03030" : "#C1440E",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              opacity: isPedometerAvailable ? 1 : 0.45,
              shadowColor: state.isWalking ? "#e03030" : "#C1440E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 }}>
              {state.isWalking ? "⏸  Pause" : "▶  Démarrer la marche"}
            </Text>
          </TouchableOpacity>



          {/* Bouton simulation — visible uniquement si podomètre indisponible (émulateur/web) */}
          {!isPedometerAvailable && (
            <TouchableOpacity
              onPress={() => addSimulatedSteps(50)}
              style={{
                borderRadius: 14,
                paddingVertical: 13,
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: "#D4AF37",
                backgroundColor: "#D4AF3715",
              }}
            >
              <Text style={{ color: "#D4AF37", fontSize: 14, fontWeight: "600" }}>
                🦶 +50 pas (simulation)
              </Text>
            </TouchableOpacity>
          )}
        </View>



        {/* ── Popup jalon atteint ───────────────────────────────────────────── */}
        {popupMilestone && (
          <MilestonePopup
            milestone={popupMilestone}
            onDismiss={() => setPopupMilestone(null)}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
