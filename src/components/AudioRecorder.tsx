
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Send, X } from "lucide-react";

interface AudioRecorderProps {
  onComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
}

export const AudioRecorder = ({ onComplete, onCancel }: AudioRecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
            setAudioChunks([...chunks]);
          }
        };
        
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
        };
        
        setMediaRecorder(recorder);
        recorder.start();
        setRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };
    
    startRecording();
    
    return () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const handleSend = () => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      onComplete(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-3 bg-muted rounded-lg mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {recording ? (
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mr-3"></div>
          ) : (
            <Mic className="h-4 w-4 mr-3" />
          )}
          <span className="text-sm font-medium">
            {recording ? "Recording..." : "Recording finished"}
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          {recording ? (
            <Button type="button" size="sm"  variant="destructive" onClick={stopRecording}>
              <Square className="h-4 w-4 mr-1" />
              Stop
            </Button>
          ) : (
            <>
              {audioURL && (
                <audio controls src={audioURL} className="h-8 w-32 rounded" />
              )}
              <Button type="button" size="sm" variant="default" onClick={handleSend}>
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </>
          )}
          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
