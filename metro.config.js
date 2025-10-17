const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Treat the monorepo root as the project root for bundling
const projectRoot = __dirname;
const workspaceRoot = projectRoot;

const config = getDefaultConfig(projectRoot);

// Watch the entire monorepo (root)
config.watchFolders = [workspaceRoot];

// Resolve node_modules from the root (workspaces install here)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Improve resolver compatibility
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Map workspace packages like @icon/* to their source entry for bundling
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
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

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;