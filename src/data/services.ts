import { Monitor, Globe, Code2, PenTool, type LucideIcon } from 'lucide-react'

export interface Service {
  id: string
  title: string
  description: string
  icon: LucideIcon
  details: string[]
}

export const services: Service[] = [
  {
    id: 'web-applications',
    title: 'Custom Web Applications',
    description: 'Modern, scalable and responsive web solutions tailored to your business needs.',
    icon: Monitor,
    details: [
      'Component-driven React front ends',
      'Scalable application architecture',
      'Performance and accessibility built in',
    ],
  },
  {
    id: 'enterprise-solutions',
    title: 'Enterprise Software Solutions',
    description: 'Software systems to streamline complex business workflows.',
    icon: Globe,
    details: [
      'Workflow and process automation',
      'Role-based access and reporting',
      'Integrations with existing business systems',
    ],
  },
  {
    id: 'api-backend',
    title: 'API & Backend Development',
    description: 'Robust and secure backend services using .NET / C#.',
    icon: Code2,
    details: [
      'RESTful and secure API design',
      'Database architecture and optimization',
      'Cloud-ready backend infrastructure',
    ],
  },
  {
    id: 'frontend-engineering',
    title: 'Frontend Engineering',
    description: 'Engaging user interfaces powered by React.',
    icon: PenTool,
    details: [
      'Design-system-driven UI development',
      'Smooth, purposeful interaction and motion',
      'Cross-device, cross-browser reliability',
    ],
  },
]
