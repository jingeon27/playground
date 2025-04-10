import { isNull } from "lodash";
import { useRef, useState } from "react";

export function useAudioRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (isNull(mediaRecorderRef.current)) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
    }

    mediaRecorderRef.current.ondataavailable = ({ data }) => {
      audioChunksRef.current.push(data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const resetRecoding = () => {
    mediaRecorderRef.current = null;
  };

  return {
    isRecording,
    stopRecording,
    startRecording,
    resetRecoding,
    audioChunksRef,
    mediaRecorderRef,
    audioUrl,
  };
}
