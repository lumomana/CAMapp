# Design de l'Application CAM Podomètre

## Vue d'ensemble
Application mobile (iOS & Android) synchronisant le podomètre avec la Chronologie Archéologique Marchée. L'utilisateur marche et reçoit des alertes (son + vibration) en atteignant des jalons historiques.

## Principes de conception
- **Orientation** : Portrait (9:16) optimisé pour une main
- **Philosophie** : Immersive, éducative, respectueuse du concept CAM
- **Accessibilité** : Textes lisibles, contrôles tactiles larges
- **Thème** : Palette archéologique (terracotta, ocre, gris pierre, or)

## Écrans principaux

### 1. **Écran d'accueil (Home)**
**Contenu** :
- Titre : "CAM Podomètre"
- Compteur de pas en grand (nombre + progression visuelle circulaire)
- Affichage de la période actuelle (ex: "Néolithique - 8000 BC")
- Bouton "Démarrer la marche" / "Arrêter"
- Bouton "Paramètres"
- Bouton "À propos"

**Fonctionnalité** :
- Affiche les pas actuels en temps réel
- Affiche la période historique correspondante
- Barre de progression circulaire montrant la progression dans la chronologie

### 2. **Écran de marche (Walking)**
**Contenu** :
- Compteur de pas dominant (très grand)
- Période historique actuelle avec description courte
- Jalon suivant (distance en pas, nom)
- Bouton "Pause" / "Reprendre"
- Bouton "Arrêter et réinitialiser"
- Historique des jalons atteints (liste déroulante)

**Fonctionnalité** :
- Mise à jour en temps réel du compteur
- Affichage dynamique de la période
- Alerte visuelle + son + vibration à chaque jalon

### 3. **Écran des jalons (Milestones)**
**Contenu** :
- Liste des jalons atteints (avec timestamps)
- Détails de chaque jalon (date, description, catégorie)
- Lien vers ressources externes (si disponible)
- Image du jalon (si disponible)

**Fonctionnalité** :
- Scroll vertical des jalons
- Tap pour voir les détails complets
- Partage des jalons atteints

### 4. **Écran de paramètres (Settings)**
**Contenu** :
- Distance totale de la chronologie (1000m, 100m, 10m, personnalisé)
- Volume des alertes sonores
- Intensité des vibrations
- Réinitialiser les données
- À propos / Crédits

**Fonctionnalité** :
- Sliders pour volume et vibration
- Boutons radio pour distance
- Bouton de réinitialisation avec confirmation

### 5. **Écran de détail du jalon (Milestone Detail)**
**Contenu** :
- Titre du jalon
- Date exacte (BC ou AD)
- Image (si disponible)
- Description complète
- Catégorie (civilisation, culture, artefact)
- Région géographique
- Lien vers ressource externe
- Bouton "Retour"

**Fonctionnalité** :
- Scroll vertical pour texte long
- Tap sur lien pour ouvrir dans navigateur
- Partage du jalon

## Flux utilisateur principal

1. **Démarrage** : Utilisateur ouvre l'app → Écran d'accueil
2. **Préparation** : Tap "Démarrer la marche" → Écran de marche
3. **Marche** : Utilisateur marche → Compteur augmente → Alertes aux jalons
4. **Jalon atteint** : Son + vibration + notification visuelle
5. **Consultation** : Tap sur jalon pour voir détails
6. **Fin** : Tap "Arrêter" → Retour à l'accueil avec historique

## Palette de couleurs (Archéologique)

| Élément | Couleur | Hex |
|---------|---------|-----|
| Primaire | Terracotta | #C1440E |
| Accent | Or | #D4AF37 |
| Fond | Crème | #F5F1E8 |
| Texte principal | Gris foncé | #2C2C2C |
| Texte secondaire | Gris moyen | #666666 |
| Succès (jalon) | Vert archéo | #6B8E23 |
| Alerte | Orange chaud | #FF8C00 |
| Bordures | Gris clair | #D3D3D3 |

### Mode sombre
- Fond : Gris très foncé (#1A1A1A)
- Texte : Crème (#F5F1E8)
- Accent : Or (#D4AF37)

## Typographie

- **Titre (H1)** : 32px, Bold, Terracotta
- **Sous-titre (H2)** : 24px, SemiBold, Gris foncé
- **Corps (Body)** : 16px, Regular, Gris foncé
- **Petit texte** : 12px, Regular, Gris moyen

## Composants réutilisables

1. **MilestoneCard** : Affiche un jalon avec titre, date, image
2. **StepCounter** : Compteur circulaire animé
3. **PeriodDisplay** : Affiche la période actuelle avec description
4. **AlertNotification** : Notification de jalon atteint
5. **BottomSheet** : Détails du jalon (modal)

## Interactions clés

- **Tap sur jalon** : Ouvre détails en modal
- **Swipe vers le haut** : Historique des jalons
- **Long press sur jalon** : Menu de partage
- **Double tap sur compteur** : Réinitialise (avec confirmation)

## Considérations techniques

- Utiliser `expo-pedometer` pour tracker les pas
- Utiliser `expo-haptics` pour vibrations
- Utiliser `expo-audio` pour son (avec mode silencieux iOS)
- AsyncStorage pour persister l'historique
- Animations fluides avec `react-native-reanimated`
