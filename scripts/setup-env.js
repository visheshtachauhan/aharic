const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(process.cwd(), '.env.local');

// Required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_URL',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'STORAGE_BUCKET',
  'STORAGE_URL',
  'API_KEY',
  'API_SECRET'
];

// Optional environment variables with defaults
const optionalEnvVars = {
  'SMTP_HOST': 'smtp.gmail.com',
  'SMTP_PORT': '587',
  'ENABLE_ANALYTICS': 'true',
  'ENABLE_NOTIFICATIONS': 'true',
  'ENABLE_REALTIME': 'true'
};

function promptForValue(key, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue 
      ? `Enter value for ${key} (default: ${defaultValue}): `
      : `Enter value for ${key}: `;
    rl.question(prompt, (value) => {
      resolve(value || defaultValue);
    });
  });
}

async function setupEnv() {
  console.log('Setting up environment variables...\n');
  let envContent = '# Environment Variables\n\n';
  for (const key of requiredEnvVars) {
    const value = await promptForValue(key);
    if (!value) {
      console.error(`Error: ${key} is required but no value was provided.`);
      process.exit(1);
    }
    envContent += `${key}=${value}\n`;
  }
  for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
    const value = await promptForValue(key, defaultValue);
    envContent += `${key}=${value}\n`;
  }
  fs.writeFileSync(envPath, envContent);
  console.log('\nEnvironment variables have been set up successfully!');
  console.log(`File created at: ${envPath}`);
}

setupEnv().then(() => {
  rl.close();
}).catch((error) => {
  console.error('Error setting up environment variables:', error);
  process.exit(1);
}); 