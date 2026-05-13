'use client'
import './globals.css'
import { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── Role context ────────────────────────────────────────────────────────────

const ROLES = ['COO', 'CFO', 'Field Lead', 'Sponsor (read-only)']
const ROLE_COLORS: Record<string, string> = {
  'COO': '#1B2A4A',
  'CFO': '#2E4D7B',
  'Field Lead': '#1E6B44',
  'Sponsor (read-only)': '#5C3D8B',
}

// ── Nav items ───────────────────────────────────────────────────────────────
const NAV = [
  { href: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/alerts', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: true },
  { href: '/entry/100day', label: '100-Day entry', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/entry/ops', label: 'Ops KPI entry', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { href: '/trends', label: 'Trends', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { href: '/milestones', label: 'Milestones', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
]

function Sidebar({ role, setRole, alertCount }: { role: string; setRole: (r: string) => void; alertCount: number }) {
  const path = usePathname()
  const [showRoles, setShowRoles] = useState(false)
  const isReadOnly = role === 'Sponsor (read-only)'

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-mark">V</div>
        <div>
          <div className="logo-name">Vainbrook</div>
          <div className="logo-sub">Crane Platform KPIs</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Monitoring</div>
        {NAV.slice(0, 2).map(item => (
          <Link key={item.href} href={item.href}
            className={`nav-item ${path === item.href ? 'nav-item-active' : ''}`}>
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
            {item.badge && alertCount > 0 && (
              <span className="nav-badge">{alertCount}</span>
            )}
          </Link>
        ))}

        {!isReadOnly && (
          <>
            <div className="nav-section-label" style={{ marginTop: 16 }}>Data entry</div>
            {NAV.slice(2, 4).map(item => (
              <Link key={item.href} href={item.href}
                className={`nav-item ${path === item.href ? 'nav-item-active' : ''}`}>
                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            ))}
          </>
        )}

        <div className="nav-section-label" style={{ marginTop: 16 }}>Analysis</div>
        {NAV.slice(4).map(item => (
          <Link key={item.href} href={item.href}
            className={`nav-item ${path === item.href ? 'nav-item-active' : ''}`}>
            <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="role-btn" onClick={() => setShowRoles(!showRoles)}
          style={{ borderColor: ROLE_COLORS[role] }}>
          <span className="role-dot" style={{ background: ROLE_COLORS[role] }} />
          {role}
          <svg style={{ width: 12, marginLeft: 'auto', opacity: .5 }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
          </svg>
        </button>
        {showRoles && (
          <div className="role-dropdown">
            {ROLES.map(r => (
              <button key={r} className={`role-option ${r === role ? 'role-option-active' : ''}`}
                onClick={() => { setRole(r); setShowRoles(false) }}
                style={{ '--dot': ROLE_COLORS[r] } as any}>
                <span className="role-dot" style={{ background: ROLE_COLORS[r] }} />{r}
              </button>
            ))}
          </div>
        )}
        <div className="sidebar-data-note">Data shared across all team members</div>
      </div>
    </aside>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState('COO')
  const [alertCount, setAlertCount] = useState(0)
  const [day, setDay] = useState(1)

  useEffect(() => {
    fetch('/api/kpis').then(r => r.json()).then(data => {
      setDay(Math.min(data.day ?? 1, 100))
    }).catch(() => {})
  }, [])

  // Poll alert count every 30s
  useEffect(() => {
    const fetchAlerts = () => {
      fetch('/api/kpis').then(r => r.json()).then(data => {
        // Count reds — computed client-side from latest entries
        setAlertCount(data._alertCount ?? 0)
      }).catch(() => {})
    }
    fetchAlerts()
    const t = setInterval(fetchAlerts, 30000)
    return () => clearInterval(t)
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Vainbrook — Crane Platform KPI Dashboard</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <RoleContext.Provider value={{ role, setRole }}>
          <div className="app-shell">
            <Sidebar role={role} setRole={setRole} alertCount={alertCount} />
            <main className="app-main">
              <div className="topbar">
                <div className="day-progress">
                  <span className="day-label">Day {day} of 100</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${day}%` }} />
                  </div>
                </div>
                <div className="topbar-role" style={{ color: ROLE_COLORS[role] }}>
                  Viewing as: {role}
                </div>
              </div>
              <div className="page-body">
                {children}
              </div>
            </main>
          </div>
        </RoleContext.Provider>
      </body>
    </html>
  )
}
