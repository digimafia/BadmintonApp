# Global Tech Byte — Corporate Website

Marketing site for Global Tech Byte Private Limited, built with React, TypeScript, Vite, Tailwind CSS and Motion for React.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build

```bash
npm run build   # type-checks and produces dist/
npm run preview # serve the production build locally
```

## Project structure

- `src/pages` — routed pages (Home, About, Services, Work, Careers, Internships, Contact, legal pages, 404)
- `src/components/sections` — homepage section blocks (Hero, Services, Process, etc.)
- `src/components/layout` — Header, Footer, custom cursor, scroll progress, back-to-top
- `src/components/ui` — shared building blocks (Button, form fields, PageHero, Reveal, JobCard)
- `src/data` — configurable content: services, process steps, solution concepts, highlights, advantages, job listings
- `src/lib/site.ts` — company contact details and navigation config

## Configuration notes

- **Contact / Internship forms** submit through [Web3Forms](https://web3forms.com) (a hosted form backend — no custom server needed). To enable it:
  1. Sign up at [web3forms.com](https://web3forms.com) (free) and copy your access key.
  2. Copy `.env.example` to `.env` and fill in:
     ```
     VITE_WEB3FORMS_ACCESS_KEY=your_access_key
     ```
  3. Restart `npm run dev` (Vite only reads `.env` at startup).

  One access key covers both forms — Web3Forms differentiates submissions by the `subject` line each form sends ("Project Enquiry - ..." vs "Internship Enquiry - ..."). Until the key is set — or if the Web3Forms request fails for any reason — both forms automatically fall back to opening the visitor's email client with the enquiry pre-filled, addressed to `info@globaltechbyte.com`, so no enquiry is silently lost. That fallback logic lives in `src/lib/web3forms.ts` (`submitToWeb3Forms`) and `src/lib/mailto.ts` (`buildMailto`).
- **Careers page** (`src/data/jobs.ts`) ships with an empty job list by design — no fictional openings are included. Add real, published vacancies to that file to populate the page; the page shows an elegant empty state otherwise.
- **Work / solutions page** (`src/data/solutions.ts`) shows solution *concepts*, not real client case studies, since no verified client project data was available. Replace with real case studies when available.
- **Company statistics** (years of experience, client counts, etc.) were intentionally omitted from the highlights section since no verified figures were provided — only qualitative, defensible claims are shown.
- **Hero, product showcase, and solution card visuals** use licensed imagery supplied for the project (`public/images/`, `public/brand/`), not fabricated photos of specific staff.
- Canonical domain, Open Graph URLs, `robots.txt` and `sitemap.xml` assume `https://www.globaltechbyte.com` — update these if the production domain differs.
