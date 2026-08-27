import React, { Suspense } from 'react';
import './Home.css';

// Imports - کامپوننت‌های هسته
import Navbar from '../components/Navbar';
import LanguageSwitcher from '../components/LanguageSwitcher';
import PiPaymentPanel from '../components/PiPaymentPanel';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Roadmap from '../components/Roadmap';
import Poll from '../components/Poll';
import About from '../components/About';
import Footer from '../components/Footer';

/**
 * Home Page Component
 * Represents the main landing page for Pi Explorer.
 * This page orchestrates all major sections of the decentralized ecosystem.
 */
const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Navigation Layer */}
      <Navbar />

      <main className="home-main">
        {/* Global Utilities: Language & Region Settings */}
        <nav className="home-language-section" aria-label="Language Selection">
          <div className="home-language-switcher">
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Hero Section: Initial Brand Impression (Pi Explorer) */}
        <Hero />

        {/* Pi Network Integration: Payment & Auth Layer */}
        <section 
          id="pi-payment-panel" 
          className="home-pi-panel" 
          aria-labelledby="pi-panel-title"
        >
          {/* در آینده: این بخش می‌تواند از یک Context برای مدیریت وضعیت اتصال به Pi SDK استفاده کند */}
          <PiPaymentPanel />
        </section>

        {/* Core Value Propositions */}
        <section id="features" className="home-features-section">
          <Features />
        </section>

        {/* Project Milestones & Development Path */}
        <section id="roadmap" className="home-roadmap-section">
          <Roadmap />
        </section>

        {/* Governance & Community Interaction (DAO Features) */}
        <section id="governance" className="home-poll-section">
          <Poll />
        </section>

        {/* Project Background & Vision */}
        <section id="about" className="home-about-section">
          <About />
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Home;
