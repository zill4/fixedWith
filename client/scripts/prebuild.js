const fs = require('fs');
const path = require('path');

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

try {
  console.error('DEBUG: Starting prebuild script');
  
  const targetPlistPath = path.join(__dirname, '..', 'GoogleService-Info.plist');
  console.error(`DEBUG: Target path is ${targetPlistPath}`);
  
  console.error('DEBUG: Environment variables available:', Object.keys(process.env));
  
  if (process.env.GOOGLE_SERVICES_PLIST_PATH) {
    console.error(`DEBUG: Found GOOGLE_SERVICES_PLIST_PATH: ${process.env.GOOGLE_SERVICES_PLIST_PATH}`);
    fs.copyFileSync(process.env.GOOGLE_SERVICES_PLIST_PATH, targetPlistPath);
    
    const stats = fs.statSync(targetPlistPath);
    console.error(`DEBUG: File created with size: ${stats.size} bytes`);
  } else {
    console.error('DEBUG: GOOGLE_SERVICES_PLIST_PATH not found in environment');
    process.exit(1);
  }
} catch (error) {
  console.error('DEBUG: Error in prebuild script:', error);
  process.exit(1);
}