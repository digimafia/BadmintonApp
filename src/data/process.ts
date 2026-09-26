import { Lightbulb, FileText, Code, Rocket, type LucideIcon } from 'lucide-react'

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discover',
    description: 'Understand the business goals and requirements.',
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'Plan',
    description: 'Define the right solution and development approach.',
    icon: FileText,
  },
  {
    number: '03',
    title: 'Develop',
    description: 'Build the application using modern technologies.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'Validate, launch, and evolve the solution.',
    icon: Rocket,
  },
]
