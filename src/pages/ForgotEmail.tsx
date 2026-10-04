import { Link } from 'react-router-dom'
import '../assets/css/Accounts.css'

const LogoIcon = () => <img src="/ascentra.webp" alt="Ascentracore Solutions" />

const InfoCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{flexShrink:0}}>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
  </svg>
)

export default function ForgotEmail() {
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
          <h1 className="auth-title">Forgot your email?</h1>
          <p className="auth-subtitle">We can help you recover account access</p>
        </div>

        {/* Info box */}
        <div className="info-box">
          <InfoCircleIcon />
          <div>
            If you've forgotten the email address associated with your account, please contact our support team. We'll verify your identity and help you recover access.
          </div>
        </div>

        {/* Support options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
          <a
            href="mailto:support@ascentracoresolutions.com"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '.5rem',
              height: '46px',
              background: 'var(--clr-surface-2)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--r-md)',
              color: 'var(--clr-text)',
              textDecoration: 'none',
              fontSize: '.9rem',
              fontWeight: 500,
              transition: 'border-color 150ms, background 150ms',
            }}
          >
            📧 Email Support
          </a>
          <a
            href="https://www.ascentracoresolutions.com/privacy_policy/contact"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '.5rem',
              height: '46px',
              background: 'var(--clr-surface-2)',
              border: '1px solid var(--clr-border)',
              borderRadius: 'var(--r-md)',
              color: 'var(--clr-text)',
              textDecoration: 'none',
              fontSize: '.9rem',
              fontWeight: 500,
            }}
          >
            💬 Contact Us
          </a>
        </div>

        <p className="auth-redirect">
          Know your email? <Link to="/login">Back to Sign In</Link>
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