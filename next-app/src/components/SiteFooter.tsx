import Link from 'next/link';
import { CookieSettingsLink } from '@/components/CookieNotice';
import { FOOTER } from '@/lib/config';
import { Year } from './Year';

/**
 * The footer reads its columns and brand copy from `data/site-config.json`
 * (admin phase 2) — the same file the studio will edit. The markup is
 * unchanged: the gate cannot see outside <main>, so the frozen reference and
 * the built pages are compared section by section in the phase-2 proof.
 */
export function SiteFooter() {
  return (
    <footer className="foot" data-od-id="footer">
      <div className="shell">
        <div className="foot__grid">
          <div className="foot__brand">
            <Link href="/" aria-label="Intactic — home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo--blue" src="/assets/img/logo-blue-500.png" alt="Intactic" width={125} height={19} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo--white" src="/assets/img/logo-white-500.png" alt="" width={125} height={19} />
            </Link>
            <p>{FOOTER.brand.blurb}</p>
            <a className="linkarrow" href={`mailto:${FOOTER.brand.email}`}>
              {FOOTER.brand.email}
            </a>
          </div>

          {FOOTER.columns.map((column) => (
            <div className="foot__col" key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('/') ? (
                      <Link href={link.href}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="foot__bar">
          <p className="mono">
            © <Year /> Intactic
          </p>
          <p className="mono">Software engineering studio</p>
          <div className="foot__legal">
            <CookieSettingsLink />
            <a className="mono" href="#top">
              Back to top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
