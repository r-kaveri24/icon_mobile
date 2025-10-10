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

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. Add resolver platforms and main fields for better compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 5. Custom resolver for workspace packages
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @icon/ workspace packages
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
      // Fall through to original resolver
    }
  }
  
  // Fall back to the original resolver
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;