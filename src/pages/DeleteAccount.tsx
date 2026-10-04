import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import '../assets/css/Accounts.css'

const LogoIcon = () => <img src="/ascentra.webp" alt="Ascentracore Solutions" />
const EnvelopeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
  </svg>
)
const LockIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4M4.5 7A1.5 1.5 0 0 0 3 8.5v5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 7zM8 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3"/>
  </svg>
)
const EyeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
  </svg>
)
const EyeOffIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" style={{flexShrink:0, marginTop:'1px'}}>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
  </svg>
)
const WarnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{flexShrink:0}}>
    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
  </svg>
)

export default function DeleteAccount() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [conPassword, setConPassword] = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [showCon, setShowCon]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [confirm, setConfirm]     = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim())              { setError('Please enter your email address.'); return }
    if (!password)                  { setError('Please enter your password.'); return }
    if (password !== conPassword)   { setError('Passwords do not match.'); return }
    if (!confirm)                   { setError('Please check the confirmation checkbox.'); return }

    setLoading(true)
    try {
      // TODO: call delete-account API
      await new Promise(r => setTimeout(r, 1000))
      alert('Account deletion request submitted. You will receive a confirmation email.')
    } catch {
      setError('Could not delete account. Please try again or contact support.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-logo"><LogoIcon /></div>
            <span className="auth-brand-name">
              <span>Ascentra</span>core Solutions
            </span>
          </div>
          <h1 className="auth-title" style={{ color: '#f87171' }}>Delete Account</h1>
          <p className="auth-subtitle">This action is permanent and cannot be undone.</p>
        </div>

        {/* Warning */}
        <div className="warn-box">
          <WarnIcon />
          <div>
            Deleting your account will permanently remove all your data, projects, and settings.
            You will lose access to all Ascentracore services immediately.
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-alert auth-alert--error" role="alert">
            <AlertIcon /> {error}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <span className="input-icon"><EnvelopeIcon /></span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="your-email@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(p => !p)} aria-label="Toggle">
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="form-group">
            <label className="form-label" htmlFor="con_password">Confirm password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="con_password"
                type={showCon ? 'text' : 'password'}
                className={`form-input${conPassword && conPassword !== password ? ' input-error' : ''}`}
                placeholder="Re-enter your password"
                autoComplete="current-password"
                value={conPassword}
                onChange={e => setConPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowCon(p => !p)} aria-label="Toggle">
                {showCon ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {conPassword && conPassword !== password && (
              <span className="field-error">Passwords don't match</span>
            )}
          </div>

          {/* Confirmation checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '.6rem',
            cursor: 'pointer',
            fontSize: '.85rem',
            color: 'var(--clr-text-muted)',
            lineHeight: 1.55,
            marginTop: '.25rem',
          }}>
            <input
              type="checkbox"
              checked={confirm}
              onChange={e => setConfirm(e.target.checked)}
              style={{ marginTop: '3px', accentColor: '#ef4444', flexShrink: 0 }}
            />
            I understand this is permanent and I want to delete my account and all associated data.
          </label>

          {/* Submit */}
          <button
            className="btn-primary btn-danger"
            type="submit"
            disabled={loading || !confirm}
          >
            {loading && <span className="btn-spinner" />}
            {loading ? 'Deleting account…' : 'Delete My Account'}
          </button>
        </form>

        <p className="auth-redirect">
          Changed your mind? <Link to="/login">Back to Sign In</Link>
        </p>
      </div>

      <footer className="auth-page-footer">
        <a href="https://www.ascentracoresolutions.com/privacy_policy/">Privacy Policy</a>
        <span className="sep">·</span>
        <a href="https://www.ascentracoresolutions.com/privacy_policy/contact">Contact Support</a>
        <span className="sep">·</span>
        © 2026 Ascentracore Solutions
      </footer>
    </div>
  )
}