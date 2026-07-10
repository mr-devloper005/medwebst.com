import { SITE_CONFIG } from '@/lib/site-config'

export function EditableBrand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3" aria-label={SITE_CONFIG.name}>
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-[4px_4px_0_currentColor] ${compact ? 'h-10 w-10' : 'h-12 w-12 sm:h-14 sm:w-14'}`}
      >
        <img src="/favicon.png" alt="" className="h-full w-full object-cover" />
      </span>
      <span className={`editable-display font-bold leading-none text-white ${compact ? 'text-3xl' : 'text-4xl sm:text-5xl'}`}>
        {SITE_CONFIG.name}
      </span>
    </span>
  )
}
