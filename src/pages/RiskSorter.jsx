import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown, 
  Percent, 
  SlidersHorizontal,
  FolderMinus,
  Activity,
  Volume2,
  VolumeX,
  TrendingDown
} from 'lucide-react';
import { MaxHeap } from '../utils/MaxHeap';
import SkeletonBlock from '../components/SkeletonBlock';

export default function RiskSorter({ transactions }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('deviation');
  const [minDeviation, setMinDeviation] = useState(-50);

  // Budget Simulation States
  const [budgetSimulationCut, setBudgetSimulationCut] = useState(0); // 0% to 50% budget cut simulator
  const [sirenActive, setSirenActive] = useState(false); // siren alarm switch

  // Calculate deviation and assign risk details for all transactions under the simulated budget cut
  const transactionsWithRisk = transactions.map(t => {
    const simulatedBudget = Math.round(t.budgeted * (1 - budgetSimulationCut / 100));
    const deviationVal = t.amount - simulatedBudget;
    const deviationPct = simulatedBudget > 0 ? (deviationVal / simulatedBudget) * 100 : 0;
    
    let riskLevel = 'LOW';
    let riskColor = 'success';
    let riskIcon = CheckCircle2;

    if (deviationPct > 100) {
      riskLevel = 'CRITICAL';
      riskColor = 'danger';
      riskIcon = AlertOctagon;
    } else if (deviationPct > 15) {
      riskLevel = 'HIGH';
      riskColor = 'danger';
      riskIcon = AlertOctagon;
    } else if (deviationPct > 0) {
      riskLevel = 'MEDIUM';
      riskColor = 'warning';
      riskIcon = AlertTriangle;
    }

    return {
      ...t,
      simulatedBudget,
      deviationVal,
      deviationPct: Math.round(deviationPct * 100) / 100,
      riskLevel,
      riskColor,
      riskIcon
    };
  });

  const preFiltered = transactionsWithRisk.filter(t => {
    const matchesFilter = riskFilter === 'ALL' || t.riskLevel === riskFilter;
    const matchesSlider = t.deviationPct >= minDeviation;
    return matchesFilter && matchesSlider;
  });

  let filteredTxns = [];
  if (sortBy === 'deviation') {
    const heap = new MaxHeap();
    heap.heapify(preFiltered);
    while (heap.heap.length > 0) {
      filteredTxns.push(heap.extractMax());
    }
  } else {
    filteredTxns = [...preFiltered].sort((a, b) => {
      if (sortBy === 'amount') {
        return b.amount - a.amount;
      } else if (sortBy === 'budgeted') {
        return b.simulatedBudget - a.simulatedBudget;
      }
      return 0;
    });
  }

  const criticalCount = transactionsWithRisk.filter(t => t.riskLevel === 'CRITICAL').length;
  const highCount = transactionsWithRisk.filter(t => t.riskLevel === 'HIGH').length;
  const mediumCount = transactionsWithRisk.filter(t => t.riskLevel === 'MEDIUM').length;

  const totalActual = transactions.reduce((sum, t) => sum + t.amount, 0);
  const simulatedTotalBudget = transactionsWithRisk.reduce((sum, t) => sum + t.simulatedBudget, 0);
  const overallDeviation = totalActual - simulatedTotalBudget;
  const overallDeviationPct = simulatedTotalBudget > 0 ? Math.round((overallDeviation / simulatedTotalBudget) * 100) : 0;

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <SkeletonBlock height="40px" width="300px" />
          <SkeletonBlock height="40px" width="160px" />
        </div>
        <div className="grid-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="clay-card"><SkeletonBlock height="120px" width="100%" /></div>
          ))}
        </div>
        <div className="clay-card"><SkeletonBlock height="300px" width="100%" /></div>
      </div>
    );
  }

  return (
    <div className="fade-in animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* ── Page Header / Control Row ── */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Activity size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              MaxHeap Priority Engine
            </span>
          </div>
          <h2 style={{ fontSize: '36px', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: '400', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
            Risk Deviation Sorter
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
            Deviation-ranked sorting models dynamic budget cuts and siren limits.
          </p>
        </div>

        {/* Siren Alarm Switch */}
        <div className="vault-toggle-container" style={{ borderColor: sirenActive ? 'var(--color-danger-border)' : 'var(--border-color)', height: '42px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sirenActive ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
            {sirenActive ? <Volume2 size={16} className="pulse" /> : <VolumeX size={16} />}
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {sirenActive ? 'Siren Active' : 'Siren Silent'}
            </span>
          </div>
          <label className="vault-switch">
            <input 
              type="checkbox" 
              checked={sirenActive}
              onChange={(e) => setSirenActive(e.target.checked)}
            />
            <span className="vault-slider" style={sirenActive ? { backgroundColor: 'var(--color-danger)' } : {}}></span>
          </label>
        </div>
      </div>

      {/* ── Risk Stats Row ── */}
      <div className="grid-3">
        {/* Card 1: Variance */}
        <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderRadius: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simulated Variance
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: overallDeviation > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {overallDeviation > 0 ? `+${overallDeviationPct}%` : `${overallDeviationPct}%`}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>overall deviation</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            Actual: ${totalActual.toLocaleString()} vs Budget: ${simulatedTotalBudget.toLocaleString()}
          </p>
        </div>

        {/* Card 2: Critical Risks */}
        <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--color-danger)', borderRadius: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Critical / High Risks
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-danger)' }}>
            {criticalCount + highCount} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Files</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            Exceeding safety budget guidelines.
          </p>
        </div>

        {/* Card 3: Medium Risks */}
        <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--color-warning)', borderRadius: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Medium Caution Risks
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-warning)' }}>
            {mediumCount} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Files</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 'auto' }}>
            Within boundary limit (+1% to +15%).
          </p>
        </div>
      </div>

      {/* ── Budget Trim Forecaster ── */}
      <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-muted)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} style={{ color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Interactive Budget Trim Forecaster
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
          Trim company budgets overall to simulate compliance caseload changes. Threshold deviations recalculate instantly.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginTop: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-blue)', minWidth: '160px' }}>
            Simulation Trim: {budgetSimulationCut}% Cut
          </span>
          <input 
            type="range" 
            min="0" 
            max="50" 
            value={budgetSimulationCut}
            onChange={(e) => setBudgetSimulationCut(parseInt(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--accent-blue)', height: '8px', borderRadius: '4px' }}
          />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
            (Increases alerts dynamically)
          </span>
        </div>
      </div>

      {/* ── Main Priority Sorter Card ── */}
      <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '32px' }}>
        
        {/* Sorter Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => {
              const getLvlColor = (l) => {
                if (l === 'ALL') return { activeBg: 'var(--accent-blue)', shadow: '0 4px 10px rgba(14, 165, 233, 0.2)' };
                if (l === 'CRITICAL' || l === 'HIGH') return { activeBg: 'var(--accent-rose)', shadow: '0 4px 10px rgba(244, 63, 94, 0.2)' };
                if (l === 'MEDIUM') return { activeBg: 'var(--accent-amber)', shadow: '0 4px 10px rgba(245, 158, 11, 0.2)' };
                return { activeBg: 'var(--accent-emerald)', shadow: '0 4px 10px rgba(16, 185, 129, 0.2)' };
              };
              const colors = getLvlColor(lvl);
              return (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  style={{
                    border: '1px solid var(--border-color)',
                    background: riskFilter === lvl ? colors.activeBg : 'var(--bg-muted)',
                    color: riskFilter === lvl ? '#ffffff' : 'var(--text-secondary)',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    boxShadow: riskFilter === lvl ? colors.shadow : 'none',
                    transition: 'all 0.2s ease',
                    transform: 'none',
                    fontWeight: '700'
                  }}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* Deviation Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                Deviation Trigger: {minDeviation}%
              </span>
              <input 
                type="range" 
                min="-50" 
                max="200" 
                value={minDeviation}
                onChange={(e) => setMinDeviation(parseInt(e.target.value))}
                style={{ width: '120px', accentColor: 'var(--accent-blue)' }}
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '150px', borderRadius: '10px', padding: '6px 12px' }}
              >
                <option value="deviation">Deviation % (MaxHeap)</option>
                <option value="amount">Amount</option>
                <option value="budgeted">Simulated Budget</option>
              </select>
            </div>
          </div>
        </div>

        {/* Priority list output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTxns.map((txn) => {
            const RiskIcon = txn.riskIcon;
            const isAlarming = sirenActive && (txn.riskLevel === 'CRITICAL' || txn.riskLevel === 'HIGH');

            return (
              <div 
                key={txn.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: isAlarming ? 'var(--color-danger-bg)' : 'var(--bg-card)',
                  border: isAlarming ? '2px solid var(--color-danger)' : '1px solid var(--border-color)',
                  borderRadius: '24px',
                  boxShadow: isAlarming ? '0 8px 24px rgba(244, 63, 94, 0.15)' : 'var(--shadow-xs)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Visual Icon */}
                <div style={{
                  padding: '10px',
                  borderRadius: '50%',
                  backgroundColor: isAlarming ? 'var(--color-danger-bg)' : `var(--color-${txn.riskColor}-bg)`,
                  color: isAlarming ? 'var(--color-danger)' : `var(--color-${txn.riskColor})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <RiskIcon size={20} className={isAlarming ? 'pulse' : ''} />
                </div>

                {/* Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontWeight: '800', color: 'var(--color-brand)', fontSize: '12px' }}>
                      {txn.id}
                    </span>
                    <span className={`badge badge-${txn.riskColor}`}>
                      {txn.riskLevel}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {txn.category}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
                    {txn.description}
                  </h4>
                </div>

                {/* Visual Deviation Bar */}
                <div style={{ width: '150px' }} className="hide-mobile">
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Variance Scope</span>
                  <div className="progress-track" style={{ height: '6px', marginTop: '3px' }}>
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min(Math.max(txn.deviationPct + 30, 0), 100)}%`,
                        backgroundColor: `var(--color-${txn.riskColor})`
                      }} 
                    />
                  </div>
                </div>

                {/* Amount and percentage deviation */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>
                    ${txn.amount.toLocaleString()}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: txn.deviationPct > 0 ? 'var(--color-danger)' : 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '2px',
                    marginTop: '2px'
                  }}>
                    <span>{txn.deviationPct > 0 ? `+${txn.deviationPct}%` : `${txn.deviationPct}%`}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTxns.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <FolderMinus size={36} style={{ color: 'var(--color-brand)', opacity: 0.5, marginBottom: '8px' }} />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>No violations found</span>
              <span style={{ fontSize: '11px' }}>Adjust deviation slider or level selection.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
