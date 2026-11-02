'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/Icon';

/**
 * The contact page's project brief, ported from the legacy `app.js` handler
 * (`[data-brief-form]`). The form never posts: it validates with the browser's
 * own constraint API, builds a `mailto:` URL from the fields and hands it to
 * the OS mail client. Everything here exists to reproduce that handoff, so the
 * server component around it stays free of event handlers.
 */
const STATUS_MESSAGE =
  'Your email app should open with the brief filled in. If nothing happens, write to hello@intactic.net directly.';

export function BriefForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState('');

  // The legacy handler moved focus to the status line so it is read out; keep
  // that, now that the text arrives a render later than the imperative write.
  useEffect(() => {
    if (status) statusRef.current?.focus();
  }, [status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const get = (key: string) => (data.get(key) || '').toString().trim();
    const subject = 'Project brief — ' + (get('company') || get('name') || 'Intactic enquiry');
    // Note: `budget` is collected by the form but, as in the legacy app.js,
    // it is not part of the message. That omission is preserved on purpose.
    const lines = [
      'Name: ' + get('name'),
      'Company: ' + get('company'),
      'Email: ' + get('email'),
      'Project type: ' + get('type'),
      'Timeline: ' + get('timeline'),
      '',
      'Brief:',
      get('message'),
      '',
      '— Sent from intactic.net',
    ];
    const href =
      'mailto:hello@intactic.net?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(lines.join('\n'));

    setStatus(STATUS_MESSAGE);
    window.location.href = href;
  }

  return (
    <form className="form" data-brief-form="" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">Name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required placeholder="Your name" />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      </div>
      <div className="field">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" type="text" autoComplete="organization" placeholder="Company or team" />
      </div>
      <div className="field">
        <label htmlFor="f-type">Project type</label>
        <select id="f-type" name="type" required defaultValue="">
          <option value="">Select one</option>
          <option>Custom software</option>
          <option>Multi-vendor commerce</option>
          <option>ERP &amp; operations</option>
          <option>Web platform</option>
          <option>Mobile product</option>
          <option>Automation &amp; models</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-timeline">Timeline</label>
        <select id="f-timeline" name="timeline" defaultValue="">
          <option value="">Not sure yet</option>
          <option>As soon as possible</option>
          <option>This quarter</option>
          <option>Next quarter</option>
          <option>Just exploring</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-budget">Budget range</label>
        <select id="f-budget" name="budget" defaultValue="">
          <option value="">Prefer not to say</option>
          <option>Under $10k</option>
          <option>$10k &ndash; $25k</option>
          <option>$25k &ndash; $75k</option>
          <option>$75k+</option>
        </select>
      </div>
      <div className="field field--full">
        <label htmlFor="f-message">Brief</label>
        <textarea
          id="f-message"
          name="message"
          required
          aria-describedby="f-hint"
          placeholder="What the system does today, what breaks, and when you need it."
        />
        <p className="form__note" id="f-hint">A few sentences is enough. No decks required.</p>
      </div>
      <div className="form__foot">
        <button className="btn btn--primary btn--lg" type="submit">Prepare the brief
          <Icon name="i-arrow" />
        </button>
        <p className="form__note">This opens your email app with the brief filled in. Nothing is stored on this site.</p>
      </div>
      <p
        className="form__status"
        data-form-status=""
        role="status"
        aria-live="polite"
        tabIndex={-1}
        hidden={!status}
        ref={statusRef}
      >
        {status}
      </p>
    </form>
  );
}
