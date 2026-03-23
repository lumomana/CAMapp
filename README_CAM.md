# CAM Podomètre

Une application mobile innovante qui synchronise votre podomètre avec la **Chronologie Archéologique Marchée (CAM)**, transformant chaque pas en un voyage à travers 1 million d'années d'histoire humaine.

## 🎯 Concept

L'application repose sur une idée simple mais puissante : **marcher à travers le temps**. En marchant, vous progressez dans la chronologie archéologique, découvrant des jalons historiques majeurs. Chaque jalon atteint déclenche une alerte sonore et haptique pour vous immerger dans cette expérience unique.

### Synchronisation
- **1 million d'années** = **1000 mètres** (configurable)
- **1 pas** ≈ **0,75 mètre** ≈ **750 ans**
- **100 pas** = ~75 000 ans
- **1000 pas** = ~750 000 ans

## 📱 Fonctionnalités

### Écran d'accueil
- Compteur circulaire animé affichant les pas en temps réel
- Affichage de la période historique actuelle
- Prochain jalon à atteindre avec distance restante
- Statut du podomètre
- Boutons pour démarrer/arrêter la marche et réinitialiser

### Écran des jalons
- Historique complet des jalons atteints
- Informations détaillées : titre, date, catégorie, description
- Liens vers des ressources externes (articles, vidéos, etc.)
- Affichage en ordre chronologique inverse (du plus récent au plus ancien)

### Écran des paramètres
- Configuration de la distance totale (100m, 500m, 1000m, 2000m)
- Contrôle du volume sonore
- Contrôle de l'intensité des vibrations
- Activation/désactivation des alertes
- Informations sur l'application

## 🏛️ Jalons inclus

L'application contient **186 jalons** couvrant :
- **Préhistoire** : Maîtrise du feu (-1M BC), outils lithiques, art pariétal
- **Protohistoire** : Domestication, sédentarisation, premières civilisations
- **Antiquité** : Égypte, Mésopotamie, Grèce, Rome
- **Moyen Âge** : Phéniciens, Olmèques, civilisations asiatiques
- Et bien d'autres...

Chaque jalon inclut :
- Date précise (année BC/AD)
- Description et contexte historique
- Catégorie (civilisation, culture, artefact)
- Région géographique
- Liens vers des ressources externes

## 🎨 Design

L'interface respecte les principes de design iOS/Android modernes :
- **Palette archéologique** : Terracotta (#C1440E), crème (#F5F1E8), or (#D4AF37)
- **Typographie claire** : Hiérarchie visuelle bien définie
- **Interactions fluides** : Animations subtiles, feedback haptique
- **Accessibilité** : Textes lisibles, contrôles tactiles larges
- **Mode sombre** : Support complet pour les préférences système

## 🚀 Démarrage

### Installation
```bash
cd cam-pedometer-app
pnpm install
```

### Développement
```bash
pnpm dev
```

### Prévisualisation
- **Web** : Accédez au lien fourni par le serveur de développement
- **iOS/Android** : Scannez le code QR avec Expo Go

## 📋 Architecture

### Structure des données
- **Milestones** : 186 jalons archéologiques avec métadonnées complètes
- **PedometerState** : État du podomètre (pas, distance, jalons atteints)
- **AppSettings** : Préférences utilisateur (distance, volume, vibrations)

### Hooks personnalisés
- **`usePedometer`** : Gestion complète du podomètre et synchronisation
- **`useMilestoneAlerts`** : Alertes sonores et haptiques

### Écrans
- **Home** : Écran principal avec compteur et statut
- **Milestones** : Historique des jalons atteints
- **Settings** : Paramètres et configuration

## 🔧 Technologies

- **React Native** 0.81 avec Expo SDK 54
- **TypeScript** pour la sécurité des types
- **NativeWind** (Tailwind CSS) pour le styling
- **expo-sensors** pour le podomètre
- **expo-haptics** pour les vibrations
- **expo-audio** pour les sons
- **AsyncStorage** pour la persistance locale

## 📊 Données

Les jalons sont extraits du CSV de la CAM officielle et incluent :
- Titre et description
- Dates de début et fin
- Catégorie (civilisation, culture, artefact)
- Région géographique
- Liens vers ressources externes
- Images (quand disponibles)

## 🎯 Prochaines étapes

- [ ] Tests sur iOS et Android réels
- [ ] Optimisation des performances
- [ ] Intégration avec HealthKit (iOS) et Google Fit (Android)
- [ ] Partage des jalons atteints
- [ ] Mode hors ligne amélioré
- [ ] Statistiques détaillées

## 📝 Licence

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

## 🙏 Crédits

- **CAM** : David Vial (librairiemobile.org)
- **Données archéologiques** : Tiki-Toki Timeline
- **Design** : Inspiré par les principes HIG d'Apple

## 📧 Support

Pour toute question ou suggestion, consultez la documentation CAM officielle sur [librairiemobile.org](https://librairiemobile.org/feuilleCAM.html).

---

**Marchez à travers l'histoire. Découvrez nos origines. Comprenez notre présent.**
