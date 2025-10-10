const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Add workspace packages to resolver platforms
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// 4. Configure resolver to handle workspace packages
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 5. Add custom resolver for workspace packages
const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle workspace packages
  if (moduleName.startsWith('@icon/')) {
    const packageName = moduleName.replace('@icon/', '');
    const packagePath = path.resolve(workspaceRoot, 'packages', packageName, 'src', 'index.ts');
    
    try {
      const fs = require('fs');
      if (fs.existsSync(packagePath)) {
        return {
          filePath: packagePath,
          type: 'sourceFile',
        };
      }
    } catch (error) {
      // Fall back to default resolver
    }
  }
  
  // Fall back to the default resolver
  if (originalResolver) {
    return originalResolver(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

// 6. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

module.exports = config;