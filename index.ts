import { registerRootComponent } from 'expo';
import App from './apps/user-app/App';

// Register the user-app as the root component when bundling from monorepo root
registerRootComponent(App);