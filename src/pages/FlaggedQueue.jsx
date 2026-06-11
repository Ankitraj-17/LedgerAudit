import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Calendar,
  Plus,
  ChevronRight,
  Clock,
  DollarSign,
  Building2,
  AlertOctagon,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Queue } from '../utils/Queue';
import SkeletonBlock from '../components/SkeletonBlock';

export default function FlaggedQueue({ transactions, setTransactions }) {
  const [loading, setLoading] = useState(true);
  const [flagTxnId, setFlagTxnId]   = useState('');
  const [flagAmount, setFlagAmount] = useState('');
  const [flagDept, setFlagDept]     = useState('Treasury');
  const [flagReason, setFlagReason] = useState('');
  const [sessionAuditTrail, setSessionAuditTrail] = useState([]);
  const [justDequeued, setJustDequeued] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const flaggedTransactions = transactions.filter(t => t.status === 'Flagged');
  const queue = new Queue();
  flaggedTransactions.forEach(t => queue.enqueue(t));
  const queueItems = queue.items;

  const handleDequeue = () => {
    if (queue.isEmpty()) { alert('No pending items in queue.'); return; }
    const nextItem = queueItems[0];
    setTransactions(prev => prev.map(t =>
      t.id === nextItem.id ? { ...t, status: 'Approved', approvedBy: 'Sarah Jenkins', verified: true } : t
    ));
    setSessionAuditTrail(prev => [{
      id: nextItem.id,
      description: nextItem.description,
      amount: nextItem.amount,
      category: nextItem.category,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Approved'
    }, ...prev]);
    setJustDequeued(true);
    setTimeout(() => setJustDequeued(false), 2000);
  };

  const handleEnqueue = (e) => {
    e.preventDefault();
    if (!flagTxnId.trim() || !flagAmount.trim()) return;
    const parsedAmount = parseFloat(flagAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) { alert('Please enter a valid amount.'); return; }
    if (transactions.some(t => t.id.trim().toUpperCase() === flagTxnId.trim().toUpperCase())) {
      alert('A transaction with this code already exists.'); return;
    }
    setTransactions(prev => [...prev, {
      id: flagTxnId.trim().toUpperCase(),
      date: new Date().toISOString(),
      description: flagReason.trim() || `Flagged ${flagDept} overlimit transfer`,
      amount: parsedAmount,
      budgeted: Math.round(parsedAmount * 0.8),
      category: flagDept,
      status: 'Flagged',
      approvedBy: 'Unassigned',
      routingPath: ['Chase Bank (US)'],
      errorCode: 'TXN-LIMIT-ERR',
      verified: false
    }]);
    setFlagTxnId(''); setFlagAmount(''); setFlagReason('');
  };

  const getCategoryTag = (cat) => {
    const map = { Operations: 'OP', Marketing: 'MK', Legal: 'LG', Travel: 'TR', Treasury: 'TS' };
    return map[cat] || 'CF';
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <SkeletonBlock height="36px" width="300px" />
        <SkeletonBlock height="180px" width="100%" style={{ borderRadius: '24px' }} />
        <div className="grid-2">
          <SkeletonBlock height="280px" width="100%" style={{ borderRadius: '24px' }} />
          <SkeletonBlock height="280px" width="100%" style={{ borderRadius: '24px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* ─── PAGE HEADER BANNER ─── */}
      <div style={{
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '28px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 30px rgba(14, 165, 233, 0.05)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <AlertOctagon size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FIFO Review Queue
            </span>
          </div>
          <h2 style={{ fontSize: '36px', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: '400', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
            Flagged Transaction Queue
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
            A pipeline lining up suspicious or flagged financial codes in the order they were spotted.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '12px 20px', textAlign: 'center', boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-blue)', lineHeight: 1 }}>{queueItems.length}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Queued</div>
          </div>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-color)',
            borderRadius: '16px', padding: '12px 20px', textAlign: 'center', boxShadow: 'var(--shadow-xs)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', lineHeight: 1 }}>{sessionAuditTrail.length}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Resolved</div>
          </div>
        </div>
      </div>

      {/* ─── FIFO QUEUE PIPELINE REGISTER ─── */}
      <div className="clay-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '32px' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Compliance Conveyor Pipeline
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              First-In, First-Out (FIFO) — next transaction in line must be audited first
            </p>
          </div>
          <button
            onClick={handleDequeue}
            disabled={queue.isEmpty()}
            className="btn-primary"
            style={{ gap: '6px', fontSize: '13px', padding: '10px 20px' }}
          >
            <CheckCircle2 size={15} />
            <span>Resolve Next (Dequeue)</span>
          </button>
        </div>

        {/* Horizontal linear representation */}
        <div style={{
          display: 'flex', 
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto', 
          padding: '8px 4px 16px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none'
        }}>
          {queueItems.map((txn, index) => {
            const isNext = index === 0;
            return (
              <React.Fragment key={txn.id}>
                {index > 0 && (
                  <ArrowRight size={16} style={{ color: '#d1d5db', flexShrink: 0 }} />
                )}
                
                <div
                  className={isNext ? 'scale-in' : 'fade-in'}
                  style={{
                    flex: '0 0 220px',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px',
                    padding: '18px',
                    backgroundColor: 'var(--bg-card)',
                    border: isNext ? `2.5px solid var(--accent-blue)` : '1px solid var(--border-color)',
                    borderRadius: '24px',
                    boxShadow: isNext ? '0 8px 24px rgba(14, 165, 233, 0.2)' : 'var(--shadow-xs)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div className="flex-between" style={{ fontSize: '10px', fontWeight: '800' }}>
                    <span style={{
                      color: isNext ? '#ffffff' : 'var(--text-secondary)',
                      backgroundColor: isNext ? 'var(--accent-blue)' : 'var(--bg-muted)',
                      padding: '2px 8px', 
                      borderRadius: '10px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.04em',
                      border: isNext ? 'none' : '1px solid var(--border-color)'
                    }}>
                      {isNext ? 'FRONT' : `POS ${index + 1}`}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--mono)', backgroundColor: 'var(--bg-muted)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      {getCategoryTag(txn.category)}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>
                    {txn.id}
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0, minHeight: '34px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {txn.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                    <div className="flex-between" style={{ fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--accent-rose)' }}>
                        ${txn.amount.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {queueItems.length === 0 && (
            <div className="empty-state" style={{ flex: 1, padding: '40px 24px' }}>
              <div className="empty-state-icon" style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', width: '48px', height: '48px' }}>
                <ShieldCheck size={20} />
              </div>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '8px' }}>Queue fully cleared</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>All suspicious transfer records have been audited.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── BOTTOM ROW: ENQUEUE FORM + COMPLIANCE AUDIT TRAIL ─── */}
      <div className="layout-split-queue">

        {/* Left: Flag/Enqueue suspicious transaction */}
        <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '32px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Auditor Intake Registry
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>Flag Suspicious Event</h3>
          </div>

          <form onSubmit={handleEnqueue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Transaction Code</label>
              <input
                type="text" 
                placeholder="e.g. TXN-9999"
                value={flagTxnId} 
                onChange={e => setFlagTxnId(e.target.value)} 
                required
                style={{ borderRadius: '10px' }}
              />
            </div>

            <div className="grid-2-cols">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Amount ($)</label>
                <input
                  type="number" 
                  placeholder="e.g. 24000"
                  value={flagAmount} 
                  onChange={e => setFlagAmount(e.target.value)} 
                  required
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Department</label>
                <select 
                  value={flagDept} 
                  onChange={e => setFlagDept(e.target.value)}
                  style={{ borderRadius: '10px' }}
                >
                  <option>Treasury</option>
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Legal</option>
                  <option>Travel</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Violation Description</label>
              <textarea
                rows="3" 
                placeholder="E.g. Large overseas transfer flagged for manual review..."
                value={flagReason} 
                onChange={e => setFlagReason(e.target.value)}
                style={{ resize: 'none', borderRadius: '16px', padding: '12px 18px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', height: '42px', gap: '8px', borderRadius: '10px' }}
            >
              <Plus size={15} />
              <span>Flag & Enqueue</span>
            </button>
          </form>
        </div>

        {/* Right: compliance audit trail (timeline style) */}
        <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '32px', minHeight: '360px' }}>
          <div className="flex-between">
            <div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Operational Log
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>Compliance Audit Trail</h3>
            </div>
            {sessionAuditTrail.length > 0 && (
              <span className="badge badge-success">{sessionAuditTrail.length} verified</span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', maxHeight: '380px' }}>
            {sessionAuditTrail.map((log, idx) => (
              <div
                key={idx}
                className="fade-in-up"
                style={{
                  padding: '14px 16px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px'
                }}
              >
                <div className="flex-between">
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: '800', fontSize: '12.5px', color: 'var(--color-brand)' }}>
                    {log.id}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Clock size={12} />
                    <span>{log.timestamp}</span>
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                  {log.description}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Audited Amount: <strong style={{ color: 'var(--text-primary)' }}>${log.amount.toLocaleString()}</strong></span>
                  <span className="badge badge-success">{log.status}</span>
                </div>
              </div>
            ))}

            {sessionAuditTrail.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '40px 10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                <Clock size={24} style={{ color: 'var(--color-brand)', opacity: 0.6, marginBottom: '8px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>No trail items</span>
                <span style={{ fontSize: '11px', marginTop: '2px' }}>Resolve queued items above to log compliance actions.</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
