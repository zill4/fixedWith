const fs = require('fs');
const path = require('path');

console.log('Starting prebuild script...');

// Define the target path for the plist file
const targetPlistPath = path.join(__dirname, '..', 'GoogleService-Info.plist');
console.log(`Target plist path: ${targetPlistPath}`);

if (process.env.GOOGLE_SERVICES_PLIST) {
  console.log('Found GOOGLE_SERVICES_PLIST secret, creating plist file...');
  try {
    // Write the base64 decoded content directly to the file
    const decodedContent = Buffer.from(process.env.GOOGLE_SERVICES_PLIST, 'base64').toString();
    fs.writeFileSync(targetPlistPath, decodedContent);
    console.log('Successfully created GoogleService-Info.plist from secret');
    
    // Verify file exists and has content
    const stats = fs.statSync(targetPlistPath);
    console.log(`File created with size: ${stats.size} bytes`);
  } catch (error) {
    console.error('Error creating plist file:', error);
    process.exit(1);
  }
} else {
  console.error('GOOGLE_SERVICES_PLIST environment variable not found');
  console.log('Available environment variables:', Object.keys(process.env));
  process.exit(1);
}