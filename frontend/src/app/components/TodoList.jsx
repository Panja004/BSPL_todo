"use client";

import { useState } from "react";

export default function TodoList({ todos, onDelete, onToggle, onSelect }) {
  const [error, setError] = useState("");

  if (!todos?.length) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No todos yet. Create one above!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo._id}
            onClick={() => onSelect(todo)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              todo.checked 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={todo.checked}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggle(todo._id, !todo.checked);
                }}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium ${todo.checked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-sm ${todo.checked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {todo.description}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Created: {formatDate(todo.date || todo.createdAt)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(todo._id);
                }}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
