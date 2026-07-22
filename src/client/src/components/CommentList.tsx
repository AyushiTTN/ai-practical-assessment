import type { Comment } from '../types';

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-gray-500">No comments yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm">{c.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {c.createdBy.name} &middot; {new Date(c.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
