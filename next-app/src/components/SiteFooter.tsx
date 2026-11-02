import Link from 'next/link';
import { Year } from './Year';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Capabilities',
    links: [
      { label: 'Custom software', href: '/custom-software' },
      { label: 'Multi-vendor commerce', href: '/ecommerce' },
      { label: 'ERP & operations', href: '/erp' },
      { label: 'Web platforms', href: '/web-platforms' },
      { label: 'Mobile products', href: '/mobile-apps' },
      { label: 'Automation & models', href: '/automation' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Shamlai', href: '/shamlai' },
      { label: 'Pharmasys', href: '/pharmasys' },
      { label: 'Pdfing Pro', href: '/pdfing-pro' },
      { label: 'iCounsel', href: '/icounsel' },
      { label: 'All products', href: '/products' },
    ],
  },
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Approach', href: '/approach' },
      { label: 'Engagements', href: '/engagements' },
      { label: 'Process', href: '/process' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Direct',
    links: [
      { label: 'hello@intactic.net', href: 'mailto:hello@intactic.net' },
      { label: 'intactic.net', href: 'https://intactic.net' },
      { label: 'Start a project', href: '/contact' },
    ],
  },
];

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
            <p>
              A software engineering studio. Custom platforms, commerce, ERP and product interfaces, built to be run
              by the teams that own them.
            </p>
            <a className="linkarrow" href="mailto:hello@intactic.net">
              hello@intactic.net
            </a>
          </div>

          {COLUMNS.map((column) => (
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
          <a className="mono" href="#top">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
