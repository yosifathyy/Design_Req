/**
 * ResizeObserver loop error suppression
 *
 * This utility suppresses the "ResizeObserver loop completed with undelivered notifications" error
 * which is a harmless browser warning that occurs when ResizeObserver callbacks trigger
 * synchronous DOM changes causing additional resize events.
 */

// Store original ResizeObserver
const OriginalResizeObserver = window.ResizeObserver;

// Debounce function for ResizeObserver notifications
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Enhanced ResizeObserver that handles errors gracefully
class EnhancedResizeObserver {
  private observer: ResizeObserver;
  private debouncedCallback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    // Debounce the callback to prevent rapid successive calls
    this.debouncedCallback = debounce(
      (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
        try {
          callback(entries, observer);
        } catch (error) {
          // Suppress ResizeObserver loop errors specifically
          if (
            error instanceof Error &&
            error.message.includes("ResizeObserver loop")
          ) {
            console.debug(
              "ResizeObserver loop error suppressed:",
              error.message,
            );
            return;
          }
          // Re-throw other errors
          throw error;
        }
      },
      16,
    ); // ~60fps debounce

    this.observer = new OriginalResizeObserver(this.debouncedCallback);
  }

  observe(target: Element, options?: ResizeObserverOptions) {
    return this.observer.observe(target, options);
  }

  unobserve(target: Element) {
    return this.observer.unobserve(target);
  }

  disconnect() {
    return this.observer.disconnect();
  }
}

/**
 * Initialize ResizeObserver error suppression
 * Call this once at app startup
 */
export function initializeResizeObserverFix() {
  // Replace global ResizeObserver with enhanced version
  window.ResizeObserver = EnhancedResizeObserver as any;

  // Suppress unhandled ResizeObserver errors globally
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      // Suppress this specific error
      console.debug("ResizeObserver error suppressed:", message);
      return;
    }
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
  };

  // Handle uncaught ResizeObserver errors
  const handleResizeObserverError = (event: ErrorEvent) => {
    if (
      event.message &&
      event.message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      )
    ) {
      event.preventDefault();
      console.debug("Uncaught ResizeObserver error suppressed:", event.message);
      return false;
    }
  };

  window.addEventListener("error", handleResizeObserverError);

  // Return cleanup function
  return () => {
    window.ResizeObserver = OriginalResizeObserver;
    console.error = originalConsoleError;
    window.removeEventListener("error", handleResizeObserverError);
  };
}
