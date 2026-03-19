# Devinette célébrités — suivi

## Implémentation initiale

- [x] Scaffold TanStack Start (`celebrity-devinette`)
- [x] Modèle puzzle (Zod, `content/` + `public/`, Europe/Paris)
- [x] Page unique `/` + `submitGuess` sans fuite réponse dans le loader
- [x] Règles Cursor + `docs/automation-daily-puzzle.md`
- [x] Repo GitHub + README

## Review

- Build : `pnpm build` OK.
- Tests : `pnpm test` (normalizeGuess).
- Client bundle : pas de chaînes `answerNormalized` / réponses dans `dist/client`.
- Loader : données publiques uniquement (`date`, `imagePath`).

## Suite possible

- [ ] GitHub Action cron + API image (hors MVP)
- [ ] Hébergement (Vercel / Cloudflare)

## Puzzle quotidien 2026-03-19

- [ ] Choisir une célébrité française et un jeu de mots visuel clair sur le nom de famille
- [ ] Générer une image raster 400x400 sans texte dans `public/puzzles/2026-03-19.*`
- [ ] Créer `content/puzzles/2026-03-19.json` avec réponse normalisée
- [ ] Exécuter `pnpm build` et corriger si nécessaire
- [ ] Committer et pousser les changements sur la branche de travail

## Review — puzzle 2026-03-19

- [ ] Date Europe/Paris vérifiée
- [ ] Fichiers puzzle et image présents
- [ ] Build validé
