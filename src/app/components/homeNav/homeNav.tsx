'use client'

import styles from './home-nav.module.css';
import '../../globals.css';
import Link from 'next/link';

export default function HomeNav() {
    return(
        <div className={styles.nav}>
            <h1 className={styles.title}>R-Response</h1>

            <Link href="/login" className={styles.navLink}>
              <button className="button-primary">Login to R-Response</button>
            </Link>
        </div>
    )
}