import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  FileText,
  BarChart2,
  Lock,
  Globe,
  Award,
  ChevronDown,
  Users,
  AlertTriangle,
  DollarSign,
  BookOpen
} from 'lucide-react';
import PricingModal from '../components/PricingModal';

export default function Landing({ currentPlan = 'Standard', setCurrentPlan, billingInterval, setBillingInterval }) {
  const navigate = useNavigate();
  const [localBillingInterval, setLocalBillingInterval] = useState(billingInterval || 'monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleBillingIntervalChange = (interval) => {
    setLocalBillingInterval(interval);
    if (setBillingInterval) setBillingInterval(interval);
  };

  const handleOpenModal = (plan) => {
    setModalPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmPlan = (planName, interval) => {
    if (setCurrentPlan) setCurrentPlan(planName);
    if (setBillingInterval) setBillingInterval(interval);
    navigate('/dashboard');
  };

  useEffect(() => {
    document.body.classList.add('landing-body');
    return () => document.body.classList.remove('landing-body');
  }, []);

  // Smooth scroll helper — fixes HashRouter breaking #anchor links
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const features = [
    {
      icon: <FileText size={22} />,
      color: 'var(--accent-blue)',
      bg: 'var(--accent-blue-bg)',
      title: 'Regulatory Audit Trails',
      desc: 'Maintain complete, tamper-proof audit trails for every financial transaction. Automated documentation ready for SOX, IFRS, and GAAP compliance reviews.'
    },
    {
      icon: <AlertTriangle size={22} />,
      color: 'var(--accent-rose)',
      bg: 'var(--accent-rose-bg)',
      title: 'Fraud & Anomaly Detection',
      desc: 'Instantly flag irregular payment patterns, duplicate entries, unauthorized approvals, and offshore wire deviations before they escalate to regulatory risk.'
    },
    {
      icon: <BarChart2 size={22} />,
      color: 'var(--accent-indigo)',
      bg: 'var(--accent-indigo-bg)',
      title: 'Financial Risk Scoring',
      desc: 'Automatically score each transaction for risk exposure. Prioritize high-value reviews and focus your compliance team where financial risk is greatest.'
    },
    {
      icon: <Users size={22} />,
      color: 'var(--accent-emerald)',
      bg: 'var(--accent-emerald-bg)',
      title: 'Multi-Auditor Workflows',
      desc: 'Assign, track, and sign off financial investigations across your entire audit team. Role-based access ensures segregation of duties and review accountability.'
    },
    {
      icon: <DollarSign size={22} />,
      color: 'var(--accent-amber)',
      bg: 'var(--accent-amber-bg)',
      title: 'Transaction Tracing',
      desc: 'Trace the complete financial chain of any wire transfer, ledger entry, or intercompany movement across multiple entities, currencies, and jurisdictions.'
    },
    {
      icon: <BookOpen size={22} />,
      color: 'var(--accent-purple)',
      bg: 'var(--accent-purple-bg)',
      title: 'Compliance Reporting',
      desc: 'Generate audit-ready reports on demand. Export regulatory disclosures, board-level risk summaries, and full transaction logs to PDF or Excel with one click.'
    }
  ];

  const stats = [
    { value: '$4.2T+', label: 'Transactions Audited', sub: 'across all client portfolios' },
    { value: '99.97%', label: 'Audit Accuracy Rate', sub: 'zero material misstatement' },
    { value: '340+', label: 'Finance Teams', sub: 'in 28 countries' },
    { value: '<2 hrs', label: 'Mean Detection Time', sub: 'for financial irregularities' }
  ];

  const complianceFrameworks = ['SOX', 'IFRS 9', 'GAAP', 'AML/KYC', 'Basel III', 'MiFID II', 'COSO', 'PCAOB'];

  const testimonials = [
    {
      quote: "LedgerAudit reduced our quarterly close audit cycle from 3 weeks to 4 days. Our external auditors were impressed with the evidence package quality.",
      name: "Patricia Okafor",
      role: "Chief Financial Officer",
      org: "Meridian Capital Group"
    },
    {
      quote: "We identified a $2.3M internal fraud case within 6 hours of deployment. The transaction trace feature is unlike anything we had before.",
      name: "David Ng",
      role: "Head of Internal Audit",
      org: "Horizon Asset Management"
    },
    {
      quote: "SOX compliance documentation that used to take our team 8 weeks now gets generated in a single afternoon. The ROI is enormous.",
      name: "Elena Marchetti",
      role: "VP Compliance & Regulatory Affairs",
      org: "Avante Financial Services"
    }
  ];

  const faqs = [
    {
      q: 'Which regulatory frameworks does LedgerAudit support?',
      a: 'LedgerAudit is built to support SOX (Sarbanes-Oxley), IFRS 9, US GAAP, AML/KYC regulations, Basel III capital reporting, MiFID II trade transparency, COSO internal control frameworks, and PCAOB auditing standards. New regulatory modules are added quarterly.'
    },
    {
      q: 'How does the fraud detection work?',
      a: 'Our anomaly detection engine compares every transaction against a baseline of historical financial behavior, approved payment patterns, and counterparty risk profiles. Deviations beyond configurable thresholds are immediately flagged, categorized by risk severity, and routed to the relevant auditor for review.'
    },
    {
      q: 'Can LedgerAudit connect to our existing accounting systems?',
      a: 'Yes. LedgerAudit integrates with SAP, Oracle Financials, QuickBooks Enterprise, NetSuite, and most major ERP/accounting platforms via secure API. Data is ingested, normalized, and immediately available for audit review without manual export.'
    },
    {
      q: 'Is our financial data secure and confidential?',
      a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified, ISO 27001 compliant, and maintain strict data residency controls. Enterprise clients may additionally deploy fully on-premises with zero data leaving their private network.'
    }
  ];

  const plans = [
    {
      name: 'Standard',
      price: localBillingInterval === 'monthly' ? 99 : 79,
      color: 'var(--accent-blue)',
      colorRaw: '#0ea5e9',
      desc: 'Ideal for growing finance teams requiring foundational audit integrity.',
      features: [
        'Up to 1,000 transactions/month',
        'Standard ledger verification',
        'Basic fraud flag alerts',
        'Email compliance support desk',
        '14-day audit history review',
        'Single auditor workspace'
      ],
      cta: currentPlan === 'Standard' ? 'Current Plan' : 'Get Started',
      badge: null
    },
    {
      name: 'Professional',
      price: localBillingInterval === 'monthly' ? 299 : 239,
      color: 'var(--accent-indigo)',
      colorRaw: '#4f46e5',
      desc: 'Advanced forensic audit suite for compliance teams and finance departments.',
      features: [
        'Up to 25,000 transactions/month',
        'Custom signature verification',
        'Wire transfer route tracing',
        'Priority compliance support (4-hr SLA)',
        '24/7 regulatory alert monitoring',
        'Multi-auditor team workspace',
        'Custom compliance report templates'
      ],
      cta: currentPlan === 'Professional' ? 'Current Plan' : 'Upgrade to Pro',
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: localBillingInterval === 'monthly' ? 899 : 719,
      color: 'var(--accent-rose)',
      colorRaw: '#f43f5e',
      desc: 'Complete compliance infrastructure for large financial institutions.',
      features: [
        'Unlimited transaction volume',
        'Dedicated compliance node',
        'Custom regulatory rule scripting',
        'Full SLA agreement with instant pager',
        'Dedicated account compliance engineer',
        'On-premises or private cloud deploy',
        'Board-level risk reporting suite'
      ],
      cta: currentPlan === 'Enterprise' ? 'Current Plan' : 'Contact Sales',
      badge: 'Enterprise'
    }
  ];

  return (
    <div style={{ fontFamily: 'var(--sans)', color: '#151515', backgroundColor: '#ffffff', minHeight: '100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #eaeae6',
        padding: '0 6%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            backgroundColor: '#151515',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ffffff', fontWeight: '900', fontSize: '14px', letterSpacing: '-0.5px'
          }}>LA</div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '15px', letterSpacing: '-0.02em' }}>LedgerAudit</div>
            <div className="hide-mobile" style={{ fontSize: '9.5px', color: '#8c8c8a', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Financial Compliance Suite</div>
          </div>
        </div>

        <div className="hide-tablet" style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '13.5px', fontWeight: '600', color: '#555552' }}>
          <button onClick={() => scrollTo('features')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', color: '#555552' }}>Features</button>
          <button onClick={() => scrollTo('compliance')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', color: '#555552' }}>Compliance</button>
          <button onClick={() => scrollTo('pricing')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', color: '#555552' }}>Pricing</button>
          <button onClick={() => scrollTo('faqs')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: '600', color: '#555552' }}>FAQs</button>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '9px 22px',
            backgroundColor: '#151515',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Launch Console <ArrowRight size={13} />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        padding: '90px 6% 80px',
        background: 'linear-gradient(160deg, #f8faf9 0%, #ffffff 50%, #f0fdf4 100%)',
        borderBottom: '1px solid #eaeae6',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background accent shapes */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '10%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="landing-hero-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Left: copy */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0',
              borderRadius: '10px', padding: '5px 14px',
              fontSize: '11.5px', fontWeight: '700', color: '#059669',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '24px'
            }}>
              <ShieldCheck size={13} /> Trusted Financial Audit Platform
            </div>

            <h1 className="landing-hero-title" style={{
              fontWeight: '900',
              lineHeight: '1.08',
              letterSpacing: '-0.03em',
              color: '#151515',
              marginBottom: '20px'
            }}>
              Financial auditing<br />
              <span style={{ color: '#059669' }}>built for compliance.</span>
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#5a5a58',
              lineHeight: '1.65',
              maxWidth: '480px',
              marginBottom: '36px'
            }}>
              LedgerAudit gives financial controllers and compliance officers a single platform to verify ledger integrity, detect fraudulent transactions, trace wire transfers, and produce regulatory audit documentation automatically.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '13px 28px',
                  backgroundColor: '#151515',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 16px rgba(21,21,21,0.18)'
                }}
              >
                Launch Audit Console <ArrowRight size={15} />
              </button>
              <button
                onClick={() => scrollTo('features')}
                style={{
                  padding: '13px 28px',
                  backgroundColor: 'transparent',
                  color: '#151515',
                  border: '1.5px solid #dcdcd8',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                Explore Features
              </button>
            </div>

            {/* Micro trust badges */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '36px', flexWrap: 'wrap' }}>
              {['SOX Compliant', 'SOC 2 Type II', 'ISO 27001', 'GDPR Ready'].map(badge => (
                <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', fontWeight: '700', color: '#555552' }}>
                  <CheckCircle size={13} style={{ color: 'var(--accent-emerald)' }} />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Financial Dashboard Preview Card */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #eaeae6',
            borderRadius: '20px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.07), 0 4px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            {/* Card Header */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #f0f0ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#8c8c8a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Audit Monitor</span>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '10px' }}>● ACTIVE</div>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderBottom: '1px solid #f0f0ee' }}>
              {[
                { label: 'Transactions Reviewed', value: '1,847', change: '+12 today', up: true },
                { label: 'Compliance Score', value: '98.4%', change: '+0.3% this week', up: true },
                { label: 'Open Alerts', value: '6', change: '2 critical', up: false }
              ].map((kpi, i) => (
                <div key={i} style={{
                  padding: '18px 16px',
                  borderRight: i < 2 ? '1px solid #f0f0ee' : 'none'
                }}>
                  <div style={{ fontSize: '9.5px', color: '#8c8c8a', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>{kpi.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#151515', fontFamily: 'var(--mono)' }}>{kpi.value}</div>
                  <div style={{ fontSize: '10px', color: kpi.up ? '#10b981' : '#ef4444', fontWeight: '600', marginTop: '2px' }}>{kpi.change}</div>
                </div>
              ))}
            </div>

            {/* Transaction list */}
            <div style={{ padding: '14px 0' }}>
              {[
                { id: 'TXN-6619-F', amount: '$248,500', party: 'Cayman Holdings Ltd.', risk: 'HIGH', flag: true },
                { id: 'TXN-8821-A', amount: '$12,400', party: 'Meridian Supply Co.', risk: 'LOW', flag: false },
                { id: 'TXN-3304-C', amount: '$500,000', party: 'Offshore Legal Fees', risk: 'CRITICAL', flag: true },
                { id: 'TXN-9022-B', amount: '$8,200', party: 'Operations Account', risk: 'LOW', flag: false },
              ].map((txn) => (
                <div key={txn.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 20px',
                  borderLeft: txn.flag ? '3px solid #f43f5e' : '3px solid transparent',
                  backgroundColor: txn.flag ? 'rgba(244,63,94,0.03)' : 'transparent'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#151515', fontFamily: 'var(--mono)' }}>{txn.id}</div>
                    <div style={{ fontSize: '10.5px', color: '#8c8c8a', marginTop: '1px' }}>{txn.party}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: '800', color: txn.flag ? '#f43f5e' : '#151515' }}>{txn.amount}</div>
                    <div style={{
                      fontSize: '9.5px', fontWeight: '800', marginTop: '2px',
                      color: txn.risk === 'CRITICAL' ? '#dc2626' : txn.risk === 'HIGH' ? '#f59e0b' : '#10b981'
                    }}>{txn.risk} RISK</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA row */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f0ee', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8c8c8a', fontWeight: '600' }}>Last synced: 2 minutes ago</span>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-indigo)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Open Full Console <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ backgroundColor: '#151515', padding: '52px 6%' }}>
        <div className="landing-stats-grid" style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e0e0de', marginTop: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '11.5px', color: '#8c8c8a', marginTop: '4px' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMPLIANCE FRAMEWORKS ── */}
      <section id="compliance" style={{ padding: '40px 6%', backgroundColor: '#fafafa', borderBottom: '1px solid #eaeae6' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#8c8c8a', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Regulatory Frameworks Supported
          </span>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {complianceFrameworks.map(fw => (
              <div key={fw} style={{
                padding: '5px 16px',
                backgroundColor: '#ffffff',
                border: '1px solid #dcdcd8',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                color: '#3b3b3a',
                letterSpacing: '0.02em'
              }}>{fw}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 6%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#eef2ff', color: '#4f46e5',
              border: '1px solid #c7d2fe',
              borderRadius: '10px', padding: '4px 16px',
              fontSize: '11.5px', fontWeight: '800',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>Platform Capabilities</span>
            <h2 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Every audit function. One platform.
            </h2>
            <p style={{ fontSize: '15px', color: '#5a5a58', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
              From routine transaction verification to complex cross-border fraud investigations — LedgerAudit covers the full spectrum of financial compliance work.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid #eaeae6',
                backgroundColor: '#ffffff',
                transition: 'all 0.25s ease',
                cursor: 'default'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#dcdcd8'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#eaeae6'; }}
              >
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: '12px',
                  backgroundColor: f.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color,
                  marginBottom: '18px'
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#151515', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: '#5a5a58', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS / HOW IT WORKS ── */}
      <section style={{ padding: '100px 6%', backgroundColor: '#fafafa', borderTop: '1px solid #eaeae6', borderBottom: '1px solid #eaeae6' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '34px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '10px' }}>From data import to audit sign-off</h2>
            <p style={{ fontSize: '15px', color: '#5a5a58', maxWidth: '520px', margin: '0 auto' }}>
              A structured, four-step compliance workflow designed around how audit teams actually operate.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '12.5%',
              right: '12.5%',
              height: '2px',
              backgroundColor: '#eaeae6',
              zIndex: 0
            }} />

            {[
              { num: '01', title: 'Import Financial Data', desc: 'Connect your ERP, accounting system, or upload transaction ledgers in any format.' },
              { num: '02', title: 'Automated Verification', desc: 'Every entry is cross-referenced against approval workflows, baseline signatures, and regulatory thresholds.' },
              { num: '03', title: 'Risk Prioritization', desc: 'Suspicious transactions are scored by risk level and automatically routed to the appropriate auditor.' },
              { num: '04', title: 'Regulatory Sign-Off', desc: 'Generate auditor-certified reports, digital sign-offs, and regulatory submission packages instantly.' }
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 16px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#151515',
                  color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '900', fontSize: '15px', fontFamily: 'var(--mono)',
                  marginBottom: '20px',
                  border: '3px solid #fafafa',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>{step.num}</div>
                <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#151515', marginBottom: '8px' }}>{step.title}</h4>
                <p style={{ fontSize: '12.5px', color: '#5a5a58', lineHeight: '1.55' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 6%', backgroundColor: '#151515' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '34px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Trusted by finance leaders worldwide
            </h2>
            <p style={{ fontSize: '14px', color: '#8c8c8a', maxWidth: '480px', margin: '0 auto' }}>
              Hear from CFOs, internal audit heads, and compliance officers who rely on LedgerAudit daily.
            </p>
          </div>

          <div className="landing-features-grid">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[...Array(5)].map((_, si) => (
                    <span key={si} style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '13.5px', color: '#e0e0de', lineHeight: '1.65', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                  <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '13px' }}>{t.name}</div>
                  <div style={{ fontSize: '11.5px', color: '#8c8c8a', marginTop: '3px' }}>{t.role}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--accent-blue)', marginTop: '2px', fontWeight: '700' }}>{t.org}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '100px 6%', backgroundColor: '#ffffff', borderTop: '1px solid #eaeae6' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: '#eef2ff', color: '#4f46e5',
              border: '1px solid #c7d2fe',
              borderRadius: '10px', padding: '4px 16px',
              fontSize: '11.5px', fontWeight: '800',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              marginBottom: '16px'
            }}>Audit Subscription Plans</span>
            <h2 style={{ fontSize: '34px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '10px' }}>
              Compliance capacity tailored to your scale
            </h2>
            <p style={{ fontSize: '15px', color: '#5a5a58', maxWidth: '520px', margin: '0 auto 24px' }}>
              Choose the audit capacity that matches your regulatory scope. Scale up or down at any time.
            </p>

            {/* Billing Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
              <span
                onClick={() => handleBillingIntervalChange('monthly')}
                style={{ fontSize: '13.5px', fontWeight: localBillingInterval === 'monthly' ? '700' : '500', color: localBillingInterval === 'monthly' ? '#151515' : '#8c8c8a', cursor: 'pointer' }}
              >Monthly</span>
              <div
                onClick={() => handleBillingIntervalChange(localBillingInterval === 'monthly' ? 'annual' : 'monthly')}
                style={{ width: '44px', height: '24px', borderRadius: '10px', backgroundColor: '#151515', position: 'relative', cursor: 'pointer' }}
              >
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff',
                  position: 'absolute', top: '3px',
                  left: localBillingInterval === 'monthly' ? '3px' : '23px',
                  transition: 'left 0.25s ease'
                }} />
              </div>
              <span
                onClick={() => handleBillingIntervalChange('annual')}
                style={{ fontSize: '13.5px', fontWeight: localBillingInterval === 'annual' ? '700' : '500', color: localBillingInterval === 'annual' ? '#151515' : '#8c8c8a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Annual
                <span style={{ fontSize: '10px', color: '#10b981', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>Save 20%</span>
              </span>
            </div>
          </div>

          <div className="landing-pricing-grid">
            {plans.map((plan) => {
              const isActive = currentPlan === plan.name;
              const isPro = plan.name === 'Professional';
              return (
                <div
                  key={plan.name}
                  style={{
                    backgroundColor: isPro ? '#151515' : '#ffffff',
                    border: isActive ? `2px solid ${plan.colorRaw}` : isPro ? '2px solid #151515' : '1px solid #eaeae6',
                    borderRadius: '20px',
                    padding: '32px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '440px',
                    position: 'relative',
                    boxShadow: isPro ? '0 20px 50px rgba(21,21,21,0.15)' : isActive ? `0 8px 24px ${plan.colorRaw}20` : 'none',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {plan.badge && (
                    <span style={{
                      position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                      backgroundColor: isPro ? '#ffffff' : plan.colorRaw,
                      color: isPro ? '#151515' : '#ffffff',
                      fontSize: '9.5px', fontWeight: '800',
                      padding: '3px 16px', borderRadius: '10px',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      whiteSpace: 'nowrap'
                    }}>{plan.badge}</span>
                  )}
                  {isActive && (
                    <span style={{
                      position: 'absolute', top: '-12px', right: '24px',
                      backgroundColor: plan.colorRaw, color: '#ffffff',
                      fontSize: '9px', fontWeight: '800',
                      padding: '3px 10px', borderRadius: '10px',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>Active</span>
                  )}

                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: isPro ? 'rgba(255,255,255,0.6)' : plan.colorRaw, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {plan.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '14px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '40px', fontWeight: '900', color: isPro ? '#ffffff' : '#151515', fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>
                        ${plan.price}
                      </span>
                      <span style={{ fontSize: '13px', color: isPro ? 'rgba(255,255,255,0.5)' : '#8c8c8a', marginLeft: '5px' }}>/month</span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: isPro ? 'rgba(255,255,255,0.6)' : '#5a5a58', lineHeight: '1.5', marginBottom: '24px' }}>
                      {plan.desc}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: isPro ? 'rgba(255,255,255,0.8)' : '#3b3b3a' }}>
                          <CheckCircle size={14} style={{ color: isPro ? '#10b981' : plan.colorRaw, flexShrink: 0, marginTop: '1px' }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      if (isActive) return;
                      handleOpenModal({
                        name: plan.name,
                        price: plan.price,
                        desc: plan.desc,
                        color: plan.color,
                        features: plan.features
                      });
                    }}
                    disabled={isActive}
                    style={{
                      width: '100%',
                      marginTop: '28px',
                      padding: '12px 0',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: '800',
                      cursor: isActive ? 'default' : 'pointer',
                      backgroundColor: isActive ? 'rgba(0,0,0,0.1)' : isPro ? '#ffffff' : plan.colorRaw,
                      color: isActive ? (isPro ? 'rgba(255,255,255,0.5)' : '#8c8c8a') : isPro ? '#151515' : '#ffffff',
                      border: isActive ? '1px solid rgba(0,0,0,0.1)' : 'none',
                      boxShadow: (!isActive && !isPro) ? `0 4px 14px ${plan.colorRaw}40` : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#8c8c8a', marginTop: '28px' }}>
            All plans include a 14-day free trial. No credit card required to start. Cancel or change tier at any time.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section id="faqs" style={{ padding: '80px 6%', backgroundColor: '#fafafa', borderTop: '1px solid #eaeae6' }}>
        <div style={{ maxWidth: '740px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '40px', textAlign: 'center' }}>
            Frequently asked compliance questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} style={{ border: '1px solid #eaeae6', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
                  <div
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    style={{
                      padding: '18px 22px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '700',
                      fontSize: '14px',
                      color: '#151515',
                      backgroundColor: isOpen ? '#fafafa' : '#ffffff'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} style={{ color: '#8c8c8a', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                  </div>
                  {isOpen && (
                    <div style={{ padding: '16px 22px 20px', fontSize: '13.5px', color: '#5a5a58', lineHeight: '1.65', borderTop: '1px solid #eaeae6' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{
        padding: '90px 6%',
        background: 'linear-gradient(135deg, #151515 0%, #1a1a2e 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px', padding: '5px 14px',
            fontSize: '11.5px', fontWeight: '700', color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            marginBottom: '24px'
          }}>
            <Award size={13} /> Trusted Since 2019
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: '900', color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '16px', lineHeight: '1.12' }}>
            Ready to modernise your<br />financial audit process?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '36px', lineHeight: '1.6' }}>
            Join 340+ finance teams who have replaced manual spreadsheet audits with automated, regulatory-grade compliance monitoring.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '14px 30px',
                backgroundColor: '#ffffff',
                color: '#151515',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 20px rgba(255,255,255,0.15)'
              }}
            >
              Start Free Trial <ArrowRight size={15} />
            </button>
            <button
              onClick={() => scrollTo('pricing')}
              style={{
                padding: '14px 30px',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.85)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        backgroundColor: '#0f0f0f',
        padding: '48px 6% 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '30px', height: '30px', backgroundColor: '#ffffff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#151515', fontWeight: '900', fontSize: '12px' }}>LA</div>
              <span style={{ fontWeight: '800', color: '#ffffff', fontSize: '14px' }}>LedgerAudit</span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#5a5a58', lineHeight: '1.65', maxWidth: '240px' }}>
              Financial compliance and audit automation for regulated finance teams worldwide.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Audit Console', 'Transaction Review', 'Fraud Alerts', 'Risk Reports'] },
            { title: 'Compliance', links: ['SOX', 'IFRS 9', 'AML/KYC', 'Basel III'] },
            { title: 'Company', links: ['About Us', 'Security', 'Privacy Policy', 'Contact'] }
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#5a5a58', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontSize: '13px', color: '#3b3b3a', textDecoration: 'none', fontWeight: '500' }}
                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                    onMouseLeave={e => e.target.style.color = '#3b3b3a'}
                  >{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#5a5a58' }}>© 2024 LedgerAudit Financial Technologies Ltd. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['SOC 2', 'ISO 27001', 'GDPR'].map(badge => (
              <span key={badge} style={{ fontSize: '10px', fontWeight: '700', color: '#3b3b3a', backgroundColor: '#1a1a1a', border: '1px solid #2b2b2b', padding: '3px 8px', borderRadius: '4px' }}>{badge}</span>
            ))}
          </div>
        </div>
      </footer>

      <PricingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={modalPlan}
        initialBillingInterval={localBillingInterval}
        onConfirm={handleConfirmPlan}
      />
    </div>
  );
}
