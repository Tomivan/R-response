'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/sidebar/sidebar';
import Topbar from '../components/topbar/topbar';
import styles from './help.module.css';

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  departments: string[];
  examples: string[];
  contact?: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    icon: '⚖️',
    description: 'Report human misbehaviours and violations of conduct policies.',
    departments: ['Ethics Committee', 'HR Department'],
    examples: [
      'Domestic and sexual abuse',
      'Theft and fraud',
      'Disputes with staff working for church businesses',
      'Harassment and intimidation'
    ],
  },
  {
    id: 'fire-department',
    title: 'Fire Department',
    icon: '🔥',
    description: 'Immediate response for fire emergencies and road accidents.',
    departments: ['Fire Rescue', 'Hazmat Division'],
    examples: [
      'Fire outbreaks',
      'Road accidents',
      'Hazardous material incidents',
      'Smoke or gas emergencies'
    ],
    contact: '991',
  },
  {
    id: 'electrical-department',
    title: 'Electrical Department',
    icon: '⚡',
    description: 'Address electrical issues and power-related emergencies.',
    departments: ['Electrical Maintenance', 'Power Grid'],
    examples: [
      'Meter issues and faults',
      'Transformer problems',
      'Street light failures',
      'Power outages'
    ],
    contact: '+2348022592463',
  },
  {
    id: 'health-centre',
    title: 'RCCG Health Centre',
    icon: '🏥',
    description: 'Medical emergencies and health-related interventions.',
    departments: ['Emergency Medical Services', 'General Practice'],
    examples: [
      'Health emergencies',
      'Medical interventions',
      'Injury treatment',
      'Urgent care needs'
    ],
    contact: '+23418447340',
  },
  {
    id: 'sanitation-department',
    title: 'Sanitation Department',
    icon: '🗑️',
    description: 'Maintain cleanliness and address environmental health concerns.',
    departments: ['Waste Management', 'Environmental Health'],
    examples: [
      'Late refuse pickups',
      'Potential health hazards',
      'Waste disposal issues',
      'Environmental violations'
    ],
    contact: '+2348030760183',
  },
  {
    id: 'water-department',
    title: 'Water Department',
    icon: '💧',
    description: 'Resolve water supply and plumbing issues.',
    departments: ['Water Supply', 'Plumbing Services'],
    examples: [
      'Plumbing issues',
      'Pumping machine fixes',
      'Water supply interruptions',
      'Pipe bursts and leaks'
    ],
    contact: '+2348034059309',
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategory(selectedCategory === id ? null : id);
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <Topbar onMenuToggle={toggleSidebar} />
      
      <main className={`${styles.main} ${!sidebarOpen ? styles.fullWidth : ''}`}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.header}>
              <h1 className={styles.title}>Help & Support</h1>
              <p className={styles.subtitle}>
                Find the right department to report incidents and get assistance.
              </p>
            </div>

            <div className={styles.searchContainer}>
              <input
                type="text"
                className="input"
                placeholder="Search for help topics..."
                onChange={(e) => {
                  const searchTerm = e.target.value.toLowerCase();
                }}
              />
            </div>

            <div className={styles.categoriesGrid}>
              {helpCategories.map((category) => (
                <div 
                  key={category.id} 
                  className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.expanded : ''}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className={styles.categoryHeader}>
                    <div className={styles.categoryIcon}>{category.icon}</div>
                    <div className={styles.categoryInfo}>
                      <h3 className={styles.categoryTitle}>{category.title}</h3>
                      <p className={styles.categoryDescription}>{category.description}</p>
                    </div>
                    <span className={styles.expandIcon}>
                      {selectedCategory === category.id ? '−' : '+'}
                    </span>
                  </div>

                  {selectedCategory === category.id && (
                    <div className={styles.categoryDetails}>
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>Responsible Departments</h4>
                        <div className={styles.departmentTags}>
                          {category.departments.map((dept) => (
                            <span key={dept} className={styles.departmentTag}>
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={styles.detailSection}>
                        <h4 className={styles.detailTitle}>Reportable Incidents</h4>
                        <ul className={styles.exampleList}>
                          {category.examples.map((example, index) => (
                            <li key={index} className={styles.exampleItem}>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {category.contact && (
                        <div className={styles.contactSection}>
                          <span className={styles.contactLabel}>Contact:</span>
                          <a href={`tel:${category.contact.replace(/[^0-9+]/g, '')}`} className={styles.contactNumber}>
                            {category.contact}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}