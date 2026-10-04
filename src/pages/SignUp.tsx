import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { signInWithGoogle, resolveAppType } from '../services/firebase'
import '../assets/css/Accounts.css'

// ─── Icons ───────────────────────────────────────────────────────────────────
const LogoIcon = () => <img src="/ascentra.webp" alt="Ascentracore Solutions" />
const UserIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
  </svg>
)
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
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" style={{flexShrink:0, marginTop:'1px'}}>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
  </svg>
)
// ────────────────────────────────────────────────────────────────────────────

type StrengthLevel = 0 | 1 | 2 | 3 | 4

function getPasswordStrength(pwd: string): StrengthLevel {
  let score = 0
  if (pwd.length >= 8)  score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score as StrengthLevel
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#10b981', '#6d28d9']

export default function SignUp() {
  const [searchParams] = useSearchParams()
  const nextQuery = searchParams.get('next')
  const preservedNext = nextQuery
    ? `?${new URLSearchParams({ next: nextQuery }).toString()}`
    : ''
  const [fullName, setFullName]       = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [conPassword, setConPassword] = useState('')
  const [showPwd, setShowPwd]         = useState(false)
  const [showCon, setShowCon]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')

  const strength = getPasswordStrength(password)
  const strengthPct = (strength / 4) * 100

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const codeChallenge = searchParams.get('code_challenge')
  const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256'
  const state = searchParams.get('state') || ''

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName.trim())      { setError('Full name is required.'); return }
    if (!email.trim())         { setError('Email address is required.'); return }
    if (password.length < 6)   { setError('Password must be at least 6 characters.'); return }
    if (password !== conPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const nameParts = fullName.trim().split(/\s+/)
      const name = nameParts[0]
      const lastname = nameParts.slice(1).join(' ')

      const response = await fetch(`${apiBaseUrl}/api/accounts/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          lastname,
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json().catch(() => null) as {
        status?: boolean
        message?: string
        user?: { user_id?: string }
        access_token?: string
        errors?: Record<string, string[]>
      } | null

      if (!response.ok || !data?.status || !data.access_token) {
        const errorMsg = data?.errors
          ? Object.values(data.errors).flat().join(' ')
          : data?.message || 'Failed to create account.'
        throw new Error(errorMsg)
      }

      localStorage.setItem('user_id', data.user?.user_id || '')
      localStorage.setItem('skiltrix_access_token', data.access_token)

      // If this was an OAuth PKCE request from a client app, authorize and redirect
      if (clientId && redirectUri && codeChallenge) {
        const authRes = await fetch(`${apiBaseUrl}/api/accounts/oauth/authorize/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
          body: JSON.stringify({
            client_id: clientId,
            redirect_uri: redirectUri,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            state: state,
          }),
        })
        const authData = await authRes.json()
        if (authRes.ok && authData.redirect_url) {
          window.location.assign(authData.redirect_url)
          return
        } else {
          throw new Error(authData?.message || 'Failed to authorize connected application.')
        }
      }

      setSuccess('Account created successfully! Redirecting…')
      setTimeout(() => {
        window.location.assign('/settings')
      }, 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const appType = resolveAppType(searchParams.get('type'), clientId)
      const googleResult = await signInWithGoogle(appType)

      const googlePayload: Record<string, string> = {
        email: googleResult.email,
        name: googleResult.name,
        lastname: googleResult.lastname,
        profile: googleResult.photoURL,
        firebase_uid: googleResult.uid,
        id_token: googleResult.idToken,
      }
      if (clientId) googlePayload.client_id = clientId
      if (redirectUri) googlePayload.redirect_uri = redirectUri
      if (codeChallenge) googlePayload.code_challenge = codeChallenge
      if (codeChallengeMethod) googlePayload.code_challenge_method = codeChallengeMethod
      if (state) googlePayload.state = state

      const response = await fetch(`${apiBaseUrl}/api/accounts/google/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googlePayload),
      })

      const data = await response.json().catch(() => null) as {
        status?: boolean
        message?: string
        user?: { user_id?: string }
        access_token?: string
        redirect_url?: string
      } | null

      if (!response.ok || !data?.status || !data.access_token) {
        throw new Error(data?.message || 'Google sign-in failed. Please try again.')
      }

      localStorage.setItem('user_id', data.user?.user_id || '')
      localStorage.setItem('skiltrix_access_token', data.access_token)
      sessionStorage.removeItem('skiltrix_access_token')

      if (data.redirect_url) {
        window.location.assign(data.redirect_url)
        return
      }

      if (clientId && redirectUri && codeChallenge) {
        const authRes = await fetch(`${apiBaseUrl}/api/accounts/oauth/authorize/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
          body: JSON.stringify({
            client_id: clientId,
            redirect_uri: redirectUri,
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod,
            state: state,
          }),
        })
        const authData = await authRes.json()
        if (authRes.ok && authData.redirect_url) {
          window.location.assign(authData.redirect_url)
          return
        } else {
          throw new Error(authData?.message || 'Failed to authorize connected application.')
        }
      }

      setSuccess('Signed in with Google! Redirecting…')
      setTimeout(() => {
        window.location.assign('/settings')
      }, 600)
    } catch (cause) {
      const msg = cause instanceof Error ? cause.message : 'Google sign-up could not be completed.'
      if (!msg.includes('auth/popup-closed-by-user') && !msg.includes('auth/cancelled-popup-request')) {
        setError(msg)
      }
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
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Join Ascentracore Solutions today</p>
        </div>

        {/* Social login */}
        <div className="social-buttons">
          <button
            className="btn-social"
            type="button"
            aria-label="Sign up with Google"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <GoogleIcon /> Google
          </button>
          <button
            className="btn-social"
            type="button"
            aria-label="Sign up with GitHub"
            disabled={loading}
            onClick={() => {
              alert('GitHub sign-in is managed by your organization identity provider. Please use Google or your email credentials.')
            }}
          >
            <GitHubIcon /> GitHub
          </button>
        </div>

        <div className="auth-divider">or create with email</div>

        {/* Alerts */}
        {error && (
          <div className="auth-alert auth-alert--error" role="alert">
            <AlertIcon /> {error}
          </div>
        )}
        {success && (
          <div className="auth-alert auth-alert--success" role="alert">
            ✓ {success}
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Full name */}
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">Full name</label>
            <div className="input-wrapper">
              <span className="input-icon"><UserIcon /></span>
              <input
                id="full_name"
                type="text"
                className="form-input"
                placeholder="Your full name"
                autoComplete="name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <span className="input-icon"><EnvelopeIcon /></span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password + strength */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"><LockIcon /></span>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPwd(p => !p)} aria-label="Toggle password">
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {password && (
              <>
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{ width: `${strengthPct}%`, background: STRENGTH_COLORS[strength] }}
                  />
                </div>
                <span className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                  {STRENGTH_LABELS[strength]}
                </span>
              </>
            )}
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
                autoComplete="new-password"
                value={conPassword}
                onChange={e => setConPassword(e.target.value)}
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowCon(p => !p)} aria-label="Toggle confirm password">
                {showCon ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {conPassword && conPassword !== password && (
              <span className="field-error">Passwords don't match</span>
            )}
          </div>

          {/* Submit */}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to={`/login${preservedNext}`}>Sign in</Link>
        </p>
      </div>

      <footer className="auth-page-footer">
        <a href="https://www.ascentracoresolutions.com/privacy_policy/">Privacy Policy</a>
        <span className="sep">·</span>
        <a href="https://www.ascentracoresolutions.com/privacy_policy/">Terms of Service</a>
        <span className="sep">·</span>
        © 2026 Ascentracore Solutions
      </footer>
    </div>
  )
}