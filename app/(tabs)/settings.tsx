import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometer } from "@/hooks/use-pedometer";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import Slider from "@react-native-community/slider";

/**
 * Écran des paramètres
 */
export default function SettingsScreen() {
  const colors = useColors();
  const { settings, updateSettings, reset } = usePedometer();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDistanceChange = (value: number) => {
    updateSettings({ totalDistance: value });
  };

  const handleSoundVolumeChange = (value: number) => {
    updateSettings({ soundVolume: value });
  };

  const handleVibrationIntensityChange = (value: number) => {
    updateSettings({ vibrationIntensity: value });
  };

  const handleSoundToggle = (value: boolean) => {
    updateSettings({ soundEnabled: value });
  };

  const handleVibrationToggle = (value: boolean) => {
    updateSettings({ vibrationEnabled: value });
  };

  const handleReset = async () => {
    await reset();
    setShowResetConfirm(false);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* En-tête */}
          <View className="mb-2">
            <Text className="text-3xl font-bold text-primary mb-2">Paramètres</Text>
            <Text className="text-sm text-muted">Personnalisez votre expérience</Text>
          </View>

          {/* Section Distance */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Distance totale</Text>
            <Text className="text-sm text-muted">
              Définissez la longueur totale de la chronologie
            </Text>

            <View className="gap-3">
              {[100, 500, 1000, 2000].map((distance) => (
                <TouchableOpacity
                  key={distance}
                  onPress={() => handleDistanceChange(distance)}
                  className={`py-3 px-4 rounded-lg border-2 items-center ${
                    settings.totalDistance === distance
                      ? `border-primary bg-primary/10`
                      : `border-border bg-background`
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      settings.totalDistance === distance ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {distance} mètres
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-xs text-muted mt-2">
              Actuellement : {settings.totalDistance}m = 1 million d'années
            </Text>
          </View>

          {/* Section Son */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Son d'alerte</Text>
              <Switch
                value={settings.soundEnabled}
                onValueChange={handleSoundToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={settings.soundEnabled ? colors.primary : colors.muted}
              />
            </View>

            {settings.soundEnabled && (
              <View className="gap-3">
                <Text className="text-sm text-muted">Volume</Text>
                <Slider
                  style={{ height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={settings.soundVolume}
                  onValueChange={handleSoundVolumeChange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.border}
                  thumbTintColor={colors.primary}
                />
                <Text className="text-xs text-muted text-center">
                  {Math.round(settings.soundVolume * 100)}%
                </Text>
              </View>
            )}
          </View>

          {/* Section Vibration */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Vibration</Text>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={handleVibrationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={settings.vibrationEnabled ? colors.primary : colors.muted}
              />
            </View>

            {settings.vibrationEnabled && (
              <View className="gap-3">
                <Text className="text-sm text-muted">Intensité</Text>
                <Slider
                  style={{ height: 40 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={settings.vibrationIntensity}
                  onValueChange={handleVibrationIntensityChange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.border}
                  thumbTintColor={colors.primary}
                />
                <Text className="text-xs text-muted text-center">
                  {settings.vibrationIntensity > 0.7
                    ? "Forte"
                    : settings.vibrationIntensity > 0.3
                      ? "Moyenne"
                      : "Légère"}
                </Text>
              </View>
            )}
          </View>

          {/* Section Bibliothèque (Aperçu) */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Bibliothèque de chronologies</Text>
            <Text className="text-sm text-muted">Sélectionnez une chronologie à parcourir</Text>

            <View className="gap-2">
              {[
                { id: 1, name: "Chronologie Archéologique Marchée", active: true },
                { id: 2, name: "Chronologie 2", active: false },
                { id: 3, name: "Chronologie 3", active: false },
                { id: 4, name: "Chronologie 4", active: false },
                { id: 5, name: "Chronologie 5", active: false },
              ].map((chrono) => (
                <TouchableOpacity
                  key={chrono.id}
                  className={`py-3 px-4 rounded-lg border-2 flex-row items-center justify-between ${
                    chrono.active
                      ? `border-primary bg-primary/10`
                      : `border-border bg-background`
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      chrono.active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {chrono.name}
                  </Text>
                  {chrono.active && <Text className="text-primary font-bold">✓</Text>}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity className="py-3 px-4 rounded-lg bg-primary/10 border border-primary items-center mt-2">
              <Text className="text-primary font-semibold">+ Ajouter une chronologie</Text>
            </TouchableOpacity>
          </View>

          {/* Section À propos */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">À propos</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Version</Text>
                <Text className="text-sm text-foreground font-semibold">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Jalons</Text>
                <Text className="text-sm text-foreground font-semibold">186</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Chronologie</Text>
                <Text className="text-sm text-foreground font-semibold">1M d'années</Text>
              </View>
            </View>
            <Text className="text-xs text-muted mt-2">
              Chronologie Archéologique Marchée synchronise votre marche avec l'histoire.
            </Text>
            <Text className="text-xs text-muted">
              - par lumomana
            </Text>
          </View>

          {/* Section Réinitialisation */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => setShowResetConfirm(true)}
              className="py-3 px-4 rounded-lg bg-error/10 border border-error items-center"
            >
              <Text className="text-error font-semibold">🗑️ Réinitialiser les données</Text>
            </TouchableOpacity>

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

          {/* Espacement */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
