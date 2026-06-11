import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Network, 
  Activity, 
  AlertTriangle, 
  HelpCircle,
  Play,
  Building2,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  FileText,
  GitBranch,
  RotateCcw,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { Graph } from '../utils/Graph';
import SkeletonBlock from '../components/SkeletonBlock';

export default function MoneyMovement({ transactions }) {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'map'; // map | finder

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Construct custom Graph structure from transaction routing histories
  const routingGraph = new Graph();
  transactions.forEach(t => {
    t.routingPath.forEach(node => routingGraph.addNode(node));
    for (let i = 0; i < t.routingPath.length - 1; i++) {
      routingGraph.addEdge(t.routingPath[i], t.routingPath[i+1], t.amount);     // forward
      routingGraph.addEdge(t.routingPath[i+1], t.routingPath[i], t.amount);     // reverse (bidirectional)
    }
  });

  const [selectedTxnId, setSelectedTxnId] = useState(transactions[2].id);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [isTracing, setIsTracing] = useState(false);
  const [tracedPathStep, setTracedPathStep] = useState(-1);
  const [errorNodeIndex, setErrorNodeIndex] = useState(-1);
  const [traceReport, setTraceReport] = useState(null);

  // ── BFS PathFinder state ──
  const allNodes = Array.from(routingGraph.getAdjacencyList().keys()).sort();
  const [bfsSource, setBfsSource] = useState('Chase Bank (US)');
  const [bfsTarget, setBfsTarget] = useState('Zurich Safe Harbor (CH)');
  const [bfsResult, setBfsResult] = useState(null);
  const [bfsVisited, setBfsVisited] = useState(new Set());
  const [bfsActive, setBfsActive] = useState(null);
  const [bfsRunning, setBfsRunning] = useState(false);
  const [bfsError, setBfsError] = useState(false);
  const bfsIntervalRef = useRef(null);

  const activeTxn = transactions.find(t => t.id === selectedTxnId) || transactions[0];
  const pathNodes = activeTxn.routingPath;

  const institutionDb = {
    "Chase Bank (US)": { code: "CHASUS33", region: "New York, USA", type: "Clearing House Bank", integrity: "99.9% Secure", speed: "Instant (<1m)", status: "PASSED" },
    "Wells Fargo (US)": { code: "WELIUS44", region: "San Francisco, USA", type: "Commercial Account", integrity: "99.8% Secure", speed: "Fast (<5m)", status: "PASSED" },
    "BuildCorp Escrow (US)": { code: "BCRPUS11", region: "Chicago, USA", type: "Escrow Sub-account", integrity: "99.9% Secure", speed: "Medium (<30m)", status: "PASSED" },
    "Barclays (UK)": { code: "BARCGB22", region: "London, UK", type: "International Hub", integrity: "99.8% Secure", speed: "Fast (<5m)", status: "PASSED" },
    "HSBC Hong Kong (HK)": { code: "HSBCHKHH", region: "Hong Kong, HK", type: "Overseas Trust Bank", integrity: "99.6% Secure", speed: "Medium (<15m)", status: "PASSED" },
    "AdMedia Agency (HK)": { code: "ADMAHK01", region: "Hong Kong, HK", type: "Vendor Commercial Account", integrity: "99.5% Secure", speed: "Slow (<2h)", status: "PASSED" },
    "Cayman Islands Trust (KY)": { code: "CAYMKY88", region: "Grand Cayman, Cayman Islands", type: "Offshore Shell Account", integrity: "42.0% Risk Flagged", speed: "Delayed (>12h)", status: "SUSPICIOUS" },
    "Zurich Safe Harbor (CH)": { code: "ZURICHCH99", region: "Zurich, Switzerland", type: "Unlisted Private Trust", integrity: "55.0% Unverified", speed: "Delayed (>24h)", status: "HOLD" },
    "CitiBank (US)": { code: "CITIUS33", region: "New York, USA", type: "Clearing House Bank", integrity: "99.9% Secure", speed: "Instant (<1m)", status: "PASSED" },
    "Deutsche Bank (DE)": { code: "DEUTDEFF", region: "Frankfurt, Germany", type: "Correspondent Bank", integrity: "99.7% Secure", speed: "Fast (<5m)", status: "PASSED" },
    "Alpine Lux Chalet (FR)": { code: "CHALETFR", region: "Chamonix, France", type: "Unregulated Retail Account", integrity: "80.0% Non-Commercial", speed: "Delayed (>12h)", status: "FLAGGED" },
    "Apex Tech Supply (US)": { code: "APEXTECH", region: "Austin, USA", type: "Vendor Account", integrity: "99.8% Secure", speed: "Medium (<15m)", status: "PASSED" },
    "Sullivan & Cromwell Escrow (US)": { code: "SCESCRW1", region: "New York, USA", type: "Escrow Sub-account", integrity: "99.9% Secure", speed: "Medium (<30m)", status: "PASSED" },
    "Salesforce Ltd (US)": { code: "CRMTECH1", region: "San Francisco, USA", type: "Corporate Account", integrity: "99.9% Secure", speed: "Instant (<1m)", status: "PASSED" },
    "Cyprus Commercial (CY)": { code: "CYPRCY77", region: "Nicosia, Cyprus", type: "Intermediary Shell Account", integrity: "38.0% Suspicious Link", speed: "Delayed (>6h)", status: "HOLD" },
    "Panama Holdings (PA)": { code: "PANAPA44", region: "Panama City, Panama", type: "Unlisted Off-shore Entity", integrity: "30.0% Critical Alert", speed: "Delayed (>24h)", status: "FLAGGED" },
    "SuperMicro Inc (US)": { code: "SMCIUSAA", region: "San Jose, USA", type: "Corporate Supplier", integrity: "99.9% Secure", speed: "Fast (<5m)", status: "PASSED" },
    "Vaduz Private Bank (LI)": { code: "VADUZLI2", region: "Vaduz, Liechtenstein", type: "Offshore Asset Manager", integrity: "48.0% Disclosed Check Required", speed: "Delayed (>12h)", status: "FLAGGED" },
    "Vanguard Properties (US)": { code: "VANGPROP", region: "Boston, USA", type: "Commercial Landlord", integrity: "99.9% Secure", speed: "Fast (<5m)", status: "PASSED" }
  };

  useEffect(() => {
    setIsTracing(false);
    setTracedPathStep(-1);
    setErrorNodeIndex(-1);
    setTraceReport(null);
    setSelectedNode(null);
  }, [selectedTxnId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const startProblemFinder = () => {
    setIsTracing(true);
    setTracedPathStep(-1);
    setErrorNodeIndex(-1);
    setTraceReport(null);
    setSelectedNode(null);

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < pathNodes.length) {
        setTracedPathStep(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        let errorIndex = -1;
        let report = "";
        
        if (activeTxn.id === "TXN-3304-C") {
          errorIndex = 1;
          report = "ALERT: Cayman Islands Trust (KY) failed to produce a valid corporate invoice reference. Transfer deviates from normal legal fee schedules (+400% deviation).";
        } else if (activeTxn.id === "TXN-4890-D") {
          errorIndex = 2;
          report = "ALERT: Alpine Lux Chalet (FR) is registered as a personal lodging node, violating corporate retreat limits ($18.2k retreat vs $1.2k standard).";
        } else if (activeTxn.id === "TXN-5511-E") {
          errorIndex = 1;
          report = "ALERT: Wells Fargo commercial receiver reports duplicate invoice entries under tracking Apex Tech Supply. System flagged double-billing error.";
        } else if (activeTxn.id === "TXN-8812-H") {
          errorIndex = 2;
          report = "ALERT: Money routed through Cyprus Commercial, landing in Panama Holdings (PA). The recipient entity is marked as an unlisted offshore beneficiary.";
        } else if (activeTxn.id === "TXN-1011-J") {
          errorIndex = 1;
          report = "ALERT: Vaduz Private Bank (LI) routed an unauthorized bonus payout ($80k vs $5k budget) to a Liechtenstein asset manager check mismatch.";
        } else {
          errorIndex = -2;
          report = "VERIFIED: Money path contains clean certified routing codes. No anomalous deviations or leaks found.";
        }

        setErrorNodeIndex(errorIndex);
        setTraceReport(report);
        setIsTracing(false);
      }
    }, 450);
  };

  const runBFSPathfinder = () => {
    if (!bfsSource || !bfsTarget || bfsSource === bfsTarget) return;
    if (bfsIntervalRef.current) clearInterval(bfsIntervalRef.current);
    setBfsResult(null);
    setBfsVisited(new Set());
    setBfsActive(null);
    setBfsRunning(true);
    setBfsError(false);

    const result = routingGraph.bfs(bfsSource, bfsTarget);
    let step = 0;

    bfsIntervalRef.current = setInterval(() => {
      if (step < result.visitedOrder.length) {
        const node = result.visitedOrder[step];
        setBfsActive(node);
        setBfsVisited(prev => new Set([...prev, node]));
        step++;
      } else {
        clearInterval(bfsIntervalRef.current);
        setBfsActive(null);
        setBfsRunning(false);
        setBfsResult(result);
        setBfsError(result.path === null);
      }
    }, 420);
  };

  const resetBFS = () => {
    if (bfsIntervalRef.current) clearInterval(bfsIntervalRef.current);
    setBfsResult(null);
    setBfsVisited(new Set());
    setBfsActive(null);
    setBfsRunning(false);
    setBfsError(false);
    setBfsSource('');
    setBfsTarget('');
  };

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <SkeletonBlock height="40px" width="300px" />
          <SkeletonBlock height="40px" width="160px" />
        </div>
        <div className="clay-card"><SkeletonBlock height="300px" width="100%" /></div>
      </div>
    );
  }

  return (
    <div className="fade-in animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* ── Tabs Navigation ── */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'map', label: 'Network Map', activeBg: 'var(--accent-blue)', shadow: '0 4px 10px rgba(14, 165, 233, 0.2)' },
            { id: 'finder', label: 'Path Finder', activeBg: 'var(--accent-indigo)', shadow: '0 4px 10px rgba(99, 102, 241, 0.2)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                border: 'none',
                background: currentTab === tab.id ? tab.activeBg : 'transparent',
                color: currentTab === tab.id ? 'var(--bg-app)' : 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: currentTab === tab.id ? tab.shadow : 'none',
                transition: 'all 0.2s ease',
                transform: 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Network size={16} style={{ color: 'var(--accent-blue)' }} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Routing Graph Subsystem
            </span>
          </div>
          <h2 style={{ fontSize: '36px', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: '400', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
            Money Movement Map
          </h2>
        </div>
      </div>

      {/* ── TAB VIEW 1: NETWORK MAP ── */}
      {currentTab === 'map' && (
        <div className="layout-split-movement fade-in" style={{ gap: '24px' }}>
          
          {/* SVG Map Canvas */}
          <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '480px', borderRadius: '32px' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={18} style={{ color: 'var(--color-brand)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Wire Transfer Route Map</h3>
              </div>

              <div 
                ref={dropdownRef} 
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Audit File:</span>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      width: '200px',
                      height: '38px',
                      padding: '0 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: 'var(--shadow-sm)',
                      transform: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: activeTxn.status === 'Flagged' ? 'var(--color-danger)' : 'var(--accent-emerald)',
                          boxShadow: activeTxn.status === 'Flagged' ? '0 0 8px var(--color-danger)' : '0 0 8px var(--accent-emerald)'
                        }}
                      />
                      <span style={{ fontFamily: 'var(--mono)' }}>{selectedTxnId}</span>
                    </div>
                    <ChevronRight 
                      size={15} 
                      style={{ 
                        transform: isDropdownOpen ? 'rotate(-90deg)' : 'rotate(90deg)', 
                        transition: 'transform 0.25s ease',
                        color: 'var(--text-muted)'
                      }} 
                    />
                  </button>
                </div>

                {isDropdownOpen && (
                  <div 
                    className="custom-dropdown-overlay animate-scale-in"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '44px',
                      width: '280px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100,
                      overflow: 'hidden',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {transactions.map((t) => {
                        const isSelected = t.id === selectedTxnId;
                        const isFlagged = t.status === 'Flagged';
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              setSelectedTxnId(t.id);
                              setIsDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px 16px',
                              border: 'none',
                              background: isSelected ? 'var(--color-brand-light)' : 'transparent',
                              borderBottom: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                              transition: 'all 0.15s ease'
                            }}
                            className="dropdown-item-hover"
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span 
                                style={{ 
                                  fontFamily: 'var(--mono)', 
                                  fontWeight: '800', 
                                  fontSize: '12.5px',
                                  color: isSelected ? 'var(--color-brand)' : 'var(--text-primary)' 
                                }}
                              >
                                {t.id}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--mono)' }}>
                                ${t.amount.toLocaleString()}
                              </span>
                            </div>
                            <span 
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '10px',
                                fontWeight: '800',
                                padding: '3px 8px',
                                borderRadius: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                backgroundColor: isFlagged ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                                color: isFlagged ? 'var(--color-danger)' : 'var(--color-success)',
                                border: `1px solid ${isFlagged ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`
                              }}
                            >
                              {isFlagged ? 'Flagged' : 'Passed'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="map-container" style={{ position: 'relative', height: '280px', borderRadius: '24px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              {/* Dot Grid Background */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--border-color) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }} />

              {/* SVG Lines */}
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <defs>
                  <marker id="arrow-gray" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4d4d8" />
                  </marker>
                  <marker id="arrow-blue" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent-blue)" />
                  </marker>
                  <marker id="arrow-red" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-danger)" />
                  </marker>
                </defs>

                {pathNodes.map((node, i) => {
                  if (i === pathNodes.length - 1) return null;
                  const x1 = `${15 + i * (70 / (pathNodes.length - 1))}%`;
                  const y1 = '40%';
                  const x2 = `${15 + (i + 1) * (70 / (pathNodes.length - 1))}%`;
                  const y2 = '40%';

                  const isLineTraced = tracedPathStep >= i;
                  const isLineAnomalous = errorNodeIndex > -1 && i >= errorNodeIndex;

                  return (
                    <React.Fragment key={`lines-group-${i}`}>
                      <line 
                        x1={x1} y1={y1} x2={x2} y2={y2} 
                        stroke="#d4d4d8" strokeWidth="2.5" strokeDasharray="6 6"
                        markerEnd="url(#arrow-gray)"
                      />
                      {isLineTraced && (
                        <line 
                          x1={x1} y1={y1} x2={x2} y2={y2} 
                          stroke={isLineAnomalous ? 'var(--color-danger)' : 'var(--accent-blue)'} 
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeDasharray="12 24"
                          markerEnd={isLineAnomalous ? "url(#arrow-red)" : "url(#arrow-blue)"}
                          style={{
                            animation: isLineAnomalous ? 'laser-flow-alert 0.8s linear infinite' : 'laser-flow 1.5s linear infinite',
                            transition: 'stroke 0.25s ease'
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </svg>

              {/* HTML Custom Nodes */}
              {pathNodes.map((node, i) => {
                const percentX = 15 + i * (70 / (pathNodes.length - 1));
                const isCurrentTrace = tracedPathStep === i;
                const isAnomalous = errorNodeIndex === i;
                const isNodeTraced = tracedPathStep >= i;

                let nodeBg = 'var(--bg-card)';
                let nodeBorder = 'var(--border-color)';
                let iconColor = 'var(--text-muted)';
                let shadow = '0 4px 10px rgba(0,0,0,0.05)';
                let glowClass = '';

                if (isAnomalous) {
                  nodeBorder = 'var(--color-danger)';
                  iconColor = 'var(--color-danger)';
                  glowClass = 'pulse-glow-danger';
                } else if (isNodeTraced) {
                  nodeBorder = 'var(--accent-blue)';
                  iconColor = 'var(--accent-blue)';
                  if (isCurrentTrace) glowClass = 'pulse-glow-info';
                }

                const activeNodeScale = selectedNode === node ? 'scale(1.15)' : 'scale(1)';

                return (
                  <div 
                    key={`html-node-${i}`}
                    style={{
                      position: 'absolute',
                      left: `${percentX}%`,
                      top: '40%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      zIndex: selectedNode === node ? 20 : 10
                    }}
                    onClick={() => setSelectedNode(node)}
                    className="node-group"
                  >
                    <div 
                      style={{
                        padding: '8px 16px',
                        borderRadius: '24px',
                        backgroundColor: nodeBg,
                        border: `2px solid ${nodeBorder}`,
                        boxShadow: shadow,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: activeNodeScale
                      }}
                    >
                      <Building2 size={16} color={iconColor} />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: isAnomalous ? 'var(--color-danger)' : 'var(--text-primary)', letterSpacing: '-0.2px' }}>
                        {node.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              <span style={{ position: 'absolute', bottom: '12px', left: '16px', fontSize: '11px', color: 'var(--text-muted)', zIndex: 5, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '8px' }}>
                * Click nodes above to inspect BIC registration and compliance status.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                  Trace Path Sweep
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Breadth-First Path Tracer
                </span>
              </div>
              <button 
                onClick={startProblemFinder} 
                className="btn-primary" 
                disabled={isTracing}
                style={{ gap: '6px' }}
              >
                <Play size={14} fill="white" />
                <span>Run Routing Anomaly Trace</span>
              </button>
            </div>
          </div>

          {/* Right sidebar details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Swift passport */}
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} style={{ color: 'var(--color-brand)' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Node Inspector</h3>
              </div>

              {selectedNode && institutionDb[selectedNode] ? (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    SWIFT CLEARING RECORD
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '12.5px' }}>
                    <div className="flex-between">
                      <span style={{ color: 'var(--text-muted)' }}>Institution:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{selectedNode}</strong>
                    </div>
                    <div className="flex-between">
                      <span style={{ color: 'var(--text-muted)' }}>BIC Code:</span>
                      <strong style={{ fontFamily: 'var(--mono)', color: 'var(--text-secondary)' }}>{institutionDb[selectedNode].code}</strong>
                    </div>
                    <div className="flex-between">
                      <span style={{ color: 'var(--text-muted)' }}>Region:</span>
                      <strong style={{ color: 'var(--text-secondary)' }}>{institutionDb[selectedNode].region}</strong>
                    </div>
                    <div className="flex-between">
                      <span style={{ color: 'var(--text-muted)' }}>Rating:</span>
                      <span className={`badge badge-${
                        institutionDb[selectedNode].status === 'PASSED' ? 'success' : 
                        institutionDb[selectedNode].status === 'HOLD' ? 'warning' : 'danger'
                      }`}>
                        {institutionDb[selectedNode].status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
                  <HelpCircle size={32} style={{ margin: '0 auto 8px', color: 'var(--color-brand)', opacity: 0.5 }} />
                  <p style={{ fontSize: '12px' }}>Click a node on the map to inspect clearings.</p>
                </div>
              )}
            </div>

            {/* Trace results */}
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: '180px', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Trace Log Summary</h3>
              {isTracing && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', gap: '8px' }}>
                  <div className="spinner"></div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tracing path codes...</span>
                </div>
              )}
              {!isTracing && traceReport && (
                <div className="fade-in" style={{
                  padding: '14px', borderRadius: '16px', border: '1px solid',
                  backgroundColor: errorNodeIndex === -2 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                  borderColor: errorNodeIndex === -2 ? 'var(--color-success-border)' : 'var(--color-danger-border)',
                  color: errorNodeIndex === -2 ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: '12.5px', lineHeight: '1.4', fontWeight: '600'
                }}>
                  <strong style={{ display: 'block', marginBottom: '6px' }}>
                    {errorNodeIndex === -2 ? '✓ Path Clearance Passed' : '⚠️ Anomaly Detected'}
                  </strong>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{traceReport}</p>
                </div>
              )}
              {!isTracing && !traceReport && (
                <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  Click "Run Routing Anomaly Trace" to scan transfer packets.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB VIEW 2: BFS PATH FINDER ── */}
      {currentTab === 'finder' && (
        <div className="clay-card fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '32px' }}>
          <div>
            <span className="section-label">WIRE ROUTE TRACER</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>Wire Route Finder — Shortest Transfer Path</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Source Institution</label>
              <select value={bfsSource} onChange={e => { setBfsSource(e.target.value); setBfsResult(null); setBfsVisited(new Set()); setBfsError(false); }}>
                <option value="">— Select source —</option>
                {allNodes.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Target Institution</label>
              <select value={bfsTarget} onChange={e => { setBfsTarget(e.target.value); setBfsResult(null); setBfsVisited(new Set()); setBfsError(false); }}>
                <option value="">— Select target —</option>
                {allNodes.filter(n => n !== bfsSource).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={runBFSPathfinder} 
                className="btn-primary"
                disabled={!bfsSource || !bfsTarget || bfsSource === bfsTarget || bfsRunning}
                style={{ flex: 1, height: '42px', borderRadius: '10px' }}
              >
                <Play size={13} fill="white" />
                <span>{bfsRunning ? 'Tracing...' : 'Trace Path'}</span>
              </button>
              <button 
                onClick={resetBFS} 
                disabled={bfsRunning}
                style={{ height: '42px', borderRadius: '10px', padding: '10px 14px' }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* BFS Steps */}
          {(bfsVisited.size > 0 || bfsRunning) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Queue traversal order:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                {Array.from(bfsVisited).map((node, i) => {
                  const isPath = bfsResult && bfsResult.path && bfsResult.path.includes(node);
                  const isActive = node === bfsActive;
                  return (
                    <div key={node} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${isActive ? 'badge-warning active-pulse' : isPath ? 'badge-success' : 'badge-neutral'}`}>
                        {node.split(' ')[0]}
                      </span>
                      {i < bfsVisited.size - 1 && <ChevronRight size={12} style={{ color: '#d1d5db' }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result Panel */}
          {!bfsRunning && bfsResult && (
            <div className="fade-in">
              {bfsError || bfsResult.path === null ? (
                <div style={{ padding: '16px', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-danger)' }}>
                  <AlertTriangle size={16} />
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>No connection route exists between selected nodes.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: '24px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={15} /> Shortest route established
                  </span>

                  {/* Flow breadcrumbs */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', padding: '14px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--color-success-border)' }}>
                    {bfsResult.path.map((node, i) => (
                      <React.Fragment key={node}>
                        <span style={{ 
                          fontSize: '12px', fontWeight: '800', fontFamily: 'var(--mono)', 
                          color: i === 0 ? 'var(--color-brand)' : i === bfsResult.path.length - 1 ? 'var(--color-success)' : 'var(--text-primary)',
                          padding: '4px 10px', borderRadius: '10px',
                          backgroundColor: i === 0 ? 'var(--color-brand-light)' : i === bfsResult.path.length - 1 ? 'var(--color-success-bg)' : 'var(--bg-app)',
                          border: '1px solid var(--border-color)'
                        }}>
                          {node}
                        </span>
                        {i < bfsResult.path.length - 1 && <ArrowRight size={13} style={{ color: '#d1d5db' }} />}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', fontSize: '13px' }}>
                    {[
                      { label: 'Hops', value: `${bfsResult.hops} hops` },
                      { label: 'Nodes Scanned', value: `${bfsVisited.size} institutions` },
                      { label: 'Total Volume Traversed', value: `$${bfsResult.totalValue.toLocaleString()}` }
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                        <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes moving-dots {
          to { stroke-dashoffset: -20; }
        }

        /* ── Laser Flow Animations ── */
        @keyframes laser-flow {
          to { stroke-dashoffset: -36; }
        }
        @keyframes laser-flow-alert {
          to { stroke-dashoffset: -36; }
        }

        /* ── Pulse Glow Animations ── */
        @keyframes pulse-shadow-danger {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes pulse-shadow-info {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .pulse-glow-danger {
          animation: pulse-shadow-danger 2s infinite;
        }
        .pulse-glow-info {
          animation: pulse-shadow-info 1.5s infinite;
        }

        /* ── Node Group Scale/Bounce/Vibrate ── */
        .node-group {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .node-shake {
          animation: node-shake-anim 0.5s ease-in-out infinite;
        }
        .node-bounce {
          animation: node-bounce-anim 0.7s ease-in-out alternate infinite;
        }

        @keyframes node-shake-anim {
          0%, 100% { transform: rotate(0deg) scale(1.05); }
          25% { transform: rotate(-5deg) scale(1.05); }
          75% { transform: rotate(5deg) scale(1.05); }
        }
        @keyframes node-bounce-anim {
          0% { transform: translateY(0px) scale(1.05); }
          100% { transform: translateY(-5px) scale(1.05); }
        }

        /* ── Path Finder Traversal Active Pulse ── */
        .active-pulse {
          animation: active-badge-pulse 0.8s ease-in-out infinite alternate;
        }
        @keyframes active-badge-pulse {
          from { transform: scale(1); filter: brightness(1); }
          to { transform: scale(1.1); filter: brightness(1.2); box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
        }

        /* ── Custom Dropdown Item Hover & Entry Animation ── */
        .dropdown-item-hover:hover {
          background-color: var(--color-brand-light) !important;
        }
        .animate-scale-in {
          animation: scale-in-anim 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: top right;
        }
        @keyframes scale-in-anim {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
