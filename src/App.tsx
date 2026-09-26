import { Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { CustomCursor } from './components/layout/CustomCursor'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { BackToTop } from './components/layout/BackToTop'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Work } from './pages/Work'
import { Careers } from './pages/Careers'
import { Internships } from './pages/Internships'
import { Contact } from './pages/Contact'
import { Legal } from './pages/Legal'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only rounded-full bg-[var(--color-orange)] px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<Legal title="Privacy Policy" />} />
          <Route path="/terms" element={<Legal title="Terms & Conditions" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default App
