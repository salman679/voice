import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";

function Voice() {
  const {
    transcript,
    browserSupportsSpeechRecognition,
    listening,
    resetTranscript,
  } = useSpeechRecognition();
  const [voiceStart, setVoiceStart] = useState(false);
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    let sentenceTimeout;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && voiceStart) {
        SpeechRecognition.startListening({
          continuous: true,
          language: "en-us",
        });
      } else {
        SpeechRecognition.stopListening();
      }
    };

    if (transcript) {
      // Delay in milliseconds to consider the end of a sentence
      const sentenceEndDelay = 2000;

      // Clear previous timeout
      clearTimeout(sentenceTimeout);

      // Set a new timeout to handle the end of a sentence
      sentenceTimeout = setTimeout(() => {
        setSentences((prevSentences) => [...prevSentences, transcript.trim()]);
        resetTranscript();
      }, sentenceEndDelay);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(sentenceTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [voiceStart, resetTranscript, transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>The browser does not support voice recognition</span>;
  }

  function handleStartListening() {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-us",
      exclusive: true,
    });
    setVoiceStart(true);
  }

  function handleStopListening() {
    SpeechRecognition.stopListening();
  }

  return (
    <>
      <div className="container">
        <h2>Speech To Text Converter</h2>
        <br />
        <p>
          A React hook that converts speech from the microphone to text and
          makes it available to your React components.
        </p>
        <div className="main-content">
          <div>Transcript: {transcript}</div>
          <ul>
            Sentences:
            {sentences.map((sentence, index) => (
              <li key={index}>{sentence}</li>
            ))}
          </ul>
        </div>

        <div className="btn-style">
          <button onClick={handleStartListening} disabled={listening}>
            Start Listening
          </button>

          <button onClick={handleStopListening} disabled={!listening}>
            Stop Listening
          </button>
        </div>
      </div>
    </>
  );
}

export default Voice;
