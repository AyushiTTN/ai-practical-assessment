interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Ask for help...',
}: ChatInputProps) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={500}
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        Send
      </button>
    </form>
  );
}
