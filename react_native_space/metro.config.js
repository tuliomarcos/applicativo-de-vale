const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

const nodeModulesPath = path.resolve(projectRoot, 'node_modules');

// Check if node_modules is a symlink
if (fs.existsSync(nodeModulesPath) && fs.lstatSync(nodeModulesPath).isSymbolicLink()) {
  const realNodeModules = fs.realpathSync(nodeModulesPath);
  
  // Configure Metro to watch both the project root and the real node_modules location
  config.watchFolders = [projectRoot, realNodeModules];
  config.resolver.nodeModulesPaths = [realNodeModules];
}

module.exports = config;
