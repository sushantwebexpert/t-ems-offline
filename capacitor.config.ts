import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voters.awanish',
  appName: 'Awanish Voters',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    EdgeToEdge: {
      backgroundColor: "#278D27",
    },
    Keyboard: {
      resize: 'ionic', // or 'ionic' depending on your layout
    }
  },
};

export default config;

