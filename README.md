# Application de Gestion de Prêts de Matériel

Une application React simple et intuitive pour gérer les prêts de matériel informatique au sein d'une organisation. L'application fonctionne entièrement côté client avec stockage en mémoire.

## Fonctionnalités

### Gestion des Utilisateurs
- ✅ Création d'utilisateurs avec prénom et nom
- ✅ Attribution automatique d'ID unique
- ✅ Liste complète des utilisateurs enregistrés

### Gestion du Matériel
- ✅ Ajout de matériel avec nom et catégorie prédéfinie
- ✅ Catégories disponibles : Ordinateur portable, Écran/Moniteur, Clavier, Souris, etc.
- ✅ Suivi du statut (disponible/emprunté)
- ✅ Filtrage par statut de disponibilité

### Gestion des Emprunts
- ✅ Attribution de matériel à un utilisateur
- ✅ **Emprunts à durée déterminée** : avec date de retour prévue
- ✅ **Emprunts à durée indéterminée** : sans contrainte de temps
- ✅ Suivi des emprunts en cours
- ✅ Détection automatique des retards
- ✅ Processus de retour simple

### Historique et Suivi
- ✅ Historique complet de tous les emprunts
- ✅ Statistiques en temps réel (total, en cours, retournés, en retard)
- ✅ Filtrage par statut (tous, en cours, retournés)
- ✅ Tri par date, utilisateur ou matériel
- ✅ Export des données au format JSON

### Import/Export
- ✅ Sauvegarde complète des données
- ✅ Restauration depuis un fichier JSON
- ✅ Export de l'historique filtré

## Technologies Utilisées

- **React 18** avec hooks (useState)
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le design responsive
- **Lucide React** pour les icônes
- **Vite** comme bundler de développement

## Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd gestion-prets-materiel

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Scripts Disponibles
```bash
npm run dev      # Démarrage en mode développement
npm run build    # Construction pour la production
npm run preview  # Prévisualisation de la version de production
npm run lint     # Vérification du code avec ESLint
```

## Guide d'Utilisation

### 1. Ajouter des Utilisateurs
1. Aller dans l'onglet "Utilisateurs"
2. Remplir le formulaire avec prénom et nom
3. Cliquer sur "Ajouter l'utilisateur"

### 2. Ajouter du Matériel
1. Aller dans l'onglet "Matériels"
2. Saisir le nom du matériel
3. Sélectionner une catégorie dans la liste déroulante
4. Cliquer sur "Ajouter le matériel"

### 3. Créer un Emprunt
1. Aller dans l'onglet "Emprunts"
2. Sélectionner un utilisateur
3. Choisir un matériel disponible
4. **Option A** : Cocher "Définir une date de retour prévue" et sélectionner une date
5. **Option B** : Laisser décoché pour un emprunt à durée indéterminée
6. Cliquer sur "Enregistrer l'emprunt"

### 4. Retourner du Matériel
1. Dans l'onglet "Emprunts", section "Emprunts en cours"
2. Cliquer sur "Retourner" pour le matériel concerné
3. Le matériel redevient automatiquement disponible

### 5. Consulter l'Historique
1. Aller dans l'onglet "Historique"
2. Utiliser les filtres pour affiner la vue
3. Exporter les données si nécessaire

## Types d'Emprunts

### Emprunt à Durée Déterminée
- Date de retour prévue définie
- Suivi des retards automatique
- Badge "En retard" si dépassement

### Emprunt à Durée Indéterminée
- Aucune contrainte de temps
- Badge "Durée indéterminée"
- Idéal pour les prêts long terme

## Interface Utilisateur

L'application propose une interface moderne et intuitive avec :
- **Navigation par onglets** pour un accès rapide aux fonctionnalités
- **Badges de statut** colorés pour une identification visuelle
- **Compteurs en temps réel** sur chaque onglet
- **Design responsive** adapté mobile et desktop
- **Indicateurs visuels** pour les retards et statuts

## Stockage des Données

- **Stockage en mémoire** : Les données sont conservées pendant la session
- **Pas de base de données externe** : Fonctionnement 100% client
- **Export/Import JSON** : Pour la sauvegarde et restauration
- **Réinitialisation** : Les données sont perdues au rechargement de page

## Structure du Projet

```
src/
├── components/           # Composants React
│   ├── UserManagement.tsx      # Gestion des utilisateurs
│   ├── MaterialManagement.tsx  # Gestion du matériel
│   ├── LoanManagement.tsx      # Gestion des emprunts
│   └── LoanHistory.tsx         # Historique des emprunts
├── types.ts             # Définitions TypeScript
├── App.tsx              # Composant principal
├── main.tsx             # Point d'entrée
└── index.css            # Styles Tailwind
```

## Fonctionnalités Avancées

### Statistiques en Temps Réel
- Nombre total d'emprunts
- Emprunts en cours
- Matériels retournés
- Emprunts en retard

### Filtres et Tri
- Filtrage par statut d'emprunt
- Tri par date, utilisateur ou matériel
- Recherche dans l'historique

### Export de Données
- Export complet de la base de données
- Export filtré de l'historique
- Format JSON lisible

## Cas d'Usage Typiques

- **Entreprises** : Gestion des ordinateurs portables et équipements
- **Écoles/Universités** : Prêt de matériel pédagogique
- **Associations** : Gestion du matériel partagé
- **Équipes IT** : Suivi des équipements temporaires

## Évolutions Possibles

- Ajout de la persistance avec localStorage
- Notifications de rappel pour les retours
- Gestion des utilisateurs avec plus de détails
- Historique des modifications
- Génération de rapports PDF
- API REST pour synchronisation multi-utilisateurs

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---
