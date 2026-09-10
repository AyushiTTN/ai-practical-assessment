import { useCallback, useEffect, useRef, useState } from 'react';
import { getChatWelcome, sendChatMessage } from '../../api/chat';
import { useChatContext } from '../../context/ChatContext';
import ErrorAlert from '../ErrorAlert';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const { route, pageContext } = useChatContext();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const buildContext = useCallback(
    () => ({
      route,
      ticketId: pageContext.ticketId,
      ticketStatus: pageContext.ticketStatus,
      lastError: pageContext.lastError,
    }),
    [route, pageContext]
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open, scrollToBottom]);

  useEffect(() => {
    if (!open || initialized) return;

    let cancelled = false;

    async function loadWelcome() {
      setLoading(true);
      setError(null);
      try {
        const response = await getChatWelcome(buildContext());
        if (cancelled) return;
        setMessages([{ id: 'welcome', role: 'assistant', content: response.reply }]);
        setSuggestions(response.suggestions);
        setInitialized(true);
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWelcome();

    return () => {
      cancelled = true;
    };
  }, [open, initialized, buildContext]);

  useEffect(() => {
    setInitialized(false);
    setMessages([]);
    setSuggestions([]);
  }, [route, pageContext.ticketId, pageContext.ticketStatus]);

  async function handleSend(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSuggestions([]);
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(trimmed, buildContext());
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: 'assistant', content: response.reply },
      ]);
      setSuggestions(response.suggestions);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl sm:w-[24rem]">
          <div className="flex items-center justify-between border-b border-gray-200 bg-blue-600 px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">Help Assistant</h2>
              <p className="text-xs text-blue-100">Guide for tickets and status changes</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-blue-100 hover:bg-blue-700 hover:text-white"
              aria-label="Close help chat"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} role={message.role} content={message.content} />
            ))}
            {loading && (
              <p className="text-sm text-gray-500">Thinking...</p>
            )}
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
            <div ref={messagesEndRef} />
          </div>

          {suggestions.length > 0 && !loading && (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 px-3 py-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={() => handleSend(input)}
            disabled={loading}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-blue-700"
        aria-expanded={open}
        aria-label={open ? 'Close help chat' : 'Open help chat'}
      >
        {open ? 'Close Help' : 'Help'}
      </button>
    </div>
  );
}
