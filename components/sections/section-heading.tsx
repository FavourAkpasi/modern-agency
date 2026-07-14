// Shared section header: a small parenthesised label paired with a bold title,
// separated by a rule. Keeps every section visually consistent.
export function SectionHeading({
  label,
  title,
}: {
  label: string
  title: string
}) {
  return (
    <div className="mb-12 flex flex-col gap-3 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <span className="text-sm tracking-widest text-muted-foreground uppercase">
        ({label})
      </span>
      <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl">
        {title}
      </h2>
    </div>
  )
}
