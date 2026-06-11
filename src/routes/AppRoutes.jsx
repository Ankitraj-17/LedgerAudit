import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import Landing from '../pages/Landing';
import Overview from '../components/Overview';
import TransactionHistory from '../pages/TransactionHistory';
import FlaggedQueue from '../pages/FlaggedQueue';
import RiskSorter from '../pages/RiskSorter';
import MoneyMovement from '../pages/MoneyMovement';
import TaskAssignor from '../pages/TaskAssignor';
import Profile from '../pages/Profile';
import Pricing from '../pages/Pricing';
import { useAppState } from '../hooks/useAppState';

export default function AppRoutes() {
  const {
    transactions, setTransactions,
    specialists, setSpecialists,
    undoLog, setUndoLog,
    currentUser, handleSetCurrentUser,
    vaultSealed, setVaultSealed,
    currentPlan, setCurrentPlan,
    billingInterval, setBillingInterval,
    theme, toggleTheme,
    isLandingPage, setActiveTab,
    sidebarOpen, setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed
  } = useAppState();

  if (isLandingPage) {
    return (
      <Routes>
        <Route 
          path="/" 
          element={
            <Landing 
              currentPlan={currentPlan} 
              setCurrentPlan={setCurrentPlan}
              billingInterval={billingInterval}
              setBillingInterval={setBillingInterval}
            />
          } 
        />
      </Routes>
    );
  }

  return (
    <div className="app-viewport">
      <div className="app-container">
        <Sidebar 
          transactions={transactions} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        
        {/* Mobile sidebar overlay */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <TopNav 
            transactions={transactions} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            setSidebarOpen={setSidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            specialists={specialists}
            setSpecialists={setSpecialists}
            currentUser={currentUser}
            setCurrentUser={handleSetCurrentUser}
          />
          
          <main className="main-content" style={{ width: '100%' }}>
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <Overview 
                    transactions={transactions} 
                    specialists={specialists} 
                    setActiveTab={setActiveTab} 
                    vaultSealed={vaultSealed}
                    setVaultSealed={setVaultSealed}
                  />
                } 
              />
              
              <Route 
                path="/transactions" 
                element={
                  <TransactionHistory 
                    transactions={transactions} 
                    setTransactions={setTransactions} 
                    undoLog={undoLog} 
                    setUndoLog={setUndoLog}
                    vaultSealed={vaultSealed}
                    setVaultSealed={setVaultSealed}
                  />
                } 
              />
              
              <Route 
                path="/flagged" 
                element={
                  <FlaggedQueue 
                    transactions={transactions} 
                    setTransactions={setTransactions} 
                  />
                } 
              />
              
              <Route 
                path="/risks" 
                element={
                  <RiskSorter 
                    transactions={transactions} 
                  />
                } 
              />
              
              <Route 
                path="/movement" 
                element={
                  <MoneyMovement 
                    transactions={transactions} 
                  />
                } 
              />
              
              <Route 
                path="/assignor" 
                element={
                  <TaskAssignor 
                    transactions={transactions} 
                    setTransactions={setTransactions} 
                    specialists={specialists} 
                    setSpecialists={setSpecialists} 
                  />
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <Profile 
                    specialists={specialists} 
                    setSpecialists={setSpecialists} 
                    theme={theme}
                    toggleTheme={toggleTheme}
                    currentPlan={currentPlan}
                    billingInterval={billingInterval}
                    currentUser={currentUser}
                    setCurrentUser={handleSetCurrentUser}
                  />
                } 
              />

              <Route 
                path="/pricing" 
                element={
                  <Pricing 
                    currentPlan={currentPlan} 
                    setCurrentPlan={setCurrentPlan}
                    billingInterval={billingInterval}
                    setBillingInterval={setBillingInterval}
                  />
                } 
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
