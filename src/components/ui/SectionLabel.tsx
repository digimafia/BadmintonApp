interface SectionLabelProps {
  children: string
  dark?: boolean
}

export function SectionLabel({ children, dark }: SectionLabelProps) {
  return (
    <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
      <span className={dark ? 'text-white/70' : 'text-[var(--color-text-gray)]'}>{children}</span>
    </div>
  )
}
