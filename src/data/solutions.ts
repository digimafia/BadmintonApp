export interface Solution {
  id: string
  category: string
  title: string
  description: string
  image: string
}

/**
 * Presented as solution concepts, not completed client case studies —
 * no real client names or fabricated outcomes.
 */
export const solutions: Solution[] = [
  {
    id: 'business-dashboard',
    category: 'Web Application',
    title: 'Business Dashboard',
    description: 'A data-driven operations dashboard for tracking business performance in real time.',
    image: '/images/solutions/business-dashboard.webp',
  },
  {
    id: 'service-platform',
    category: 'Mobile App',
    title: 'Service Platform',
    description: 'A booking and service-management app connecting customers with providers.',
    image: '/images/solutions/service-platform.webp',
  },
  {
    id: 'online-store',
    category: 'E-Commerce',
    title: 'Online Store',
    description: 'A conversion-focused storefront with a streamlined checkout experience.',
    image: '/images/solutions/online-store.webp',
  },
]
