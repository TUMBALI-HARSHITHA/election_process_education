"use client";

import React, { useRef } from 'react';
import styles from './EducationCard.module.css';
import { Volume2, VolumeX } from 'lucide-react';

interface EducationCardProps {
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  spokenText: string;
  isCurrentlySpeaking: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export default function EducationCard({ 
  title, 
  icon, 
  colorClass, 
  spokenText,
  isCurrentlySpeaking,
  onPlay,
  onStop
}: EducationCardProps) {
  
  const handleToggle = () => {
    if (isCurrentlySpeaking) {
      onStop();
    } else {
      onPlay();
    }
  };

  return (
    <div 
      className={`${styles.card} ${styles[colorClass]} ${isCurrentlySpeaking ? styles.active : ''}`}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      aria-label={`Learn about ${title}. Click to listen.`}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.actionBtn}>
        {isCurrentlySpeaking ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </div>
    </div>
  );
}
