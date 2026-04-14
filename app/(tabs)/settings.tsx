import { ScrollView, Text, View, TouchableOpacity, Switch, Linking } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { usePedometerContext as usePedometer } from "@/lib/pedometer-context";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { useThemeContext, type ThemePreference } from "@/lib/theme-provider";
import Slider from "@react-native-community/slider";

/**
 * Écran des paramètres
 */
export default function SettingsScreen() {
  const colors = useColors();
  const { settings, updateSettings, reset, changeChronology } = usePedometer();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { themePreference, setThemePreference } = useThemeContext();

  const handleChronologyChange = (chronologyId: number) => {
    changeChronology(chronologyId);
  };

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

          {/* Section Thème */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Thème</Text>
            <View className="flex-row gap-2">
              {([
                { value: "light", label: "☀️ Clair" },
                { value: "auto",  label: "🌗 Auto" },
                { value: "dark",  label: "🌙 Sombre" },
              ] as { value: ThemePreference; label: string }[]).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setThemePreference(option.value)}
                  style={{ flex: 1 }}
                  className={`py-3 rounded-xl items-center border-2 ${
                    themePreference === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  }`}
                >
                  <Text className={`text-sm font-semibold ${
                    themePreference === option.value ? "text-primary" : "text-foreground"
                  }`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text className="text-xs text-muted">
              {themePreference === "auto"
                ? "Suit automatiquement le thème du système"
                : themePreference === "dark"
                ? "Mode sombre activé"
                : "Mode clair activé"}
            </Text>
          </View>

          {/* Section Distance */}
          <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Distance totale</Text>
            <Text className="text-sm text-muted">
              Définissez la longueur totale de la chronologie
            </Text>

            <View className="gap-3">
              {[
                { dist: 100.2,    label: "Sprint",      sub: "100m" },
                { dist: 501,      label: "Balade",      sub: "500m" },
                { dist: 1002.050, label: "Promenade",   sub: "1km" },
                { dist: 2004.1,   label: "Randonnée",   sub: "2km" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.dist}
                  onPress={() => handleDistanceChange(option.dist)}
                  className={`py-3 px-4 rounded-lg border-2 items-center ${
                    Math.abs(settings.totalDistance - option.dist) < 0.5
                      ? `border-primary bg-primary/10`
                      : `border-border bg-background`
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      Math.abs(settings.totalDistance - option.dist) < 0.5 ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-xs text-muted mt-1">{option.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>



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
                { id: 1, name: "Chronologie Archéologique Marchée" },
                { id: 2, name: "Photographie" },
                { id: 3, name: "Chronologie 3" },
                { id: 4, name: "Chronologie 4" },
                { id: 5, name: "Chronologie 5" },
              ].map((chrono) => {
                const isActive = settings.chronologyId === chrono.id;
                return (
                  <TouchableOpacity
                    key={chrono.id}
                    onPress={() => handleChronologyChange(chrono.id)}
                    className={`py-3 px-4 rounded-lg border-2 flex-row items-center justify-between ${
                      isActive
                        ? `border-primary bg-primary/10`
                        : `border-border bg-background`
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {chrono.name}
                    </Text>
                    {isActive && <Text className="text-primary font-bold">✓</Text>}
                  </TouchableOpacity>
                );
              })}
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
            <Text className="text-xs text-muted mt-2 leading-relaxed">
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
            </Text>
            <View className="gap-1 mt-1">
              <Text className="text-xs text-muted">📜 Crédits CAM : David Vial</Text>
              <Text className="text-xs text-muted">⏱️ Mise en chronologie : Tiki-Toki Timeline</Text>
              <Text className="text-xs text-muted">🎶 Sons : freesound.org</Text>
              <Text className="text-xs text-muted">🎨 Design : Inspiré par les principes HIG d'Apple</Text>
              <Text className="text-xs text-muted">💻 Conception & développement : lumomana</Text>
              <Text className="text-xs text-muted">👩🏾‍💻🤖 avec la complicité de Claude & Manus</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://librairiemobile.org/feuilleCAM.html")}
              className="mt-2 py-3 px-4 rounded-lg bg-primary/10 border border-primary items-center"
            >
              <Text className="text-primary font-semibold">📚 Consulter la documentation</Text>
              <Text className="text-xs text-primary mt-1">https://librairiemobile.org/feuilleCAM.html</Text>
            </TouchableOpacity>
            <Text className="text-xs text-primary font-semibold mt-1 leading-relaxed">
              Parcourez 1 million d'années d'histoire. Découvrez nos origines. Comprenez notre présent.
            </Text>
          </View>

          {/* Section Réinitialisation */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={() => setShowResetConfirm(true)}
              className="py-3 px-4 rounded-lg bg-error/10 border border-error items-center"
            >
              <Text className="text-error font-semibold">🗑️ Remettre à zéro (pas, distance et jalons)</Text>
            </TouchableOpacity>

            {showResetConfirm && (
              <View className="bg-surface rounded-2xl p-4 border border-error gap-3">
                <Text className="text-sm font-semibold text-foreground">
                  Cela remettra à zéro tous vos pas, votre distance et tous les jalons atteints.
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
