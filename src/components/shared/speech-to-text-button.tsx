"use client";

import { useEffect, useRef, useState } from "react";

import { MicIcon, StopCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function SpeechToTextButton({
  onTranscript = (text: string) => {},
}: {
  onTranscript?: (text: string) => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onstart = () => {
          setIsActive(true);
          transcriptRef.current = "";
        };

        recognitionRef.current.onend = () => {
          setIsActive(false);
          if (transcriptRef.current) {
            onTranscript(transcriptRef.current);
          }
        };

        recognitionRef.current.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            transcriptRef.current +=
              (transcriptRef.current ? " " : "") + transcript;
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsActive(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const handleToggle = () => {
    try {
      if (isActive) {
        recognitionRef.current?.stop();
      } else {
        recognitionRef.current?.start();
      }
    } catch (error) {
      console.error("Speech recognition error:", error);
      setIsActive(false);
    }
  };

  return (
    <Button
      className="relative"
      onClick={handleToggle}
      variant={isActive ? "destructive" : "secondary"}
      size="icon"
      title={isActive ? "Stop recording" : "Start recording"}
      type="button"
    >
      {isActive ? (
        <>
          <StopCircleIcon size={18} />
          <div className="absolute inset-0 animate-pulse overflow-hidden rounded bg-destructive/50" />
        </>
      ) : (
        <MicIcon size={18} />
      )}
    </Button>
  );
}
