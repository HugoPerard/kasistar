# Devinette personnalités publiques — suivi

## Implémentation initiale

- [x] Scaffold TanStack Start (`celebrity-devinette`)
- [x] Modèle puzzle (Zod, `content/` + `public/`, Europe/Paris)
- [x] Page unique `/` + `submitGuess` sans fuite réponse dans le loader
- [x] Règles Cursor + `docs/automation-daily-puzzle.md`
- [x] Repo GitHub + README

## Review

- Build : `pnpm build` OK.
- Tests : `pnpm test` (normalizeGuess).
- Client bundle : pas de chaînes `answersNormalized` / réponses dans `dist/client`.
- Loader : données publiques uniquement (`date`, `imagePath`).
- Déploiement Vercel : les JSON sous `content/puzzles/` ne sont pas sur le disque serverless ; chargement via `import.meta.glob` dans `src/server/puzzle-registry.ts` pour les embarquer au build.

## Sons feedback (soundcn)

- [x] `npx shadcn@latest add @soundcn/use-sound @soundcn/error-008 @soundcn/confirmation-003`
- [x] Accueil + archives : confirmation sur bonne réponse, erreur sur mauvaise réponse ou échec réseau

### Review

- Build + tests OK après intégration.

## Blocage devinettes futures (serveur)

- [x] `listReleasedPuzzleDates` / `isPuzzleDateReleased` (calendrier Europe/Paris)
- [x] `resolvePuzzleDateForPlay` sans fallback « dernière du repo » si tout est futur
- [x] `getPuzzleByDate`, `listAvailableDates`, `submitGuess` alignés

### Review

- `pnpm test` + `tsc --noEmit` OK.

## Suite possible

- [ ] GitHub Action cron + API image (hors MVP)
- [ ] Hébergement (Vercel / Cloudflare)

## Page Archives (mars 2026)

- [x] Date par défaut : veille (Paris), avec repli si pas de fichier ce jour-là
- [x] Layout aligné sur l’accueil : overline « Archives », date en `type-date-hero` cliquable
- [x] Modale calendrier : aperçu image par jour avec devinette + indicateur résolu (localStorage)

### Review

- `pnpm exec tsc --noEmit`, `pnpm build`, `pnpm test` OK.

## Devinette du jour (2026-03-25)

- [x] Vérifier la date Europe/Paris et l'état existant des fichiers du jour
- [x] Remplacer le placeholder 2026-03-25 par une vraie devinette cohérente et diversifiée
- [x] Générer puis exporter une image finale 400×400 sans texte sous `public/puzzles/2026-03-25.png`
- [x] Mettre à jour `content/puzzles/2026-03-25.json` avec la réponse normalisée correcte
- [x] Valider avec `pnpm build`
- [ ] Commit, push de la branche de travail, puis ouvrir une PR

### Review

- Date Paris confirmée : `2026-03-25`.
- Placeholder remplacé par `Michel Sardou` → `michel sardine` avec image PNG 400×400 sous `public/puzzles/2026-03-25.png`.
- Validation : `pnpm build` OK, `pnpm test` OK.
