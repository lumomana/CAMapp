import { ScrollView, Text, View, TouchableOpacity, FlatList, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometer } from "@/hooks/use-pedometer";
import { useColors } from "@/hooks/use-colors";
import { Milestone } from "@/lib/types/milestone";

/**
 * Écran affichant l'historique des jalons atteints
 */
export default function MilestonesScreen() {
  const colors = useColors();
  const { state } = usePedometer();

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderMilestoneItem = ({ item, index }: { item: Milestone; index: number }) => (
    <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
      {/* Numéro du jalon */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <View className="bg-primary rounded-full w-8 h-8 items-center justify-center">
            <Text className="text-white font-bold text-sm">#{index + 1}</Text>
          </View>
          <Text className="text-xs text-muted font-semibold">JALON ATTEINT</Text>
        </View>
        <Text className="text-xs text-muted">🏆</Text>
      </View>

      {/* Titre du jalon */}
      <Text className="text-lg font-semibold text-foreground mb-2">{item.title}</Text>

      {/* Date */}
      <View className="flex-row items-center gap-2 mb-3">
        <Text className="text-sm text-muted">📅</Text>
        <Text className="text-sm text-muted">
          {item.start_date.year} {item.start_date.era}
        </Text>
      </View>

      {/* Catégorie */}
      <View className="flex-row items-center gap-2 mb-3">
        <View className="bg-warning/20 rounded-full px-3 py-1">
          <Text className="text-xs text-warning font-semibold">{item.category}</Text>
        </View>
      </View>

      {/* Description */}
      {item.intro && (
        <Text className="text-sm text-foreground leading-relaxed mb-3">{item.intro}</Text>
      )}

      {/* Lien externe */}
      {item.external_link && (
        <TouchableOpacity
          onPress={() => handleOpenLink(item.external_link)}
          className="bg-primary/10 rounded-lg py-2 px-3 flex-row items-center justify-center gap-2"
        >
          <Text className="text-primary font-semibold text-sm">🔗 En savoir plus</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const emptyComponent = (
    <View className="flex-1 items-center justify-center py-12">
      <Text className="text-5xl mb-4">🚶</Text>
      <Text className="text-lg font-semibold text-foreground mb-2">Aucun jalon atteint</Text>
      <Text className="text-sm text-muted text-center px-4">
        Commencez à marcher pour découvrir les jalons de la chronologie archéologique !
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1">
        {/* En-tête */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-primary mb-2">Jalons Atteints</Text>
          <Text className="text-sm text-muted">
            {state.milestonesReached.length} jalon{state.milestonesReached.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Liste des jalons */}
        {state.milestonesReached.length > 0 ? (
          <FlatList
            data={[...state.milestonesReached].reverse()}
            renderItem={renderMilestoneItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          emptyComponent
        )}
      </View>
    </ScreenContainer>
  );
}
