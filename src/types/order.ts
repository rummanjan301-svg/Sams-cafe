export type OrderType = 'pickup' | 'delivery';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItemRecord {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  delivery_address?: string | null;
  delivery_landmark?: string | null;
  special_instructions?: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  archived: boolean;
  created_at: string;
  updated_at: string;
  items?: OrderItemRecord[];
}

export interface OrderStatusHistoryItem {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_by: string;
  created_at: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  deliveryFee: number;
  minimumOrder: number;
  openingHoursDisplay: string;
  onlineOrderingActive: boolean;
  soundEnabled: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}
