import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import { SITE_NAME } from '../constants';
import styles from './Footer.module.css';

// Primary nav links mirrored in the footer
const quickLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const supportLinks = [
  { label: 'FAQ', path: '/faq' },
  { label: 'Shipping', path: '/shipping' },
  { label: 'Returns', path: '/returns' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms', path: '/terms' },
];

const socials = [
  { icon: FaFacebook, label: 'Facebook', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaPinterest, label: 'Pinterest', href: '#' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // In production this would connect to an email newsletter provider (Mailchimp/Klaviyo)
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand & Mission Statement */}
          <div>
            <div className={styles.brand}>{SITE_NAME}</div>
            <p className={styles.about}>
              Curated luxury fashion and lifestyle essentials. We bring you premium
              quality products with timeless design and exceptional craftsmanship.
            </p>
            <div className={styles.social}>
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.socialIcon}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Catalog shortcuts */}
          <div>
            <h4 className={styles.heading}>Shop</h4>
            <div className={styles.links}>
              {quickLinks.map((link) => (
                <Link key={link.path} to={link.path} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className={styles.heading}>Support</h4>
            <div className={styles.links}>
              {supportLinks.map((link) => (
                <Link key={link.path} to={link.path} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter Signup Box */}
          <div>
            <h4 className={styles.heading}>Newsletter</h4>
            <p className={styles.newsletterText}>
              Subscribe for exclusive offers, new arrivals, and style inspiration.
            </p>
            <form className={styles.form} onSubmit={handleNewsletterSubmit}>
              <input
                className={styles.input}
                type="email"
                placeholder="Your email"
                aria-label="Email address"
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
