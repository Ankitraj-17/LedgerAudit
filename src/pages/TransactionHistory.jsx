import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Edit2, 
  Undo2, 
  Check, 
  X, 
  Calendar, 
  Folder, 
  ArrowUpDown,
  History,
  FileCheck2,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Hash,
  Zap,
  Database,
  AlertCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { officialCodeDirectory } from '../utils/mockData';
import { SinglyLinkedList } from '../utils/LinkedList';
import { HashMap } from '../utils/HashMap';
import { Stack } from '../utils/Stack';
import SkeletonBlock from '../components/SkeletonBlock';

const getCategoryColor = (category) => {
  switch (category) {
    case 'Operations':
      return {
        bg: 'var(--accent-emerald-bg)',
        border: 'var(--accent-emerald-border)',
        text: 'var(--accent-emerald)'
      };
    case 'Marketing':
      return {
        bg: 'var(--accent-cyan-bg)',
        border: 'var(--accent-cyan-border)',
        text: 'var(--accent-cyan)'
      };
    case 'Legal':
      return {
        bg: 'var(--accent-indigo-bg)',
        border: 'var(--accent-indigo-border)',
        text: 'var(--accent-indigo)'
      };
    case 'Travel':
      return {
        bg: 'var(--accent-rose-bg)',
        border: 'var(--accent-rose-border)',
        text: 'var(--accent-rose)'
      };
    default:
      return {
        bg: 'var(--bg-app)',
        border: 'var(--border-color)',
        text: 'var(--text-secondary)'
      };
  }
};

export default function TransactionHistory({ 
  transactions, 
  setTransactions, 
  undoLog, 
  setUndoLog,
  vaultSealed,
  setVaultSealed
}) {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Add Transaction Form State
  const [newCode, setNewCode] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Operations');
  const [newStatus, setNewStatus] = useState('Approved');
  const [newAuditor, setNewAuditor] = useState('Sarah Jenkins');
  const [newRoutingPath, setNewRoutingPath] = useState('Chase Bank (US)');
  const [newDescription, setNewDescription] = useState('');

  const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randLetter = letters[Math.floor(Math.random() * letters.length)];
    const randNum = Math.floor(Math.random() * 9000 + 1000);
    return `TXN-${randNum}-${randLetter}`;
  };

  useEffect(() => {
    setNewCode(generateRandomCode());
  }, []);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (vaultSealed) { triggerLockAlert(); return; }
    
    const parsedAmount = parseFloat(newAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const pathArray = newRoutingPath
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    if (editingId) {
      // ── EDIT MODE ──
      const originalTxn = transactions.find(t => t.id === editingId);
      if (!originalTxn) return;

      const changes = [];
      if (originalTxn.amount !== parsedAmount) {
        changes.push({
          field: 'amount',
          oldValue: originalTxn.amount,
          newValue: parsedAmount,
          msg: `amount from $${originalTxn.amount.toLocaleString()} to $${parsedAmount.toLocaleString()}`
        });
      }
      if (originalTxn.description !== newDescription.trim()) {
        changes.push({
          field: 'description',
          oldValue: originalTxn.description,
          newValue: newDescription.trim(),
          msg: `description from "${originalTxn.description}" to "${newDescription.trim()}"`
        });
      }
      if (originalTxn.category !== newCategory) {
        changes.push({
          field: 'category',
          oldValue: originalTxn.category,
          newValue: newCategory,
          msg: `department from ${originalTxn.category} to ${newCategory}`
        });
      }
      if (originalTxn.status !== newStatus) {
        changes.push({
          field: 'status',
          oldValue: originalTxn.status,
          newValue: newStatus,
          msg: `status from ${originalTxn.status} to ${newStatus}`
        });
      }
      const targetAuditor = newStatus === 'Flagged' ? 'Unassigned' : newAuditor;
      if (originalTxn.approvedBy !== targetAuditor) {
        changes.push({
          field: 'approvedBy',
          oldValue: originalTxn.approvedBy,
          newValue: targetAuditor,
          msg: `auditor from ${originalTxn.approvedBy} to ${targetAuditor}`
        });
      }
      const oldPathStr = originalTxn.routingPath ? originalTxn.routingPath.join(', ') : '';
      const newPathStr = pathArray.join(', ');
      if (oldPathStr !== newPathStr) {
        changes.push({
          field: 'routingPath',
          oldValue: originalTxn.routingPath || [],
          newValue: pathArray,
          msg: `routing path from [${oldPathStr}] to [${newPathStr}]`
        });
      }

      if (changes.length > 0) {
        const logEntry = {
          id: `LOG-${Date.now()}`,
          txnId: editingId,
          timestamp: new Date().toISOString(),
          changes,
          summary: `Corrected ${changes.map(c => c.msg).join(' and ')}`
        };
        setUndoLog([logEntry, ...undoLog]);
        setTransactions(transactions.map(t => t.id === editingId ? {
          ...t,
          amount: parsedAmount,
          description: newDescription.trim(),
          category: newCategory,
          status: newStatus,
          approvedBy: targetAuditor,
          routingPath: pathArray.length > 0 ? pathArray : ['Chase Bank (US)'],
          errorCode: newStatus === 'Flagged' ? 'TXN-LIMIT-ERR' : 'NONE',
          verified: newStatus === 'Approved'
        } : t));
      }

      // Exit Edit Mode and clear form
      setEditingId(null);
      setNewAmount('');
      setNewDescription('');
      setNewRoutingPath('Chase Bank (US)');
      setNewCode(generateRandomCode());
      handleTabChange('ledger');
    } else {
      // ── ADD MODE ──
      if (transactions.some(t => t.id.trim().toUpperCase() === newCode.trim().toUpperCase())) {
        alert("A transaction with this code already exists.");
        return;
      }

      const newTxn = {
        id: newCode.trim().toUpperCase(),
        date: new Date().toISOString(),
        description: newDescription.trim(),
        amount: parsedAmount,
        budgeted: Math.round(parsedAmount * 0.9),
        category: newCategory,
        status: newStatus,
        approvedBy: newStatus === 'Flagged' ? 'Unassigned' : newAuditor,
        routingPath: pathArray.length > 0 ? pathArray : ['Chase Bank (US)'],
        errorCode: newStatus === 'Flagged' ? 'TXN-LIMIT-ERR' : 'NONE',
        verified: newStatus === 'Approved'
      };

      setTransactions([...transactions, newTxn]);

      // Clear form
      setNewAmount('');
      setNewDescription('');
      setNewRoutingPath('Chase Bank (US)');
      setNewCode(generateRandomCode());
      handleTabChange('ledger');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewAmount('');
    setNewDescription('');
    setNewRoutingPath('Chase Bank (US)');
    setNewCode(generateRandomCode());
    handleTabChange('ledger');
  };
  const currentTab = searchParams.get('tab') || 'ledger'; // ledger | undo | lookup

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ── HashMap: O(1) Transaction Code Checker ──
  const txnHashMap = useRef(new HashMap());
  const [codeSearch, setCodeSearch] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupTime, setLookupTime] = useState(null);
  const [lookupStatus, setLookupStatus] = useState('idle'); // idle | found | notfound

  // Populate HashMap on mount / whenever transactions change
  useEffect(() => {
    const map = new HashMap();
    transactions.forEach(t => map.set(t.id, t));
    txnHashMap.current = map;
  }, [transactions]);

  const handleCodeLookup = (raw) => {
    setCodeSearch(raw);
    const query = raw.trim().toUpperCase();
    if (!query) {
      setLookupStatus('idle');
      setLookupResult(null);
      setLookupTime(null);
      return;
    }
    const t0 = performance.now();
    const exists = txnHashMap.current.has(query);
    const result = txnHashMap.current.get(query);
    const t1 = performance.now();
    setLookupTime((t1 - t0).toFixed(3));
    if (exists && result) {
      setLookupStatus('found');
      setLookupResult(result);
    } else {
      setLookupStatus('notfound');
      setLookupResult(null);
    }
  };

  // Trigger search from URL parameters
  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam && currentTab === 'lookup') {
      handleCodeLookup(codeParam);
    }
  }, [searchParams, currentTab]);

  // ── Stack: Undo Log Visualizer (LIFO) ──
  const undoStack = useRef(new Stack());
  useEffect(() => {
    const s = new Stack();
    [...undoLog].reverse().forEach(entry => s.push(entry));
    undoStack.current = s;
  }, [undoLog]);

  // Use custom SinglyLinkedList to store and traverse journal records
  const list = new SinglyLinkedList();
  transactions.forEach(t => list.append(t));
  const listTransactions = list.toArray();

  const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
  const averageAmount = transactions.length ? Math.round(totalAmount / transactions.length) : 0;

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [shakeLock, setShakeLock] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconReport, setReconReport] = useState(null);

  const triggerLockAlert = () => {
    setShakeLock(true);
    setTimeout(() => setShakeLock(false), 500);
  };

  const handleSort = (field) => {
    if (vaultSealed) { triggerLockAlert(); return; }
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const runReconciliation = () => {
    setIsReconciling(true);
    setReconReport(null);
    setTimeout(() => {
      let matchedCount = 0, mismatchCount = 0;
      transactions.forEach(t => {
        const official = officialCodeDirectory[t.id];
        if (official && official.verifiedAmount === t.amount && t.status === 'Approved') matchedCount++;
        else mismatchCount++;
      });
      setReconReport({
        total: transactions.length,
        matched: matchedCount,
        mismatched: mismatchCount,
        score: Math.round((matchedCount / transactions.length) * 100)
      });
      setIsReconciling(false);
    }, 700);
  };

  const filteredTransactions = listTransactions
    .filter(t => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.approvedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') cmp = new Date(a.date) - new Date(b.date);
      else if (sortField === 'amount') cmp = a.amount - b.amount;
      else if (sortField === 'id') cmp = a.id.localeCompare(b.id);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  const categories = ['ALL', 'Operations', 'Legal', 'Marketing', 'Travel'];

  const startEdit = (txn) => {
    if (vaultSealed) { triggerLockAlert(); return; }
    setEditingId(txn.id);
    setNewCode(txn.id);
    setNewAmount(txn.amount.toString());
    setNewCategory(txn.category);
    setNewStatus(txn.status);
    setNewAuditor(txn.approvedBy);
    setNewRoutingPath(txn.routingPath ? txn.routingPath.join(', ') : '');
    setNewDescription(txn.description);
    handleTabChange('registry');
  };

  const triggerUndo = (logEntry) => {
    if (vaultSealed) { triggerLockAlert(); return; }
    const targetTxn = transactions.find(t => t.id === logEntry.txnId);
    if (!targetTxn) { alert("The transaction associated with this log no longer exists."); return; }
    const restoredTxn = { ...targetTxn };
    logEntry.changes.forEach(change => { restoredTxn[change.field] = change.oldValue; });
    setTransactions(transactions.map(t => t.id === logEntry.txnId ? restoredTxn : t));
    setUndoLog(undoLog.filter(l => l.id !== logEntry.id));
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
      
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-app)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'ledger', label: 'Ledger Log', activeBg: 'var(--text-primary)', shadow: 'none' },
            { id: 'registry', label: editingId ? 'Edit Entry' : 'Add Entry', activeBg: 'var(--text-primary)', shadow: 'none' },
            { id: 'lookup', label: 'Code Lookup', activeBg: 'var(--text-primary)', shadow: 'none' },
            { id: 'undo', label: 'Undo Panel', activeBg: 'var(--text-primary)', shadow: 'none' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                border: '1px solid transparent',
                background: currentTab === tab.id ? tab.activeBg : 'transparent',
                color: currentTab === tab.id ? 'var(--bg-card)' : 'var(--text-secondary)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: tab.shadow,
                transition: 'all 0.2s ease',
                transform: 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Vault Seal */}
        <div className={`vault-toggle-container ${shakeLock ? 'shake' : ''}`} style={{ borderColor: vaultSealed ? 'var(--color-danger-border)' : 'var(--border-color)', height: '42px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: vaultSealed ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
            {vaultSealed ? <Lock size={15} /> : <Unlock size={15} />}
            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {vaultSealed ? 'Vault Sealed' : 'Vault Open'}
            </span>
          </div>
          <label className="vault-switch">
            <input type="checkbox" checked={vaultSealed} onChange={(e) => { setVaultSealed(e.target.checked); if (editingId) setEditingId(null); }} />
            <span className="vault-slider"></span>
          </label>
        </div>
      </div>

      {/* ── TAB VIEW 1: LEDGER LOG ── */}
      {currentTab === 'ledger' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Bento Cards Row */}
          <div className="grid-3">
            
            {/* Card 1: Ledger Integrity Check */}
            <div className="clay-card animate-slide-up delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} style={{ color: 'var(--color-brand)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Ledger Integrity Check</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Cross-reference recorded transactions against secure baseline database hashes.
              </p>
              <button 
                onClick={runReconciliation} 
                disabled={isReconciling || vaultSealed} 
                className="btn-primary" 
                style={{ width: '100%', height: '38px', fontSize: '13px', marginTop: 'auto' }}
              >
                {isReconciling ? 'Cross-Checking...' : 'Run Reconciliation'}
              </button>
              {reconReport && (
                <div className="fade-in" style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  backgroundColor: reconReport.score === 100 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                  border: `1px solid ${reconReport.score === 100 ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`,
                  color: reconReport.score === 100 ? 'var(--color-success)' : 'var(--color-warning)',
                  display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', marginTop: '6px'
                }}>
                  <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {reconReport.score === 100 ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
                    <span>{reconReport.score}% Integrity Score</span>
                  </strong>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Verified: {reconReport.matched}/{reconReport.total}</span>
                    <span>Errors: {reconReport.mismatched}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Vault Security Lock */}
            <div className="clay-card animate-slide-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {vaultSealed ? (
                  <Lock size={18} style={{ color: 'var(--color-danger)' }} />
                ) : (
                  <Unlock size={18} style={{ color: 'var(--color-brand)' }} />
                )}
                <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Vault Security Lock</h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {vaultSealed 
                  ? "Ledger is currently SEALED. Edits and corrections are locked to preserve audit trail." 
                  : "Ledger is currently OPEN. Officers can edit records and run corrections."}
              </p>
              <div style={{ 
                marginTop: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '6px 12px', 
                backgroundColor: 'var(--bg-app)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px',
                height: '38px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: vaultSealed ? 'var(--color-danger)' : 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {vaultSealed ? 'System Locked' : 'System Unlocked'}
                </span>
                <label className="vault-switch">
                  <input type="checkbox" checked={vaultSealed} onChange={(e) => { setVaultSealed(e.target.checked); if (editingId) setEditingId(null); }} />
                  <span className="vault-slider"></span>
                </label>
              </div>
            </div>

            {/* Card 3: Ledger Statistics */}
            <div className="clay-card animate-slide-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '160px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} style={{ color: 'var(--color-brand)' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '800' }}>Journal Aggregates</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: 'auto 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Total Volume</span>
                  <strong style={{ fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontWeight: '800' }}>
                    ${totalAmount.toLocaleString()}
                  </strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Avg Trans</span>
                  <strong style={{ fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'var(--mono)', fontWeight: '800' }}>
                    ${averageAmount.toLocaleString()}
                  </strong>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: 'auto' }}>
                <span>Chronological Nodes:</span>
                <strong style={{ color: 'var(--color-brand)', fontFamily: 'var(--mono)', fontWeight: '800' }}>{transactions.length}</strong>
              </div>
            </div>

          </div>

          {/* Active Journal Table */}
          <div className="clay-card animate-slide-up delay-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-between">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <History size={16} style={{ color: 'var(--accent-blue)' }} />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Singly LinkedList Traversal · {transactions.length} Nodes
                  </span>
                </div>
                <h2 style={{ fontSize: '36px', fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: '400', color: 'var(--text-primary)', margin: 0, lineHeight: 1.1 }}>
                  Active Journal
                </h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Showing {filteredTransactions.length} of {transactions.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" placeholder="Search code, description, auditor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingLeft: '40px' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Presets:</span>
                {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setFilterCategory(cat)} 
                    style={{
                      padding: '4px 12px', 
                      borderRadius: '10px', 
                      fontSize: '12px', 
                      boxShadow: 'none',
                      backgroundColor: filterCategory === cat ? 'var(--color-brand)' : 'var(--bg-app)',
                      color: filterCategory === cat ? 'var(--color-active-text)' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Table wrapper */}
            <div className="table-container" style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                      Code <ArrowUpDown size={11} style={{ display: 'inline-block', marginLeft: '4px' }} />
                    </th>
                    <th>Date</th>
                    <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }}>
                      Amount <ArrowUpDown size={11} style={{ display: 'inline-block', marginLeft: '4px' }} />
                    </th>
                    <th>Dept</th>
                    <th>Description</th>
                    <th>Routing Path</th>
                    <th>Auditor</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn) => {
                    const isFlagged = txn.status === 'Flagged';
                    return (
                      <tr 
                        key={txn.id}
                        style={{
                          backgroundColor: isFlagged ? 'var(--color-danger-bg)' : 'transparent',
                          borderLeft: isFlagged ? '4px solid var(--color-danger)' : 'none',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: '700', color: isFlagged ? 'var(--color-danger)' : 'var(--color-brand)', fontSize: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isFlagged && <ShieldAlert size={13} style={{ color: 'var(--color-danger)' }} />}
                            <span>{txn.id}</span>
                          </div>
                        </td>
                        <td>{new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: '700' }}>
                          {`$${txn.amount.toLocaleString()}`}
                        </td>
                        <td>
                          <span style={{ 
                            fontSize: '11px', 
                            fontWeight: '700', 
                            padding: '3px 10px', 
                            backgroundColor: getCategoryColor(txn.category).bg, 
                            color: getCategoryColor(txn.category).text,
                            border: `1px solid ${getCategoryColor(txn.category).border}`, 
                            borderRadius: '8px' 
                          }}>
                            {txn.category}
                          </span>
                        </td>
                        <td>
                          {txn.description}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                            {txn.routingPath && txn.routingPath.map((inst, i) => (
                              <React.Fragment key={inst}>
                                {i > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>→</span>}
                                <span 
                                  style={{ 
                                    padding: '2px 6px', 
                                    borderRadius: '6px', 
                                    backgroundColor: isFlagged ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-muted)', 
                                    border: `1px solid ${isFlagged ? 'var(--color-danger-border)' : 'var(--border-color)'}`,
                                    color: isFlagged ? 'var(--color-danger)' : 'var(--text-secondary)',
                                    fontWeight: '600',
                                    fontSize: '10.5px'
                                  }}
                                  title={inst}
                                >
                                  {inst.split(' ')[0]}
                                </span>
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                        <td style={{ fontSize: '13px' }}>{txn.approvedBy}</td>
                        <td>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            backgroundColor: isFlagged ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
                            color: isFlagged ? 'var(--color-danger)' : 'var(--color-success)',
                            border: `1px solid ${isFlagged ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`
                          }}>
                            {isFlagged ? (
                              <>
                                <ShieldAlert size={12} />
                                <span>Flagged</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={12} />
                                <span>Approved</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => startEdit(txn)} style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                            <Edit2 size={11} style={{ marginRight: '4px' }} /> Correct
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB VIEW 1.5: REGISTRY (ADD/EDIT) ── */}
      {currentTab === 'registry' && (
        <div className="clay-card fade-in animate-slide-up" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '40px',
          position: 'relative'
        }}>
          {vaultSealed && (
            <div style={{
              position: 'absolute', inset: 0, backgroundColor: 'var(--color-brand-light)',
              zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '24px', backdropFilter: 'blur(1.5px)'
            }}>
              <div className="clay-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderColor: 'var(--color-danger-border)', backgroundColor: 'var(--color-danger-bg)', padding: '20px' }}>
                <Lock size={20} style={{ color: 'var(--color-danger)' }} />
                <div>
                  <h4 style={{ fontSize: '14px', color: 'var(--color-danger)', fontWeight: '700' }}>Registry Locked</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Toggle Vault Lock to enable adding or editing records.</p>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', background: 'var(--color-brand-light)', color: 'var(--color-brand)' }}>
              {editingId ? <Edit2 size={20} /> : <Sparkles size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                {editingId ? `Edit Ledger Entry — ${editingId}` : 'Audit Intake Registry'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {editingId ? 'Modify official journal entry and document audit correction' : 'Add a new transaction log directly to the general ledger database'}
              </p>
            </div>
          </div>

          <form onSubmit={handleAddEntry} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            
            {/* Code & Amount */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Code</label>
                <input 
                  type="text" 
                  value={newCode} 
                  onChange={e => setNewCode(e.target.value)} 
                  required 
                  disabled={!!editingId}
                  placeholder="TXN-XXXX-X"
                  style={{ 
                    height: '42px', 
                    fontSize: '13px', 
                    fontFamily: 'var(--mono)', 
                    backgroundColor: editingId ? 'var(--bg-app)' : 'var(--bg-card)',
                    color: editingId ? 'var(--text-muted)' : 'var(--text-primary)',
                    cursor: editingId ? 'not-allowed' : 'text'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Amount ($)</label>
                <input 
                  type="number" 
                  value={newAmount} 
                  onChange={e => setNewAmount(e.target.value)} 
                  required 
                  placeholder="Amount..."
                  style={{ height: '42px', fontSize: '13px', fontFamily: 'var(--mono)' }}
                />
              </div>
            </div>

            {/* Department & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Department</label>
                <select 
                  value={newCategory} 
                  onChange={e => setNewCategory(e.target.value)}
                  style={{ 
                    height: '42px', 
                    fontSize: '13px', 
                    padding: '0 12px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)' 
                  }}
                >
                  <option value="Operations">Operations</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Legal">Legal</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Status</label>
                <select 
                  value={newStatus} 
                  onChange={e => setNewStatus(e.target.value)}
                  style={{ 
                    height: '42px', 
                    fontSize: '13px', 
                    padding: '0 12px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: 'var(--bg-card)', 
                    color: 'var(--text-primary)' 
                  }}
                >
                  <option value="Approved">Approved</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>
            </div>

            {/* Auditor Assigned */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Auditor Assigned</label>
              <select 
                value={newAuditor} 
                onChange={e => setNewAuditor(e.target.value)}
                style={{ 
                  height: '42px', 
                  fontSize: '13px', 
                  padding: '0 12px', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', 
                  color: 'var(--text-primary)' 
                }}
              >
                <option value="Sarah Jenkins">Sarah Jenkins</option>
                <option value="James Patel">James Patel</option>
                <option value="Marcus Vance">Marcus Vance</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>

            {/* Routing Path */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Routing Path (comma-separated)</label>
              <input 
                type="text" 
                value={newRoutingPath} 
                onChange={e => setNewRoutingPath(e.target.value)} 
                placeholder="e.g. Chase Bank (US), Wells Fargo (US)"
                style={{ height: '42px', fontSize: '13px' }}
              />
            </div>

            {/* Description */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Description</label>
              <textarea 
                rows="3" 
                value={newDescription} 
                onChange={e => setNewDescription(e.target.value)} 
                placeholder="Describe transaction details, merchant, or context..."
                required
                style={{ 
                  padding: '10px 12px', 
                  fontSize: '13px', 
                  resize: 'none', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)', 
                  backgroundColor: 'var(--bg-card)', 
                  color: 'var(--text-primary)' 
                }}
              />
            </div>

            {/* Submit / Cancel Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {editingId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="btn-secondary"
                  style={{ 
                    flex: 1, 
                    height: '42px', 
                    fontSize: '13px', 
                    borderRadius: '10px',
                    borderColor: 'var(--border-color)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Cancel Edit
                </button>
              )}
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ 
                  flex: 2, 
                  height: '42px', 
                  fontSize: '13px', 
                  borderRadius: '10px',
                  background: editingId ? 'var(--accent-purple)' : 'var(--color-brand)'
                }}
              >
                {editingId ? 'Save Changes & Update' : 'Add Entry to Ledger'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── TAB VIEW 2: CODE LOOKUP ── */}
      {currentTab === 'lookup' && (
        <div className="clay-card fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ padding: '10px', borderRadius: '50%', background: 'var(--color-brand-light)', color: 'var(--color-brand)' }}>
              <Hash size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Transaction Code Checker</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                HashMap — constant-time O(1) verify check
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Search Code:</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={codeSearch}
                onChange={e => handleCodeLookup(e.target.value)}
                placeholder="Enter transaction code — e.g. TXN-3304-C"
                style={{ paddingLeft: '44px', fontFamily: 'var(--mono)', height: '48px' }}
              />
            </div>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Example codes:</span>
            {['TXN-3304-C', 'TXN-8472-A', 'TXN-8812-H', 'TXN-INVALID'].map(code => (
              <button
                key={code}
                onClick={() => handleCodeLookup(code)}
                style={{
                  padding: '4px 12px', fontSize: '11px', borderRadius: '10px',
                  fontFamily: 'var(--mono)', border: '1px solid var(--border-color)', background: 'var(--bg-app)',
                  color: 'var(--text-secondary)', boxShadow: 'none'
                }}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Result layout */}
          {lookupStatus === 'idle' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', background: 'var(--bg-app)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
              <Database size={16} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Enter transaction tracking number to perform HashMap search.
              </span>
            </div>
          )}

          {lookupStatus === 'notfound' && (
            <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', borderRadius: '16px', color: 'var(--color-danger)' }}>
              <AlertCircle size={16} />
              <div style={{ flex: 1, fontSize: '13px' }}>
                <strong>No record found</strong>: "{codeSearch}" is unregistered.
              </div>
              {lookupTime && <span style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>{lookupTime}ms</span>}
            </div>
          )}

          {lookupStatus === 'found' && lookupResult && (
            <div className="fade-in" style={{
              display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px',
              background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: '24px'
            }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--color-success-border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} /> Verified official record
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--color-success)', background: 'rgba(46,125,50,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                  HashMap search: {lookupTime}ms
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '13px' }}>
                {[
                  { label: 'Code', value: lookupResult.id, mono: true },
                  { label: 'Department', value: lookupResult.category },
                  { label: 'Amount', value: `$${lookupResult.amount.toLocaleString()}`, mono: true },
                  { label: 'Auditor', value: lookupResult.approvedBy },
                  { label: 'Description', value: lookupResult.description },
                  { label: 'Verification', value: lookupResult.status }
                ].map(({ label, value, mono }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: mono ? 'var(--mono)' : 'inherit' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB VIEW 3: UNDO PANEL ── */}
      {currentTab === 'undo' && (
        <div className="clay-card fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '50%', background: 'var(--color-brand-light)', color: 'var(--color-brand)' }}>
                <History size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Manual Edit Rollback</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  LIFO Stack — revert edits sequentially
                </p>
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: 'var(--color-brand)', background: 'var(--color-brand-light)', padding: '4px 12px', borderRadius: '10px', border: '1px solid var(--border-color)', fontFamily: 'var(--mono)' }}>
              <Layers size={13} />
              <span>DEPTH: {undoLog.length}</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '-8px', lineHeight: '1.5' }}>
            Edits performed on the ledger are pushed onto the Stack log. Press rollback to pop and restore original ledger states.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            {undoLog.map((log, idx) => (
              <div 
                key={log.id} 
                className="fade-in" 
                style={{ 
                  padding: '16px', 
                  backgroundColor: idx === 0 ? 'var(--color-brand-light)' : 'var(--bg-app)',
                  border: '1px solid',
                  borderColor: idx === 0 ? 'var(--color-brand)' : 'var(--border-color)',
                  borderRadius: '20px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  position: 'relative' 
                }}
              >
                {idx === 0 && (
                  <span style={{ 
                    position: 'absolute', top: '12px', right: '16px', 
                    fontSize: '9px', fontWeight: '900', color: 'var(--color-brand)', 
                    fontFamily: 'var(--mono)', letterSpacing: '0.04em' 
                  }}>
                    TOP OF STACK ↑
                  </span>
                )}
                <div className="flex-between">
                  <span style={{ fontFamily: 'var(--mono)', fontWeight: '800', color: 'var(--color-brand)', fontSize: '12px' }}>
                    {log.txnId}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4', paddingRight: idx === 0 ? '80px' : '0' }}>
                  {log.summary}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(228,228,225,0.6)', paddingTop: '10px', marginTop: '4px' }}>
                  <button 
                    onClick={() => triggerUndo(log)} 
                    className="btn-primary" 
                    disabled={vaultSealed} 
                    style={{ padding: '6px 16px', fontSize: '12px', borderRadius: '10px' }}
                  >
                    <Undo2 size={13} style={{ marginRight: '4px' }} /> Pop & Undo Edit
                  </button>
                </div>
              </div>
            ))}

            {undoLog.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: '24px', color: 'var(--text-muted)', textAlign: 'center' }}>
                <FileCheck2 size={32} style={{ marginBottom: '10px', color: 'var(--color-brand)', opacity: 0.6 }} />
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Stack is empty</span>
                <span style={{ fontSize: '12px', marginTop: '4px', maxWidth: '340px' }}>
                  To populate, seal the Vault open and edit transaction details inside the Ledger Log.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
