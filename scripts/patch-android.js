// Ce script est exécuté automatiquement par expo comme "postinstall"
// Il corrige android/build.gradle après chaque regénération
const fs = require('fs');
const path = require('path');

const buildGradle = path.join(__dirname, '..', 'android', 'build.gradle');
const gradleProps = path.join(__dirname, '..', 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties');

// Fix NDK dans build.gradle
if (fs.existsSync(buildGradle)) {
  let content = fs.readFileSync(buildGradle, 'utf8');
  if (!content.includes('ext.ndkVersion')) {
    content = content.replace(
      'apply plugin: "expo-root-project"',
      'apply plugin: "expo-root-project"\next.ndkVersion = "29.0.14206865"'
    );
    fs.writeFileSync(buildGradle, content);
    console.log('✅ NDK 29 configuré dans build.gradle');
  }
}
