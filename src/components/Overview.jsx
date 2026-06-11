import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Unlock, 
  ChevronDown, 
  Calendar, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  X,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  FileText,
  Printer,
  Settings
} from 'lucide-react';
import SkeletonBlock from './SkeletonBlock';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Operations':
      return {
        bg: 'var(--accent-emerald-bg)',
        border: 'var(--accent-emerald-border)',
        text: 'var(--accent-emerald)',
        color: '#10b981'
      };
    case 'Marketing':
      return {
        bg: 'var(--accent-cyan-bg)',
        border: 'var(--accent-cyan-border)',
        text: 'var(--accent-cyan)',
        color: '#06b6d4'
      };
    case 'Legal':
      return {
        bg: 'var(--accent-indigo-bg)',
        border: 'var(--accent-indigo-border)',
        text: 'var(--accent-indigo)',
        color: '#4f46e5'
      };
    case 'Travel':
      return {
        bg: 'var(--accent-rose-bg)',
        border: 'var(--accent-rose-border)',
        text: 'var(--accent-rose)',
        color: '#f43f5e'
      };
    default:
      return {
        bg: 'var(--bg-app)',
        border: 'var(--border-color)',
        text: 'var(--text-secondary)',
        color: 'var(--text-muted)'
      };
  }
};

export default function Overview({ transactions, specialists, setActiveTab, vaultSealed, setVaultSealed }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchActivity, setSearchActivity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedTimeframe, setSelectedTimeframe] = useState("ALL");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredWorkload, setHoveredWorkload] = useState(false);
  const [ratingVal, setRatingVal] = useState(4);

  // Report Compiler State
  const [reportFilter, setReportFilter] = useState('ALL');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledReport, setCompiledReport] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const handleCompile = (e) => {
    e.preventDefault();
    setIsCompiling(true);
    setCompiledReport(null);
    setTimeout(() => {
      let matchingTxns = transactions;
      if (reportFilter === 'HIGH_RISK') {
        matchingTxns = transactions.filter(t => (t.amount - t.budgeted) / t.budgeted > 0.15 || t.status === 'Flagged');
      } else if (reportFilter === 'FLAGGED') {
        matchingTxns = transactions.filter(t => t.status === 'Flagged');
      }
      setCompiledReport({
        id: `REP-${Math.floor(Math.random() * 90000 + 10000)}`,
        date: new Date().toLocaleDateString(),
        totalFiles: matchingTxns.length,
        totalVolume: matchingTxns.reduce((sum, t) => sum + t.amount, 0),
        status: 'COMPILED',
        filterUsed: reportFilter,
        transactions: matchingTxns
      });
      setIsCompiling(false);
    }, 600);
  };

  const printReport = (report) => {
    const statusColor = (s) => s === 'Approved' ? '#166534' : s === 'Flagged' ? '#991b1b' : '#92400e';
    const statusBg   = (s) => s === 'Approved' ? '#dcfce7' : s === 'Flagged' ? '#fee2e2' : '#fef3c7';
    const filterLabel = report.filterUsed === 'HIGH_RISK' ? 'High Risk Variance Only'
                      : report.filterUsed === 'FLAGGED'   ? 'Flagged Suspicious Codes'
                      : 'All Ledger Transactions';
    const txns = report.transactions || [];
    const approvedCount = txns.filter(t => t.status === 'Approved').length;
    const flaggedCount  = txns.filter(t => t.status === 'Flagged').length;
    const pendingCount  = txns.filter(t => t.status === 'Pending').length;
    const totalVolume   = txns.reduce((s, t) => s + t.amount, 0);
    const flaggedVolume = txns.filter(t => t.status === 'Flagged').reduce((s, t) => s + t.amount, 0);
    const anomalyRate   = txns.length > 0 ? ((flaggedCount / txns.length) * 100).toFixed(1) : '0.0';

    const rowsHtml = txns.map((t, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
        <td style="padding:8px 10px;font-family:monospace;font-size:12px;color:#374151;border-bottom:1px solid #e5e7eb">${t.id}</td>
        <td style="padding:8px 10px;font-size:12px;color:#374151;border-bottom:1px solid #e5e7eb">${new Date(t.date).toLocaleDateString()}</td>
        <td style="padding:8px 10px;font-size:12px;color:#374151;border-bottom:1px solid #e5e7eb;max-width:220px">${t.description}</td>
        <td style="padding:8px 10px;font-size:12px;color:#374151;border-bottom:1px solid #e5e7eb">${t.category || '—'}</td>
        <td style="padding:8px 10px;font-size:12px;color:#374151;border-bottom:1px solid #e5e7eb;text-align:right;font-family:monospace;font-weight:700">$${t.amount.toLocaleString()}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;text-align:center">
          <span style="display:inline-block;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700;background:${statusBg(t.status)};color:${statusColor(t.status)}">${t.status}</span>
        </td>
      </tr>`).join('');

    const reportHtml = `
  <div class="report-page">
    <!-- Header -->
    <div class="report-header">
      <div class="report-brand">
        <div class="report-brand-icon">LA</div>
        <div>
          <div class="report-brand-name">LedgerAudit</div>
          <div class="report-brand-sub">Financial Forensic Console · Certified Audit Platform</div>
        </div>
      </div>
      <div class="report-meta">
        <div class="report-id">${report.id}</div>
        <div class="report-date">Generated: ${new Date().toLocaleString()}</div>
        <div class="report-date">Compliance Reference: AML/CFT-2026</div>
      </div>
    </div>

    <!-- Title -->
    <div class="report-title-block">
      <span class="report-type">Forensic Audit Report</span>
      <div class="report-title">Financial Transaction Audit Statement</div>
      <div class="report-scope">Scope: ${filterLabel} &nbsp;|&nbsp; Reporting Period: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} &nbsp;|&nbsp; Auditor: Sarah Jenkins, CFE</div>
    </div>

    <!-- Summary Stats -->
    <div class="report-section-title">Executive Summary</div>
    <div class="report-summary-grid">
      <div class="report-stat-card">
        <div class="report-stat-label">Total Transactions</div>
        <div class="report-stat-value">${txns.length}</div>
      </div>
      <div class="report-stat-card">
        <div class="report-stat-label">Total Volume</div>
        <div class="report-stat-value">$${(totalVolume / 1000).toFixed(0)}k</div>
      </div>
      <div class="report-stat-card">
        <div class="report-stat-label">Approved</div>
        <div class="report-stat-value green">${approvedCount}</div>
      </div>
      <div class="report-stat-card">
        <div class="report-stat-label">Flagged</div>
        <div class="report-stat-value red">${flaggedCount}</div>
      </div>
      <div class="report-stat-card">
        <div class="report-stat-label">Anomaly Rate</div>
        <div class="report-stat-value ${parseFloat(anomalyRate) > 20 ? 'red' : parseFloat(anomalyRate) > 10 ? 'amber' : 'green'}">${anomalyRate}%</div>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="report-section-title">Transaction Ledger (${txns.length} entries)</div>
    <div class="report-table-wrap">
      <table class="report-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th style="text-align:right">Amount</th>
            <th style="text-align:center">Status</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot>
          <tr style="background:#f9fafb">
            <td colspan="4" style="padding:10px;font-size:12px;font-weight:800;color:#374151;border-top:2px solid #e5e7eb">TOTAL AUDIT VOLUME</td>
            <td style="padding:10px;font-size:13px;font-weight:900;font-family:monospace;text-align:right;color:#111827;border-top:2px solid #e5e7eb">$${totalVolume.toLocaleString()}</td>
            <td style="border-top:2px solid #e5e7eb"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Footer -->
    <div class="report-footer">
      <div class="report-cert-block">
        <div class="report-cert-title">Auditor Certification</div>
        <div class="report-cert-text">This report was compiled using LedgerAudit's forensic analysis engine. All transactions listed have been cross-referenced against baseline AML/CFT compliance rules. This document constitutes an official audit statement.</div>
      </div>
      <div class="report-sig-block">
        <div class="report-sig-line"></div>
        <div class="report-sig-label">Sarah Jenkins, CFE — Lead Auditor</div>
        <div class="report-sig-label" style="margin-top:2px">LedgerAudit Financial Forensic Console</div>
        <div class="report-sig-label" style="margin-top:2px">${new Date().toLocaleDateString()}</div>
      </div>
    </div>
  </div>`;

    let printRoot = document.getElementById('print-report-root');
    if (!printRoot) {
      printRoot = document.createElement('div');
      printRoot.id = 'print-report-root';
      document.body.appendChild(printRoot);
    }
    printRoot.innerHTML = reportHtml;

    document.body.classList.add('printing-report');
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-report');
      }, 500);
    }, 100);
  };

  if (loading) {
    return (
      <div className="skeleton" style={{ padding: '24px' }}>
        <div style={{ height: '80px', backgroundColor: 'var(--bg-card)', borderRadius: '16px' }}>
          <div className="skeleton" style={{ height: '100%' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '180px', backgroundColor: 'var(--bg-card)', borderRadius: '16px' }}>
              <div className="skeleton" style={{ height: '100%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dynamic calculations from database
  const approvedTxns = transactions.filter(t => t.status === 'Approved');
  const flaggedTxns = transactions.filter(t => t.status === 'Flagged');

  const totalAuditedValue = approvedTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalFlaggedValue = flaggedTxns.reduce((sum, t) => sum + t.amount, 0);
  
  const totalCount = transactions.length;
  const flaggedCount = flaggedTxns.length;
  const approvedCount = approvedTxns.length;

  const anomalyPercent = totalCount > 0 ? Math.round((flaggedCount / totalCount) * 100) : 0;

  // Category summary calculations for concentric circles
  const categorySummary = { Legal: 0, Operations: 0, Marketing: 0, Travel: 0 };
  transactions.forEach(t => {
    if (categorySummary[t.category] !== undefined) {
      categorySummary[t.category] += t.amount;
    }
  });

  // Current Date values
  const now = new Date();
  const dayNum = now.getDate();
  const weekday = now.toLocaleDateString(undefined, { weekday: 'short' });
  const month = now.toLocaleDateString(undefined, { month: 'long' });

  // Filtered transactions for Recent Activity Table
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchActivity.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchActivity.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Circular Specialist Load Math
  const totalSpecs = specialists.length;
  const busySpecs = specialists.filter(s => s.status === 'Busy' || s.load > 2).length;
  const specLoadPercent = totalSpecs > 0 ? Math.round((busySpecs / totalSpecs) * 100) : 0;

  // Dynamic path generation for Audit Stream based on actual transaction data
  const getFilteredStreamData = () => {
    let sorted = [...transactions]
      .filter(t => t.status === 'Approved')
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (selectedTimeframe === '7D') {
      sorted = sorted.slice(-4);
    } else if (selectedTimeframe === '30D') {
      sorted = sorted.slice(-7);
    }
    
    let cumulative = 0;
    return sorted.map((t, index) => {
      cumulative += t.amount;
      return {
        id: t.id,
        amount: t.amount,
        cumulative,
        date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        description: t.description,
        index
      };
    });
  };

  const streamData = getFilteredStreamData();
  const maxCumulative = streamData.length > 0 ? Math.max(...streamData.map(d => d.cumulative)) : 0;
  
  const points = [];
  const svgWidth = 100;
  const svgHeight = 40;
  
  let linePath = '';
  let fillPath = '';

  if (streamData.length > 1) {
    streamData.forEach((d, idx) => {
      const x = (idx / (streamData.length - 1)) * svgWidth;
      const y = svgHeight - 5 - (d.cumulative / (maxCumulative || 1)) * (svgHeight - 10);
      points.push({ x, y, data: d });
    });
    linePath = points.reduce((acc, p, idx) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      const prev = points[idx - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, '');
    fillPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;
  } else {
    // fallback data coordinates
    const fallbackData = [
      { amount: 12500, cumulative: 12500, date: 'Jun 1' },
      { amount: 45000, cumulative: 57500, date: 'Jun 2' },
      { amount: 32000, cumulative: 89500, date: 'Jun 6' },
      { amount: 14200, cumulative: 103700, date: 'Jun 7' },
      { amount: 120000, cumulative: 223700, date: 'Jun 8' },
      { amount: 22000, cumulative: 245700, date: 'Jun 9' },
      { amount: 50000, cumulative: 295700, date: 'Jun 10' }
    ];
    const maxFallback = 295700;
    fallbackData.forEach((d, idx) => {
      const x = (idx / (fallbackData.length - 1)) * svgWidth;
      const y = svgHeight - 5 - (d.cumulative / maxFallback) * (svgHeight - 10);
      points.push({ x, y, data: { id: `TXN-DEMO-${idx}`, ...d, description: 'Simulated baseline volume' } });
    });
    linePath = points.reduce((acc, p, idx) => {
      if (idx === 0) return `M ${p.x} ${p.y}`;
      const prev = points[idx - 1];
      const cpX1 = prev.x + (p.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (p.x - prev.x) / 2;
      const cpY2 = p.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
    }, '');
    fillPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`;
  }

  return (
    <div className="overview-container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '32px', 
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      boxSizing: 'border-box'
    }}>
      {/* ── Load dynamic fonts for Serif headings ── */}
      <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ─── ROW 1: WELCOME ROW ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        width: '100%'
      }}>
        {/* Left: Date Circle Calendar card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Big number circle */}
          <div style={{
            width: '74px',
            height: '74px',
            borderRadius: '18px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            {dayNum}
          </div>
          {/* Day text details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
              {weekday},
            </span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#8c8c8a', marginTop: '1px' }}>
              {month}
            </span>
          </div>

          <button 
            onClick={() => setActiveTab('assignor')}
            style={{
              backgroundColor: 'var(--color-brand)',
              color: 'var(--color-active-text)',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '12px',
              boxShadow: '0 4px 12px rgba(223, 92, 63, 0.15)'
            }}
          >
            <span>Show my Tasks</span>
            <ArrowRight size={13} style={{ color: 'var(--color-active-text)' }} />
          </button>

          {/* Small calendar button circle */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8c8c8a',
            cursor: 'pointer'
          }} onClick={() => navigate('/transactions')}>
            <Calendar size={16} />
          </div>
        </div>

        {/* Right: Compliant Status Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ 
              fontSize: '36px', 
              fontFamily: "'Instrument Serif', Georgia, serif", 
              fontWeight: '400',
              color: 'var(--text-primary)', 
              margin: 0,
              lineHeight: 1.1
            }}>
              System active & fully compliant.
            </h2>
            <p style={{ fontSize: '13px', color: '#8c8c8a', marginTop: '2px' }}>
              All database hash baselines validated under SEC guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: BENTO GRID FOR METRICS & WORKSPACE ─── */}
      <div className="bento-grid">
        
        {/* CARD 1: PRIMARY AUDIT TARGET */}
        <div className="bento-span-3 clay-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '275px',
          padding: '24px',
          background: 'linear-gradient(135deg, #0b1528 0%, #111e36 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          color: '#ffffff',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.15)'
        }}>
          <div className="flex-between">
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255, 255, 255, 0.6)', fontFamily: 'var(--mono)', letterSpacing: '0.05em' }}>PRIMARY AUDIT TARGET</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#f87171', cursor: 'pointer', fontWeight: '800' }}>
              <span>High Risk</span>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
            </div>
          </div>

          <div style={{ margin: '20px 0' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Offshore Outflow Account
            </span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '4px', display: 'block', letterSpacing: '0.02em', fontFamily: 'var(--mono)' }}>
              TXN-3304-C
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              flex: 1,
              backgroundColor: 'var(--accent-blue)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 0',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(14, 165, 233, 0.3)'
            }} onClick={() => navigate('/movement')}>
              Trace Route
            </button>
            <button style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '10px 0',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer'
            }} onClick={() => navigate('/assignor')}>
              Assign
            </button>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', marginTop: '16px' }} className="flex-between">
            <div>
              <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', display: 'block' }}>Limit Deviation</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#f87171', marginTop: '2px', display: 'block' }}>+400% ($500k)</span>
            </div>
            <button style={{
              padding: '4px 10px',
              fontSize: '10.5px',
              border: '1px solid var(--accent-blue)',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--accent-blue)',
              cursor: 'pointer',
              fontWeight: '700'
            }} onClick={() => navigate('/transactions?tab=lookup')}>
              Verify
            </button>
          </div>
        </div>

        {/* CARD 2: AUDITED VOLUMES */}
        <div className="bento-span-3 clay-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '275px',
          padding: '20px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px'
        }}>
          {/* Top block: Audited */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            backgroundColor: 'var(--accent-emerald-bg)',
            borderRadius: '16px',
            padding: '14px 16px'
          }}>
            <div className="flex-between">
              <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Total Audited
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10.5px', color: 'var(--accent-emerald)', cursor: 'pointer', opacity: 0.8 }}>
                <span>Monthly</span>
                <ChevronDown size={12} />
              </div>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-emerald)', margin: 0, fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>
              ${totalAuditedValue.toLocaleString()}
            </h2>
          </div>

          {/* Bottom block: Flagged */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            backgroundColor: 'var(--accent-rose-bg)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginTop: '12px'
          }}>
            <div className="flex-between">
              <span style={{ fontSize: '11px', color: 'var(--accent-rose)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                Total Flagged
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10.5px', color: 'var(--accent-rose)', cursor: 'pointer', opacity: 0.8 }}>
                <span>Monthly</span>
                <ChevronDown size={12} />
              </div>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-rose)', margin: 0, fontFamily: 'var(--mono)', letterSpacing: '-0.02em' }}>
              ${totalFlaggedValue.toLocaleString()}
            </h2>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }} className="flex-between">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Balance baselines verified</span>
            <button style={{
              padding: '4px 10px',
              fontSize: '11px',
              border: '1px solid var(--color-brand)',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: 'var(--color-brand)',
              cursor: 'pointer',
              fontWeight: '700'
            }} onClick={() => setActiveTab('risks')}>
              View Heap
            </button>
          </div>
        </div>

        {/* CARD 3: SYSTEM LOCK & ANOMALY */}
        <div className="bento-span-3 clay-card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '275px',
          padding: '24px 16px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            onClick={() => setVaultSealed(!vaultSealed)}
            title="Toggle Vault Lock"
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: vaultSealed ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
              color: vaultSealed ? 'var(--color-danger)' : 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid',
              borderColor: vaultSealed ? 'var(--color-danger-border)' : 'var(--color-success-border)',
              boxShadow: vaultSealed ? '0 0 10px var(--color-danger-border)' : '0 0 10px var(--color-success-border)'
            }}>
              {vaultSealed ? <Lock size={20} /> : <Unlock size={20} />}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: vaultSealed ? 'var(--color-danger)' : 'var(--color-success)' }}>
              {vaultSealed ? 'Vault Sealed' : 'System Lock'}
            </span>
          </div>

          {/* Anomaly Gauge */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
            <svg width="80" height="80">
              <circle cx="40" cy="40" r="32" stroke="var(--border-color)" strokeWidth="6" fill="transparent" />
              <circle 
                cx="40" 
                cy="40" 
                r="32" 
                stroke={anomalyPercent < 15 ? 'var(--color-success)' : anomalyPercent < 45 ? 'var(--color-warning)' : 'var(--color-danger)'} 
                strokeWidth="6" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 32} 
                strokeDashoffset={2 * Math.PI * 32 * (1 - anomalyPercent / 100)}
                strokeLinecap="round" 
                transform="rotate(-90 40 40)" 
                style={{
                  filter: `drop-shadow(0 0 3px ${anomalyPercent < 15 ? 'var(--color-success)' : anomalyPercent < 45 ? 'var(--color-warning)' : 'var(--color-danger)'})`
                }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{anomalyPercent}%</span>
              <span style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Anomaly</span>
            </div>
          </div>
        </div>

        {/* CARD 4: FLAGGED QUEUE SLA */}
        <div className="bento-span-3 clay-card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '275px',
          padding: '24px 12px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              SLA Queue
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--color-danger)', marginTop: '8px', marginBottom: '2px' }}>
              {flaggedCount} Files
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Waiting (FIFO)</span>
          </div>

          {/* Matrix of queue items centered */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 8px)', 
            gap: '6px', 
            justifyContent: 'center',
            margin: '20px auto 0'
          }}>
            {transactions.map((txn, i) => (
              <div 
                key={txn.id} 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: txn.status === 'Flagged' ? 'var(--color-danger)' : 'var(--border-color)',
                  boxShadow: txn.status === 'Flagged' ? '0 0 6px var(--color-danger)' : 'none',
                  transition: 'all 0.25s ease'
                }} 
                title={`${txn.id}: ${txn.status}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── ROW 3: BENTO GRID FOR THE REST OF THE MODULES ─── */}
      <div className="bento-grid">
        {/* Left: Recent Activity Journal (Filtered Table) */}
        <div className="bento-span-8 clay-card" style={{
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '24px'
        }}>
          <div className="flex-between">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Recent Audit Activity Journal</h3>
              <p style={{ fontSize: '12px', color: '#8c8c8a' }}>Filter and check records compiled inside the memory baseline.</p>
            </div>
            <button 
              onClick={() => setActiveTab('transactions')}
              style={{ fontSize: '12.5px', padding: '6px 14px', borderRadius: '10px' }}
            >
              View Full Journal
            </button>
          </div>

          {/* Search bar & Category filter tags */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8c8c8a' }} />
              <input 
                type="text" 
                placeholder="Search by code or description ..."
                value={searchActivity}
                onChange={e => setSearchActivity(e.target.value)}
                style={{
                  fontSize: '12.5px',
                  padding: '8px 12px 8px 36px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  height: '36px',
                  width: '100%',
                  boxSizing: 'border-box',
                  boxShadow: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              {['ALL', 'Operations', 'Marketing', 'Legal', 'Travel'].map(cat => {
                const colors = getCategoryColor(cat);
                const isSelected = selectedCategory === cat;
                return (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '11.5px',
                      borderRadius: '10px',
                      backgroundColor: isSelected ? colors.bg : 'transparent',
                      border: '1px solid',
                      borderColor: isSelected ? colors.border : 'var(--border-color)',
                      color: isSelected ? colors.text : '#6b7280',
                      cursor: 'pointer',
                      boxShadow: 'none',
                      fontWeight: isSelected ? '700' : '500',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}

              {selectedStatus !== 'ALL' && (
                <span className="badge badge-neutral" style={{ fontSize: '11px', display: 'inline-flex', gap: '4px', alignItems: 'center', height: '26px' }}>
                  Status: {selectedStatus}
                  <X size={12} style={{ cursor: 'pointer', color: 'var(--color-brand)' }} onClick={() => setSelectedStatus('ALL')} />
                </span>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="table-container" style={{ flex: 1, maxHeight: '220px', overflowY: 'auto', overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 5).map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '700', color: 'var(--color-brand)' }}>
                      {txn.id}
                    </td>
                    <td style={{ fontWeight: '500' }}>{txn.description}</td>
                    <td>
                      <span className="badge" style={{
                        backgroundColor: getCategoryColor(txn.category).bg,
                        color: getCategoryColor(txn.category).text,
                        border: `1px solid ${getCategoryColor(txn.category).border}`,
                        fontSize: '11px',
                        padding: '2px 8px'
                      }}>
                        {txn.category}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontWeight: '700' }}>
                      ${txn.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`badge badge-${txn.status === 'Approved' ? 'success' : txn.status === 'Flagged' ? 'danger' : 'warning'}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#8c8c8a' }}>
                      No matching transaction entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Report Compiler widget (spans 4) */}
        <div className="bento-span-4 clay-card" style={{
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <FileText size={17} style={{ color: 'var(--color-brand)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Report Compiler</h3>
            </div>
            <p style={{ fontSize: '12px', color: '#8c8c8a' }}>
              Compile ledger statements based on filter scope.
            </p>
          </div>

          <form onSubmit={handleCompile} style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#555552' }}>Report Scope:</label>
              <select 
                value={reportFilter} 
                onChange={(e) => setReportFilter(e.target.value)}
                style={{ borderRadius: '10px', padding: '10px 16px', border: '1px solid var(--border-color)', outline: 'none' }}
              >
                <option value="ALL">All Ledger Transactions</option>
                <option value="HIGH_RISK">High Risk Variance Only</option>
                <option value="FLAGGED">Flagged Suspicious Codes</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isCompiling}
              style={{ width: '100%', gap: '8px', height: '42px', borderRadius: '10px', cursor: 'pointer' }}
            >
              <Settings size={14} />
              <span>{isCompiling ? 'Compiling Report...' : 'Compile Audit Report'}</span>
            </button>

            {compiledReport && (
              <div className="fade-in delay-2" style={{
                padding: '12px 14px', 
                border: '1px solid var(--color-success-border)', 
                backgroundColor: 'var(--color-success-bg)', 
                borderRadius: '12px',
                display: 'flex', flexDirection: 'column', gap: '8px',
                fontSize: '12px',
                color: 'var(--color-success)',
                marginTop: '6px'
              }}>
                <div className="flex-between">
                  <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{compiledReport.id}</strong>
                  <span className="badge badge-success" style={{ fontSize: '10px' }}>COMPILED</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#555552', fontSize: '11px' }}>
                  <span>Date: {compiledReport.date}</span>
                  <span>Filter: {compiledReport.filterUsed}</span>
                  <span>Files: {compiledReport.totalFiles}</span>
                  <span>Volume: ${compiledReport.totalVolume.toLocaleString()}</span>
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); printReport(compiledReport); }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 14px', borderRadius: '10px',
                    border: 'none',
                    background: 'var(--bg-card)', cursor: 'pointer', fontWeight: '700', color: 'var(--color-success)',
                    width: 'fit-content',
                    boxShadow: 'none'
                  }}
                >
                  <Printer size={11} />
                  <span>Print Report</span>
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ─── ROW 4: ANALYTICS GRIDS & SYSTEM STATS ─── */}
        {/* Concentric Category Funnel Chart (spans 3) */}
        <div className="bento-span-3 clay-card" style={{
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          position: 'relative'
        }}>
          <div>
            <div className="flex-between">
              <span style={{ fontSize: '11px', color: '#8c8c8a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Asset Distribution
              </span>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: '#8c8c8a', cursor: 'pointer' }}
                onClick={() => setSelectedCategory('ALL')}
                title="Reset Category Filter"
              >
                <span>{selectedCategory === 'ALL' ? 'Categories' : `Filtered: ${selectedCategory}`}</span>
                {selectedCategory !== 'ALL' ? <X size={12} style={{ marginLeft: '4px', color: 'var(--color-brand)' }} /> : <ChevronDown size={12} />}
              </div>
            </div>
          </div>

          {/* Funnel concentric circles */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', position: 'relative' }}>
            <div 
              style={{
                width: '160px', height: '160px', borderRadius: '50%',
                backgroundColor: selectedCategory === 'Legal' ? 'var(--accent-indigo-border)' : 'var(--accent-indigo-bg)', 
                border: selectedCategory === 'Legal' ? '2.5px solid var(--color-brand)' : '1px solid var(--accent-indigo-border)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                paddingTop: '12px', fontSize: '10px', fontWeight: '700', color: 'var(--text-primary)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: selectedCategory === 'Legal' ? 'scale(1.04)' : 'none',
                boxShadow: selectedCategory === 'Legal' ? '0 8px 20px rgba(99, 102, 241, 0.15)' : 'none'
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'Legal' ? 'ALL' : 'Legal')}
              title="Click to filter by Legal"
            >
              <span>Legal (${Math.round(categorySummary.Legal / 1000)}k)</span>
              
              <div 
                style={{
                  width: '124px', height: '124px', borderRadius: '50%',
                  backgroundColor: selectedCategory === 'Operations' ? 'var(--accent-purple-border)' : 'var(--accent-purple-bg)', 
                  border: selectedCategory === 'Operations' ? '2.5px solid var(--color-brand)' : '1px solid var(--accent-purple-border)',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  paddingTop: '12px', fontSize: '10px', fontWeight: '700', color: 'var(--text-primary)',
                  position: 'absolute', bottom: '0', left: '50%', 
                  transform: `translateX(-50%) ${selectedCategory === 'Operations' ? 'scale(1.04)' : ''}`,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: selectedCategory === 'Operations' ? '0 6px 16px rgba(139, 92, 246, 0.15)' : 'none'
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedCategory(selectedCategory === 'Operations' ? 'ALL' : 'Operations'); }}
                title="Click to filter by Operations"
              >
                <span>Ops (${Math.round(categorySummary.Operations / 1000)}k)</span>

                <div 
                  style={{
                    width: '88px', height: '88px', borderRadius: '50%',
                    backgroundColor: selectedCategory === 'Marketing' ? 'var(--accent-rose-border)' : 'var(--accent-rose-bg)', 
                    border: selectedCategory === 'Marketing' ? '2.5px solid var(--color-brand)' : '1px solid var(--accent-rose-border)',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    paddingTop: '12px', fontSize: '10px', fontWeight: '700', color: 'var(--text-primary)',
                    position: 'absolute', bottom: '0', left: '50%', 
                    transform: `translateX(-50%) ${selectedCategory === 'Marketing' ? 'scale(1.04)' : ''}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: selectedCategory === 'Marketing' ? '0 4px 12px rgba(244, 63, 94, 0.15)' : 'none'
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedCategory(selectedCategory === 'Marketing' ? 'ALL' : 'Marketing'); }}
                  title="Click to filter by Marketing"
                >
                  <span>Mktg (${Math.round(categorySummary.Marketing / 1000)}k)</span>

                  <div 
                    style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      backgroundColor: selectedCategory === 'Travel' ? 'var(--accent-cyan-border)' : 'var(--accent-indigo)',
                      border: selectedCategory === 'Travel' ? '2px solid var(--bg-card)' : 'none',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', fontWeight: '700', color: '#ffffff',
                      position: 'absolute', bottom: '0', left: '50%', 
                      transform: `translateX(-50%) ${selectedCategory === 'Travel' ? 'scale(1.06)' : ''}`,
                      boxShadow: 'var(--shadow-xs)',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    onClick={(e) => { e.stopPropagation(); setSelectedCategory(selectedCategory === 'Travel' ? 'ALL' : 'Travel'); }}
                    title="Click to filter by Travel"
                  >
                    <span>Travel</span>
                    <span style={{ fontSize: '8px', fontWeight: '500', opacity: 0.9 }}>
                      (${Math.round((categorySummary.Travel || 0) / 1000)}k)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '10.5px', color: '#8c8c8a', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            {selectedCategory === 'ALL' ? 'Click categories above to filter the journal table below.' : `Table filtered by "${selectedCategory}" category.`}
          </div>
        </div>

        {/* Audit Stream Trend Line (spans 3) */}
        <div className="bento-span-3 clay-card" style={{
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#8c8c8a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Audit Stream
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['ALL', '30D', '7D'].map(tf => (
                  <button 
                    key={tf}
                    onClick={() => { setSelectedTimeframe(tf); setHoveredPoint(null); }}
                    style={{
                      padding: '2px 8px',
                      fontSize: '12px',
                      border: 'none',
                      background: selectedTimeframe === tf ? 'var(--color-brand)' : 'transparent',
                      color: selectedTimeframe === tf ? 'var(--bg-app)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      height: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontWeight: '700'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'var(--mono)' }}>
              {(() => {
                const streamTotal = totalAuditedValue * (selectedTimeframe === '30D' ? 0.6 : 0.2);
                return `$${(selectedTimeframe === 'ALL' ? totalAuditedValue : streamTotal).toLocaleString()}`;
              })()}
            </h2>
          </div>

          {/* Interactive Line Chart */}
          <div style={{ height: '100px', margin: '10px 0', position: 'relative' }}>
            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                transform: 'translateX(-50%) translateY(-100%)',
                backgroundColor: 'var(--color-brand)',
                color: 'var(--bg-app)',
                padding: '8px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 10,
                width: '180px',
                textAlign: 'left',
                pointerEvents: 'none',
                border: '1px solid #333'
              }}>
                <div style={{ fontWeight: 'bold', borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{hoveredPoint.id}</span>
                  <span style={{ color: '#8c8c8a' }}>{hoveredPoint.date}</span>
                </div>
                <div>Amount: <strong style={{ color: 'var(--color-brand)' }}>${hoveredPoint.amount.toLocaleString()}</strong></div>
                <div style={{ color: '#eaeae6', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hoveredPoint.description}</div>
                <div style={{ color: '#8c8c8a', fontSize: '9px', marginTop: '2px' }}>Cumulative Audited: ${hoveredPoint.cumulative.toLocaleString()}</div>
              </div>
            )}

            <svg viewBox="0 0 100 40" width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="stocks-grad-dynamic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Spline Area Fill */}
              {fillPath && (
                <path 
                  d={fillPath} 
                  fill="url(#stocks-grad-dynamic)" 
                />
              )}
              
              {/* Spline Path */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="var(--accent-blue)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              )}

              {/* Interactive Dots */}
              {points.map((p, i) => (
                <g key={i}>
                  {/* Invisible larger hover target */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="8" 
                    fill="transparent" 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint(p.data)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Visible point */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredPoint?.index === p.data.index ? "4" : "2.5"} 
                    fill={hoveredPoint?.index === p.data.index ? "#ffffff" : "var(--accent-blue)"} 
                    stroke="var(--accent-blue)"
                    strokeWidth={hoveredPoint?.index === p.data.index ? "2" : "0"}
                    style={{ transition: 'all 0.15s ease' }}
                  />
                </g>
              ))}
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#8c8c8a', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <span>Hover points for detail values</span>
            <span>2026 Audit Journal</span>
          </div>
        </div>

        {/* Approved vs Flagged Bar Chart (spans 3) */}
        <div className="bento-span-3 clay-card" style={{
          minHeight: '340px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          position: 'relative'
        }}>
          <div>
            <div className="flex-between">
              <span style={{ fontSize: '11px', color: '#8c8c8a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Ledger Metrics
              </span>
              {selectedStatus !== 'ALL' && (
                <span 
                  onClick={() => setSelectedStatus('ALL')}
                  style={{ fontSize: '10px', color: 'var(--color-brand)', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}
                >
                  Clear Status <X size={10} />
                </span>
              )}
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>Approved vs Flagged</h4>
          </div>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', justifyContent: 'center', height: '140px', paddingBottom: '10px' }}>
            {/* Approved Bar */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                opacity: selectedStatus === 'Flagged' ? 0.35 : 1,
                transition: 'all 0.2s ease',
                transform: selectedStatus === 'Approved' ? 'scale(1.05)' : 'none'
              }}
              onClick={() => setSelectedStatus(selectedStatus === 'Approved' ? 'ALL' : 'Approved')}
              title="Click to filter by Approved"
            >
              <div 
                style={{ 
                  width: '32px', 
                  height: `${(approvedCount / (Math.max(approvedCount, flaggedCount) || 1)) * 100}px`, 
                  minHeight: '12px',
                  backgroundColor: selectedStatus === 'Approved' ? 'var(--accent-emerald)' : 'var(--accent-emerald-border)', 
                  borderRadius: '6px',
                  border: selectedStatus === 'Approved' ? '2.5px solid var(--accent-emerald)' : 'none',
                  boxShadow: selectedStatus === 'Approved' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'height 0.4s ease'
                }} 
              />
              <span style={{ fontSize: '11px', color: selectedStatus === 'Approved' ? 'var(--accent-emerald)' : '#8c8c8a', fontWeight: selectedStatus === 'Approved' ? '700' : '600' }}>
                Approved ({approvedCount})
              </span>
            </div>

            {/* Flagged Bar */}
            <div 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                opacity: selectedStatus === 'Approved' ? 0.35 : 1,
                transition: 'all 0.2s ease',
                transform: selectedStatus === 'Flagged' ? 'scale(1.05)' : 'none'
              }}
              onClick={() => setSelectedStatus(selectedStatus === 'Flagged' ? 'ALL' : 'Flagged')}
              title="Click to filter by Flagged"
            >
              <div 
                style={{ 
                  width: '32px', 
                  height: `${(flaggedCount / (Math.max(approvedCount, flaggedCount) || 1)) * 100}px`, 
                  minHeight: '12px',
                  backgroundColor: selectedStatus === 'Flagged' ? 'var(--accent-rose)' : 'var(--accent-rose-border)', 
                  borderRadius: '6px',
                  position: 'relative',
                  border: selectedStatus === 'Flagged' ? '2.5px solid var(--accent-rose)' : 'none',
                  boxShadow: selectedStatus === 'Flagged' ? '0 0 10px rgba(244, 63, 94, 0.4)' : 'none',
                  transition: 'height 0.4s ease'
                }}
              >
                <span style={{
                  position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
                  backgroundColor: 'var(--accent-rose)', color: '#ffffff', fontSize: '9px', fontWeight: '800',
                  padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap',
                  border: '1px solid var(--accent-rose-border)',
                  boxShadow: '0 2px 6px rgba(244, 63, 94, 0.2)'
                }}>
                  Flagged ({flaggedCount})
                </span>
              </div>
              <span style={{ fontSize: '11px', color: selectedStatus === 'Flagged' ? 'var(--accent-rose)' : 'var(--text-primary)', fontWeight: '700' }}>
                Flagged
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '11.5px', color: '#8c8c8a', lineHeight: 1.3 }}>
            High volume deviations account for {anomalyPercent}% of ledger files.
          </div>
        </div>

        {/* Auditor Load progress (spans 3) */}
        <div 
          className="bento-span-3 clay-card" 
          style={{
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
            position: 'relative'
          }}
          onMouseEnter={() => setHoveredWorkload(true)}
          onMouseLeave={() => setHoveredWorkload(false)}
        >
          <div>
            <span style={{ fontSize: '11px', color: '#8c8c8a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Auditor Workload
            </span>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>Load Balance</h4>
          </div>

          {/* Workload Hover Overlay details */}
          {hoveredWorkload && (
            <div style={{
              position: 'absolute',
              bottom: '80px',
              right: '16px',
              left: '16px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              padding: '16px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              zIndex: 10,
              textAlign: 'left'
            }}>
              <h5 style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px', letterSpacing: '0.04em' }}>
                Auditor Load Matrix
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {specialists.slice(0, 4).map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.name}</span>
                      <span style={{ fontSize: '8.5px', color: '#8c8c8a', whiteSpace: 'nowrap', overflow: 'hidden', textWidth: '100px', textOverflow: 'ellipsis' }}>{s.specialty}</span>
                    </div>
                    <span 
                      className={`badge badge-${s.status === 'Busy' ? 'danger' : 'success'}`} 
                      style={{ fontSize: '9px', padding: '1px 6px', height: '18px', display: 'inline-flex', alignItems: 'center', fontWeight: '700' }}
                    >
                      {s.assignedFiles.length} files
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', margin: '12px 0', cursor: 'help' }} title="Hover card to view allocation breakdown">
            <svg width="72" height="72">
              <circle cx="36" cy="36" r="30" stroke="var(--border-color)" strokeWidth="5" fill="transparent" />
              <circle 
                cx="36" 
                cy="36" 
                r="30" 
                stroke="var(--accent-purple)" 
                strokeWidth="5" 
                fill="transparent"
                strokeDasharray={2 * Math.PI * 30} 
                strokeDashoffset={2 * Math.PI * 30 * (1 - specLoadPercent / 100)} 
                strokeLinecap="round" 
                transform="rotate(-90 36 36)" 
                style={{ filter: 'drop-shadow(0 0 4px var(--accent-purple))' }}
              />
            </svg>
            <div>
              <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{specLoadPercent}%</span>
              <span style={{ fontSize: '10px', color: '#8c8c8a', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>Active Load</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('assignor')}
            style={{ 
              width: '100%', 
              fontSize: '12px', 
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              fontWeight: '700',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)'
            }}
          >
            Manage Assignments
          </button>
        </div>

        {/* ─── ROW 5: SCANNER HARDWARE INFRA LEDs (Forensic Hardware Scan Core Info) ─── */}
        <div className="bento-span-12 clay-card" style={{ 
          background: 'var(--bg-app)',
          padding: '18px 24px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Cpu size={16} style={{ color: 'var(--color-brand)' }} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Forensic Scanner Subsystems
            </span>
            <div style={{ height: '14px', width: '1px', backgroundColor: 'var(--border-color)' }} className="hide-mobile" />
            <span style={{ fontSize: '11px', color: '#8c8c8a' }}>
              Baseline Sync: 99.98% operational · Verification memory buffers un-fragmented
            </span>
            
            <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              {[
                { label: 'LEDGER SYNC', led: 'led-green' },
                { label: 'ANOMALY SEARCH', led: flaggedCount > 0 ? 'led-amber' : 'led-green' },
                { label: 'WIRE TRACE MAP', led: 'led-info' }
              ].map(({ label, led }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div className={`led-indicator ${led}`} />
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-secondary)', fontFamily: 'var(--mono)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
