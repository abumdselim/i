'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * The cookie notice and its settings.
 *
 * The shape is borrowed from Brain Station 23's bar: one compact card in a
 * corner, one sentence, one primary action and a way into the detail — not a
 * full-width panel that covers the page. What it does not borrow is the missing
 * choice: there is a second action ("Essential only"), a settings panel, and the
 * answer is stored rather than assumed.
 *
 * Nothing on this site sets a non-essential cookie today, so the panel says that
 * plainly and the analytics switch ships off. It exists so that a measurement
 * script added later can read `document.documentElement.dataset.consent` and stay
 * silent until someone switches it on.
 *
 * The stored answer is read through `useSyncExternalStore` rather than an effect:
 * the server has no answer, the first client render adopts the stored one, and
 * React reconciles the two without a cascading render.
 */

const KEY = 'intactic.consent';
const VERSION = 1;
const OPEN_EVENT = 'intactic:consent-open';

export type Consent = { v: number; analytics: boolean; at: string };

function read(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    return parsed.v === VERSION && typeof parsed.analytics === 'boolean' ? (parsed as Consent) : null;
  } catch {
    return null;
  }
}

let cache: Consent | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function snapshot(): Consent | null {
  if (!loaded) {
    cache = read();
    loaded = true;
  }
  return cache;
}

function noSnapshot(): Consent | null {
  return null;
}

function publish() {
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const sync = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    loaded = false;
    publish();
  };
  window.addEventListener('storage', sync);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', sync);
  };
}

const hydratedSubscribe = () => () => {};
const hydrated = () => true;
const notHydrated = () => false;

function record(analytics: boolean): Consent {
  const next: Consent = { v: VERSION, analytics, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private mode: the answer still applies to this page view.
  }
  cache = next;
  loaded = true;
  publish();
  return next;
}

export function CookieNotice() {
  const consent = useSyncExternalStore(subscribe, snapshot, noSnapshot);
  const isClient = useSyncExternalStore(hydratedSubscribe, hydrated, notHydrated);
  const [manual, setManual] = useState(false);
  const [panel, setPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const switchRef = useRef<HTMLButtonElement | null>(null);
  const linkRef = useRef<HTMLButtonElement | null>(null);

  const visible = isClient && (manual || consent === null);

  // The choice is the site's only durable state; a measurement script added
  // later reads it from here instead of guessing.
  useEffect(() => {
    if (consent) document.documentElement.dataset.consent = consent.analytics ? 'analytics' : 'essential';
  }, [consent]);

  // The footer's "Cookie settings" link.
  useEffect(() => {
    const open = () => {
      setAnalytics(snapshot()?.analytics ?? false);
      setPanel(true);
      setManual(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (panel && visible) switchRef.current?.focus({ preventScroll: true });
  }, [panel, visible]);

  const choose = useCallback((value: boolean) => {
    record(value);
    setManual(false);
    setPanel(false);
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Escape') return;
      if (panel) {
        setPanel(false);
        linkRef.current?.focus({ preventScroll: true });
      } else if (consent) {
        setManual(false);
      }
    },
    [panel, consent],
  );

  if (!visible) return null;

  return (
    <div className="cookie" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text" onKeyDown={onKeyDown}>
      <p className="cookie__label mono" id="cookie-title">
        Cookies
      </p>

      {panel ? (
        <>
          <p className="cookie__text" id="cookie-text">
            Two categories. Nothing here is shared or sold, and there is no advertising to opt out of.
          </p>

          <div className="cookie__rows">
            <div className="cookie__row">
              <div>
                <p className="cookie__name" id="cookie-essential">
                  Essential
                </p>
                <p className="cookie__note">Remembers this answer. Always on.</p>
              </div>
              <span className="cookie__locked mono">On</span>
            </div>

            <div className="cookie__row">
              <div>
                <p className="cookie__name" id="cookie-analytics">
                  Analytics
                </p>
                <p className="cookie__note">Not in use. If measurement is added, it runs only with this on.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={analytics}
                aria-labelledby="cookie-analytics"
                className={analytics ? 'cookie__switch is-on' : 'cookie__switch'}
                onClick={() => setAnalytics((value) => !value)}
                ref={switchRef}
              >
                <span />
              </button>
            </div>
          </div>

          <div className="cookie__actions">
            <button type="button" className="btn btn--primary" onClick={() => choose(analytics)}>
              Save choice
            </button>
            <button type="button" className="btn btn--onink" onClick={() => setPanel(false)}>
              Back
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="cookie__text" id="cookie-text">
            This site sets no analytics or advertising cookies. The only thing kept is this answer, in your browser.
          </p>
          <div className="cookie__actions">
            <button type="button" className="btn btn--primary" onClick={() => choose(true)}>
              Accept
            </button>
            <button type="button" className="btn btn--onink" onClick={() => choose(false)}>
              Essential only
            </button>
          </div>
          <button
            type="button"
            className="cookie__link mono"
            aria-expanded={panel}
            onClick={() => setPanel(true)}
            ref={linkRef}
          >
            Cookie settings
          </button>
        </>
      )}
    </div>
  );
}

/** The footer's way back into the choice, once the card has been dismissed. */
export function CookieSettingsLink() {
  return (
    <button type="button" className="mono foot__cookie" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
