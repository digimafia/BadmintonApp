import { Layers, MessageSquare, Target, ShieldCheck, type LucideIcon } from 'lucide-react'

export interface Advantage {
  title: string
  description: string
  icon: LucideIcon
}

export const advantages: Advantage[] = [
  {
    title: 'Modern Technology Stack',
    description: 'Building maintainable software using appropriate, well-tested technologies.',
    icon: Layers,
  },
  {
    title: 'Business-Focused Approach',
    description: 'Technology aligned with actual business requirements and goals.',
    icon: Target,
  },
  {
    title: 'Transparent Collaboration',
    description: 'Clear communication throughout the development journey.',
    icon: MessageSquare,
  },
  {
    title: 'Long-Term Support',
    description: 'Reliable support to help your software grow and scale with your business.',
    icon: ShieldCheck,
  },
]
