import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [variant, setVariant] = useState<'default' | 'link' | 'view'>('default')

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isEnabled = fine && !reduced
    setEnabled(isEnabled)
    if (isEnabled) document.documentElement.classList.add('custom-cursor-active')
    return () => document.documentElement.classList.remove('custom-cursor-active')
  }, [])

  useEffect(() => {
    if (!enabled) return

    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY
    let raf = 0

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="view"]')) setVariant('view')
      else if (target.closest('a, button, [role="button"]')) setVariant('link')
      else setVariant('default')
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMove)
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize = variant === 'view' ? 64 : variant === 'link' ? 48 : 36

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div
        ref={ringRef}
        className="cursor-ring flex items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-[var(--color-orange)]"
        style={{
          width: ringSize,
          height: ringSize,
          backgroundColor: variant === 'link' ? 'rgba(255,87,45,0.08)' : 'transparent',
        }}
        aria-hidden="true"
      >
        {variant === 'view' && 'View'}
      </div>
    </>
  )
}
