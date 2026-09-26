import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

type Variant = 'primary' | 'dark' | 'outline' | 'ghost'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-orange)] text-white hover:bg-[var(--color-orange-dark)]',
  dark: 'bg-[var(--color-ink)] text-white hover:bg-black',
  outline: 'bg-transparent text-[var(--color-ink)] border border-[var(--color-ink)]/20 hover:border-[var(--color-ink)]',
  ghost: 'bg-white/10 text-white hover:bg-white/20',
}

const baseClasses =
  'group relative inline-flex items-center gap-3 rounded-full px-6 py-3 font-semibold text-sm transition-all duration-300 focus-ring cursor-pointer select-none'

interface SharedProps {
  variant?: Variant
  icon?: boolean
  children: ReactNode
  className?: string
}

function ArrowBadge({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45 ${
        dark ? 'bg-[var(--color-orange)] text-white' : 'bg-white text-[var(--color-ink)]'
      }`}
    >
      <ArrowUpRight size={15} strokeWidth={2.5} />
    </span>
  )
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsAnchor = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }
type ButtonAsLink = SharedProps & { as: 'link'; to: string }

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink

export const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', icon = true, children, className = '' } = props
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`
  const dark = variant === 'primary' || variant === 'dark'

  if (props.as === 'link') {
    const { to } = props
    return (
      <Link to={to} className={classes} ref={ref as never}>
        {children}
        {icon && <ArrowBadge dark={dark} />}
      </Link>
    )
  }

  if (props.as === 'a') {
    const { as: _as, variant: _v, icon: _i, children: _c, className: _cl, ...rest } = props
    return (
      <a className={classes} ref={ref as never} {...rest}>
        {children}
        {icon && <ArrowBadge dark={dark} />}
      </a>
    )
  }

  const { as: _as, variant: _v, icon: _i, children: _c, className: _cl, ...rest } = props
  return (
    <button className={classes} ref={ref as never} {...rest}>
      {children}
      {icon && <ArrowBadge dark={dark} />}
    </button>
  )
})

Button.displayName = 'Button'
