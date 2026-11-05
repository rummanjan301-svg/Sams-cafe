import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  OrderRecord,
  OrderItemRecord,
  OrderStatus,
  OrderType,
  RestaurantSettings,
  ContactMessage
} from '../types/order';
import { MenuItem, CAFE_INFO } from '../data/menuData';

const LOCAL_ORDERS_KEY = 'sams_cafe_orders_store_v2';
const LOCAL_SETTINGS_KEY = 'sams_cafe_settings_store_v2';
const LOCAL_CONTACT_KEY = 'sams_cafe_contact_store_v2';

export const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: "SAM'S CAFE",
  phoneDisplay: CAFE_INFO.phoneDisplay,
  phoneRaw: CAFE_INFO.phoneRaw,
  whatsappNumber: CAFE_INFO.whatsappNumber,
  pickupAvailable: true,
  deliveryAvailable: true,
  deliveryFee: 100, // PKR
  minimumOrder: 350, // PKR
  openingHoursDisplay: "10:00 AM – 2:00 AM daily",
  onlineOrderingActive: true,
  soundEnabled: true
};

// --- In-Memory / Local Storage Helper for seamless operation ---
function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrders(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    // Broadcast for same-window or cross-tab instant dashboard sync
    window.dispatchEvent(new CustomEvent('sams_orders_updated'));
  } catch (e) {
    console.warn('Could not save orders locally', e);
  }
}

// Generate unique order number: e.g. SAM-8291
export function generateOrderNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SAM-${randomSuffix}`;
}

// 1. Submit Customer Order
export async function submitOrder(params: {
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress?: string;
  deliveryLandmark?: string;
  specialInstructions?: string;
  cartItems: { item: MenuItem; quantity: number }[];
  deliveryFee: number;
}): Promise<{ success: boolean; order?: OrderRecord; error?: string }> {
  const {
    customerName,
    customerPhone,
    orderType,
    deliveryAddress,
    deliveryLandmark,
    specialInstructions,
    cartItems,
    deliveryFee
  } = params;

  // Validation
  if (!customerName.trim()) {
    return { success: false, error: 'Customer name is required.' };
  }
  if (!customerPhone.trim()) {
    return { success: false, error: 'Valid phone number is required.' };
  }
  if (orderType === 'delivery' && !deliveryAddress?.trim()) {
    return { success: false, error: 'Delivery address is required for delivery orders.' };
  }
  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'Your cart is empty.' };
  }

  // Calculate Subtotal & Total
  const subtotal = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const finalDeliveryFee = orderType === 'delivery' ? deliveryFee : 0;
  const total = subtotal + finalDeliveryFee;
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  // Prepare Items
  const items: OrderItemRecord[] = cartItems.map((ci, index) => ({
    id: `item-${Date.now()}-${index}`,
    order_id: '',
    menu_item_id: ci.item.id,
    item_name_snapshot: ci.item.name,
    unit_price_snapshot: ci.item.price,
    quantity: ci.quantity,
    line_total: ci.item.price * ci.quantity
  }));

  const newOrder: OrderRecord = {
    id: `order-${Date.now()}`,
    order_number: orderNumber,
    customer_name: customerName.trim(),
    customer_phone: customerPhone.trim(),
    order_type: orderType,
    delivery_address: orderType === 'delivery' ? deliveryAddress?.trim() : null,
    delivery_landmark: orderType === 'delivery' ? deliveryLandmark?.trim() : null,
    special_instructions: specialInstructions?.trim() || null,
    subtotal,
    delivery_fee: finalDeliveryFee,
    total,
    status: 'PENDING',
    archived: false,
    created_at: now,
    updated_at: now,
    items
  };

  // If Supabase is connected, write to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: newOrder.customer_name,
          customer_phone: newOrder.customer_phone,
          order_type: orderType,
          delivery_address: newOrder.delivery_address,
          delivery_landmark: newOrder.delivery_landmark,
          special_instructions: newOrder.special_instructions,
          subtotal,
          delivery_fee: finalDeliveryFee,
          total,
          status: 'PENDING',
          archived: false
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.id;
      newOrder.id = orderId;

      // Insert order items
      const itemsToInsert = cartItems.map((ci) => ({
        order_id: orderId,
        menu_item_id: ci.item.id,
        item_name_snapshot: ci.item.name,
        unit_price_snapshot: ci.item.price,
        quantity: ci.quantity,
        line_total: ci.item.price * ci.quantity
      }));

      await supabase.from('order_items').insert(itemsToInsert);

      // Audit status history
      await supabase.from('order_status_history').insert({
        order_id: orderId,
        old_status: null,
        new_status: 'PENDING',
        changed_by: 'customer_checkout'
      });

      return { success: true, order: newOrder };
    } catch (err: any) {
      console.warn('Supabase order insert error, saving locally as fallback:', err);
      // Fallback to local store if network or credentials hit an issue
    }
  }

  // Local Store Fallback
  const existingOrders = getLocalOrders();
  saveLocalOrders([newOrder, ...existingOrders]);
  return { success: true, order: newOrder };
}

// 2. Fetch Orders with Filtering
export async function fetchOrders(options?: {
  typeFilter?: 'all' | OrderType;
  statusFilter?: 'all' | OrderStatus;
  archived?: boolean;
  searchQuery?: string;
  sort?: 'newest' | 'oldest';
}): Promise<OrderRecord[]> {
  const {
    typeFilter = 'all',
    statusFilter = 'all',
    archived = false,
    searchQuery = '',
    sort = 'newest'
  } = options || {};

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('orders').select('*, items:order_items(*)');

      query = query.eq('archived', archived);

      if (typeFilter !== 'all') {
        query = query.eq('order_type', typeFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: true });
      }

      const { data, error } = await query;
      if (!error && data) {
        let result: OrderRecord[] = data;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          result = result.filter(
            (o) =>
              o.order_number.toLowerCase().includes(q) ||
              o.customer_name.toLowerCase().includes(q) ||
              o.customer_phone.toLowerCase().includes(q)
          );
        }
        return result;
      }
    } catch (e) {
      console.warn('Supabase fetchOrders error, falling back to local store', e);
    }
  }

  // Local fallback
  let orders = getLocalOrders();

  orders = orders.filter((o) => (archived ? o.archived === true : !o.archived));

  if (typeFilter !== 'all') {
    orders = orders.filter((o) => o.order_type === typeFilter);
  }
  if (statusFilter !== 'all') {
    orders = orders.filter((o) => o.status === statusFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    orders = orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.toLowerCase().includes(q)
    );
  }

  orders.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return sort === 'newest' ? timeB - timeA : timeA - timeB;
  });

  return orders;
}

// 3. Update Order Status
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  adminUser = 'Admin'
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: now })
        .eq('id', orderId);

      if (!error) {
        await supabase.from('order_status_history').insert({
          order_id: orderId,
          new_status: newStatus,
          changed_by: adminUser
        });
        return true;
      }
    } catch (e) {
      console.warn('Supabase updateOrderStatus error', e);
    }
  }

  // Local fallback
  const orders = getLocalOrders();
  const updated = orders.map((o) =>
    o.id === orderId
      ? { ...o, status: newStatus, updated_at: new Date().toISOString() }
      : o
  );
  saveLocalOrders(updated);
  return true;
}

// 4. Archive / Unarchive Order
export async function setOrderArchived(orderId: string, archived: boolean): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ archived, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase setOrderArchived error', e);
    }
  }

  const orders = getLocalOrders();
  const updated = orders.map((o) => (o.id === orderId ? { ...o, archived } : o));
  saveLocalOrders(updated);
  return true;
}

// 5. Delete Order Permanently
export async function deleteOrder(orderId: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase deleteOrder error', e);
    }
  }

  const orders = getLocalOrders();
  const filtered = orders.filter((o) => o.id !== orderId);
  saveLocalOrders(filtered);
  return true;
}

// 6. Customer Track Order
export async function trackOrder(
  orderNumber: string,
  customerPhone: string
): Promise<OrderRecord | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = customerPhone.trim();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_number', cleanOrderNum)
        .eq('customer_phone', cleanPhone)
        .maybeSingle();

      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase trackOrder error', e);
    }
  }

  // Local fallback
  const orders = getLocalOrders();
  const found = orders.find(
    (o) =>
      o.order_number.toUpperCase() === cleanOrderNum &&
      o.customer_phone.replace(/\D/g, '') === cleanPhone.replace(/\D/g, '')
  );
  return found || null;
}

// 7. Strictly Order-Count Statistics (NO SALES OR REVENUE AGGREGATES)
export async function getDashboardOrderCounts(): Promise<{
  total: number;
  pending: number;
  accepted: number;
  preparing: number;
  ready: number;
  completed: number;
  cancelled: number;
  pickupCount: number;
  deliveryCount: number;
  archivedCount: number;
}> {
  const activeOrders = await fetchOrders({ archived: false });
  const archivedOrders = await fetchOrders({ archived: true });

  return {
    total: activeOrders.length,
    pending: activeOrders.filter((o) => o.status === 'PENDING').length,
    accepted: activeOrders.filter((o) => o.status === 'ACCEPTED').length,
    preparing: activeOrders.filter((o) => o.status === 'PREPARING').length,
    ready: activeOrders.filter((o) => o.status === 'READY').length,
    completed: activeOrders.filter((o) => o.status === 'COMPLETED').length,
    cancelled: activeOrders.filter((o) => o.status === 'CANCELLED').length,
    pickupCount: activeOrders.filter((o) => o.order_type === 'pickup').length,
    deliveryCount: activeOrders.filter((o) => o.order_type === 'delivery').length,
    archivedCount: archivedOrders.length
  };
}

// 8. Restaurant Settings
export function getStoredSettings(): RestaurantSettings {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: RestaurantSettings): void {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('sams_settings_updated'));
  } catch (e) {
    console.warn('Could not save settings', e);
  }
}

// 9. Contact Messages
export async function submitContactInquiry(inquiry: {
  name: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const record: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: inquiry.name.trim(),
    phone: inquiry.phone.trim(),
    subject: inquiry.subject.trim(),
    message: inquiry.message.trim(),
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contact_inquiries').insert(record);
      return true;
    } catch (e) {
      console.warn('Supabase contact insert error', e);
    }
  }

  try {
    const raw = localStorage.getItem(LOCAL_CONTACT_KEY);
    const list: ContactMessage[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LOCAL_CONTACT_KEY, JSON.stringify([record, ...list]));
    return true;
  } catch {
    return true;
  }
}
