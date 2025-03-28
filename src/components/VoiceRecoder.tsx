import { useAudioRecord } from "../hooks/useAudioRecord";

export function VoiceRecorder() {
  const { isRecording, stopRecording, startRecording, audioUrl } =
    useAudioRecord();

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded text-white ${
          isRecording ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioUrl && (
        <div className="flex flex-col items-center">
          <audio controls src={audioUrl} className="mt-2" />
          <a
            href={audioUrl}
            download="recording.wav"
            className="mt-2 text-blue-500 underline"
          >
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
}
