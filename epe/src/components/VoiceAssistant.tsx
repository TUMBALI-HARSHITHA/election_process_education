"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2, Volume2, VolumeX } from 'lucide-react';
import styles from './VoiceAssistant.module.css';

interface VoiceAssistantProps {
  onStateChange?: (isListening: boolean) => void;
}

// Add global type declaration for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant({ onStateChange }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          stopListening();
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            handleVoiceSubmit();
          }
        };
      } else {
        console.warn("Speech Recognition API not supported in this browser.");
      }

      // Initialize Speech Synthesis
      synthRef.current = window.speechSynthesis;
    }
  }, [isListening]);

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setTranscript('');
    setResponse('');
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (onStateChange) onStateChange(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    if (onStateChange) onStateChange(false);
  };

  const handleVoiceSubmit = async () => {
    if (!transcript.trim()) {
      setIsListening(false);
      if (onStateChange) onStateChange(false);
      return;
    }

    setIsProcessing(true);
    setIsListening(false);
    if (onStateChange) onStateChange(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcript }),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setResponse(data.reply);
      speakText(data.reply);
    } catch (error) {
      console.error('Error fetching response:', error);
      setResponse("Sorry, I couldn't process that. Please try again.");
      speakText("Sorry, I couldn't process that. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current && text) {
      stopSpeaking();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className={styles.assistantContainer}>
      <div className={styles.displayArea}>
        {transcript && (
          <div className={styles.transcriptBubble}>
            <p>"{transcript}"</p>
          </div>
        )}
        
        {isProcessing && (
          <div className={styles.processingIndicator}>
            <Loader2 className={styles.spinner} size={24} />
            <span>Thinking...</span>
          </div>
        )}

        {response && (
          <div className={styles.responseBubble}>
            <p>{response}</p>
            {isSpeaking ? (
              <button onClick={stopSpeaking} className={styles.audioBtn} aria-label="Stop speaking">
                <VolumeX size={20} />
              </button>
            ) : (
              <button onClick={() => speakText(response)} className={styles.audioBtn} aria-label="Listen again">
                <Volume2 size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      <button 
        className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
        onClick={toggleListen}
        disabled={isProcessing}
        aria-label={isListening ? "Stop listening" : "Start speaking"}
      >
        {isListening ? (
          <Square fill="currentColor" size={40} />
        ) : (
          <Mic size={48} />
        )}
      </button>
      
      <p className={styles.helpText}>
        {isListening ? "Listening... Tap square to stop" : "Tap the microphone to ask a question"}
      </p>
    </div>
  );
}
