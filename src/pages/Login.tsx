import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { signInWithGoogle, resolveAppType } from '../services/firebase'
import Continuewith from '../components/Continuewith'
import '../assets/css/Accounts.css'

// ─── SVG icons ──────────────────────────────────────────────────────────────
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
// ────────────────────────────────────────────────────────────────────────────

function getSafeNextUrl(next: string | null): string | null {
  if (!next || next.startsWith('//') || next.includes('\\')) {
    return null
  }

  try {
    const destination = new URL(next, window.location.origin)
    const configuredOrigins = (import.meta.env.VITE_AUTH_REDIRECT_ORIGINS || '')
      .split(',')
      .map((origin: string) => origin.trim())
      .filter(Boolean)
    const isLocalhostRedirect =
      ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
      destination.hostname === window.location.hostname &&
      destination.protocol === window.location.protocol
    const isAllowedOrigin =
      destination.origin === window.location.origin ||
      isLocalhostRedirect ||
      configuredOrigins.includes(destination.origin)

    if (
      !isAllowedOrigin ||
      !['http:', 'https:'].includes(destination.protocol) ||
      destination.username ||
      destination.password
    ) {
      return null
    }

    return destination.href
  } catch {
    return null
  }
}

export default function Login() {
  const [searchParams] = useSearchParams()
  const nextUrl = getSafeNextUrl(searchParams.get('next') || searchParams.get('returnTo'))
  const nextQuery = searchParams.get('next') || searchParams.get('returnTo')
  const preservedNext = nextQuery
    ? `?${new URLSearchParams({ next: nextQuery }).toString()}`
    : ''
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const clientId = searchParams.get('client_id')
  const redirectUri = searchParams.get('redirect_uri')
  const codeChallenge = searchParams.get('code_challenge')
  const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256'
  const state = searchParams.get('state') || ''
  const prompt = searchParams.get('prompt')

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

  // Function to authorize client app and redirect via OIDC PKCE
  const authorizeClientApp = async (token: string) => {
    if (!clientId || !redirectUri || !codeChallenge) return false
    try {
      const res = await fetch(`${apiBaseUrl}/api/accounts/oauth/authorize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_id: clientId,
          redirect_uri: redirectUri,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          state: state,
        }),
      })
      const data = await res.json()
      if (res.ok && data.redirect_url) {
        window.location.assign(data.redirect_url)
        return true
      } else if (data.message) {
        setError(data.message)
      }
    } catch {
      setError('SSO authorization error. Please check redirect configuration.')
    }
    return false
  }

  // Silent SSO Check: If user is already authenticated and prompt != 'login', auto-authorize
  useEffect(() => {
    const existingToken = localStorage.getItem('skiltrix_access_token') || localStorage.getItem('access_token')
    if (existingToken && clientId && redirectUri && codeChallenge && prompt !== 'login') {
      setLoading(true)
      setStatusMessage('Authorizing Single Sign-On session…')
      authorizeClientApp(existingToken).finally(() => setLoading(false))
    }
  }, [clientId, redirectUri, codeChallenge, prompt])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setStatusMessage('')

    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password)     { setError('Please enter your password.'); return }

    setLoading(true)
    try {
      const loginPayload: Record<string, string> = {
        email: email.trim(),
        password,
      }
      if (clientId) {
        loginPayload.client_id = clientId
      }

      const response = await fetch(`${apiBaseUrl}/api/accounts/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      })
      const result = await response.json().catch(() => null) as {
        status?: boolean
        message?: string
        errors?: Record<string, string[] | string>
        user?: { user_id?: string }
        access_token?: string
      } | null

      if (!response.ok || !result?.status || !result.access_token) {
        const validationMessage = result?.errors
          ? Object.entries(result.errors)
              .flatMap(([field, messages]) => (Array.isArray(messages) ? messages : [messages]).map((message) => `${field}: ${message}`))
              .join(' ')
          : ''
        throw new Error(validationMessage || result?.message || 'Sign in failed. Please check your details and try again.')
      }

      localStorage.setItem('user_id', result.user?.user_id || '')
      localStorage.setItem('skiltrix_access_token', result.access_token)
      sessionStorage.removeItem('skiltrix_access_token')

      // If this was an OAuth PKCE request from a client app, authorize and redirect
      if (clientId && redirectUri && codeChallenge) {
        setStatusMessage('Signing into connected application…')
        const redirected = await authorizeClientApp(result.access_token)
        if (redirected) return
        return
      }

      if (nextUrl) {
        window.location.assign(nextUrl)
      } else {
        window.location.assign('/settings')
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setStatusMessage('')
    setLoading(true)
    try {
      const appType = resolveAppType(searchParams.get('type'), clientId)
      const googleResult = await signInWithGoogle(appType)
      setStatusMessage('Authenticating with Google…')

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
        setStatusMessage('Signing into connected application…')
        window.location.assign(data.redirect_url)
        return
      }

      if (clientId && redirectUri && codeChallenge) {
        setStatusMessage('Authorizing connected application…')
        const redirected = await authorizeClientApp(data.access_token)
        if (redirected) return
        return
      }

      if (nextUrl) {
        window.location.assign(nextUrl)
      } else {
        window.location.assign('/settings')
      }
    } catch (cause) {
      const msg = cause instanceof Error ? cause.message : 'Google sign-in could not be completed.'
      if (!msg.includes('auth/popup-closed-by-user') && !msg.includes('auth/cancelled-popup-request')) {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page--login">
      <div className="auth-card auth-card--login">

        {/* Brand */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-logo"><LogoIcon /></div>
            <span className="auth-brand-name">
              <span>Ascentra</span>core Solutions
            </span>
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="auth-alert auth-alert--error" role="alert">
            <AlertIcon /> {error}
          </div>
        )}
        {statusMessage && <p className="auth-subtitle" role="status">{statusMessage}</p>}

        {/* Social Login */}
        <Continuewith
          label="Or continue with"
          onGoogleClick={handleGoogleSignIn}
          disabled={loading}
        />

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address or username</label>
            <div className="input-wrapper">
              <span className="input-icon"><EnvelopeIcon /></span>
              <input
                id="email"
                type="text"
                className={`form-input${error ? ' input-error' : ''}`}
                placeholder="you@example.com or username"
                autoComplete="username"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
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
                className={`form-input${error ? ' input-error' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPwd(p => !p)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="form-footer-row">
            <Link to={`/forgot-password${preservedNext}`} className="auth-link">Forgot password?</Link>
          </div>

          {/* Submit */}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Redirect to signup */}
        <p className="auth-redirect">
          Don't have an account? <Link to={`/signup${preservedNext}`}>Create one</Link>
        </p>
      </div>

      {/* Legal footer */}
      <footer className="auth-page-footer">
        <a href="https://www.ascentracoresolutions.com/privacy_policy/">Privacy Policy</a>
        <span className="sep">·</span>
        <a href="https://www.ascentracoresolutions.com/privacy_policy/">Terms of Service</a>
        <span className="sep">·</span>
        <a href="https://www.ascentracoresolutions.com/privacy_policy/contact">Contact</a>
        <span className="sep">·</span>
        © 2026 Ascentracore Solutions
      </footer>
    </div>
  )
}
