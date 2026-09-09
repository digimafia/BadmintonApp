import LoginForm from '@/features/auth/components/LoginForm'
import cockImage from '@/assets/cock.png'

const LoginPage = () => (
  <main className="auth-page">
    <div className="auth-page__court auth-page__court--one" /><div className="auth-page__court auth-page__court--two" />
    <div className="auth-page__light auth-page__light--one" /><div className="auth-page__light auth-page__light--two" />
    <section className="auth-screen auth-screen--login">
      <div className="auth-topbar"><span className="auth-time">9:41</span><span className="auth-status" aria-hidden="true">▮▮▮ ◼ ▰</span></div>
      <button className="auth-help" type="button">Need Help?</button>
      <div className="auth-brand auth-brand--login"><span>SMASH</span> <b>POINT</b><i>➤</i></div>
      <div className="auth-tagline">PLAY <b>·</b> CONNECT <b>·</b> COMPETE</div>
      <img className="auth-login-art" src={cockImage} alt="Badminton shuttlecock" />
      <LoginForm />
    </section>
  </main>
)

export default LoginPage
