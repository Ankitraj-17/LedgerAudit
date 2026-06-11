import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  AlertTriangle, 
  BarChart3, 
  Network, 
  Users, 
  Plus, 
  Share2,
  User,
  Award,
  X
} from 'lucide-react';

export default function Sidebar({ transactions, sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const flaggedCount = transactions ? transactions.filter(t => t.status === 'Flagged').length : 0;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Ledger Log', path: '/transactions', icon: History },
    { id: 'flagged', label: 'Flagged Queue', path: '/flagged', icon: AlertTriangle, badgeCount: flaggedCount },
    { id: 'risks', label: 'Risk Sorter', path: '/risks', icon: BarChart3 },
    { id: 'movement', label: 'Network Map', path: '/movement', icon: Network },
    { id: 'assignor', label: 'Task Assignor', path: '/assignor', icon: Users },
    { id: 'profile', label: 'Auditor Profile', path: '/profile', icon: User },
    { id: 'pricing', label: 'Pricing Strategy', path: '/pricing', icon: Award },
  ];

  const tabGradients = {
    dashboard: 'var(--color-brand)',
    transactions: 'var(--color-brand)',
    flagged: 'var(--color-brand)',
    risks: 'var(--color-brand)',
    movement: 'var(--color-brand)',
    assignor: 'var(--color-brand)',
    profile: 'var(--color-brand)',
    pricing: 'var(--color-brand)'
  };

  const tabShadows = {
    dashboard: 'var(--shadow-sm)',
    transactions: 'var(--shadow-sm)',
    flagged: 'var(--shadow-sm)',
    risks: 'var(--shadow-sm)',
    movement: 'var(--shadow-sm)',
    assignor: 'var(--shadow-sm)',
    profile: 'var(--shadow-sm)',
    pricing: 'var(--shadow-sm)'
  };

  if (sidebarCollapsed) {
    return (
      <aside 
        className={`sidebar select-none ${sidebarOpen ? 'open' : ''}`}
        aria-label="Main Navigation"
        style={{
          width: '64px',
          padding: '20px 12px',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Top: Expand button (Branded logo) */}
        <button 
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-brand)',
            border: '1px solid var(--color-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--bg-app)',
            fontWeight: '800',
            fontSize: '12px',
            fontFamily: 'var(--mono)',
            padding: 0,
            flexShrink: 0
          }}
          onClick={() => setSidebarCollapsed(false)}
          title="Expand Sidebar"
        >
          LA
        </button>

        {/* Icon-only Navigation */}
        <nav style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'center',
          flex: 1,
          width: '100%',
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path && !location.search;

            return (
              <Link
                key={item.id}
                to={item.path}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? tabGradients[item.id] : 'transparent',
                  color: isActive ? 'var(--color-active-text)' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  textDecoration: 'none'
                }}
                title={item.label}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--color-active-text)' : '#9ca3af' }} />
                {item.badgeCount > 0 && !isActive && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--color-brand)',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom share icon */}
        <Link
          to="/movement"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#6b7280',
            textDecoration: 'none'
          }}
          title="Money Movement Map"
        >
          <Share2 size={14} />
        </Link>
      </aside>
    );
  }

  // Expanded Sidebar (standard)
  return (
    <aside 
      className={`sidebar select-none ${sidebarOpen ? 'open' : ''}`}
      aria-label="Main Navigation"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        {/* Top: Branding logo and brand name */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
          padding: '8px 4px',
        }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: 'var(--color-brand)',
          border: '1px solid var(--color-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '12px',
          fontFamily: 'var(--mono)',
          color: 'var(--bg-app)',
          flexShrink: 0
        }}>
          LA
        </div>
        <div>
          <h2 style={{
            fontSize: '16px',
            fontFamily: 'var(--heading)',
            fontWeight: '800',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            LedgerAudit
          </h2>
          <span style={{
            fontSize: '9px',
            color: 'var(--text-muted)',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Forensic Suite
          </span>
        </div>
      </Link>

      {/* Mobile Close Button */}
      {window.innerWidth <= 1024 && (
        <button 
          onClick={() => setSidebarOpen(false)}
          aria-label="Close Navigation Menu"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8c8c8a'
          }}
        >
          <X size={20} />
        </button>
      )}
      </div>

      {/* Navigation list */}
      <nav style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        flex: 1
      }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path && !location.search;

          return (
            <Link
              key={item.id}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                background: isActive ? tabGradients[item.id] : 'transparent',
                boxShadow: isActive ? tabShadows[item.id] : 'none',
                color: isActive ? 'var(--color-active-text)' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              className={!isActive ? 'hover:bg-gray-100/70 hover:text-gray-900' : ''}
            >
              <Icon 
                size={18} 
                style={{ 
                  color: isActive ? 'var(--color-active-text)' : '#9ca3af',
                  transition: 'color 0.2s ease',
                  flexShrink: 0
                }} 
              />
              <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
              
              {item.badgeCount > 0 && (
                <span style={{
                  backgroundColor: isActive ? 'var(--color-active-text)' : 'var(--color-brand-light)',
                  color: isActive ? 'var(--color-brand)' : 'var(--color-brand)',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  lineHeight: '1.2'
                }}>
                  {item.badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button inside wide sidebar */}
      <button 
        onClick={() => setSidebarCollapsed(true)}
        style={{
          width: '100%',
          fontSize: '12px',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid var(--border-color)',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          color: 'var(--text-secondary)'
        }}
      >
        Collapse Sidebar
      </button>

      {/* Footer widget */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-muted)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)'
          }} />
          <span style={{
            fontSize: '10px',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            COMPILER ACTIVE
          </span>
        </div>
        <p style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: '1.3'
        }}>
          Safe ledger tracking.
        </p>
      </div>
    </aside>
  );
}
