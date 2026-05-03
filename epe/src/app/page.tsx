"use client";

import React, { useState, useRef } from 'react';
import styles from './page.module.css';
import VoiceAssistant from '../components/VoiceAssistant';
import EducationCard from '../components/EducationCard';
import { Vote, FileSignature, CheckSquare, Fingerprint } from 'lucide-react';

export default function Home() {
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize synth on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const cards = [
    {
      title: "Who Can Vote?",
      icon: <Fingerprint size={40} />,
      colorClass: "primary",
      spokenText: "Any citizen who is 18 years of age or older can vote. You need to be registered in the voters list."
    },
    {
      title: "How to Register?",
      icon: <FileSignature size={40} />,
      colorClass: "secondary",
      spokenText: "To register, fill out Form 6 online or at your local voter registration center. Bring your ID proof."
    },
    {
      title: "The Polling Station",
      icon: <Vote size={40} />,
      colorClass: "accent",
      spokenText: "Go to your assigned polling booth. Show your Voter ID card to the officer. They will check your name."
    },
    {
      title: "How to Cast Vote",
      icon: <CheckSquare size={40} />,
      colorClass: "success",
      spokenText: "Press the blue button next to your chosen candidate on the EVM machine. A red light will glow, and you will hear a beep sound."
    }
  ];

  const handlePlayCard = (index: number) => {
    // Stop any existing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    setActiveCardIndex(index);
    
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(cards[index].spokenText);
      utterance.rate = 0.9;
      utterance.onend = () => setActiveCardIndex(null);
      utterance.onerror = () => setActiveCardIndex(null);
      synthRef.current.speak(utterance);
    }
  };

  const handleStopCard = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setActiveCardIndex(null);
  };

  // When voice assistant starts listening, stop card speech
  const handleAssistantStateChange = (isListening: boolean) => {
    if (isListening) {
      handleStopCard();
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Election Guide</h1>
          <p className={styles.subtitle}>Tap a card to listen, or talk to the voice assistant.</p>
        </header>

        <section className={styles.hero}>
          <div className={`${styles.heroIconContainer} animate-float`}>
            <Vote size={64} />
          </div>
          <VoiceAssistant onStateChange={handleAssistantStateChange} />
        </section>

        <section className={styles.grid}>
          {cards.map((card, index) => (
            <EducationCard
              key={index}
              title={card.title}
              icon={card.icon}
              colorClass={card.colorClass}
              spokenText={card.spokenText}
              isCurrentlySpeaking={activeCardIndex === index}
              onPlay={() => handlePlayCard(index)}
              onStop={handleStopCard}
            />
          ))}
        </section>

        <footer className={styles.footer}>
          <p>Made for everyone. Your vote is your voice.</p>
        </footer>
      </div>
    </main>
  );
}
