import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Cpu, 
  Terminal, 
  CheckCircle, 
  FolderOpen,
  ArrowRight,
  UserPlus,
  ArrowLeftRight,
  UserCheck
} from 'lucide-react';
import { Queue } from '../utils/Queue';
import SkeletonBlock from '../components/SkeletonBlock';

export default function TaskAssignor({ transactions, setTransactions, specialists, setSpecialists }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const [assignmentLogs, setAssignmentLogs] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);

  // Specialist Creator Form State
  const [newSpecName, setNewSpecName] = useState('');

  const [newSpecSpecialty, setNewSpecSpecialty] = useState('Legal & Compliance');

  // Manual Reassignment State
  const [reassignTxnId, setReassignTxnId] = useState('');
  const [reassignSpecId, setReassignSpecId] = useState('');

  // Unassigned flagged files
  const unassignedFiles = transactions.filter(
    t => t.status === 'Flagged' && (t.approvedBy === 'Unassigned' || !t.approvedBy)
  );

  // Assigned files list (for manual reassignment)
  const assignedFlaggedFiles = transactions.filter(
    t => t.status === 'Flagged' && t.approvedBy !== 'Unassigned' && t.approvedBy
  );

  // Auto-assignment engine
  const runAutoAssignment = () => {
    if (unassignedFiles.length === 0) {
      setAssignmentLogs(prev => [
        `[INFO] ${new Date().toLocaleTimeString()}: No pending unassigned files in the queue.`,
        ...prev
      ]);
      return;
    }

    setIsAssigning(true);
    let logsToAdd = [];
    let updatedTxns = [...transactions];
    let updatedSpecs = specialists.map(s => ({ ...s, assignedFiles: [...s.assignedFiles] }));

    // Populate standard FIFO queue for dispatching
    const q = new Queue();
    unassignedFiles.forEach(file => q.enqueue(file));

    while (!q.isEmpty()) {
      const file = q.dequeue();
      let bestCandidate = null;
      
      const categoryKeywords = {
        'Legal': ['legal', 'compliance'],
        'Operations': ['operations', 'saas'],
        'Marketing': ['marketing', 'commercial'],
        'Travel': ['travel', 'perks', 'expense'],
        'Capital Outflow': ['capital', 'wire', 'transfer']
      };

      const keywords = categoryKeywords[file.category] || [];

      const scoredSpecs = updatedSpecs.map(spec => {
        let score = 0;
        const specNameLower = spec.specialty.toLowerCase();
        keywords.forEach(kw => {
          if (specNameLower.includes(kw)) score += 10;
        });

        score -= spec.load * 2;
        
        if (spec.status === 'Busy') score -= 5;

        return { spec, score };
      }).sort((a, b) => b.score - a.score);

      if (scoredSpecs.length > 0) {
        bestCandidate = scoredSpecs[0].spec;
      } else {
        let minLoad = Infinity;
        updatedSpecs.forEach(s => {
          if (s.load < minLoad) {
            minLoad = s.load;
            bestCandidate = s;
          }
        });
      }

      if (bestCandidate) {
        const previousLoad = bestCandidate.load;
        bestCandidate.load += 1;
        bestCandidate.assignedFiles.push(file.id);
        
        if (bestCandidate.load >= 4) {
          bestCandidate.status = 'Busy';
        }

        updatedTxns = updatedTxns.map(t => {
          if (t.id === file.id) {
            return { ...t, approvedBy: bestCandidate.name };
          }
          return t;
        });

        logsToAdd.push(
          `[SUCCESS] Assigned ${file.id} (${file.category}) to ${bestCandidate.name} (Load: ${previousLoad} → ${bestCandidate.load}, Match Score: OK)`
        );
      }
    }

    setTimeout(() => {
      setTransactions(updatedTxns);
      setSpecialists(updatedSpecs);
      setAssignmentLogs(prev => [...logsToAdd, ...prev]);
      setIsAssigning(false);
    }, 800);
  };

  // Add new specialist to database
  const handleCreateSpecialist = (e) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;

    const newId = `SPEC-${specialists.length + 1}`;
    const newAuditor = {
      id: newId,
      name: newSpecName.trim(),
      specialty: newSpecSpecialty,
      load: 0,
      status: 'Available',
      assignedFiles: []
    };

    setSpecialists([...specialists, newAuditor]);
    setAssignmentLogs(prev => [
      `[INFO] ${new Date().toLocaleTimeString()}: Registered new auditor ${newSpecName} specializing in ${newSpecSpecialty}`,
      ...prev
    ]);
    
    setNewSpecName('');
  };

  // Manual Reassignment Handler
  const handleManualReassign = (e) => {
    e.preventDefault();
    if (!reassignTxnId || !reassignSpecId) return;

    const targetTxn = transactions.find(t => t.id === reassignTxnId);
    const targetSpec = specialists.find(s => s.id === reassignSpecId);
    
    if (!targetTxn || !targetSpec) return;

    const oldAuditorName = targetTxn.approvedBy;

    // Update specialist databases
    const updatedSpecs = specialists.map(s => {
      // Remove file from previous specialist's list
      if (s.name === oldAuditorName) {
        return {
          ...s,
          load: Math.max(s.load - 1, 0),
          assignedFiles: s.assignedFiles.filter(id => id !== reassignTxnId),
          status: s.load - 1 < 4 ? 'Available' : s.status
        };
      }
      // Add file to new specialist's list
      if (s.id === reassignSpecId) {
        const nextLoad = s.load + 1;
        return {
          ...s,
          load: nextLoad,
          assignedFiles: [...s.assignedFiles, reassignTxnId],
          status: nextLoad >= 4 ? 'Busy' : s.status
        };
      }
      return s;
    });

    // Update transaction approvedBy name
    const updatedTxns = transactions.map(t => {
      if (t.id === reassignTxnId) {
        return { ...t, approvedBy: targetSpec.name };
      }
      return t;
    });

    setTransactions(updatedTxns);
    setSpecialists(updatedSpecs);
    setAssignmentLogs(prev => [
      `[OVERRIDE] ${new Date().toLocaleTimeString()}: Reassigned ${reassignTxnId} from ${oldAuditorName || 'Unassigned'} to ${targetSpec.name}`,
      ...prev
    ]);

    setReassignTxnId('');
    setReassignSpecId('');
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* Title skeleton */}
        <div>
          <SkeletonBlock height="32px" width="380px" />
          <SkeletonBlock height="15px" width="480px" style={{ marginTop: '8px' }} />
        </div>

        {/* Workload Sorter split skeletons */}
        <div className="layout-split-assignor">
          {/* Left Column (Specialists) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="flex-between">
                <SkeletonBlock height="18px" width="180px" />
                <SkeletonBlock height="20px" width="120px" className="rounded-full" />
              </div>
              <div className="grid-specialists">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="specialist-card" style={{ cursor: 'default', gap: '10px' }}>
                    <div className="flex-between">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <SkeletonBlock height="14px" width="80px" />
                        <SkeletonBlock height="10px" width="100px" />
                      </div>
                      <SkeletonBlock height="14px" width="50px" className="rounded-full" />
                    </div>
                    <SkeletonBlock height="8px" width="100%" />
                    <SkeletonBlock height="10px" width="60px" style={{ marginTop: '4px' }} />
                  </div>
                ))}
              </div>
            </div>
            {/* Override board */}
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SkeletonBlock height="18px" width="180px" />
              <SkeletonBlock height="12px" width="300px" />
              <div style={{ display: 'flex', gap: '12px' }}>
                <SkeletonBlock height="38px" width="100%" />
                <SkeletonBlock height="38px" width="100%" />
                <SkeletonBlock height="38px" width="100%" />
              </div>
            </div>
          </div>

          {/* Right Column (Dispatch, Creator, Console) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Dispatch queue */}
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-between">
                <SkeletonBlock height="18px" width="140px" />
                <SkeletonBlock height="20px" width="80px" className="rounded-full" />
              </div>
              <SkeletonBlock height="12px" width="220px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                <SkeletonBlock height="32px" width="100%" />
                <SkeletonBlock height="32px" width="100%" />
              </div>
              <SkeletonBlock height="40px" width="100%" style={{ marginTop: '10px' }} />
            </div>

            {/* Creator Card */}
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SkeletonBlock height="18px" width="160px" />
              <SkeletonBlock height="38px" width="100%" />
              <SkeletonBlock height="38px" width="100%" />
              <SkeletonBlock height="40px" width="100%" style={{ marginTop: '10px' }} />
            </div>

            {/* Console monitor */}
            <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-brand-light)', border: '1px solid var(--sage-300)' }}>
              <SkeletonBlock height="14px" width="140px" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height: '140px', justifyContent: 'center', alignItems: 'center' }}>
                <SkeletonBlock height="10px" width="120px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Title */}
      <div className="animate-slide-up delay-1">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Users size={16} style={{ color: 'var(--accent-blue)' }} />
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Compliance & Operations
          </span>
        </div>
        <h2 style={{ fontSize: '36px', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: '400', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
          Compliance Task Assignor
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          Queue manager dispatching audit logs, registering new compliance specialists, and reallocating workloads.
        </p>
      </div>

      <div className="layout-split-assignor">
        
        {/* Left Column: Specialists Workload Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="clay-card animate-slide-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} style={{ color: 'var(--accent-blue)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Compliance Specialists</h3>
              </div>
              <span className="badge badge-info" style={{ backgroundColor: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', borderColor: 'var(--accent-blue-border)' }}>
                {specialists.length} Active Auditors
              </span>
            </div>

            {/* Specialist Cards */}
            <div className="grid-specialists">
              {specialists.map((spec) => {
                const maxLoad = 5;
                const loadPercent = Math.min((spec.load / maxLoad) * 100, 100);
                
                let loadColor = 'var(--color-success)';
                let progressStyle = { background: 'linear-gradient(90deg, #10b981, #34d399)' };
                if (spec.load >= 4) {
                  loadColor = 'var(--color-danger)';
                  progressStyle = { background: 'linear-gradient(90deg, #dc2626, #f87171)' };
                } else if (spec.load >= 2) {
                  loadColor = 'var(--accent-blue)';
                  progressStyle = { background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-indigo))' };
                }

                return (
                  <div 
                    key={spec.id} 
                    className="specialist-card"
                  >
                    <div className="flex-between">
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{spec.name}</h4>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{spec.specialty}</span>
                      </div>
                      <span className={`badge ${spec.status === 'Available' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '9px' }}>
                        {spec.status}
                      </span>
                    </div>

                    {/* Progress Capacity bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className="flex-between" style={{ fontSize: '11px' }}>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Workload Capacity</span>
                        <strong style={{ color: loadColor }}>{spec.load} / {maxLoad} Files</strong>
                      </div>
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${loadPercent}%`, ...progressStyle }}
                        ></div>
                      </div>
                    </div>

                    {/* Files List */}
                    <div style={{ borderTop: '1px solid rgba(163, 177, 198, 0.15)', paddingTop: '8px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Assigned Audit Keys:</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {spec.assignedFiles.map(fileId => (
                          <span 
                            key={fileId} 
                            className="text-mono" 
                            style={{ 
                              fontSize: '10px', 
                              backgroundColor: 'var(--accent-blue-bg)', 
                              color: 'var(--accent-blue)', 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              fontWeight: '800',
                              border: '1px solid var(--accent-blue-border)'
                            }}
                          >
                            {fileId}
                          </span>
                        ))}
                        {spec.assignedFiles.length === 0 && (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No active files</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NEW FEATURE: Manual Override Reassignment Panel */}
          {assignedFlaggedFiles.length > 0 && (
            <div className="clay-card animate-slide-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ArrowLeftRight size={20} style={{ color: 'var(--accent-indigo)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Manual File Override Board</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-8px' }}>
                Manually shift a flagged file from its current investigator to another compliance officer.
              </p>

              <form onSubmit={handleManualReassign} className="reassign-form-mobile">
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Select Audit Key</span>
                  <select 
                    value={reassignTxnId} 
                    onChange={(e) => setReassignTxnId(e.target.value)}
                    style={{ marginTop: '4px' }}
                  >
                    <option value="">-- Choose File Code --</option>
                    {assignedFlaggedFiles.map(t => (
                      <option key={t.id} value={t.id}>{t.id} (Under {t.approvedBy})</option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: '180px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>New Investigator</span>
                  <select 
                    value={reassignSpecId} 
                    onChange={(e) => setReassignSpecId(e.target.value)}
                    style={{ marginTop: '4px' }}
                  >
                    <option value="">-- Choose Specialist --</option>
                    {specialists.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Load: {s.load}/5)</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={!reassignTxnId || !reassignSpecId}
                  style={{ alignSelf: 'flex-end', height: '40px', minWidth: '120px' }}
                >
                  Reassign File
                </button>
              </form>
            </div>
          )}

          {/* Allocation Logs Console (Moved from Right to Left for better height balance) */}
          <div className="clay-card animate-slide-up delay-4" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px', 
            background: 'var(--color-brand-light)', 
            border: '1px solid var(--sage-300)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              <Terminal size={16} style={{ color: 'var(--color-brand)' }} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>INTELLIGENT SCHEDULER MONITOR</span>
            </div>

            <div style={{ 
              height: '140px', 
              overflowY: 'auto', 
              fontFamily: 'var(--mono)', 
              fontSize: '11px', 
              color: 'var(--text-secondary)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              lineHeight: '1.4'
            }}>
              {assignmentLogs.map((log, idx) => {
                let color = 'var(--text-secondary)';
                if (log.type === 'register') color = 'var(--color-success)';
                if (log.type === 'error') color = 'var(--color-danger)';
                if (log.includes('[SUCCESS]')) color = 'var(--color-success)';
                else if (log.includes('[OVERRIDE]')) color = 'var(--color-warning)';
                else if (log.includes('[INFO]')) color = 'var(--color-brand)';

                return (
                  <div key={idx} style={{ color }}>
                    {log}
                  </div>
                );
              })}
              {assignmentLogs.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', paddingTop: '40px' }}>
                  Awaiting dispatch triggers...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Unassigned Queue, Creator & CRT Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Dispatch Panel */}
          <div className="clay-card animate-slide-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FolderOpen style={{ color: 'var(--accent-amber)' }} size={20} />
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Unassigned Queue</h3>
              </div>
              <span className="badge badge-warning" style={{ backgroundColor: 'var(--accent-amber-bg)', color: 'var(--accent-amber)', borderColor: 'var(--accent-amber-border)' }}>
                {unassignedFiles.length} Pending
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '-8px' }}>
              Financial files flagged for review that require compliance officer assignment.
            </p>

            {/* List of unassigned files */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxH: '180px', overflowY: 'auto' }}>
              {unassignedFiles.map(file => (
                <div 
                  key={file.id} 
                  className="unassigned-file-item"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span className="text-mono" style={{ fontWeight: '800', fontSize: '12px', color: 'var(--text-primary)' }}>{file.id}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{file.category} · ${file.amount.toLocaleString()}</span>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--color-brand)' }} />
                </div>
              ))}
              {unassignedFiles.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 0', border: '2px dashed #cbd5e1', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                  <CheckCircle size={24} style={{ color: 'var(--color-success)', margin: '0 auto 8px', opacity: '0.6' }} />
                  <p style={{ fontSize: '12px', fontWeight: '700' }}>All flagged cases assigned</p>
                </div>
              )}
            </div>

            {/* Dispatch Action */}
            <button 
              onClick={runAutoAssignment}
              className="btn-primary"
              disabled={isAssigning || unassignedFiles.length === 0}
              style={{ width: '100%', gap: '6px', height: '42px', marginTop: '6px' }}
            >
              <Cpu size={16} />
              <span>{isAssigning ? 'Scheduling...' : 'Auto-Assign Pending Files'}</span>
            </button>
          </div>

          {/* NEW FEATURE: Add Specialist Registration Form */}
          <div className="clay-card animate-slide-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserPlus size={20} style={{ color: 'var(--accent-emerald)' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Register Auditor Card</h3>
            </div>

            <form onSubmit={handleCreateSpecialist} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Officer Name</span>
                <input 
                  type="text" 
                  placeholder="Officer Name..."
                  value={newSpecName}
                  onChange={(e) => setNewSpecName(e.target.value)}
                  style={{ marginTop: '4px' }}
                  required
                />
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Department Specialty</span>
                <select 
                  value={newSpecSpecialty} 
                  onChange={(e) => setNewSpecSpecialty(e.target.value)}
                  style={{ marginTop: '4px' }}
                >
                  <option value="Legal & Compliance">Legal & Compliance</option>
                  <option value="Operations & SaaS">Operations & SaaS</option>
                  <option value="Capital Transfers & Wire Audits">Capital Transfers & Wire Audits</option>
                  <option value="High Risk Travel & Perks">High Risk Travel & Perks</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ height: '40px', gap: '6px' }}
              >
                <UserCheck size={15} />
                <span>Add Officer to Roster</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
