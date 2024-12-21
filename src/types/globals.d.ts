export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
  }
}

interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;
