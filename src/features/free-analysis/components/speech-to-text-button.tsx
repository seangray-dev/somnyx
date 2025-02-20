"use client";

import { useEffect, useRef, useState } from "react";

import { MicIcon, StopCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SpeechToTextButton({
  onTranscript,
  isRecording,
  onRecordingChange,
  disabled = false,
}: {
  onTranscript: (text: string, isInterim?: boolean) => void;
  isRecording: boolean;
  onRecordingChange: (isRecording: boolean) => void;
  disabled?: boolean;
}) {
  const [isActive, setIsActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Started recording");
      setIsActive(true);
      onRecordingChange(true);
      onTranscript(""); // Clear existing text
    };

    recognition.onend = () => {
      console.log("Stopped recording");
      setIsActive(false);
      onRecordingChange(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Send the appropriate transcript
      if (finalTranscript) {
        console.log("Final:", finalTranscript);
        onTranscript(finalTranscript, false);
      } else if (interimTranscript) {
        console.log("Interim:", interimTranscript);
        onTranscript(interimTranscript, true);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Recognition error:", event.error);
      setIsActive(false);
      onRecordingChange(false);

      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please check your permissions.");
      } else {
        toast.error("An error occurred with the microphone.");
      }
    };

    recognitionRef.current = recognition;

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []); // Only initialize once

  const toggleRecording = () => {
    if (disabled) return;

    if (!recognitionRef.current) {
      toast.error("Speech recognition not available");
      return;
    }

    try {
      if (isActive) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Toggle recording error:", error);
      setIsActive(false);
      onRecordingChange(false);
      toast.error("Failed to toggle recording");
    }
  };

  return (
    <Button
      className={cn("relative", disabled && "hover:cursor-not-allowed")}
      onClick={toggleRecording}
      variant={isActive ? "destructive" : "secondary"}
      size="icon"
      title={isActive ? "Stop recording" : "Start recording"}
      type="button"
      disabled={disabled}
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
