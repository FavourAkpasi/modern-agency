// Shared loading/error/empty states for the Projects variants.

export function ProjectsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-start gap-5 rounded-2xl border border-border p-8">
      <div>
        <p className="font-medium">We couldn&apos;t load the work right now.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The request failed — give it another try.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-border px-5 py-2 text-sm tracking-widest uppercase transition-colors hover:bg-foreground hover:text-background"
      >
        Retry
      </button>
    </div>
  )
}

export function ProjectsEmpty() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8 text-muted-foreground">
      No projects to show yet.
    </div>
  )
}
