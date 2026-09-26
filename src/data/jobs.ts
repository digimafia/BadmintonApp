export interface Job {
  id: string
  title: string
  department: string
  location: string
  arrangement: 'On-site' | 'Remote' | 'Hybrid'
  type: 'Full-time' | 'Part-time' | 'Contract'
  description: string
  requirements: string[]
}

/**
 * No fictional openings. Add real, published vacancies here.
 * The Careers page shows an elegant empty state when this list is empty.
 */
export const jobs: Job[] = []
