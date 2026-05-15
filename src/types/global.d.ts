/**
 * Google Analytics 4 global types
 * Extends Window interface to include gtag function
 */

interface GtagConfig {
  [key: string]: unknown;
}

interface GtagEvent {
  event_name: string;
  event_params?: Record<string, unknown>;
}

interface Gtag {
  (command: "js", config: GtagConfig): void;
  (command: "config", config: GtagConfig): void;
  (command: "event", eventName: string, eventParams?: Record<string, unknown>): void;
  (command: "set", config: GtagConfig): void;
}

declare global {
  interface Window {
    gtag: Gtag;
    dataLayer: unknown[];
  }
}

export {};