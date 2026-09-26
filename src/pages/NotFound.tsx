import { usePageMeta } from '../hooks/usePageMeta'
import { Button } from '../components/ui/Button'

export function NotFound() {
  usePageMeta({
    title: 'Page Not Found',
    description: 'The page you are looking for could not be found.',
  })

  return (
    <section className="flex flex-col items-center justify-center px-4 py-36 text-center sm:px-6 lg:px-8">
      <span className="text-7xl font-extrabold text-[var(--color-orange)]">404</span>
      <h1 className="mt-4 text-3xl font-extrabold text-[var(--color-ink)]">Page Not Found</h1>
      <p className="mt-3 max-w-sm text-[var(--color-text-gray)]">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div className="mt-8">
        <Button as="link" to="/" variant="primary">
          Back to Home
        </Button>
      </div>
    </section>
  )
}
