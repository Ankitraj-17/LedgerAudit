import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initialTransactions, initialSpecialists } from '../utils/mockData';

export function useAppState() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [specialists, setSpecialists] = useState(initialSpecialists);
  const [undoLog, setUndoLog] = useState([]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('currentUser') || null;
  });

  const handleSetCurrentUser = (name) => {
    setCurrentUser(name);
    if (name) {
      localStorage.setItem('currentUser', name);
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Shared Vault Seal write-protection switch state
  const [vaultSealed, setVaultSealed] = useState(false);

  // Subscription Plan state synced with localStorage
  const [currentPlan, setCurrentPlanState] = useState(() => {
    return localStorage.getItem('currentPlan') || 'Standard';
  });
  const [billingInterval, setBillingIntervalState] = useState(() => {
    return localStorage.getItem('billingInterval') || 'monthly';
  });

  const setCurrentPlan = (plan) => {
    setCurrentPlanState(plan);
    localStorage.setItem('currentPlan', plan);
  };

  const setBillingInterval = (interval) => {
    setBillingIntervalState(interval);
    localStorage.setItem('billingInterval', interval);
  };

  // Theme state synced with localStorage and html data-theme attribute
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Routing
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const setActiveTab = (tab) => {
    navigate(tab === 'dashboard' ? '/dashboard' : `/${tab}`);
  };

  // Sidebar Layout
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return {
    transactions, setTransactions,
    specialists, setSpecialists,
    undoLog, setUndoLog,
    currentUser, handleSetCurrentUser,
    vaultSealed, setVaultSealed,
    currentPlan, setCurrentPlan,
    billingInterval, setBillingInterval,
    theme, toggleTheme,
    navigate, location, isLandingPage, setActiveTab,
    sidebarOpen, setSidebarOpen,
    sidebarCollapsed, setSidebarCollapsed
  };
}
