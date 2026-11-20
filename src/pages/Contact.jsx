import { useState } from 'react';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiChevronDown,
  FiCheck,
} from 'react-icons/fi';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import { useToast } from '../context/ToastContext';
import styles from './Contact.module.css';

const faqs = [
  {
    q: 'How does complimentary shipping operate?',
    a: 'We offer complimentary express shipping on all orders across India exceeding ₹999. Deliveries typically arrive within 3–5 business days via Blue Dart or Delhivery with end-to-end tracking.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept unwashed, unworn items with original tags attached within 30 days of delivery. Every parcel includes a complimentary return pickup from your doorstep across all major Indian cities.',
  },
  {
    q: 'How do I ascertain my accurate sizing?',
    a: 'Each garment profile includes precise measurements in centimeters alongside fit notes. Our sizing follows Indian standard measurements. For bespoke advice, contact our concierge team.',
  },
  {
    q: 'Do you deliver across all states in India?',
    a: 'Yes, we deliver pan-India including all metros, tier-2 and tier-3 cities. Cash on Delivery is available in select pincodes. All applicable GST is included in the displayed price.',
  },
];

export default function Contact() {
  const { addToast } = useToast();
  const [openFaq, setOpenFaq] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please complete all form fields', 'error');
      return;
    }

    setIsSent(true);
    addToast('Your inquiry has been received. Our concierge will reply within 24 hours.');
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className={styles.contactPage}>
      <div className="container">
        <SectionHeader
          title="Client Concierge"
          subtitle="Whether inquiring about bespoke sizing, order logistics, or care guidance, our team is at your disposal."
        />

        <div className={styles.mainGrid}>
          {/* Contact Details Column */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Atelier &amp; Headquarters</h3>

              <div className={styles.infoItem}>
                <FiMapPin className={styles.infoIcon} />
                <div>
                  <strong>ATELIER Flagship &amp; Design Studio</strong>
                  <p>14, Connaught Place, Block F</p>
                  <p>New Delhi, DL 110001</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FiMail className={styles.infoIcon} />
                <div>
                  <strong>Electronic Correspondence</strong>
                  <p>concierge@atelier-store.in</p>
                  <p>press@atelier-store.in</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FiPhone className={styles.infoIcon} />
                <div>
                  <strong>Telephone Assistance</strong>
                  <p>+91 1800 202 5893</p>
                  <p>Complimentary toll-free</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FiClock className={styles.infoIcon} />
                <div>
                  <strong>Operating Hours</strong>
                  <p>Monday – Saturday: 10am – 8pm IST</p>
                  <p>Sunday: 11am – 6pm IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Transmit an Inquiry</h3>

              {isSent ? (
                <div className={styles.sentSuccess}>
                  <FiCheck className={styles.checkIcon} />
                  <h4>Message Dispatched</h4>
                  <p>
                    Thank you for reaching out. A client specialist has been assigned to your message and will respond promptly.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setIsSent(false)}>
                    Send Another Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label className={styles.label}>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Arjun Sharma"
                        className={styles.input}
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="arjun@example.in"
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={styles.select}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Status & Delivery">Order Status &amp; Delivery</option>
                      <option value="Returns & Exchange">Returns &amp; Exchange</option>
                      <option value="Fit & Sizing Consultation">Fit &amp; Sizing Consultation</option>
                      <option value="Wholesale & Press">Wholesale &amp; Press</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Message *</label>
                    <textarea
                      rows="5"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please specify your order ID or questions in detail..."
                      className={styles.textarea}
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" size="md">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section className={styles.faqSection}>
          <SectionHeader
            title="Frequently Addressed Questions"
            subtitle="Immediate guidance regarding our purchasing, delivery, and garment standards"
          />

          <div className={styles.faqAccordion}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <FiChevronDown
                      className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
