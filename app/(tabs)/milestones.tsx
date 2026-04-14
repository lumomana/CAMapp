import { ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometerContext as usePedometer } from "@/lib/pedometer-context";
import { useColors } from "@/hooks/use-colors";
import { Milestone } from "@/lib/types/milestone";

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const colors = useColors();

  const era = milestone.start_date.era === "BC"
    ? `${milestone.start_date.year.toLocaleString()} av. J.-C.`
    : `${milestone.start_date.year} ap. J.-C.`;

  const handleLink = () => {
    if (milestone.external_link) {
      Linking.openURL(milestone.external_link);
    }
  };

  return (
    <View style={{
      backgroundColor: "#C1440E",
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    }}>
      {/* Numéro + label */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 }}>
        <View style={{
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 2,
        }}>
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>#{index + 1}</Text>
        </View>
        <Text style={{ color: "#F5F1E8CC", fontSize: 10, fontWeight: "700", letterSpacing: 2 }}>
          🏛️ JALON ATTEINT
        </Text>
      </View>

      {/* Titre */}
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
        {milestone.title}
      </Text>

      {/* Date + catégorie */}
      <Text style={{ color: "#F5F1E8CC", fontSize: 13, marginBottom: 8 }}>
        {era}
        {milestone.category ? `  ·  ${milestone.category}` : ""}
      </Text>

      {/* Description */}
      {(milestone.intro || milestone.full_text) ? (
        <Text style={{ color: "#F5F1E8DD", fontSize: 12, lineHeight: 18, marginBottom: 10 }}>
          {milestone.intro || milestone.full_text}
        </Text>
      ) : null}

      {/* Lien */}
      {milestone.external_link ? (
        <TouchableOpacity
          onPress={handleLink}
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
            🔗 En savoir plus
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function MilestonesScreen() {
  const colors = useColors();
  const { state } = usePedometer();
  const milestones = [...state.milestonesReached].reverse(); // plus récent en premier

  return (
    <ScreenContainer>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.primary, marginBottom: 4 }}>
            Jalons Atteints
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted }}>
            {state.milestonesReached.length} jalon{state.milestonesReached.length !== 1 ? "s" : ""} découvert{state.milestonesReached.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Liste */}
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              index={milestones.length - 1 - index}
            />
          ))
        ) : (
          <View style={{ alignItems: "center", paddingTop: 60 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🚶🏽‍♀️</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
              Aucun jalon atteint
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center", paddingHorizontal: 20 }}>
              Commencez à marcher pour découvrir les jalons de la chronologie archéologique !
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
