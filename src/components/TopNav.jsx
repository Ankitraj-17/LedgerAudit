import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Plus, 
  Search,
  ChevronDown,
  User,
  Check,
  Moon,
  Sun,
  Award,
  X
} from 'lucide-react';

export default function TopNav({ 
  transactions, 
  setSidebarOpen, 
  sidebarCollapsed, 
  setSidebarCollapsed,
  specialists,
  setSpecialists,
  theme,
  toggleTheme,
  currentUser,
  setCurrentUser
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [billingInterval, setBillingInterval] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');

  // We now use currentUser as the single source of truth for the profile name
  const sarah = specialists?.find(s => s.id === 'SPEC-1') || {
    name: "Sarah Jenkins",
    specialty: "Legal & Compliance",
    status: "Available",
    assignedFiles: ["TXN-6619-F"]
  };

  const getInitials = (name) => {
    if (!name) return 'GU'; // Guest
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : 'GU';
  };

  const updateAuditorStatus = (newStatus) => {
    if (!specialists || !setSpecialists) return;
    const updated = specialists.map(s => 
      s.id === 'SPEC-1' ? { ...s, status: newStatus } : s
    );
    setSpecialists(updated);
  };

  const updateAuditorName = (newName) => {
    // If we have currentUser state, update that too.
    if (setCurrentUser) {
      setCurrentUser(newName);
    }
    if (!specialists || !setSpecialists) return;
    const updated = specialists.map(s => 
      s.id === 'SPEC-1' ? { ...s, name: newName } : s
    );
    setSpecialists(updated);
  };

  const getStatusBorderColor = (status) => {
    if (status === 'Available') return '#10b981'; // Emerald Green
    if (status === 'Busy') return '#f59e0b'; // Amber
    return '#ef4444'; // Crimson Red
  };

  return (
    <header className="topnav" style={{
      width: '100%',
      padding: '20px 40px',
      backgroundColor: 'var(--bg-card)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      borderBottom: '1px solid var(--border-color)',
      height: '80px',
      boxSizing: 'border-box',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      {/* Left side: Hamburger, Logo Circle, App Titles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Hamburger Toggle Button */}
        <button 
          onClick={() => {
            if (window.innerWidth <= 1024) {
              setSidebarOpen(true);
            } else {
              setSidebarCollapsed(!sidebarCollapsed);
            }
          }}
          aria-label="Toggle Navigation Menu"
          aria-expanded={window.innerWidth <= 1024 ? false : !sidebarCollapsed}
          className="topnav-hamburger"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)'
          }}
          title="Toggle Navigation"
        >
          <Menu size={22} />
        </button>

        {/* Logo and Text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-brand)',
            color: 'var(--bg-app)',
            border: '1px solid var(--color-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '12px',
            fontFamily: 'var(--mono)',
            flexShrink: 0
          }}>
            LA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              LedgerAudit
            </span>
            <span className="hide-mobile" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', marginTop: '1px' }}>
              Forensic Console
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Circular Actions, Profile, Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Plus Button Circle */}
        <button 
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-xs)',
            padding: 0
          }}
          onClick={() => navigate('/assignor')}
          title="Assign New Task"
          aria-label="Assign New Task"
        >
          <Plus size={16} />
        </button>

        {/* Auditor Profile Card */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: showProfileDropdown ? 'var(--bg-muted)' : 'transparent',
            transition: 'background-color 0.2s ease'
          }} 
          onClick={() => {
            if (!currentUser) {
              navigate('/profile');
            } else {
              setShowProfileDropdown(!showProfileDropdown);
            }
          }}
          title={currentUser ? "Audit Profile Settings" : "Sign In"}
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: currentUser ? 'var(--color-brand)' : 'var(--bg-app)',
              color: currentUser ? 'var(--color-active-text)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '13px',
              border: '1px solid var(--border-color)',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--mono)'
            }}>
              {currentUser ? getInitials(currentUser) : <User size={16} />}
            </div>
            {/* Online/Status indicator dot */}
            {currentUser && (
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getStatusBorderColor(sarah.status),
                border: '1.5px solid var(--bg-card)'
              }} />
            )}
          </div>
          <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {currentUser ? currentUser : "Sign In"}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '1px' }}>
              {currentUser ? "Lead Auditor" : "Guest"}
            </span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '4px', transform: showProfileDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', opacity: currentUser ? 1 : 0 }} />
        </div>

        {/* Search pill container */}
        <div className="hide-mobile" style={{ position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'var(--bg-muted)',
            borderRadius: '10px',
            padding: '4px 16px 4px 6px',
            border: '1px solid var(--border-color)',
            height: '42px',
            width: '260px',
            boxSizing: 'border-box'
          }}>
            {/* Search Icon Circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}>
              <Search size={14} />
            </div>
            <input 
              type="text" 
              placeholder="Search code or description..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                paddingLeft: '10px',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                boxShadow: 'none',
                height: '100%'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchQuery && (
            <div className="clay-card fade-in" style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '320px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              padding: '8px 0',
              maxHeight: '300px',
              overflowY: 'auto',
              textAlign: 'left'
            }}>
              <div style={{ padding: '6px 16px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)' }}>
                Ledger Results
              </div>
              {transactions
                .filter(t => 
                  t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, 5)
                .map(txn => (
                  <div 
                    key={txn.id}
                    onClick={() => {
                      navigate(`/transactions?tab=lookup&code=${txn.id}`);
                      setSearchQuery('');
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-muted)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'background-color 0.2s ease',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', fontFamily: 'var(--mono)', color: 'var(--color-brand)' }}>
                        {txn.id}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {txn.description}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                        ${txn.amount.toLocaleString()}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '2px' }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: txn.status === 'Approved' ? 'var(--color-success)' : 'var(--color-danger)'
                        }} />
                        <span style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-muted)' }}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              {transactions.filter(t => 
                t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  No matching files found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auditor Profile settings popover dropdown */}
      {showProfileDropdown && (
        <div 
          className="clay-card fade-in"
          style={{
            position: 'absolute',
            top: '82px',
            right: '290px',
            width: '320px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-lg)',
            padding: '24px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'left'
          }}
        >
          {/* Avatar and editable name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-brand)',
              color: 'var(--color-active-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '15px',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--mono)'
            }}>
              {getInitials(currentUser)}
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="text" 
                value={currentUser || ''} 
                onChange={(e) => updateAuditorName(e.target.value)}
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  width: '100%',
                  outline: 'none',
                  backgroundColor: 'var(--bg-muted)'
                }}
                title="Edit name in database"
              />
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginTop: '4px', paddingLeft: '2px' }}>
                ID: AUD-8839-IN · LEAD AUDITOR
              </span>
            </div>
          </div>

          {/* Specialty edit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Specialty Scope:</label>
            <input 
              type="text" 
              value={sarah.specialty} 
              onChange={(e) => {
                if (!specialists || !setSpecialists) return;
                setSpecialists(specialists.map(s => s.id === 'SPEC-1' ? { ...s, specialty: e.target.value } : s));
              }}
              style={{
                fontSize: '12.5px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                width: '100%',
                outline: 'none',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-card)'
              }}
            />
          </div>

          {/* Working Status Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Working Status:</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Available', 'Busy', 'On Leave'].map(status => {
                const isActive = sarah.status === status;
                return (
                  <button 
                    key={status}
                    onClick={() => updateAuditorStatus(status)}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      fontSize: '10.5px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? getStatusBorderColor(status) : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: isActive ? getStatusBorderColor(status) : 'var(--border-color)',
                      boxShadow: 'none',
                      cursor: 'pointer',
                      fontWeight: '700',
                      height: '28px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Switcher & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-secondary)' }}>Theme Mode</span>
              <button 
                onClick={toggleTheme}
                style={{
                  padding: '6px 14px',
                  fontSize: '11.5px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'none',
                  backgroundColor: 'var(--bg-muted)',
                  color: 'var(--text-primary)',
                  fontWeight: '700'
                }}
              >
                {theme === 'light' ? <Moon size={13} style={{ color: 'var(--accent-indigo)' }} /> : <Sun size={13} style={{ color: 'var(--accent-amber)' }} />}
                <span style={{ textTransform: 'capitalize' }}>{theme}</span>
              </button>
            </div>

            <button 
              onClick={() => { navigate('/profile'); setShowProfileDropdown(false); }}
              style={{
                width: '100%',
                padding: '9px 0',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px'
              }}
            >
              <User size={13} style={{ color: 'var(--text-secondary)' }} />
              <span>Full Profile Settings</span>
            </button>

            <button 
              onClick={() => { navigate('/pricing'); setShowProfileDropdown(false); }}
              style={{
                width: '100%',
                padding: '9px 0',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-indigo)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
              }}
            >
              <Award size={13} style={{ color: '#ffffff' }} />
              <span style={{ color: '#ffffff' }}>Pricing Strategy & ROI</span>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Comparison Modal Overlay */}
      {showPricingModal && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(9, 9, 11, 0.55)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div className="clay-card fade-in-up" style={{
            maxWidth: '840px',
            width: '100%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '32px',
            padding: '40px',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)',
            boxSizing: 'border-box'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowPricingModal(false)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                boxShadow: 'none'
              }}
            >
              <X size={15} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ 
                color: 'var(--accent-indigo)', 
                backgroundColor: 'var(--accent-indigo-bg)', 
                border: '1px solid var(--accent-indigo-border)',
                fontSize: '11px', 
                fontWeight: '800', 
                padding: '4px 14px', 
                borderRadius: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Pricing & Strategy
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '12px', fontFamily: 'var(--heading)' }}>
                Forensic auditing, priced for trust.
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Select the baseline audit capacity tailored to your regulatory scope.
              </p>
            </div>

            {/* Monthly / Annual Toggle Switch */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span style={{ fontSize: '13px', fontWeight: billingInterval === 'monthly' ? '700' : '500', color: billingInterval === 'monthly' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setBillingInterval('monthly')}>Monthly</span>
              <div 
                onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly')}
                style={{
                  width: '48px',
                  height: '24px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-indigo)',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  position: 'absolute',
                  top: '2px',
                  left: billingInterval === 'monthly' ? '3px' : '25px',
                  transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: billingInterval === 'annual' ? '700' : '500', color: billingInterval === 'annual' ? 'var(--text-primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }} onClick={() => setBillingInterval('annual')}>
                Annually
                <span style={{ fontSize: '10px', color: 'var(--color-success)', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>Save 20%</span>
              </span>
            </div>

            {/* Pricing Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {/* Plan 1 */}
              <div style={{
                border: '1.5px solid var(--border-color)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '350px',
                backgroundColor: 'var(--bg-card)',
                boxSizing: 'border-box'
              }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Standard</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '12px', gap: '2px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {billingInterval === 'monthly' ? '$99' : '$79'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/month</span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', padding: 0, marginTop: '20px', listStyle: 'none', textAlign: 'left' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Up to 1,000 files/mo</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Standard hash validations</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Basic routing tracing</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Email support scope</li>
                  </ul>
                </div>
                <button style={{ width: '100%', marginTop: '24px', fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)', cursor: 'default', boxShadow: 'none', border: '1px solid var(--border-color)' }}>
                  Current Plan
                </button>
              </div>

              {/* Plan 2: Pro */}
              <div style={{
                border: '2px solid var(--accent-indigo)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '350px',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.08)',
                backgroundColor: 'var(--bg-card)',
                boxSizing: 'border-box'
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--accent-indigo)',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '2px 12px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap'
                }}>
                  Popular Strategy
                </span>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-indigo)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Professional</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '12px', gap: '2px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {billingInterval === 'monthly' ? '$299' : '$239'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/month</span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', padding: 0, marginTop: '20px', listStyle: 'none', textAlign: 'left' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><Check size={12} style={{ color: 'var(--accent-indigo)' }} /> Up to 25,000 files/mo</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><Check size={12} style={{ color: 'var(--accent-indigo)' }} /> Custom signature checks</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><Check size={12} style={{ color: 'var(--accent-indigo)' }} /> Wire transfer route tracing</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><Check size={12} style={{ color: 'var(--accent-indigo)' }} /> Priority dispatching queues</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}><Check size={12} style={{ color: 'var(--accent-indigo)' }} /> 24/7 response desk</li>
                  </ul>
                </div>
                <button 
                  onClick={() => { alert(`Scope upgraded to Professional! interval: ${billingInterval === 'monthly' ? 'Monthly ($299)' : 'Annual ($239/mo)'}. Expanded capacity active.`); setShowPricingModal(false); }}
                  style={{ width: '100%', marginTop: '24px', fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', backgroundColor: 'var(--accent-indigo)', color: '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)' }}
                >
                  Upgrade to Pro
                </button>
              </div>

              {/* Plan 3 */}
              <div style={{
                border: '1.5px solid var(--border-color)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '350px',
                backgroundColor: 'var(--bg-card)',
                boxSizing: 'border-box'
              }}>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enterprise</h4>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '12px', gap: '2px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {billingInterval === 'monthly' ? '$899' : '$719'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/month</span>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)', padding: 0, marginTop: '20px', listStyle: 'none', textAlign: 'left' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Unlimited volume sync</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Dedicated node replication</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Custom reporting modules</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={12} style={{ color: 'var(--color-success)' }} /> Full compliance SLA desk</li>
                  </ul>
                </div>
                <button 
                  onClick={() => { alert('Consultant desk notified. We will contact you at your auditor profile email.'); setShowPricingModal(false); }}
                  style={{ width: '100%', marginTop: '24px', fontSize: '12.5px', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', backgroundColor: 'var(--color-brand)', color: 'var(--bg-card)', border: 'none', cursor: 'pointer' }}
                >
                  Contact Sales
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              All plans include 14-day history audit back-testing. Custom deployment configurations available on request.
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
