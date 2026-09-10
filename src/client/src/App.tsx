import { Link, Route, Routes } from 'react-router-dom';
import ChatWidget from './components/chat/ChatWidget';
import { ChatContextProvider } from './context/ChatContext';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import TicketCreatePage from './pages/TicketCreatePage';

export default function App() {
  return (
    <ChatContextProvider>
      <div className="min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-semibold text-blue-700">
              Support Tickets
            </Link>
            <Link
              to="/tickets/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              New Ticket
            </Link>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<TicketListPage />} />
            <Route path="/tickets/new" element={<TicketCreatePage />} />
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Routes>
        </main>
      </div>
      <ChatWidget />
    </ChatContextProvider>
  );
}
