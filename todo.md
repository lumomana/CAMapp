# CAM Podomètre - TODO

## Phase 1 : Fondations
- [x] Parser le CSV de la CAM et extraire les jalons principaux
- [x] Créer la structure de données des jalons (TypeScript types)
- [x] Implémenter le calcul de distance en fonction de la chronologie
- [x] Configurer la base de données locale AsyncStorage

## Phase 2 : Podomètre & Capteurs
- [x] Intégrer expo-pedometer pour tracker les pas
- [x] Implémenter la logique de synchronisation pas ↔ années
- [x] Créer le système de détection des jalons atteints
- [ ] Tester sur iOS et Android

## Phase 3 : Alertes & Notifications
- [x] Intégrer expo-haptics pour vibrations
- [x] Intégrer expo-audio pour son d'alerte
- [ ] Créer les sons d'alerte (générer ou télécharger)
- [x] Implémenter la notification visuelle de jalon
- [ ] Tester les alertes sur vrais appareils

## Phase 4 : Interface utilisateur
- [x] Créer l'écran d'accueil (Home)
- [ ] Créer l'écran de marche (Walking)
- [x] Créer l'écran des jalons (Milestones)
- [x] Créer l'écran de paramètres (Settings)
- [ ] Créer l'écran de détail du jalon (Milestone Detail)
- [x] Implémenter la navigation entre écrans
- [x] Appliquer la palette de couleurs archéologique
- [ ] Tester la responsivité sur différentes tailles d'écran

## Phase 5 : Branding & Assets
- [x] Générer le logo de l'application
- [x] Créer les icônes pour la tab bar
- [x] Configurer app.config.ts avec le branding
- [ ] Créer la splash screen

## Phase 6 : Optimisations & Tests
- [ ] Tester le flux utilisateur complet
- [ ] Vérifier les performances (consommation batterie)
- [ ] Tester sur iOS et Android réels
- [ ] Vérifier l'accessibilité
- [ ] Corriger les bugs identifiés

## Phase 7 : Livraison
- [ ] Créer le checkpoint final
- [ ] Préparer la documentation utilisateur
- [ ] Générer l'APK pour Android (via UI Publish)
