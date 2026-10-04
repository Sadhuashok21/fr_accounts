import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import '../assets/css/Accounts.css'

const LogoIcon = () => <img src="/ascentra.webp" alt="Ascentracore Solutions" />
const EnvelopeIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" style={{flexShrink:0, marginTop:'1px'}}>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
  </svg>
)
const MailSentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'#6d28d9', margin:'0 auto 1rem'}}>
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    <path d="M16 19l2 2 4-4"/>
  </svg>
)

export default function ForgotPassword() {
  const [searchParams] = useSearchParams()
  const nextQuery = searchParams.get('next')
  const preservedNext = nextQuery
    ? `?${new URLSearchParams({ next: nextQuery }).toString()}`
    : ''
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Please enter your email address.'); return }

    setLoading(true)
    try {
      // TODO: call password-reset API
      await new Promise(r => setTimeout(r, 800))
      setSent(true)
    } catch {
      setError('Could not send reset link. Please try again.')
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

          {sent ? (
            <>
              <MailSentIcon />
              <h1 className="auth-title">Check your inbox</h1>
              <p className="auth-subtitle">
                We sent a password reset link to <strong>{email}</strong>.<br />
                Please check your spam folder if it doesn't arrive.
              </p>
            </>
          ) : (
            <>
              <h1 className="auth-title">Forgot password?</h1>
              <p className="auth-subtitle">
                Enter your email and we'll send you a reset link.
              </p>
            </>
          )}
        </div>

        {!sent && (
          <>
            {error && (
              <div className="auth-alert auth-alert--error" role="alert">
                <AlertIcon /> {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <div className="input-wrapper">
                  <span className="input-icon"><EnvelopeIcon /></span>
                  <input
                    id="email"
                    type="email"
                    className={`form-input${error ? ' input-error' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    required
                  />
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? 'Sending link…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        {sent && (
          <button
            className="btn-primary"
            style={{ marginTop: '1.25rem' }}
            onClick={() => { setSent(false); setEmail('') }}
          >
            Send another link
          </button>
        )}

        <p className="auth-redirect">
          Remembered it? <Link to={`/login${preservedNext}`}>Back to Sign In</Link>
        </p>
      </div>

      <footer className="auth-page-footer">
        <a href="https://www.ascentracoresolutions.com/privacy_policy/">Privacy Policy</a>
        <span className="sep">·</span>
        © 2026 Ascentracore Solutions
      </footer>
    </div>
  )
}