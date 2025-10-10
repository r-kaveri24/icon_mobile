// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER' | 'AGENT';
  createdAt: string;
  updatedAt: string;
}

// Shop types
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  operatingHours: string;
  createdAt: string;
  updatedAt: string;
}

// Agent types
export interface Agent {
  id: string;
  userId: string;
  shopId: string;
  user?: User;
  shop?: Shop;
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Banner types
export interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Offer types
export interface Offer {
  id: string;
  title: string;
  description?: string;
  discountPercentage: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// CMS Response types
export interface CMSResponse {
  title: string;
  content: string;
  banners: Banner[];
  offers: Offer[];
  products: Product[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Health Check types
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  version: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  ShopList: undefined;
  ShopDetail: { shopId: string };
};

export type AgentStackParamList = {
  Dashboard: undefined;
  HealthCheck: undefined;
  Settings: undefined;
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}