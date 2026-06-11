import React, { useState, useEffect, useRef } from 'react';
import { Search, ShieldAlert, ShieldCheck, Database, AlertCircle } from 'lucide-react';
import { HashMap } from '../utils/HashMap';
import { initialTransactions } from '../utils/mockData';

// Simulated mockDataService to meet requirement constraints
const mockDataService = {
  fetchTransactions: async () => {
    return initialTransactions;
  }
};

export default function CodeLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundResult, setFoundResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lookupTime, setLookupTime] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  
  const hashMap = useRef(new HashMap());

  useEffect(() => {
    // Call mockDataService.fetchTransactions() on mount
    mockDataService.fetchTransactions().then((txns) => {
      txns.forEach(txn => {
        hashMap.current.set(txn.id, txn);
      });
      setRecordCount(txns.length);
    });
  }, []);

  const handleKeystroke = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.trim().length === 0) {
      setFoundResult(null);
      setHasSearched(false);
      setLookupTime(0);
      return;
    }

    const t0 = performance.now();
    const hasKey = hashMap.current.has(val);
    let result = null;
    if (hasKey) {
      result = hashMap.current.get(val);
    }
    const t1 = performance.now();
    
    setLookupTime(t1 - t0);
    setFoundResult(result);
    setHasSearched(true);
  };

  const getBadgeClass = (status) => {
    if (status === 'Approved') return 'badge badge-success';
    if (status === 'Flagged') return 'badge badge-danger';
    return 'badge badge-neutral';
  };

  return (
    <div className="fade-in animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '40px auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center' }}>
        <span className="section-label">HASHMAP SEARCH ENGINE</span>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px' }}>Transaction Code Checker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          O(1) constant-time indexing and lookup for rapid forensic audit checks.
        </p>
      </div>

      {/* Main Search Panel Card */}
      <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '36px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleKeystroke}
            placeholder="Enter transaction code e.g. TXN-3304-C"
            style={{ 
              paddingLeft: '48px', 
              fontSize: '16px', 
              fontFamily: 'var(--mono)', 
              height: '52px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-app)',
              borderRadius: '10px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Diagnostic Metadata Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <span>
            {hasSearched ? (
              <span>Resolved in <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{lookupTime.toFixed(4)}ms</strong></span>
            ) : (
              <span>Ready for query</span>
            )}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} />
            <span>HashMap — O(1) lookup · {recordCount} records indexed</span>
          </span>
        </div>

        {/* Results Box */}
        {hasSearched ? (
          foundResult ? (
            <div className="scale-in" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              padding: '24px',
              backgroundColor: foundResult.status === 'Flagged' ? 'var(--color-danger-bg)' : 'var(--color-success-bg)',
              border: `1px solid ${foundResult.status === 'Flagged' ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`,
              borderRadius: '24px',
              transition: 'all 0.25s ease'
            }}>
              <div className="flex-between" style={{ borderBottom: `1px solid ${foundResult.status === 'Flagged' ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`, paddingBottom: '12px' }}>
                <span style={{ 
                  fontSize: '13.5px', 
                  fontWeight: '800', 
                  color: foundResult.status === 'Flagged' ? 'var(--color-danger)' : 'var(--color-success)', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}>
                  {foundResult.status === 'Flagged' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                  <span>Indexed Record Verified</span>
                </span>
                <span className={getBadgeClass(foundResult.status)}>{foundResult.status}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Transaction ID</span>
                  <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>{foundResult.id}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date Indexed</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    {new Date(foundResult.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recorded Value</span>
                  <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--mono)' }}>${foundResult.amount.toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{foundResult.category}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lead Auditor</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{foundResult.approvedBy}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Error Code</span>
                  <span style={{ color: foundResult.errorCode === 'NONE' ? 'var(--text-primary)' : 'var(--color-danger)', fontWeight: '700', fontFamily: 'var(--mono)' }}>{foundResult.errorCode}</span>
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${foundResult.status === 'Flagged' ? 'var(--color-danger-border)' : 'var(--color-success-border)'}`, paddingTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <strong>Description</strong>: {foundResult.description}
              </div>
            </div>
          ) : (
            <div className="scale-in" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '20px', 
              backgroundColor: 'var(--color-danger-bg)', 
              border: '1px solid var(--color-danger-border)', 
              borderRadius: '20px', 
              color: 'var(--color-danger)' 
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '13.5px' }}>
                <strong>No record found</strong>: No transaction matches code "{searchQuery}".
              </div>
            </div>
          )
        ) : (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px 20px', 
            border: '1px dashed var(--border-color)', 
            borderRadius: '24px', 
            color: 'var(--text-muted)', 
            textAlign: 'center',
            gap: '8px'
          }}>
            <Database size={28} style={{ opacity: 0.6 }} />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>HashMap Directory Ready</span>
            <span style={{ fontSize: '12px' }}>Enter a code above to start searching.</span>
          </div>
        )}
      </div>

    </div>
  );
}
