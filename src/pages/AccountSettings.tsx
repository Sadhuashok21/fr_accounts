import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/Accounts.css'

interface UserData {
  user_id: string
  email: string
  name: string
  lastname: string
  username: string
  profile: string
  phone_number: string
  bio: string
  status: string
  created_at: string
}

interface ApplicationData {
  client_id: string
  name: string
  description: string
  logo_url: string
}

interface SessionData {
  session_id: string
  client_name: string
  ip_address: string
  user_agent: string
  created_at: string
  last_active_at: string
  is_current: boolean
}

export default function AccountSettings() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserData | null>(null)
  const [apps, setApps] = useState<ApplicationData[]>([])
  const [sessions, setSessions] = useState<SessionData[]>([])
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'apps' | 'sessions'>('profile')

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Edit profile state
  const [name, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changingPwd, setChangingPwd] = useState(false)

  const token = localStorage.getItem('skiltrix_access_token') || localStorage.getItem('access_token')
  const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch user info
        const meRes = await fetch(`${apiBase}/api/accounts/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!meRes.ok) {
          localStorage.removeItem('skiltrix_access_token')
          navigate('/login')
          return
        }
        const meData = await meRes.json()
        setUser(meData.user)
        setName(meData.user.name || '')
        setLastname(meData.user.lastname || '')
        setPhone(meData.user.phone_number || '')
        setBio(meData.user.bio || '')

        // Fetch applications
        const appsRes = await fetch(`${apiBase}/api/accounts/applications/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (appsRes.ok) {
          const appsData = await appsRes.json()
          setApps(appsData.applications || [])
        }

        // Fetch active sessions
        const sessRes = await fetch(`${apiBase}/api/accounts/sessions/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (sessRes.ok) {
          const sessData = await sessRes.json()
          setSessions(sessData.sessions || [])
        }
      } catch (err) {
        setError('Failed to load account information.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [token, navigate, apiBase])

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${apiBase}/api/accounts/me/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, lastname, phone_number: phone, bio }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update profile.')
      setUser(data.user)
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault()
    setChangingPwd(true)
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${apiBase}/api/accounts/password/change/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Password change failed.')
      setMessage('Password changed successfully.')
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error changing password.')
    } finally {
      setChangingPwd(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${apiBase}/api/accounts/sessions/${sessionId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.session_id !== sessionId))
        setMessage('Session revoked.')
      }
    } catch {
      setError('Failed to revoke session.')
    }
  }

  const handleGlobalLogout = async () => {
    try {
      await fetch(`${apiBase}/api/accounts/logout-all/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {}
    localStorage.removeItem('skiltrix_access_token')
    localStorage.removeItem('user_id')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div style={{ textAlign: 'center', color: 'var(--clr-text-muted)' }}>
          <div className="btn-spinner" style={{ margin: '2rem auto' }} />
          Loading your account details…
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '780px', width: '100%', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--clr-border)', paddingBottom: '1rem' }}>
          <div>
            <h1 className="auth-title" style={{ textAlign: 'left', marginBottom: '0.25rem' }}>Ascentracore Account</h1>
            <p className="auth-subtitle" style={{ textAlign: 'left' }}>{user?.email} • Single Sign-On Identity</p>
          </div>
          <button
            type="button"
            onClick={handleGlobalLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--clr-error)',
              color: 'var(--clr-error)',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--r-sm)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Sign Out All Devices
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>
          {(['profile', 'security', 'apps', 'sessions'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setMessage(''); setError('') }}
              style={{
                background: activeTab === tab ? 'var(--clr-brand)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--clr-text-muted)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--r-sm)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'apps' ? 'Connected Apps' : tab}
            </button>
          ))}
        </div>

        {/* Status Messages */}
        {message && <div className="auth-alert auth-alert--success" style={{ marginBottom: '1rem' }}>{message}</div>}
        {error && <div className="auth-alert auth-alert--error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="auth-field">
                <label className="auth-label">First Name</label>
                <input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="auth-field">
                <label className="auth-label">Last Name</label>
                <input className="auth-input" value={lastname} onChange={(e) => setLastname(e.target.value)} />
              </div>
            </div>

            <div className="auth-field" style={{ marginBottom: '1rem' }}>
              <label className="auth-label">Email Address (Identity Anchor)</label>
              <input className="auth-input" value={user?.email || ''} disabled style={{ opacity: 0.65, cursor: 'not-allowed' }} />
            </div>

            <div className="auth-field" style={{ marginBottom: '1rem' }}>
              <label className="auth-label">Phone Number</label>
              <input className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
            </div>

            <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">Bio / Profile Notes</label>
              <textarea
                className="auth-input"
                style={{ height: '80px', resize: 'vertical' }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Developer, creator, learner..."
              />
            </div>

            <button type="submit" className="auth-btn auth-btn--primary" disabled={savingProfile}>
              {savingProfile ? 'Saving Changes…' : 'Save Profile Changes'}
            </button>
          </form>
        )}

        {/* Tab 2: Security */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword}>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Changing your password will immediately secure your central identity and invalidate other active sessions.
            </p>

            <div className="auth-field" style={{ marginBottom: '1rem' }}>
              <label className="auth-label">Current Password</label>
              <input
                type="password"
                className="auth-input"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field" style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">New Password (minimum 6 characters)</label>
              <input
                type="password"
                className="auth-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="auth-btn auth-btn--primary" disabled={changingPwd}>
              {changingPwd ? 'Updating Password…' : 'Update Password'}
            </button>
          </form>
        )}

        {/* Tab 3: Connected Applications */}
        {activeTab === 'apps' && (
          <div>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              These authorized applications are configured to accept your Ascentracore Single Sign-On credentials:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {apps.map((a) => (
                <div
                  key={a.client_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--clr-surface-2)',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--clr-border)',
                  }}
                >
                  <div>
                    <h3 style={{ color: 'var(--clr-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>{a.name}</h3>
                    <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.85rem' }}>{a.description}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clr-accent)', fontFamily: 'monospace' }}>Client ID: {a.client_id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ background: 'rgba(52, 211, 153, 0.15)', color: 'var(--clr-success)', padding: '0.25rem 0.6rem', borderRadius: 'var(--r-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                      Authorized
                    </span>
                    {a.client_id !== 'accounts' && (
                      <a
                        href={
                          a.client_id === 'skiltrix' ? 'http://localhost:5173' :
                          a.client_id === 'admin' ? 'http://localhost:5175' :
                          a.client_id === 'main' ? 'http://localhost:5176' :
                          a.client_id === 'policies' ? 'http://localhost:5177' :
                          '#'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'var(--clr-brand)',
                          color: '#fff',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--r-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        Launch App ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Active Sessions */}
        {activeTab === 'sessions' && (
          <div>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Active sessions across all five frontend applications and central accounts:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sessions.map((s) => (
                <div
                  key={s.session_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--clr-surface-2)',
                    borderRadius: 'var(--r-md)',
                    border: s.is_current ? '1px solid var(--clr-brand)' : '1px solid var(--clr-border)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--clr-text)', fontSize: '0.95rem' }}>{s.client_name}</strong>
                      {s.is_current && (
                        <span style={{ background: 'var(--clr-brand-glow)', color: 'var(--clr-brand-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--r-sm)', fontSize: '0.7rem', fontWeight: 600 }}>
                          Current Device
                        </span>
                      )}
                    </div>
                    <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      IP: {s.ip_address || 'Localhost'} • Started: {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!s.is_current && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s.session_id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--clr-error)',
                        color: 'var(--clr-error)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--r-sm)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
