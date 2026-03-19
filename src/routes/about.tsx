import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">À propos</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Devinettes jeu de mots sur des célébrités
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Chaque jour, une nouvelle image-indice est publiée (générée via des
          automations Cursor selon des règles du dépôt). Le fuseau horaire du
          changement de devinette est{' '}
          <strong>Europe/Paris</strong>. Les réponses sont validées côté
          serveur sans être exposées dans les données de la page.
        </p>
      </section>
    </main>
  )
}
