import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.33b2f08a9c6046dfba4ffb29c79be9ec',
  appName: 'Zonaya',
  webDir: 'dist',
  server: {
    url: 'https://33b2f08a-9c60-46df-ba4f-fb29c79be9ec.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a2e",
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: "#1a1a2e"
    }
  }
};

export default config;