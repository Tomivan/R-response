'use client';

import HomeNav from '../components/homeNav/homeNav';
import Image from 'next/image'
import Phone from '../../../public/images/phone.svg';
import MapPin from '../../../public/images/directory.svg';
import Home from '../../../public/images/home-image.svg';
import Flame from '../../../public/images/fire-truck.svg';
import MedicalBag from '../../../public/images/medical-bag.svg';
import Safety from '../../../public/images/safety.svg';
import AlertTriangle from '../../../public/images/alert.svg';
import styles from './home.module.css';
import Link from 'next/link';

export default function HomePage() {
    const year = new Date().getFullYear()
    
    const fireDepartmentNumber = '+2347098213112';
    const healthCentreNumber = '+23418447340';
    const securityNumber = '993'

  return (
    <div className={styles.container}>
        <HomeNav />
      <div className={styles.header}>
            <div className={styles.content}>
                <h1 className={styles.title}>Contact Directory</h1>
                <p className={styles.subtitle}>
                Immediate assistance for Redemption City residents and visitors. Our dispatch centers are operational 24/7 to ensure public safety and rapid response.
                </p>
                <div className={styles.headerActions}>
                <div className={styles.buttons}>
                    <button className={`button-primary ${styles.quickContactBtn}`}>
                        <Image src={Phone} alt="Quick Contact" className={styles.quickContactIcon} />
                        Quick Contact Info
                    </button>
                    <Link href="/directory" className={styles.link}>
                        <button className={`button-secondary ${styles.viewMapBtn}`}>
                            <Image src={MapPin} alt="View Map" className={styles.viewMapIcon} />
                            View All Departments
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        <Image src={Home} alt="people in front of computers" className={styles.homeImage} height={350} width={350}/>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Direct Dispatch Lines</h2>
        <p className={styles.sectionSubtitle}>
          Use these direct numbers for immediate departmental response.
        </p>

        <div className={styles.cardsGrid}>
          <div className={styles.contactCard}>
            <div className={styles.cardHeader}>
              <Image src={Flame} alt="Fire Service" className={styles.cardIcon} width={40} height={40} />
              <div>
                <h3 className={styles.cardTitle}>Fire Department</h3>
              </div>
            </div>
            <div className={styles.phoneNumber}>
              <a href={`tel:${fireDepartmentNumber}`} className={styles.phoneLink}>
                {fireDepartmentNumber}
              </a>
            </div>
            <a href={`tel:${fireDepartmentNumber}`} className={styles.callButtonLink}>
              <button className={`button-primary ${styles.callBtn}`}>
                CALL DEPARTMENT
              </button>
            </a>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardHeader}>
                <Image src={MedicalBag} alt="Health Centre" className={styles.cardIcon} width={40} height={40} />
              <div>
                <h3 className={styles.cardTitle}>Health Centre</h3>
              </div>
            </div>
            <div className={styles.phoneNumber}>
              <a href={`tel:${healthCentreNumber}`} className={styles.phoneLink}>
                {healthCentreNumber}
              </a>
            </div>
            <p className={styles.emsDescription}>
              Direct ambulance dispatch across the campground.
            </p>
            <a href={`tel:${healthCentreNumber}`} className={styles.callButtonLink}>
              <button className={`button-primary ${styles.callBtn}`}>
                CONTACT HEALTH CENTRE
              </button>
            </a>
          </div>

          <div className={styles.contactCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIconWrapper}>
                <Image src={Safety} alt="Security Department" className={styles.cardIcon} width={40} height={40} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Security Department</h3>
              </div>
            </div>
            <div className={styles.phoneNumber}>
              <a href={`tel:${securityNumber}`} className={styles.phoneLink}>
                {securityNumber}
              </a>
            </div>
            <div className={styles.securityTip}>
              <Image src={AlertTriangle} alt="Safety Tip" className={styles.securityTipIcon} />
              <p>Safety Tip: Always verify official personnel ID cards before allowing entry during security audits.</p>
            </div>
            <a href={`tel:${securityNumber}`} className={styles.callButtonLink}>
              <button className={`button-primary ${styles.callBtn}`}>
                REQUEST OFFICER
              </button>
            </a>
          </div>
        </div>
      </section>
      <footer className={styles.footer}>
        &#169; {year}  RCCG Redemption City
      </footer>
    </div>
  );
}