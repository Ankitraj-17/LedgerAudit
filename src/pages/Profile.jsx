import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Activity, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Settings, 
  CheckCircle,
  Moon, 
  Sun,
  Award,
  CreditCard,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function Profile({ specialists, setSpecialists, theme, toggleTheme, currentPlan = 'Standard', billingInterval = 'monthly', currentUser, setCurrentUser }) {
  const navigate = useNavigate();
  // Find Sarah Jenkins (SPEC-1)
  const sarah = specialists?.find(s => s.id === 'SPEC-1') || {
    name: "Sarah Jenkins",
    specialty: "Legal & Compliance",
    status: "Available",
    assignedFiles: ["TXN-6619-F"]
  };

  // Local state for extended mock inputs
  const [email, setEmail] = useState("s.jenkins@ledgeraudit.internal");
  const [phone, setPhone] = useState("+1 (555) 389-9922");
  const [location, setLocation] = useState("London Compliance Hub, UK");
  const [bio, setBio] = useState("Lead compliance officer and forensic accountant specialising in international wire transfer auditing, regulatory reporting, and financial crime investigation. Certified Fraud Examiner (CFE) and Level IV AML compliance holder.");
  
  // Auth state form
  const [authName, setAuthName] = useState('');

  // Settings switches
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [autoReporting, setAutoReporting] = useState(false);
  const [deviationThreshold, setDeviationThreshold] = useState(250);

  const getInitials = (name) => {
    if (!name) return 'GU';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0] ? parts[0][0].toUpperCase() : 'GU';
  };

  const getStatusColor = (status) => {
    if (status === 'Available') return 'var(--color-success)';
    if (status === 'Busy') return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getStatusBg = (status) => {
    if (status === 'Available') return 'var(--color-success-bg)';
    if (status === 'Busy') return 'var(--color-warning-bg)';
    return 'var(--color-danger-bg)';
  };

  const getStatusBorder = (status) => {
    if (status === 'Available') return 'var(--color-success-border)';
    if (status === 'Busy') return 'var(--color-warning-border)';
    return 'var(--color-danger-border)';
  };

  const handleNameChange = (newName) => {
    if (setCurrentUser) {
      setCurrentUser(newName);
    }
    if (!specialists || !setSpecialists) return;
    setSpecialists(specialists.map(s => 
      s.id === 'SPEC-1' ? { ...s, name: newName } : s
    ));
  };

  const handleSpecialtyChange = (newSpecialty) => {
    if (!specialists || !setSpecialists) return;
    setSpecialists(specialists.map(s => 
      s.id === 'SPEC-1' ? { ...s, specialty: newSpecialty } : s
    ));
  };

  const handleStatusChange = (newStatus) => {
    if (!specialists || !setSpecialists) return;
    setSpecialists(specialists.map(s => 
      s.id === 'SPEC-1' ? { ...s, status: newStatus } : s
    ));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authName.trim().length > 0 && setCurrentUser) {
      setCurrentUser(authName.trim());
    }
  };

  const handleLogout = () => {
    if (setCurrentUser) {
      setCurrentUser(null);
    }
  };

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px', maxWidth: '600px', margin: '60px auto', width: '100%', boxSizing: 'border-box' }} className="fade-in-up">
        <div className="clay-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            border: '1px solid var(--border-color)'
          }}>
            <Lock size={28} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Auditor Authentication</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
            Please sign in or create an account to access the secure forensic suite profile and configuration.
          </p>
          
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name to sign up / log in"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                autoFocus
                style={{
                  padding: '12px 18px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>
            
            <button 
              type="submit"
              disabled={authName.trim().length === 0}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: authName.trim().length > 0 ? 'var(--accent-indigo)' : 'var(--bg-muted)',
                color: authName.trim().length > 0 ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                fontWeight: '700',
                fontSize: '14px',
                cursor: authName.trim().length > 0 ? 'pointer' : 'not-allowed',
                marginTop: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              Authenticate & Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }} className="fade-in-up">
      {/* Title Header */}
      <div className="page-header flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Settings
          </span>
          <h1 style={{ marginTop: '4px' }}>Lead Auditor Profile</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-danger)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700'
            }}
          >
            Sign Out
          </button>
          <button 
            onClick={toggleTheme}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '700'
            }}
          >
            {theme === 'light' ? <Moon size={14} style={{ color: 'var(--accent-indigo)' }} /> : <Sun size={14} style={{ color: 'var(--accent-amber)' }} />}
            Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      <div className="layout-split-ledger">
        {/* Left Column: Editable Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Core Details */}
          <div className="clay-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <User size={18} style={{ color: 'var(--accent-indigo)' }} />
              Auditor Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="grid-2-cols">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Auditor Name</label>
                  <input 
                    type="text" 
                    value={currentUser || ''} 
                    onChange={(e) => handleNameChange(e.target.value)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '13.5px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Specialty Scope</label>
                  <input 
                    type="text" 
                    value={sarah.specialty} 
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '13.5px'
                    }}
                  />
                </div>
              </div>

              <div className="grid-2-cols">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Secured Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '13.5px'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone / Comms</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      fontSize: '13.5px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Compliance Hub Node</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Biography / Credentials Summary</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  style={{
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-muted)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    fontFamily: 'var(--sans)',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Status & Settings */}
          <div className="clay-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
              <Settings size={18} style={{ color: 'var(--accent-purple)' }} />
              Preferences & Guardrails
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Working Status Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Working Status</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {['Available', 'Busy', 'On Leave'].map(status => {
                    const isActive = sarah.status === status;
                    return (
                      <button 
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          fontSize: '12px',
                          borderRadius: '8px',
                          backgroundColor: isActive ? getStatusColor(status) : 'transparent',
                          color: isActive ? '#ffffff' : 'var(--text-secondary)',
                          border: '1px solid',
                          borderColor: isActive ? getStatusColor(status) : 'var(--border-color)',
                          boxShadow: 'none',
                          cursor: 'pointer',
                          fontWeight: '700',
                          height: '38px',
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

              {/* MFA Switch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>Cryptographic MFA Authentication</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Require signature verification key on transaction approvals.</span>
                </div>
                <div 
                  onClick={() => setMfaEnabled(!mfaEnabled)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: mfaEnabled ? 'var(--text-primary)' : 'var(--sage-300)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card)',
                    position: 'absolute',
                    top: '2px',
                    left: mfaEnabled ? '22px' : '2px',
                    transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>
              </div>

              {/* Autopush Switch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>Automated SEC Compliance Dispatch</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Automatically transmit approved logs to regulatory server at midnight.</span>
                </div>
                <div 
                  onClick={() => setAutoReporting(!autoReporting)}
                  style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: autoReporting ? 'var(--text-primary)' : 'var(--sage-300)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-card)',
                    position: 'absolute',
                    top: '2px',
                    left: autoReporting ? '22px' : '2px',
                    transition: 'left 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>
              </div>

              {/* Threshold Slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div className="flex-between">
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-primary)' }}>Deviation Warning Limit</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-blue)', fontFamily: 'var(--mono)' }}>+{deviationThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="500" 
                  value={deviationThreshold} 
                  onChange={(e) => setDeviationThreshold(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: '6px',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    accentColor: 'var(--text-primary)'
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Flag transaction files deviating from category baseline volume by this percentage.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Holographic Clearance ID Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="clay-card" style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-app))',
            border: '1.5px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '36px 24px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Glossy overlay effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />

            {/* Micro badge status indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '10px',
              backgroundColor: getStatusBg(sarah.status),
              border: `1px solid ${getStatusBorder(sarah.status)}`,
              color: getStatusColor(sarah.status),
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '28px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getStatusColor(sarah.status) }} />
              {sarah.status}
            </div>

            {/* Dynamic initials avatar circle */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-brand)',
              color: 'var(--color-active-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '28px',
              border: '1px solid var(--border-color)',
              marginBottom: '20px',
              fontFamily: 'var(--mono)'
            }}>
              {getInitials(currentUser)}
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{currentUser}</h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              Lead Compliance Auditor
            </span>

            <div style={{
              width: '100%',
              borderTop: '1px dashed var(--border-color)',
              margin: '24px 0',
              paddingTop: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              textAlign: 'left'
            }}>
              <div className="flex-between" style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>CREDENTIAL_ID:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'var(--mono)' }}>AUD-8839-IN</span>
              </div>
              <div className="flex-between" style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>SPECIALTY:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{sarah.specialty}</span>
              </div>
              <div className="flex-between" style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>CLEARANCE_LEVEL:</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={12} />
                  Level IV (Special)
                </span>
              </div>
              <div className="flex-between" style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>PENDING_TASKS:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'var(--mono)' }}>{sarah.assignedFiles?.length || 0} Files</span>
              </div>
            </div>

            {/* Decal seal */}
            <div style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-muted)',
              border: '1px solid var(--border-color)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <Award size={14} style={{ color: 'var(--accent-amber)' }} />
              <span>SEC HASH VERIFIED CONSOLE SEALS ACTIVE</span>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="clay-card">
            <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>Session Audit Activity</h3>
            <div className="grid-2-cols" style={{ gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>14</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', textTransform: 'uppercase' }}>Logs Verified</span>
              </div>
              <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'var(--bg-muted)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>100%</span>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', marginTop: '2px', textTransform: 'uppercase' }}>Integrity Rate</span>
              </div>
            </div>
          </div>

          {/* Active Subscription Card */}
          <div className="clay-card" style={{
            background: currentPlan === 'Professional'
              ? 'linear-gradient(135deg, var(--accent-indigo-bg), var(--bg-card))'
              : currentPlan === 'Enterprise'
                ? 'linear-gradient(135deg, var(--accent-rose-bg), var(--bg-card))'
                : 'linear-gradient(135deg, var(--accent-blue-bg), var(--bg-card))',
            border: currentPlan === 'Professional'
              ? '1.5px solid var(--accent-indigo-border)'
              : currentPlan === 'Enterprise'
                ? '1.5px solid var(--accent-rose-border)'
                : '1.5px solid var(--accent-blue-border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
                <CreditCard size={16} style={{ 
                  color: currentPlan === 'Professional' ? 'var(--accent-indigo)' : currentPlan === 'Enterprise' ? 'var(--accent-rose)' : 'var(--accent-blue)' 
                }} />
                Active Subscription
              </h3>
              <button
                onClick={() => navigate('/pricing')}
                style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: 'var(--accent-indigo)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Manage Plan <ArrowRight size={11} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Plan badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Strategy Tier</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 12px',
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: currentPlan === 'Professional' ? 'var(--accent-indigo)' : currentPlan === 'Enterprise' ? 'var(--accent-rose)' : 'var(--accent-blue)',
                  backgroundColor: currentPlan === 'Professional' ? 'var(--accent-indigo-bg)' : currentPlan === 'Enterprise' ? 'var(--accent-rose-bg)' : 'var(--accent-blue-bg)',
                  border: `1px solid ${currentPlan === 'Professional' ? 'var(--accent-indigo-border)' : currentPlan === 'Enterprise' ? 'var(--accent-rose-border)' : 'var(--accent-blue-border)'}`
                }}>
                  {currentPlan}
                </span>
              </div>

              {/* Billing frequency */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Billing Cycle</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {billingInterval} {billingInterval === 'annual' ? '(-20%)' : ''}
                </span>
              </div>

              {/* Price row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Current Rate</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                  ${currentPlan === 'Standard' ? (billingInterval === 'annual' ? 79 : 99) : currentPlan === 'Professional' ? (billingInterval === 'annual' ? 239 : 299) : (billingInterval === 'annual' ? 719 : 899)}
                  <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)' }}>/{billingInterval === 'annual' ? 'mo (annual)' : 'mo'}</span>
                </span>
              </div>

              {/* Upgrade prompt */}
              {currentPlan !== 'Enterprise' && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
                  onClick={() => navigate('/pricing')}
                >
                  <Zap size={12} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                  <span>Upgrade to {currentPlan === 'Standard' ? 'Professional' : 'Enterprise'} for advanced forensic capacity</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
