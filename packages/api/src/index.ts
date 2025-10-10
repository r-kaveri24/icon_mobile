export { apiClient } from './client';
export { api, healthService, cmsService, authService, userService, agentService } from './services';
export * from './mock';

// Re-export types from config for convenience
export type {
  User,
  Shop,
  Agent,
  Product,
  Banner,
  Offer,
  CMSResponse,
  HealthCheckResponse,
  ApiResponse,
  LoginForm,
  RegisterForm,
} from '@icon/config/src/types';