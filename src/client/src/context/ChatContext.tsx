import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { Status } from '../types';

export interface PageChatContext {
  ticketId?: string;
  ticketStatus?: Status;
  lastError?: string | null;
}

interface ChatContextValue {
  route: string;
  pageContext: PageChatContext;
  setPageContext: (context: PageChatContext) => void;
  clearPageContext: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

const emptyPageContext: PageChatContext = {};

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [pageContext, setPageContextState] = useState<PageChatContext>(emptyPageContext);

  const setPageContext = useCallback((context: PageChatContext) => {
    setPageContextState(context);
  }, []);

  const clearPageContext = useCallback(() => {
    setPageContextState(emptyPageContext);
  }, []);

  const value = useMemo(
    () => ({
      route: location.pathname,
      pageContext,
      setPageContext,
      clearPageContext,
    }),
    [location.pathname, pageContext, setPageContext, clearPageContext]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatContextProvider');
  }
  return context;
}
