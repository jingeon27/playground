import { useAudioRecord } from "../hooks/useAudioRecord";
import clsx from "clsx";
import { isUndefined } from "lodash";
import { ComponentProps } from "react";

function Audio({ src, ...rest }: ComponentProps<"audio">) {
  if (isUndefined(src)) return null;
  return (
    <div className="flex flex-col items-center">
      <audio controls className="mt-2" {...rest} />
      <a
        href={src}
        download="recording.wav"
        className="mt-2 text-blue-500 underline"
      >
        Download Recording
      </a>
    </div>
  );
}

export function VoiceRecorder() {
  const { isRecording, stopRecording, startRecording, audioUrl } =
    useAudioRecord();

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={clsx(
          "px-4 py-2 rounded text-white",
          `${isRecording ? "bg-red-500" : "bg-blue-500"}`,
        )}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <Audio src={audioUrl ?? undefined} />
    </div>
  );
}
