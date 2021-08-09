import { ResultReason } from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ChatListItem, useChats } from "./store";
import Cookie from "universal-cookie";
import { Icon } from "./components";
import { getTimeAgo } from "./utils";

const speechsdk = require("microsoft-cognitiveservices-speech-sdk");

const getToken = async (): Promise<{ tkn: string; location: string }> => {
  console.log("called");
  const cookie = new Cookie();

  let tb_tkn = cookie.get("tb_tkn");

  if (tb_tkn) {
    return tb_tkn;
  } else {
    let location = process.env.REACT_APP_SPEECH_LOCATION!;

    const headers = {
      "Ocp-Apim-Subscription-Key": process.env.REACT_APP_SPEECH_KEY!,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return fetch(
      `https://${location}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers,
      }
    )
      .then((resp) => resp.text())
      .then((tkn) => {
        cookie.set("tb_tkn", JSON.stringify({ tkn, location }), {
          maxAge: 540,
          path: "/",
        });
        return { tkn, location };
      });
  }
};

const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useChats();
  const [token, tokenSet] = useState<string | null>(null);
  const [loaded, loadedSet] = useState<boolean>(false);

  const [status, statusSet] = useState<string>("Click to speak");
  const [recording, recordingSet] = useState<boolean>(false);
  const [displayText, displayTextSet] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLInputElement | null>(null);
	const listRef = useRef();

  const listen = () => {
    //check status check

    if (recording || displayText) {
      if (displayText) {
        recordingSet(false);
        dispatch({ type: "add", text: displayText!, id: Number(id) - 1 });
        displayTextSet(null);
        statusSet("Click to speak");
      }

      return;
    }

    recordingSet(true);

    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(
      token,
      process.env.REACT_APP_SPEECH_LOCATION!
    );
    speechConfig.speechRecognitionLanguage = "en-US";
    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new speechsdk.SpeechRecognizer(
      speechConfig,
      audioConfig
    );

    recognizer.recognizeOnceAsync((result: any) => {
      statusSet("Click to send");
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayTextSet(`${displayText || ""}${result.text}`);
      } else {
        displayTextSet(null);
        statusSet(
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly."
        );
        window.setTimeout(() => {
          statusSet("Click to speak");
        }, 1000);
      }

      recordingSet(false);
    });
  };

  const chats = useMemo(() => {
    let chats: ChatListItem[] = JSON.parse(JSON.stringify(state));
    return (
      chats
        .find((_, index) => index + 1 === Number(id))
        ?.chats.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ) || []
    );
  }, [id, state]);

  useEffect(() => {
    loadedSet(true);
  }, [chats]);

  useEffect(() => {
    getToken().then(({ tkn }) => {
      if (tkn) {
        tokenSet(tkn);
      }
    });
		dispatch({ type: "open", id: Number(id) - 1 });

  }, []);

  const firstUpdate = useRef(true);

  useEffect(() => {
    let behavior: ScrollBehavior = "smooth";
    if (firstUpdate.current) {
      firstUpdate.current = false;
      behavior = "auto";
    }
    messagesEndRef?.current?.scrollIntoView({ behavior });
  }, [recording, displayText, state]);

  return (
    <div className="chat-page">
      <div className="container">
        <ul className={loaded ? "loaded" : ""}>
          {chats.map((c, index) => (
            <li className={c.own ? "own" : ""} key={index}>
              {c.content}

              <span className="date">{getTimeAgo(c.date)}</span>
            </li>
          ))}
        </ul>
        <div ref={messagesEndRef} className="list-bottom"></div>
      </div>
      <div className="chat-input">
        <div className="container">
          {displayText && <div className="display">{displayText}</div>}
          <button
            onClick={() => (token ? listen() : null)}
            className={`mic-btn ${recording ? "recording" : ""}`}
          >
            <Icon>{token ? (recording ? "mic" : "mic_none") : "mic_off"}</Icon>
          </button>
          <span className="hint">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
