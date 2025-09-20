
import { useState, useRef, useCallback } from 'react';

interface AudioData {
  blob: Blob;
  mimeType: string;
}

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            setIsRecording(true);
            audioChunksRef.current = [];
            
            const options = { mimeType: 'audio/webm' };
            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
              }
            };

            mediaRecorder.onstop = () => {
               // Get all tracks from the stream
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            resolve();
          })
          .catch(err => {
            console.error('Error accessing microphone:', err);
            reject(err);
          });
      } else {
        reject(new Error('getUserMedia not supported on your browser!'));
      }
    });
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise<AudioData | null>((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          setIsRecording(false);
          resolve({ blob: audioBlob, mimeType });
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording };
};
