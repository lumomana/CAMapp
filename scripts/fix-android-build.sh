#!/bin/bash
# Script à lancer une fois après "npx expo prebuild" ou "npx expo run:android"
# Corrige le NDK et force AGP compatible avec React Native

GRADLE_FILE="android/build.gradle"

if [ ! -f "$GRADLE_FILE" ]; then
  echo "android/build.gradle non trouvé — lance d'abord npx expo run:android"
  exit 1
fi

# Forcer NDK 29
if ! grep -q "ext.ndkVersion" "$GRADLE_FILE"; then
  sed -i 's/apply plugin: "expo-root-project"/apply plugin: "expo-root-project"\next.ndkVersion = "29.0.14206865"/' "$GRADLE_FILE"
  echo "✅ NDK forcé à 29.0.14206865"
else
  echo "ℹ️  NDK déjà configuré"
fi

echo "✅ android/build.gradle corrigé — relance npx expo run:android"
