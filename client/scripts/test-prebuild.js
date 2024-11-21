const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create a mock plist file path that simulates what EAS would provide
const mockPlistPath = path.join(__dirname, '..', 'temp-google-services.plist');

// Create a temporary plist file (you can copy your actual plist file here for testing)
fs.copyFileSync(
  path.join(__dirname, '..', 'config', 'GoogleService-Info.plist'), // Your local plist file
  mockPlistPath
);

try {
  // Run the prebuild script with simulated EAS environment
  execSync('node ./scripts/prebuild.js', {
    env: {
      ...process.env,
      EAS_BUILD: 'true',
      GOOGLE_SERVICES_PLIST_PATH: mockPlistPath
    },
    stdio: 'inherit' // This will show all console output
  });

  // Clean up the temporary file
  fs.unlinkSync(mockPlistPath);

  console.log('Test completed successfully');
} catch (error) {
  console.error('Test failed:', error);
  // Clean up even if there's an error
  if (fs.existsSync(mockPlistPath)) {
    fs.unlinkSync(mockPlistPath);
  }
  process.exit(1);
} 