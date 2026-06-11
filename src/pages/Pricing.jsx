import React, { useState } from 'react';
import { 
  Check, 
  HelpCircle, 
  ChevronDown, 
  Clock, 
  DollarSign, 
  Calculator,
  Zap,
  ShieldCheck,
  Star,
  Building2,
  X
} from 'lucide-react';
import PricingModal from '../components/PricingModal';

export default function Pricing({ currentPlan = 'Standard', setCurrentPlan, billingInterval = 'monthly', setBillingInterval }) {
  const [txnVolume, setTxnVolume] = useState(15000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleOpenModal = (plan) => {
    setModalPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmPlan = (planName, interval) => {
    if (setCurrentPlan) setCurrentPlan(planName);
    if (setBillingInterval) setBillingInterval(interval);
  };

  // ROI computations
  const manualAuditHours = Math.round(txnVolume / 50);
  const automatedAuditHours = Math.round(txnVolume / 5000);
  const hoursSaved = Math.max(0, manualAuditHours - automatedAuditHours);
  const dollarSavings = hoursSaved * 75;

  const plans = [
    {
      name: 'Standard',
      tagline: 'For growing finance teams',
      price: billingInterval === 'monthly' ? 99 : 79,
      accentColor: '#2e7d32',
      accentBg: '#edf7ed',
      accentBorder: '#cdd8cd',
      isPopular: false,
      features: [
        'Up to 5,000 transactions/month',
        'Automated audit trail generation',
        'Basic fraud pattern detection',
        'Ledger reconciliation reports',
        '14-day transaction history review',
        'Email compliance support',
        'Single auditor workspace',
      ],
      cta: currentPlan === 'Standard' ? 'Current Plan' : 'Get Started',
      isActive: currentPlan === 'Standard',
    },
    {
      name: 'Professional',
      tagline: 'For compliance departments',
      price: billingInterval === 'monthly' ? 299 : 239,
      accentColor: '#059669',
      accentBg: '#ecfdf5',
      accentBorder: '#a7f3d0',
      isPopular: true,
      features: [
        'Up to 25,000 transactions/month',
        'Advanced anomaly & fraud detection',
        'Wire transfer route tracing',
        'Custom compliance report templates',
        'Multi-auditor team workspace',
        'Priority support (4-hr SLA)',
        'SOX, IFRS & GAAP audit packs',
      ],
      cta: currentPlan === 'Professional' ? 'Current Plan' : 'Upgrade to Pro',
      isActive: currentPlan === 'Professional',
    },
    {
      name: 'Enterprise',
      tagline: 'For financial institutions',
      price: billingInterval === 'monthly' ? 899 : 719,
      accentColor: '#b45309',
      accentBg: '#fef3c7',
      accentBorder: '#fde68a',
      isPopular: false,
      features: [
        'Unlimited transaction volume',
        'Dedicated compliance node',
        'Custom regulatory rule scripting',
        'Instant pager SLA agreement',
        'Dedicated account compliance engineer',
        'On-premises or private cloud deploy',
        'Board-level risk reporting suite',
      ],
      cta: currentPlan === 'Enterprise' ? 'Current Plan' : 'Contact Sales',
      isActive: currentPlan === 'Enterprise',
    },
  ];

  const faqData = [
    {
      q: 'What compliance frameworks does LedgerAudit support?',
      a: 'LedgerAudit natively supports SOX, IFRS 9, GAAP, AML/KYC, Basel III, MiFID II, COSO, and PCAOB standards. Enterprise plans can be extended with custom regulatory rule scripting for jurisdiction-specific requirements.'
    },
    {
      q: 'Can we deploy LedgerAudit within our private infrastructure?',
      a: 'Yes, on-premises and private cloud deployment is available on the Enterprise tier. We provide deployment manifests ensuring your financial data never leaves your security boundary.'
    },
    {
      q: 'How does the 14-day audit history review work?',
      a: 'Standard plans can back-test new transactions against the preceding 14 days of ledger history to detect double-entry patterns, velocity deviations, and authorisation anomalies.'
    },
    {
      q: 'How are annual billing savings calculated?',
      a: 'Annual billing saves 20% vs monthly pricing, billed in a single invoice. All transaction limits and features carry over month-to-month within the billing cycle.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '50px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }} className="fade-in-up">

      {/* ── PAGE HEADER ── */}
      <div style={{ textAlign: 'center', paddingBottom: '8px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#059669',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          fontSize: '11px', fontWeight: '800',
          padding: '4px 14px', borderRadius: '10px',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          <ShieldCheck size={11} /> Pricing Strategy
        </span>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '14px', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Compliance-grade plans for every team size
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '560px', margin: '8px auto 0', lineHeight: '1.6' }}>
          Transparent, flat-rate pricing with no per-transaction fees. Cancel or upgrade anytime.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
          <button
            onClick={() => setBillingInterval && setBillingInterval('monthly')}
            style={{
              fontSize: '13px', fontWeight: billingInterval === 'monthly' ? '700' : '500',
              color: billingInterval === 'monthly' ? 'var(--text-primary)' : 'var(--text-muted)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0'
            }}
          >
            Monthly
          </button>
          <div
            onClick={() => setBillingInterval && setBillingInterval(billingInterval === 'monthly' ? 'annual' : 'monthly')}
            style={{
              width: '44px', height: '22px', borderRadius: '10px',
              backgroundColor: 'var(--color-success)',
              position: 'relative', cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%',
              backgroundColor: 'var(--bg-card)',
              position: 'absolute', top: '3px',
              left: billingInterval === 'monthly' ? '3px' : '25px',
              transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setBillingInterval && setBillingInterval('annual')}
              style={{
                fontSize: '13px', fontWeight: billingInterval === 'annual' ? '700' : '500',
                color: billingInterval === 'annual' ? 'var(--text-primary)' : 'var(--text-muted)',
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0'
              }}
            >
              Annual
            </button>
            <span style={{
              fontSize: '10px', fontWeight: '800', color: 'var(--color-success)',
              backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)',
              padding: '2px 8px', borderRadius: '10px'
            }}>
              Save 20%
            </span>
          </div>
        </div>
      </div>

      <div className="grid-3" style={{ alignItems: 'stretch' }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px',
              border: plan.isActive
                ? `2px solid ${plan.accentColor}`
                : plan.isPopular
                  ? `2px solid ${plan.accentColor}`
                  : '1px solid var(--border-color)',
              backgroundColor: plan.isPopular ? plan.accentBg : 'var(--bg-card)',
              padding: '28px 24px 24px',
              boxShadow: plan.isPopular
                ? `0 8px 24px ${plan.accentColor}18`
                : 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default'
            }}
          >
            {plan.isPopular && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                backgroundColor: plan.accentColor,
                color: 'var(--bg-card)',
                fontSize: '10px', fontWeight: '800',
                padding: '3px 12px', borderRadius: '10px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                alignSelf: 'flex-start',
                marginBottom: '14px'
              }}>
                <Star size={9} fill="currentColor" /> Most Popular
              </div>
            )}
            {plan.isActive && !plan.isPopular && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                backgroundColor: plan.accentColor,
                color: 'var(--bg-card)',
                fontSize: '10px', fontWeight: '800',
                padding: '3px 12px', borderRadius: '10px',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                alignSelf: 'flex-start',
                marginBottom: '14px'
              }}>
                <Check size={9} /> Active Plan
              </div>
            )}
            {!plan.isPopular && !plan.isActive && (
              <div style={{ height: '30px', marginBottom: '14px' }} />
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: plan.accentColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                {plan.name}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {plan.tagline}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '38px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  ${plan.price}
                </span>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>/ month</span>
              </div>
              {billingInterval === 'annual' && (
                <div style={{ fontSize: '11px', color: plan.accentColor, fontWeight: '600', marginTop: '4px' }}>
                  Billed annually — 20% savings applied
                </div>
              )}
            </div>

            <div style={{ height: '1px', backgroundColor: plan.accentBorder || 'var(--border-color)', marginBottom: '20px' }} />

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px', flex: 1 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: plan.accentBg,
                    border: `1px solid ${plan.accentBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px'
                  }}>
                    <Check size={10} style={{ color: plan.accentColor }} />
                  </div>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => { if (!plan.isActive) handleOpenModal(plan); }}
              disabled={plan.isActive}
              style={{
                marginTop: '24px',
                width: '100%',
                padding: '11px 0',
                fontSize: '13px',
                fontWeight: '700',
                borderRadius: '10px',
                border: plan.isActive ? '1px solid var(--border-color)' : `1.5px solid ${plan.accentColor}`,
                backgroundColor: plan.isActive
                  ? 'var(--bg-muted)'
                  : plan.isPopular
                    ? plan.accentColor
                    : 'transparent',
                color: plan.isActive
                  ? 'var(--text-muted)'
                  : plan.isPopular
                    ? 'var(--bg-card)'
                    : plan.accentColor,
                cursor: plan.isActive ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="clay-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={18} style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Compliance ROI Calculator</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Estimate your monthly audit cost savings</p>
          </div>
        </div>

        <div className="grid-2-cols" style={{ alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Monthly Transaction Volume</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-success)', fontFamily: 'var(--mono)' }}>{txnVolume.toLocaleString()} txns</span>
            </div>
            <input
              type="range" min="500" max="50000" step="500"
              value={txnVolume}
              onChange={(e) => setTxnVolume(parseInt(e.target.value))}
              style={{ width: '100%', height: '6px', borderRadius: '10px', appearance: 'none', outline: 'none', cursor: 'pointer', accentColor: 'var(--color-success)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>500 txns</span><span>50,000 txns</span>
            </div>
          </div>

          <div className="grid-2-cols" style={{ gap: '12px' }}>
            <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <Clock size={13} />
                <span style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Manual Hours</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--text-primary)', fontFamily: 'var(--mono)', lineHeight: 1 }}>{manualAuditHours}h</div>
            </div>

            <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-success)', marginBottom: '10px' }}>
                <Zap size={13} />
                <span style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hours Saved</span>
              </div>
              <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--color-success)', fontFamily: 'var(--mono)', lineHeight: 1 }}>{hoursSaved}h</div>
            </div>

            <div style={{ padding: '18px', borderRadius: '12px', backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-warning-border)', gridColumn: '1 / -1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-warning)', marginBottom: '10px' }}>
                <DollarSign size={13} />
                <span style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Estimated Monthly Savings</span>
              </div>
              <div style={{ fontSize: '30px', fontWeight: '900', color: 'var(--color-warning)', fontFamily: 'var(--mono)', lineHeight: 1 }}>${dollarSavings.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="clay-card">
        <h3 style={{ fontSize: '15px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '18px', color: 'var(--text-primary)' }}>
          Plan Capabilities Comparison
        </h3>
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '40%', textAlign: 'left', color: 'var(--text-muted)' }}>Feature</th>
                <th style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Standard</th>
                <th style={{ textAlign: 'center', color: 'var(--color-success)' }}>Professional</th>
                <th style={{ textAlign: 'center', color: 'var(--color-warning)' }}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Monthly Transaction Limit', '5,000', '25,000', 'Unlimited'],
                ['Audit Trail Generation', true, true, true],
                ['Fraud & Anomaly Detection', 'Basic', 'Advanced', 'Custom AI Rules'],
                ['Compliance Report Templates', false, true, true],
                ['Multi-Auditor Workspace', false, true, true],
                ['Dedicated Compliance Node', false, false, true],
                ['Support SLA', '24 hrs', '4 hrs', 'Instant Pager'],
              ].map(([label, std, pro, ent], i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{label}</td>
                  {[std, pro, ent].map((val, j) => (
                    <td key={j} style={{ textAlign: 'center', color: j === 1 ? 'var(--color-success)' : j === 2 ? 'var(--color-warning)' : 'var(--text-secondary)' }}>
                      {val === true ? <Check size={15} style={{ color: 'var(--color-success)', margin: '0 auto' }} /> : val === false ? <X size={13} style={{ color: 'var(--text-muted)', margin: '0 auto' }} /> : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="clay-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          <HelpCircle size={17} style={{ color: 'var(--color-success)' }} />
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqData.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', transition: 'all 0.2s ease' }}>
                <button
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '14px 18px', backgroundColor: isOpen ? 'var(--bg-muted)' : 'var(--bg-card)',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)',
                    border: 'none', textAlign: 'left', transition: 'background-color 0.2s ease'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
                </button>
                {isOpen && (
                  <div style={{ padding: '14px 18px', backgroundColor: 'var(--bg-card)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid var(--border-color)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PricingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={modalPlan}
        initialBillingInterval={billingInterval}
        onConfirm={handleConfirmPlan}
      />
    </div>
  );
}
