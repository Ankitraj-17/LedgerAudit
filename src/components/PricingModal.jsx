import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  ShieldCheck,
  Building2,
  Star
} from 'lucide-react';

const PLAN_META = {
  Standard: {
    color: '#2e7d32', // Emerald
    bg: '#edf7ed',
    border: '#cdd8cd',
    icon: <ShieldCheck size={20} />,
    tagline: 'For growing finance teams'
  },
  Professional: {
    color: '#059669', // Mint
    bg: '#ecfdf5',
    border: '#a7f3d0',
    icon: <Star size={20} />,
    tagline: 'For compliance departments & audit teams'
  },
  Enterprise: {
    color: '#b45309', // Amber
    bg: '#fef3c7',
    border: '#fde68a',
    icon: <Building2 size={20} />,
    tagline: 'For financial institutions at scale'
  }
};

export default function PricingModal({ isOpen, onClose, plan, initialBillingInterval = 'monthly', onConfirm }) {
  const [billingInterval, setBillingInterval] = useState(initialBillingInterval);

  useEffect(() => {
    if (isOpen) {
      setBillingInterval(initialBillingInterval);
    }
  }, [isOpen, initialBillingInterval]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !plan) return null;

  const meta = PLAN_META[plan.name] || PLAN_META.Standard;
  const isAnnual = billingInterval === 'annual';
  const price = plan.name === 'Standard' 
    ? (isAnnual ? 79 : 99) 
    : plan.name === 'Professional' 
      ? (isAnnual ? 239 : 299) 
      : (isAnnual ? 719 : 899);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(plan.name, billingInterval);
    }
    onClose();
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 9, 11, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          position: 'relative'
        }} 
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.15s ease',
            boxShadow: 'none'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-muted)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'var(--bg-card)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <X size={14} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '24px 24px 16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: meta.bg,
            border: `1px solid ${meta.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: meta.color,
            flexShrink: 0
          }}>
            {meta.icon}
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Switch to {plan.name}
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {meta.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Billing Toggle (Small Top Toggle) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            {['monthly', 'annual'].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setBillingInterval(v)}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: billingInterval === v ? meta.color : 'transparent',
                  color: billingInterval === v ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                {v === 'annual' ? (
                  <>
                    Annual
                    <span style={{ 
                      fontSize: '9px', 
                      backgroundColor: billingInterval === 'annual' ? 'rgba(255,255,255,0.2)' : '#edf7ed', 
                      color: billingInterval === 'annual' ? '#ffffff' : '#2e7d32', 
                      padding: '1px 5px', 
                      borderRadius: '4px', 
                      fontWeight: '800' 
                    }}>-20%</span>
                  </>
                ) : 'Monthly'}
              </button>
            ))}
          </div>

          {/* Pricing Display */}
          <div style={{ textAlign: 'center', padding: '16px', borderRadius: '14px', border: `1px solid ${meta.border}`, backgroundColor: meta.bg }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: '900', color: meta.color, fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>
                ${price}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ month</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {isAnnual ? 'Billed annually ($' + (price * 12).toLocaleString() + '/yr)' : 'Billed month-to-month'}
            </p>
          </div>

          {/* Core Features list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Plan Highlights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {plan.features.slice(0, 3).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ 
                    width: '15px', 
                    height: '15px', 
                    borderRadius: '50%', 
                    backgroundColor: meta.bg, 
                    border: `1px solid ${meta.border}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0, 
                    marginTop: '2px' 
                  }}>
                    <Check size={8} style={{ color: meta.color }} />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '14px 24px 20px', 
          borderTop: '1px solid var(--border-color)', 
          backgroundColor: 'var(--bg-muted)' 
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '10px', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-card)', 
              color: 'var(--text-secondary)', 
              fontWeight: '600', 
              fontSize: '13px', 
              cursor: 'pointer' 
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '10px', 
              backgroundColor: meta.color, 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: '700', 
              fontSize: '13px', 
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${meta.color}33`
            }}
          >
            Switch Plan
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
