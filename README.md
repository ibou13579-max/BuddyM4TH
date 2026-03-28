# MathSolver — Solveur Mathématique Universitaire

Site web propulsé par Claude AI pour résoudre des problèmes mathématiques universitaires.

## Structure du projet

```
mathsolver/
├── index.html          ← Page principale (structure HTML)
├── css/
│   └── style.css       ← Tous les styles (design, animations, responsive)
├── js/
│   └── app.js          ← Toute la logique (API, upload, i18n, timer...)
└── README.md           ← Ce fichier
```

## Fonctionnalités

- **3 modes d'entrée** : Écrire, Photo, Fichier PDF
- **Détection automatique** de la branche mathématique
- **Double vérification** par l'IA
- **Recherche web** si la solution est incorrecte
- **Bilingue** FR/EN avec sélecteur globe
- **Chrono** de résolution en temps réel
- **Bouton Stop** pour arrêter une résolution
- **Consignes personnalisées** pour guider l'IA
- **Contrôle de taille** des fichiers (max 5 MB)
- **Historique** des 5 dernières résolutions

## Comment lancer

1. Ouvre le dossier `mathsolver` dans **VS Code**
2. Installe l'extension **Live Server**
3. Clic droit sur `index.html` → **Open with Live Server**
4. Le site s'ouvre dans ton navigateur

## Technologies

- HTML5 / CSS3 / JavaScript (vanilla)
- API Claude (Anthropic) pour la résolution
- KaTeX pour le rendu des formules mathématiques
- Google Fonts (Cormorant Garamond, Nunito Sans, Fira Code)
