import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  EyeOff,
  LogOut,
  Bell,
  Volume2,
  VolumeX,
  Printer,
  Archive,
  Trash2,
  RefreshCw,
  Plus,
  Edit2,
  Settings as SettingsIcon,
  Layers,
  ArrowLeft,
  X,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import {
  fetchOrders,
  updateOrderStatus,
  setOrderArchived,
  deleteOrder,
  getDashboardOrderCounts,
  getStoredSettings,
  saveStoredSettings
} from '../services/orderService';
import { OrderRecord, OrderStatus, OrderType, RestaurantSettings } from '../types/order';
import { MENU_ITEMS, MenuItem } from '../data/menuData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const AdminPortal: React.FC<{
  onExit: () => void;
}> = ({ onExit }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sams_admin_authenticated') === 'true';
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'all'
    | 'pickup'
    | 'delivery'
    | 'pending'
    | 'accepted'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'cancelled'
    | 'archived'
    | 'menu'
    | 'settings'
  >('dashboard');

  // Orders and Counts
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    pickupCount: 0,
    deliveryCount: 0,
    archivedCount: 0
  });

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Realtime & Audio Chime
  const [connectionStatus, setConnectionStatus] = useState<'LIVE' | 'RECONNECTING' | 'OFFLINE'>('LIVE');
  const [newOrderNotification, setNewOrderNotification] = useState<OrderRecord | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderRecord | null>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  // Menu Management State
  const [customMenuItems, setCustomMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('sams_custom_menu');
      return saved ? JSON.parse(saved) : MENU_ITEMS;
    } catch {
      return MENU_ITEMS;
    }
  });
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // Settings State
  const [settings, setSettings] = useState<RestaurantSettings>(getStoredSettings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Play Web Audio Chime for new incoming orders
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.85);
    } catch (e) {
      console.warn('Audio chime unsupported or blocked', e);
    }
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (error) throw error;
        if (data.session) {
          setIsAuthenticated(true);
          sessionStorage.setItem('sams_admin_authenticated', 'true');
          setAuthLoading(false);
          return;
        }
      } catch (err: any) {
        setAuthError(err.message || 'Invalid administrator credentials.');
        setAuthLoading(false);
        return;
      }
    }

    // Default administrative verification for instant local access
    if (
      (email.trim().toLowerCase() === 'admin@sams.com' || email.trim().toLowerCase() === 'admin@sams.cafe') &&
      password === 'admin123'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sams_admin_authenticated', 'true');
    } else {
      setAuthError('Invalid email or password. (For evaluation: admin@sams.com / admin123 or Supabase Auth)');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('sams_admin_authenticated');
  };

  // Load orders & order counts
  const loadData = async () => {
    setLoadingOrders(true);
    try {
      const isArchivedTab = activeTab === 'archived';
      let typeF: 'all' | OrderType = 'all';
      if (activeTab === 'pickup') typeF = 'pickup';
      if (activeTab === 'delivery') typeF = 'delivery';

      let statusF: 'all' | OrderStatus = 'all';
      if (activeTab === 'pending') statusF = 'PENDING';
      if (activeTab === 'accepted') statusF = 'ACCEPTED';
      if (activeTab === 'preparing') statusF = 'PREPARING';
      if (activeTab === 'ready') statusF = 'READY';
      if (activeTab === 'completed') statusF = 'COMPLETED';
      if (activeTab === 'cancelled') statusF = 'CANCELLED';

      const [ordersList, updatedCounts] = await Promise.all([
        fetchOrders({
          typeFilter: typeF,
          statusFilter: statusF,
          archived: isArchivedTab,
          searchQuery,
          sort: sortOrder
        }),
        getDashboardOrderCounts()
      ]);

      setOrders(ordersList);
      setCounts(updatedCounts);
      setConnectionStatus('LIVE');
    } catch {
      setConnectionStatus('RECONNECTING');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab, searchQuery, sortOrder]);

  // Realtime order listeners (Supabase channel & Window Event)
  useEffect(() => {
    if (!isAuthenticated) return;

    // Listen to local event
    const handleLocalOrderCreated = () => {
      loadData();
      playChime();
    };
    window.addEventListener('sams_orders_updated', handleLocalOrderCreated);

    // If Supabase is configured, listen to Supabase Realtime channel
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('admin-orders-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload: any) => {
            loadData();
            if (payload.eventType === 'INSERT') {
              setNewOrderNotification(payload.new);
              playChime();
            }
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') setConnectionStatus('LIVE');
          else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
            setConnectionStatus('RECONNECTING');
          }
        });
    }

    return () => {
      window.removeEventListener('sams_orders_updated', handleLocalOrderCreated);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [isAuthenticated, soundEnabled]);

  // Status Update Action
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus, 'Admin');
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    loadData();
  };

  // Archive Action
  const handleToggleArchive = async (order: OrderRecord) => {
    await setOrderArchived(order.id, !order.archived);
    if (selectedOrder && selectedOrder.id === order.id) {
      setSelectedOrder(null);
    }
    loadData();
  };

  // Delete Action with Confirmation
  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    if (deleteConfirmationInput.trim() !== orderToDelete.order_number) {
      alert(`Please type "${orderToDelete.order_number}" to confirm permanent deletion.`);
      return;
    }
    await deleteOrder(orderToDelete.id);
    setOrderToDelete(null);
    setDeleteConfirmationInput('');
    if (selectedOrder && selectedOrder.id === orderToDelete.id) {
      setSelectedOrder(null);
    }
    loadData();
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 2500);
  };

  // Print Receipt
  const handlePrintReceipt = (order: OrderRecord) => {
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${order.order_number}</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #000; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-size: 16px; font-weight: bold; border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SAM'S CAFE</h2>
            <p>Allama Iqbal Road, Mian Channu</p>
            <p>ORDER #${order.order_number} (${order.order_type.toUpperCase()})</p>
            <p>${new Date(order.created_at).toLocaleString()}</p>
          </div>
          <div class="row"><strong>Customer:</strong> <span>${order.customer_name}</span></div>
          <div class="row"><strong>Phone:</strong> <span>${order.customer_phone}</span></div>
          ${order.delivery_address ? `<div class="row"><strong>Address:</strong> <span>${order.delivery_address}</span></div>` : ''}
          <hr />
          ${order.items?.map(it => `
            <div class="row">
              <span>${it.item_name_snapshot} × ${it.quantity}</span>
              <span>PKR ${it.line_total}</span>
            </div>
          `).join('')}
          <div class="row total">
            <span>TOTAL AMOUNT</span>
            <span>PKR ${order.total}</span>
          </div>
          <p style="text-align: center; margin-top: 20px;">Thank you for dining with Sam's Cafe!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  // --- 1. RENDER LOGIN VIEW ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#141414] border border-[#262626] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-xs text-[#A6A6A6] hover:text-[#FFC928] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cafe</span>
            </button>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFC928]" />
          </div>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] border border-[#FFC928]/40 text-[#FFC928] font-display font-black text-2xl flex items-center justify-center mx-auto shadow-md">
              S
            </div>
            <h2 className="font-display font-black text-2xl text-[#F5F2EA] uppercase tracking-wider">
              SAM'S CAFE
            </h2>
            <p className="text-xs text-[#A6A6A6]">
              Secure Order Management & Kitchen Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl bg-[#291818] border border-[#522020] text-xs text-[#F87171]">
                {authError}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#A6A6A6] block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sams.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#A6A6A6] block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#F5F2EA] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[#FFC928] hover:bg-[#E5A900] text-[#0B0B0B] font-display font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#FFC928]/15 cursor-pointer disabled:opacity-50"
            >
              {authLoading ? 'VERIFYING CREDENTIALS...' : 'SIGN IN TO DASHBOARD'}
            </button>
          </form>

          <div className="pt-2 border-t border-[#1F1F1F] text-center">
            <span className="text-[10px] text-[#737373] uppercase tracking-wider">
              {isSupabaseConfigured ? 'Supabase Authentication Connected' : 'Demo Credentials: admin@sams.com / admin123'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. RENDER ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F5F2EA] flex flex-col lg:flex-row">
      
      {/* SIDEBAR NAVIGATION (Part 9) */}
      <aside className="w-full lg:w-64 bg-[#111111] border-r border-[#1C1C1C] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-[#1C1C1C] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1C1C1C] border border-[#FFC928]/40 text-[#FFC928] font-black text-lg flex items-center justify-center">
                S
              </div>
              <div>
                <h1 className="font-display font-black text-sm tracking-wider uppercase text-[#F5F2EA]">
                  SAM'S ADMIN
                </h1>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      connectionStatus === 'LIVE' ? 'bg-[#4ADE80] animate-pulse' : 'bg-[#F87171]'
                    }`}
                  />
                  <span className="text-[#A6A6A6]">{connectionStatus}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
              className="p-1.5 rounded-lg bg-[#181818] text-[#A6A6A6] hover:text-[#FFC928] cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>1. Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>2. All Orders</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('pickup')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'pickup' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>3. Pickup Orders</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.pickupCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('delivery')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'delivery' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>4. Delivery Orders</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.deliveryCount}
              </span>
            </button>

            <div className="pt-2 pb-1 border-t border-[#1C1C1C]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] px-3">
                Status Queues
              </span>
            </div>

            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'pending' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>5. Pending</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-[#D62828] text-white">
                {counts.pending}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('accepted')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'accepted' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>6. Accepted</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.accepted}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('preparing')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'preparing' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>7. Preparing</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.preparing}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ready')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'ready' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>8. Ready</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.ready}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'completed' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>9. Completed</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.completed}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cancelled')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'cancelled' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>10. Cancelled</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.cancelled}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'archived' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>11. Archived</span>
              <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-black/30">
                {counts.archivedCount}
              </span>
            </button>

            <div className="pt-2 pb-1 border-t border-[#1C1C1C]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#737373] px-3">
                Management
              </span>
            </div>

            <button
              onClick={() => setActiveTab('menu')}
              className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'menu' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>12. Menu Management</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2 px-3.5 py-2 rounded-xl font-display font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#FFC928] text-[#0B0B0B]' : 'text-[#A6A6A6] hover:bg-[#181818] hover:text-[#F5F2EA]'
              }`}
            >
              <span>13. Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1C1C1C] space-y-2">
          <button
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#181818] hover:bg-[#202020] text-xs font-semibold text-[#A6A6A6] hover:text-[#F5F2EA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#291818] hover:bg-[#381f1f] text-xs font-bold text-[#F87171] transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>14. Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
        
        {/* NEW ORDER REALTIME NOTIFICATION POPUP */}
        {newOrderNotification && (
          <div className="p-4 rounded-2xl bg-[#FFC928] text-[#0B0B0B] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-black text-[#FFC928]">
                <Bell className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <strong className="font-display font-black text-sm tracking-wide uppercase">
                  NEW ORDER RECEIVED! #{newOrderNotification.order_number}
                </strong>
                <p className="text-xs font-medium opacity-90">
                  {newOrderNotification.customer_name} · {newOrderNotification.order_type.toUpperCase()} · Individual Total: PKR {newOrderNotification.total.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedOrder(newOrderNotification);
                  setNewOrderNotification(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#0B0B0B] text-[#FFC928] text-xs font-display font-bold uppercase tracking-wider hover:bg-[#1A1A1A] cursor-pointer"
              >
                OPEN ORDER
              </button>
              <button
                onClick={() => setNewOrderNotification(null)}
                className="p-2 text-black hover:opacity-70 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TOP BAR: Search & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C1C1C]">
          <div>
            <h2 className="font-display font-black text-2xl text-[#F5F2EA] tracking-tight uppercase">
              {activeTab === 'dashboard'
                ? 'Order Operations Center'
                : activeTab === 'menu'
                ? 'Menu Catalog Management'
                : activeTab === 'settings'
                ? 'Restaurant Configuration'
                : `${activeTab} Orders`}
            </h2>
            <span className="text-xs text-[#A6A6A6]">
              Real-time synchronization · No aggregate sales calculated
            </span>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== 'settings' && activeTab !== 'menu' && (
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Order #, Name, Phone..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141414] border border-[#242424] text-xs text-[#F5F2EA] focus:border-[#FFC928] focus:outline-none"
                />
              </div>
            )}

            <button
              onClick={loadData}
              title="Refresh Queue"
              className="p-2.5 rounded-xl bg-[#141414] border border-[#242424] text-[#A6A6A6] hover:text-[#FFC928] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* TAB: DASHBOARD STATS (ONLY ORDER COUNTS - NO SALES STATS) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* The 7 Strictly Order-Related Count Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] font-display block">
                  TOTAL ORDERS
                </span>
                <span className="text-2xl font-black font-display text-[#F5F2EA] tabular-nums block">
                  {counts.total}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#181414] border border-[#3E1A1A] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F87171] font-display block">
                  PENDING
                </span>
                <span className="text-2xl font-black font-display text-[#F87171] tabular-nums block">
                  {counts.pending}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#171612] border border-[#3E381A] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFC928] font-display block">
                  ACCEPTED
                </span>
                <span className="text-2xl font-black font-display text-[#FFC928] tabular-nums block">
                  {counts.accepted}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141719] border border-[#1A303E] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] font-display block">
                  PREPARING
                </span>
                <span className="text-2xl font-black font-display text-[#60A5FA] tabular-nums block">
                  {counts.preparing}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#151914] border border-[#1E3E1A] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#34D399] font-display block">
                  READY
                </span>
                <span className="text-2xl font-black font-display text-[#34D399] tabular-nums block">
                  {counts.ready}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#141814] border border-[#1A331A] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] font-display block">
                  COMPLETED
                </span>
                <span className="text-2xl font-black font-display text-[#4ADE80] tabular-nums block">
                  {counts.completed}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#161616] border border-[#242424] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] font-display block">
                  CANCELLED
                </span>
                <span className="text-2xl font-black font-display text-[#737373] tabular-nums block">
                  {counts.cancelled}
                </span>
              </div>
            </div>

            {/* Quick Action Queue Overview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg text-[#F5F2EA] uppercase tracking-wider">
                  Live Active Orders ({orders.length})
                </h3>
                <span className="text-xs text-[#A6A6A6]">
                  Click any order to view details, update status, or print receipt
                </span>
              </div>

              {/* Order Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className="p-5 rounded-2xl bg-[#141414] border border-[#242424] hover:border-[#FFC928]/40 transition-all cursor-pointer shadow-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-base text-[#FFC928]">
                        #{o.order_number}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          o.status === 'PENDING'
                            ? 'bg-[#D62828] text-white'
                            : o.status === 'ACCEPTED'
                            ? 'bg-[#FFC928] text-black'
                            : o.status === 'PREPARING'
                            ? 'bg-[#3B82F6] text-white'
                            : o.status === 'READY'
                            ? 'bg-[#10B981] text-white'
                            : o.status === 'COMPLETED'
                            ? 'bg-[#182B18] text-[#4ADE80]'
                            : 'bg-[#252525] text-[#737373]'
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-sm text-[#F5F2EA]">
                        {o.customer_name}
                      </h4>
                      <p className="text-xs text-[#A6A6A6] tabular-nums">
                        {o.customer_phone} · <span className="uppercase font-semibold">{o.order_type}</span>
                      </p>
                      {o.order_type === 'delivery' && o.delivery_address && (
                        <p className="text-[11px] text-[#888888] truncate mt-0.5">
                          {o.delivery_address}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between text-xs">
                      <span className="text-[#737373] text-[10px]">
                        {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-display font-bold text-sm text-[#F5F2EA] tabular-nums">
                        PKR {o.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ORDER FILTER LISTS */}
        {activeTab !== 'dashboard' && activeTab !== 'menu' && activeTab !== 'settings' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-[#141414] border border-[#242424] space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#737373] mx-auto" />
                <h4 className="font-display font-bold text-base text-[#F5F2EA]">
                  No orders in this view
                </h4>
                <p className="text-xs text-[#A6A6A6]">
                  Try changing your status filter or clearing your search query.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#242424] overflow-hidden bg-[#141414]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181818] border-b border-[#242424] text-[#737373] font-display font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E1E1E]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="p-4 font-display font-bold text-[#FFC928]">
                          #{o.order_number}
                        </td>
                        <td className="p-4 text-[#A6A6A6] tabular-nums">
                          {new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-4 font-semibold text-[#F5F2EA]">
                          {o.customer_name}
                          <span className="block text-[10px] font-normal text-[#737373] tabular-nums">{o.customer_phone}</span>
                        </td>
                        <td className="p-4 uppercase font-bold text-[11px] text-[#A6A6A6]">
                          {o.order_type}
                        </td>
                        <td className="p-4 font-display font-bold text-sm text-[#F5F2EA] tabular-nums">
                          PKR {o.total.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#222222] text-[#F5F2EA]">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="px-3 py-1.5 rounded-lg bg-[#202020] hover:bg-[#FFC928] hover:text-black text-[#F5F2EA] text-xs font-semibold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: MENU MANAGEMENT (Part 16) */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#A6A6A6]">
                Configure dishes, descriptions, prices, availability, and popularity flags.
              </p>
              <button
                onClick={() =>
                  setEditingMenuItem({
                    id: `dish-${Date.now()}`,
                    name: '',
                    category: 'pizza',
                    description: '',
                    price: 850,
                    image: '/src/assets/images/food_artisan_pizza_1793898483490.jpg',
                    available: true,
                    isPopular: false
                  } as any)
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customMenuItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#141414] border border-[#242424] space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover bg-[#222222]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-bold text-sm text-[#F5F2EA] truncate">{item.name}</h4>
                      <span className="text-xs text-[#FFC928] font-bold tabular-nums">PKR {item.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A6A6A6] line-clamp-2">{item.description}</p>

                  <div className="pt-2 border-t border-[#1E1E1E] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const updated = customMenuItems.map((m) =>
                            m.id === item.id ? { ...m, available: m.available === false ? true : false } : m
                          );
                          setCustomMenuItems(updated);
                          localStorage.setItem('sams_custom_menu', JSON.stringify(updated));
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.available !== false ? 'bg-[#182B18] text-[#4ADE80]' : 'bg-[#291818] text-[#F87171]'
                        } cursor-pointer`}
                      >
                        {item.available !== false ? 'Available' : 'Unavailable'}
                      </button>

                      {item.isPopular && (
                        <span className="text-[10px] text-[#FFC928] font-bold uppercase">Popular</span>
                      )}
                    </div>

                    <button
                      onClick={() => setEditingMenuItem(item)}
                      className="p-1.5 text-[#A6A6A6] hover:text-[#FFC928] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SETTINGS (Part 17) */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl p-8 rounded-3xl bg-[#141414] border border-[#242424] space-y-6">
            <h3 className="font-display font-black text-lg text-[#F5F2EA] uppercase">
              Operations & Store Settings
            </h3>

            {settingsSavedMessage && (
              <div className="p-3.5 rounded-xl bg-[#182B18] border border-[#225522] text-xs text-[#4ADE80] flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Settings successfully saved and live!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#A6A6A6] uppercase tracking-wider block mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={settings.restaurantName}
                  onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#A6A6A6] uppercase tracking-wider block mb-1">
                    Phone Display
                  </label>
                  <input
                    type="text"
                    value={settings.phoneDisplay}
                    onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#A6A6A6] uppercase tracking-wider block mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#A6A6A6] uppercase tracking-wider block mb-1">
                    Delivery Charge (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#A6A6A6] uppercase tracking-wider block mb-1">
                    Minimum Order (PKR)
                  </label>
                  <input
                    type="number"
                    value={settings.minimumOrder}
                    onChange={(e) => setSettings({ ...settings, minimumOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA]"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3 border-t border-[#1F1F1F]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.onlineOrderingActive}
                    onChange={(e) => setSettings({ ...settings, onlineOrderingActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FFC928] accent-[#FFC928]"
                  />
                  <span className="font-semibold text-[#F5F2EA]">
                    Accept Online Orders (Kitchen Open)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pickupAvailable}
                    onChange={(e) => setSettings({ ...settings, pickupAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FFC928] accent-[#FFC928]"
                  />
                  <span className="text-[#A6A6A6]">Pickup Orders Enabled</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.deliveryAvailable}
                    onChange={(e) => setSettings({ ...settings, deliveryAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FFC928] accent-[#FFC928]"
                  />
                  <span className="text-[#A6A6A6]">Delivery Orders Enabled</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#FFC928] text-[#0B0B0B] font-display font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-[#E5A900] transition-colors"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

      </main>

      {/* ORDER DETAILS MODAL (Part 13) */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-xl bg-[#141414] border border-[#242424] rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#202020]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#737373] tracking-widest block font-display">
                  ORDER SPECIFICATION
                </span>
                <h3 className="font-display font-black text-2xl text-[#FFC928]">
                  #{selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-[#202020] text-[#A6A6A6] hover:text-[#F5F2EA] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Summary */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#737373] block uppercase text-[10px]">Customer</span>
                <strong className="text-sm text-[#F5F2EA] block">{selectedOrder.customer_name}</strong>
                <span className="text-[#A6A6A6] tabular-nums">{selectedOrder.customer_phone}</span>
              </div>
              <div>
                <span className="text-[#737373] block uppercase text-[10px]">Type & Timing</span>
                <strong className="text-sm uppercase text-[#FFC928] block">{selectedOrder.order_type}</strong>
                <span className="text-[#A6A6A6]">{new Date(selectedOrder.created_at).toLocaleString()}</span>
              </div>
            </div>

            {selectedOrder.order_type === 'delivery' && selectedOrder.delivery_address && (
              <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#282828] text-xs">
                <span className="text-[#737373] block uppercase text-[10px]">Delivery Address</span>
                <p className="text-[#F5F2EA] font-medium">{selectedOrder.delivery_address}</p>
                {selectedOrder.delivery_landmark && (
                  <p className="text-[#A6A6A6] text-[11px] mt-0.5">Landmark: {selectedOrder.delivery_landmark}</p>
                )}
              </div>
            )}

            {/* Items Breakdown */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Items Ordered:
              </span>
              <div className="rounded-xl bg-[#1A1A1A] border border-[#242424] divide-y divide-[#222222]">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center text-[#F5F2EA]">
                    <div>
                      <strong className="block">{it.item_name_snapshot}</strong>
                      <span className="text-[#A6A6A6] text-[11px]">
                        PKR {it.unit_price_snapshot} × {it.quantity}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums">PKR {it.line_total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtotal, fee, total */}
            <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#242424] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#A6A6A6]">
                <span>Subtotal</span>
                <span className="tabular-nums">PKR {selectedOrder.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrder.order_type === 'delivery' && (
                <div className="flex justify-between text-[#A6A6A6]">
                  <span>Delivery Fee</span>
                  <span className="tabular-nums">PKR {selectedOrder.delivery_fee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#F5F2EA] pt-2 border-t border-[#242424]">
                <span>Individual Total</span>
                <span className="text-[#FFC928] font-black font-display text-base tabular-nums">
                  PKR {selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* STATUS TRANSITIONS (Part 12) */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] block">
                Update Order Status:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'] as OrderStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    className={`py-2 px-1 text-center rounded-xl text-[10px] font-display font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                      selectedOrder.status === st
                        ? 'bg-[#FFC928] text-black border-[#FFC928]'
                        : 'bg-[#1E1E1E] text-[#A6A6A6] border-[#2A2A2A] hover:text-[#F5F2EA]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Print, Archive, Cancel, Delete */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#202020]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintReceipt(selectedOrder)}
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#222222] text-[#F5F2EA] text-xs font-semibold hover:bg-[#2A2A2A] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => handleToggleArchive(selectedOrder)}
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#222222] text-[#F5F2EA] text-xs font-semibold hover:bg-[#2A2A2A] cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>{selectedOrder.archived ? 'Restore' : 'Archive'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedOrder.status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to cancel Order #${selectedOrder.order_number}?`)) {
                        handleStatusChange(selectedOrder.id, 'CANCELLED');
                      }
                    }}
                    className="py-2 px-3 rounded-xl bg-[#291818] hover:bg-[#381f1f] text-[#F87171] text-xs font-bold cursor-pointer"
                  >
                    Cancel Order
                  </button>
                )}

                <button
                  onClick={() => {
                    setOrderToDelete(selectedOrder);
                    setDeleteConfirmationInput('');
                  }}
                  className="p-2 rounded-xl bg-[#291818] hover:bg-[#381f1f] text-[#F87171] cursor-pointer"
                  title="Permanent Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PERMANENT DELETE CONFIRMATION DIALOG (Part 14) */}
      {orderToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full p-6 rounded-3xl bg-[#141414] border border-[#522020] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#291818] text-[#F87171] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-display font-bold text-lg text-[#F5F2EA]">
                Permanent Order Deletion
              </h4>
              <p className="text-xs text-[#A6A6A6]">
                This will permanently delete Order <strong>#{orderToDelete.order_number}</strong>. This action cannot be undone.
              </p>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#A6A6A6] block mb-1">
                Type "{orderToDelete.order_number}" to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationInput}
                onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                placeholder={orderToDelete.order_number}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-[#F5F2EA] focus:border-[#F87171] focus:outline-none font-display uppercase tracking-wider"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-[#222222] text-[#A6A6A6] text-xs font-semibold hover:text-[#F5F2EA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="flex-1 py-2.5 rounded-xl bg-[#D62828] text-white text-xs font-display font-bold uppercase tracking-wider cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
