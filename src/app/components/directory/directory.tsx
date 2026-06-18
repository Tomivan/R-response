import HomeNav from '../homeNav/homeNav';
import Image from 'next/image';
import Link from 'next/link';
import Accomodation from '../../../../public/images/accomodation.svg';
import Restaurant from '../../../../public/images/restaurant.svg';
import Utilities from '../../../../public/images/utilities.svg';
import styles from './directory.module.css';

export default function DirectoryPage() {
  return (
    <div className={styles.container}>
      <HomeNav />
      <Link href="/home" className={styles.link}>Back home</Link>
      <div className={styles.card}>
        <h1 className={styles.title}>Department Directory</h1>
        <p className={styles.subtitle}>
          Essential contact information for all city departments and services.
        </p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Image src={Accomodation} alt='a house icon' className={styles.icon} width={30} height={30} />
             Accommodation
          </h2>
          <p className={styles.sectionSubtitle}>Chalets for Short Stay</p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.itemName}>JOY TO THE WISE</span>
              <span className={styles.itemContact}>MR JIROMADE OLA</span>
              <span className={styles.itemPhone}>+2348033961570</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>SHILOH APARTMENTS</span>
              <span className={styles.itemContact}>MR IDOWU</span>
              <span className={styles.itemPhone}>+2348037152898</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>MOSES APARTMENT</span>
              <span className={styles.itemContact}>SIJUADE ADEBAYO</span>
              <span className={styles.itemPhone}>+2348038510973</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>WHITE HOUSE SUITES</span>
              <span className={styles.itemContact}>AIYENURO BUKOLA</span>
              <span className={styles.itemPhone}>+2348038473897</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>INTERNATIONAL GUEST HOUSE</span>
              <span className={styles.itemContact}>AJIBADE JERRY</span>
              <span className={styles.itemPhone}>+2348032511111</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>AFRICA MISSIONS GUEST HOUSE</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>COMFORT PALACE</span>
              <span className={styles.itemContact}>DAVID MARY ADETOLA</span>
              <span className={styles.itemPhone}>+2348038057649</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>BETHEL SUITES</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>+2348111817522</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>OVERFLOW CHALETS</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>SHEPHERD PLACE</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>PEACE DELUXE</span>
              <span className={styles.itemContact}>MR AJIBADE JERRY</span>
              <span className={styles.itemPhone}>+2348032511111</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>OVERFLOW</span>
              <span className={styles.itemContact}>MRS BUKOLA AIYENURO</span>
              <span className={styles.itemPhone}>+2348038473897</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>DOVE GUEST HOUSE</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
          </ul>
        </section>

        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}> 
            <Image src={Restaurant} alt='a fork and a knife' className={styles.icon} width={30} height={30} />
            Restaurants
          </h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.itemName}>MIMI'S</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>+2348077281776</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>BETHEL PLACE</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>+234811817522</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>TRULY HOSPITABLE</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>+2347058898352</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>SHALOM RESTAURANT</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>TANTALIZERS</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>KING'S RESTAURANT</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>JOY TO THE WISE</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
            <li className={styles.listItem}>
              <span className={styles.itemName}>CHERITH RESTAURANT</span>
              <span className={styles.itemContact}>-</span>
              <span className={styles.itemPhone}>-</span>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Image src={Utilities} alt='a fork and a knife' className={styles.icon} width={30} height={30} />
            Other Departments
          </h2>
          <div className={styles.departmentsGrid}>
            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Sanitation & Dry Cleaning</h3>
              <p className={styles.deptContact}>RCCG Sanitation Department</p>
              <a href="tel:+2348030760183" className={styles.deptPhone}>
                +2348030760183
              </a>
            </div>

            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Fire Service</h3>
              <p className={styles.deptContact}>Emergency Response</p>
              <a href="tel:+2347098213112" className={styles.deptPhone}>
                +2347098213112
              </a>
            </div>

            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Medical Centre</h3>
              <p className={styles.deptContact}>RCCG Medical Centre</p>
              <a href="tel:+23418447340" className={styles.deptPhone}>
                +23418447340
              </a>
            </div>

            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Water Department</h3>
              <p className={styles.deptContact}>RCCG Water Department</p>
              <a href="tel:+2348034059309" className={styles.deptPhone}>
                +2348034059309
              </a>
            </div>

            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Electrical Department</h3>
              <p className={styles.deptContact}>General Issues</p>
              <a href="tel:+2348022592463" className={styles.deptPhone}>
                +2348022592463
              </a>
            </div>

            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Electrical Department</h3>
              <p className={styles.deptContact}>Metre Issues</p>
              <a href="tel:+2348066319471" className={styles.deptPhone}>
                +2348066319471
              </a>
            </div>

            <div className={styles.departmentCard}>
              <h3 className={styles.deptName}>Internet & Information</h3>
              <p className={styles.deptContact}>IT Gateway</p>
              <a href="tel:+238068680227" className={styles.deptPhone}>
                +238068680227
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}