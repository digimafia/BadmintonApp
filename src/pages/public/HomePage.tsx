import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import shuttlecockImage from '@/assets/shuttlecock.png'

const features = [
  {
    icon: 'trophy',
    title: 'Discover Tournaments',
    detail: 'Local to national events',
  },
  {
    icon: 'users',
    title: 'Find Players',
    detail: 'Singles, Doubles, Mixed',
  },
  {
    icon: 'community',
    title: 'Join a Community',
    detail: 'Play. Improve. Belong.',
  },
]

const FeatureIcon = ({ type }: { type: string }) => {
  if (type === 'trophy') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
        <path d="M8 6H5v2a3 3 0 0 0 3 3M16 6h3v2a3 3 0 0 1-3 3M12 12v4M8 20h8M9 16h6" />
      </svg>
    )
  }

  if (type === 'users') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M16 14a5 5 0 0 1 4.5 5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M14 19a4.5 4.5 0 0 1 6.5 0" />
    </svg>
  )
}

const HomePage = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleGoToDashboard = () => {
    if (!user) {
      navigate('/login')
      return
    }
    switch (user.role) {
      case 'PLAYER':
        navigate('/player/dashboard')
        break
      case 'ORGANIZER':
        navigate('/organizer/dashboard')
        break
      case 'ADMIN':
        navigate('/admin/dashboard')
        break
    }
  }

  return (
    <main className="home-page">
      <img className="home-page__shuttlecock-image" src={shuttlecockImage} alt="Badminton shuttlecock on a court" />
      <div className="home-page__glow home-page__glow--left" />
      <div className="home-page__glow home-page__glow--right" />
      <div className="home-page__court-line home-page__court-line--near" />
      <div className="home-page__court-line home-page__court-line--far" />

      <section className="home-page__content" aria-labelledby="home-title">
        <button className="home-page__skip" onClick={handleGoToDashboard}>
          Skip
        </button>

        <header className="home-page__brand">
          <div className="home-page__logo">SMASH<span>POINT</span></div>
          <div className="home-page__tagline">PLAY <b>·</b> CONNECT <b>·</b> COMPETE</div>
        </header>

        <div className="home-page__hero-copy">
          <p className="home-page__eyebrow">THE COMMUNITY FOR EVERY GAME</p>
          <h1 id="home-title">More<br /><em>Badminton</em><br /><strong>Together</strong></h1>
          <p className="home-page__description">
            Find tournaments, meet players<br className="home-page__desktop-break" /> and be part of a bigger badminton community.
          </p>
        </div>

        <div className="home-page__features">
          {features.map((feature) => (
            <div className="home-page__feature" key={feature.title}>
              <span className="home-page__feature-icon"><FeatureIcon type={feature.icon} /></span>
              <span>
                <strong>{feature.title}</strong>
                <small>{feature.detail}</small>
              </span>
            </div>
          ))}
        </div>

        <div className="home-page__pagination" aria-label="Onboarding slide 1 of 4">
          <span className="is-active" /><span /><span /><span />
        </div>

        <button
          onClick={handleGoToDashboard}
          className="home-page__cta"
        >
          <span>{user ? 'Go to Dashboard' : 'Get Started'}</span>
          <b aria-hidden="true">→</b>
        </button>

        <p className="home-page__signin">
          Already have an account? <button onClick={() => navigate('/login')}>Sign in</button>
        </p>
      </section>
    </main>
  )
}

export default HomePage
