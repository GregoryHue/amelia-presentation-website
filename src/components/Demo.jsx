import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import GlassesLogo from './GlassesLogo';
import './Demo.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: "Hi, I'm Amelia. Ask me anything — this is a placeholder interface, so my replies are canned rather than real.",
};

const SUGGESTED_PROMPTS = [
  'Summarize my unread emails',
  'Draft a follow-up to the client call',
  "What's on my calendar this week?",
];

// No model is wired up here — this just cycles through a few placeholder
// replies so the interaction loop (send → "thinking" → reply) has
// something to demo. Swap this out once there's a real API to call.
const CANNED_REPLIES = [
  "Placeholder response — this is where Amelia's real answer would appear.",
  "This demo doesn't call a real model yet, but imagine a sharp, useful answer landing here.",
  'Placeholder — Amelia would reason over your request and reply right here.',
];

const THINKING_DELAY = 900;

function Demo() {
  const [headRef, headVisible] = useReveal();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const replyIndexRef = useRef(0);
  const endRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setDraft('');
    setThinking(true);

    timerRef.current = setTimeout(() => {
      const reply = CANNED_REPLIES[replyIndexRef.current % CANNED_REPLIES.length];
      replyIndexRef.current += 1;
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setThinking(false);
    }, THINKING_DELAY);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <section id="demo" className="demo section-pad">
      <div className="container">
        <div ref={headRef} className={`demo__head reveal ${headVisible ? 'reveal--visible' : ''}`}>
          <h2 className="demo__title">Talk to Amelia</h2>
        </div>

        <div className="demo__panel">
          <div className="demo__messages">
            {messages.map((message, index) => (
              <div key={index} className={`demo__message demo__message--${message.role}`}>
                {message.role === 'assistant' && (
                  <span className="demo__avatar" aria-hidden="true">
                    <GlassesLogo />
                  </span>
                )}
                <p className="demo__bubble">{message.text}</p>
              </div>
            ))}

            {thinking && (
              <div className="demo__message demo__message--assistant">
                <span className="demo__avatar" aria-hidden="true">
                  <GlassesLogo />
                </span>
                <p className="demo__bubble demo__bubble--thinking" aria-label="Amelia is typing">
                  <span className="demo__dot" />
                  <span className="demo__dot" />
                  <span className="demo__dot" />
                </p>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="demo__prompts">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="demo__prompt"
                onClick={() => sendMessage(prompt)}
                disabled={thinking}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="demo__form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="demo__input"
              placeholder="Message Amelia…"
              aria-label="Message Amelia"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={thinking}
            />
            <button
              type="submit"
              className="demo__send"
              aria-label="Send message"
              disabled={thinking || !draft.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16M13 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Demo;
