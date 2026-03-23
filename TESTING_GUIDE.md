# Guide de Test - CAM Podomètre

Ce guide vous aide à tester complètement l'application CAM Podomètre sur iOS et Android.

## 🚀 Installation et démarrage

### Prérequis
- Téléphone iOS ou Android
- App **Expo Go** installée (gratuit sur App Store / Google Play)
- Connexion internet

### Accès à l'application
1. Ouvrez **Expo Go** sur votre téléphone
2. Scannez le **code QR** depuis le Management UI (bouton Preview)
3. Ou collez le lien : `exps://8081-iuwze2p8xv8c9nypp18er-8899b107.us1.manus.computer`
4. L'app se charge en quelques secondes

## 📋 Plan de test

### 1. Interface et navigation
- [ ] L'écran d'accueil s'affiche correctement
- [ ] Le compteur circulaire est visible
- [ ] Les trois onglets (Accueil, Jalons, Paramètres) sont accessibles
- [ ] La palette de couleurs archéologique est appliquée
- [ ] Le logo CAM Podomètre s'affiche correctement

### 2. Podomètre
- [ ] Marchez 10 pas et vérifiez que le compteur augmente
- [ ] Marchez 100 pas et vérifiez la distance en mètres
- [ ] Vérifiez que la période historique s'affiche correctement
- [ ] Vérifiez que le prochain jalon s'affiche avec la distance restante

### 3. Jalons et alertes
- [ ] Marchez jusqu'à atteindre un jalon (~3-5 minutes selon la distance)
- [ ] Vérifiez que vous recevez une **vibration** (haptique)
- [ ] Vérifiez que vous entendez un **son d'alerte**
- [ ] Vérifiez que le jalon apparaît dans l'onglet "Jalons"
- [ ] Vérifiez que le compteur affiche le jalon atteint

### 4. Onglet Jalons
- [ ] Ouvrez l'onglet "Jalons"
- [ ] Vérifiez que les jalons atteints s'affichent en ordre inverse (du plus récent)
- [ ] Cliquez sur "En savoir plus" pour vérifier que le lien externe s'ouvre
- [ ] Vérifiez que la catégorie du jalon s'affiche (civilisation, culture, artefact)
- [ ] Vérifiez que la date s'affiche correctement

### 5. Onglet Paramètres
- [ ] Ouvrez l'onglet "Paramètres"
- [ ] Testez chaque distance (100m, 500m, 1000m, 2000m)
- [ ] Vérifiez que le changement de distance affecte le compteur
- [ ] Testez le slider de volume sonore
- [ ] Testez le slider d'intensité de vibration
- [ ] Activez/désactivez le son
- [ ] Activez/désactivez la vibration
- [ ] Vérifiez que les informations "À propos" s'affichent

### 6. Persistance des données
- [ ] Fermez l'app
- [ ] Rouvrez l'app
- [ ] Vérifiez que les pas et jalons sont conservés
- [ ] Vérifiez que les paramètres sont conservés

### 7. Réinitialisation
- [ ] Cliquez sur "Réinitialiser" dans l'onglet d'accueil
- [ ] Confirmez la réinitialisation
- [ ] Vérifiez que le compteur revient à 0
- [ ] Vérifiez que les jalons sont supprimés

### 8. Performance
- [ ] L'app se charge rapidement
- [ ] La navigation entre les onglets est fluide
- [ ] Le compteur se met à jour en temps réel sans lag
- [ ] Pas de crash ou d'erreur

## 🐛 Rapporter un bug

Si vous trouvez un bug, notez :
1. **Description** : Qu'est-ce qui ne fonctionne pas ?
2. **Étapes** : Comment reproduire le bug ?
3. **Résultat attendu** : Qu'est-ce qui devrait se passer ?
4. **Résultat actuel** : Qu'est-ce qui se passe réellement ?
5. **Appareil** : iOS ou Android ? Quel modèle ?

## 💡 Suggestions d'amélioration

Si vous avez des idées pour améliorer l'app :
1. Décrivez la fonctionnalité
2. Expliquez pourquoi ce serait utile
3. Proposez comment l'implémenter

## 📊 Métriques de test

| Aspect | Statut | Notes |
|--------|--------|-------|
| Installation | ✅ | Fonctionne via Expo Go |
| Interface | ⏳ | À tester |
| Podomètre | ⏳ | À tester |
| Jalons | ⏳ | À tester |
| Alertes | ⏳ | À tester |
| Paramètres | ⏳ | À tester |
| Persistance | ⏳ | À tester |
| Performance | ⏳ | À tester |

## 🎯 Cas d'usage complet

**Scénario** : Un utilisateur marche 500 pas et atteint 2 jalons

1. Ouvrir l'app
2. Voir le compteur à 0
3. Cliquer sur "Démarrer la marche"
4. Marcher ~375 mètres (~500 pas)
5. Recevoir 2 alertes (vibration + son)
6. Voir 2 jalons dans l'onglet "Jalons"
7. Consulter les détails des jalons
8. Ajuster les paramètres
9. Réinitialiser et recommencer

## ✅ Checklist finale

Avant de valider l'app :
- [ ] Tous les tests sont passés
- [ ] Aucun crash ou erreur
- [ ] Les performances sont satisfaisantes
- [ ] L'interface est intuitive
- [ ] Les alertes fonctionnent correctement
- [ ] Les données sont persistées

Bon test ! 🚶‍♂️📱
