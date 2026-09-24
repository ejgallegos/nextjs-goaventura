type AnalyticsValue = string | number | boolean;

/** Sends a bounded, non-identifying GA4 event when the analytics client is available. */
export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, AnalyticsValue>,
): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  try {
    window.gtag('event', eventName, parameters);
  } catch {
    // Analytics is optional and must never interrupt the user's navigation or inquiry.
  }
}
