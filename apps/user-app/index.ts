import { registerRootComponent } from 'expo';

import App from './App';
import { cmsService } from '@icon/api';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Expose a debug helper to fetch raw /home JSON without UI changes
try {
  (globalThis as any).__getHomeJSON = async () => {
    const data = await cmsService.getHomeRaw();
    console.log('[home json]', data);
    return data;
  };
  // Also expose via window for web preview
  if (typeof window !== 'undefined') {
    (window as any).__getHomeJSON = (globalThis as any).__getHomeJSON;
  }
} catch {}
