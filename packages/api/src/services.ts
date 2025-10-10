import { apiClient } from './client';
import { config, buildApiUrl } from '@icon/config';
import {
  HealthCheckResponse,
  CMSResponse,
  ApiResponse,
  User,
  LoginForm,
  RegisterForm,
} from '@icon/config/src/types';
import {
  mockHealthResponse,
  mockCMSResponse,
  mockUsers,
  mockDelay,
  mockErrors,
} from './mock';

// Health service
export const healthService = {
  async checkHealth(): Promise<HealthCheckResponse> {
    if (config.mockMode) {
      await mockDelay();
      return mockHealthResponse;
    }
    
    return apiClient.get<HealthCheckResponse>(buildApiUrl('health'));
  },
};

// CMS service
export const cmsService = {
  async getCMSData(): Promise<CMSResponse> {
    if (config.mockMode) {
      await mockDelay();
      return mockCMSResponse;
    }
    
    return apiClient.get<CMSResponse>(buildApiUrl('cms'));
  },

  async getHomeContent(): Promise<ApiResponse<any>> {
    if (config.mockMode) {
      await mockDelay();
      return {
        success: true,
        data: {
          title: 'Welcome to Icon Computer',
          content: 'Your trusted computer service and repair network. We provide professional computer services, repairs, and sales across multiple locations.',
          hero: {
            title: 'Welcome to Icon Mobile',
            subtitle: 'Your trusted mobile shopping companion',
            image: 'https://via.placeholder.com/400x200',
          },
          featuredProducts: [
            { id: '1', name: 'iPhone 15 Pro', price: 999, image: 'https://via.placeholder.com/150' },
            { id: '2', name: 'Samsung Galaxy S24', price: 899, image: 'https://via.placeholder.com/150' },
            { id: '3', name: 'Google Pixel 8', price: 699, image: 'https://via.placeholder.com/150' },
          ],
          announcements: [
            { id: '1', title: 'New Year Sale', message: 'Up to 50% off on selected items!' },
            { id: '2', title: 'Free Shipping', message: 'Free shipping on orders over $100' },
          ],
        },
      };
    }
    
    return apiClient.get<ApiResponse<any>>(buildApiUrl('cms') + '/home');
  },

  async getShops(): Promise<ApiResponse<any[]>> {
    if (config.mockMode) {
      await mockDelay();
      return {
        success: true,
        data: [
          {
            id: '1',
            name: 'Icon Computer Downtown',
            address: '123 Main St, Downtown',
            phone: '+1 (555) 123-4567',
            operatingHours: 'Mon-Sat: 9AM-8PM, Sun: 11AM-6PM',
            image: 'https://via.placeholder.com/300x200',
            rating: 4.8,
            services: ['Repairs', 'Sales', 'Consultation'],
            isActive: true,
            email: 'downtown@iconcomputer.com',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            name: 'Icon Computer Mall',
            address: '456 Shopping Center Blvd',
            phone: '+1 (555) 234-5678',
            operatingHours: 'Mon-Sun: 10AM-9PM',
            image: 'https://via.placeholder.com/300x200',
            rating: 4.6,
            services: ['Sales', 'Support', 'Accessories'],
            isActive: true,
            email: 'mall@iconcomputer.com',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
          {
            id: '3',
            name: 'Icon Computer Express',
            address: '789 Quick Service Ave',
            phone: '+1 (555) 345-6789',
            operatingHours: 'Mon-Fri: 8AM-6PM',
            image: 'https://via.placeholder.com/300x200',
            rating: 4.7,
            services: ['Quick Repairs', 'Parts', 'Diagnostics'],
            isActive: true,
            email: 'express@iconcomputer.com',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
      };
    }
    
    return apiClient.get<ApiResponse<any[]>>(buildApiUrl('cms') + '/shops');
  },

  async getShopById(shopId: string): Promise<ApiResponse<any>> {
    if (config.mockMode) {
      await mockDelay();
      
      // Find shop by ID from mock data
      const shops = [
        {
          id: '1',
          name: 'Icon Computer Downtown',
          address: '123 Main St, Downtown',
          phone: '+1 (555) 123-4567',
          operatingHours: 'Mon-Sat: 9AM-8PM, Sun: 11AM-6PM',
          image: 'https://via.placeholder.com/300x200',
          rating: 4.8,
          services: ['Repairs', 'Sales', 'Consultation'],
          isActive: true,
          email: 'downtown@iconcomputer.com',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'Icon Computer Mall',
          address: '456 Shopping Center Blvd',
          phone: '+1 (555) 234-5678',
          operatingHours: 'Mon-Sun: 10AM-9PM',
          image: 'https://via.placeholder.com/300x200',
          rating: 4.6,
          services: ['Sales', 'Support', 'Accessories'],
          isActive: true,
          email: 'mall@iconcomputer.com',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '3',
          name: 'Icon Computer Express',
          address: '789 Quick Service Ave',
          phone: '+1 (555) 345-6789',
          operatingHours: 'Mon-Fri: 8AM-6PM',
          image: 'https://via.placeholder.com/300x200',
          rating: 4.7,
          services: ['Quick Repairs', 'Parts', 'Diagnostics'],
          isActive: true,
          email: 'express@iconcomputer.com',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ];
      
      const shop = shops.find(s => s.id === shopId);
      if (!shop) {
        return {
          success: false,
          error: 'Shop not found',
        };
      }
      
      return {
        success: true,
        data: shop,
      };
    }
    
    return apiClient.get<ApiResponse<any>>(buildApiUrl('cms') + `/shops/${shopId}`);
  },
};

// Auth service
export const authService = {
  async login(credentials: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    if (config.mockMode) {
      await mockDelay();
      
      // Mock login validation
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user || credentials.password !== 'password123') {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }
      
      return {
        success: true,
        data: {
          user,
          token: 'mock-jwt-token-' + user.id,
        },
      };
    }
    
    return apiClient.post<ApiResponse<{ user: User; token: string }>>(
      buildApiUrl('auth') + '/login',
      credentials
    );
  },

  async register(form: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> {
    if (config.mockMode) {
      await mockDelay();
      
      // Mock registration validation
      const existingUser = mockUsers.find(u => u.email === form.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Email already exists',
        };
      }
      
      // Create new mock user
      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email: form.email,
        name: form.name,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return {
        success: true,
        data: {
          user: newUser,
          token: 'mock-jwt-token-' + newUser.id,
        },
      };
    }
    
    return apiClient.post<ApiResponse<{ user: User; token: string }>>(
      buildApiUrl('auth') + '/register',
      form
    );
  },

  async logout(): Promise<ApiResponse> {
    if (config.mockMode) {
      await mockDelay();
      return { success: true };
    }
    
    return apiClient.post<ApiResponse>(buildApiUrl('auth') + '/logout');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (config.mockMode) {
      await mockDelay();
      // Return first user as current user for mock
      return {
        success: true,
        data: mockUsers[0],
      };
    }
    
    return apiClient.get<ApiResponse<User>>(buildApiUrl('auth') + '/me');
  },
};

// User service
export const userService = {
  async getUsers(): Promise<ApiResponse<User[]>> {
    if (config.mockMode) {
      await mockDelay();
      return {
        success: true,
        data: mockUsers,
      };
    }
    
    return apiClient.get<ApiResponse<User[]>>(buildApiUrl('users'));
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    if (config.mockMode) {
      await mockDelay();
      const user = mockUsers.find(u => u.id === id);
      if (!user) {
        return mockErrors.notFound as ApiResponse<User>;
      }
      return {
        success: true,
        data: user,
      };
    }
    
    return apiClient.get<ApiResponse<User>>(`${buildApiUrl('users')}/${id}`);
  },
};

// Agent service
export const agentService = {
  async getCurrentAgent(): Promise<ApiResponse<any>> {
    if (config.mockMode) {
      await mockDelay();
      return {
        success: true,
        data: {
          id: 'agent-001',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          status: 'active',
          joinDate: '2024-01-15',
          totalSales: 15420.50,
          commission: 2313.08,
          rating: 4.8,
          completedOrders: 142,
        },
      };
    }
    
    return apiClient.get<ApiResponse<any>>(buildApiUrl('agents') + '/current');
  },

  async getAgentDashboard(): Promise<ApiResponse<any>> {
    if (config.mockMode) {
      await mockDelay();
      return {
        success: true,
        data: {
          totalSales: 15420.50,
          todaySales: 1250.00,
          pendingOrders: 8,
          completedOrders: 142,
          recentActivity: [
            { id: '1', action: 'Order completed', time: '2 hours ago' },
            { id: '2', action: 'New customer registered', time: '4 hours ago' },
            { id: '3', action: 'Product inquiry', time: '6 hours ago' },
          ],
        },
      };
    }
    
    return apiClient.get<ApiResponse<any>>(buildApiUrl('agents') + '/dashboard');
  },
};

// Export all services
export const api = {
  health: healthService,
  cms: cmsService,
  auth: authService,
  user: userService,
  agent: agentService,
};

export default api;