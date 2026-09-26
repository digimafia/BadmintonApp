import { Cpu, Target, Users, MapPin, type LucideIcon } from 'lucide-react'

export interface Highlight {
  title: string
  icon: LucideIcon
}

export const highlights: Highlight[] = [
  { title: 'Modern Technology Stack', icon: Cpu },
  { title: 'Business-Focused Approach', icon: Target },
  { title: 'Collaborative Development', icon: Users },
  { title: 'India-Based Company', icon: MapPin },
]
