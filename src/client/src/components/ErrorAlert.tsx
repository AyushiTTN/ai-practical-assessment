interface ErrorAlertProps {
  message: string;
  details?: { field: string; message: string }[];
  onDismiss?: () => void;
}

export default function ErrorAlert({ message, details, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <p className="font-medium">{message}</p>
        {onDismiss && (
          <button onClick={onDismiss} className="text-red-600 hover:text-red-800 text-sm">
            Dismiss
          </button>
        )}
      </div>
      {details && details.length > 0 && (
        <ul className="mt-2 text-sm list-disc list-inside">
          {details.map((d) => (
            <li key={d.field}>{d.field}: {d.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
