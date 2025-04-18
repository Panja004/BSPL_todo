"use client";

import { useState, useEffect } from 'react';

const TodoDetail = ({ todo, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setIsEditing(false);
    }
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          title, 
          description,
          checked: todo.checked 
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await res.json();
      onUpdate(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

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

  if (!todo) {
    return (
      <div className="w-1/3 bg-white p-6 border-l min-h-screen">
        <div className="text-center text-gray-500">
          Select a todo to view details
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white p-6 border-l min-h-screen">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 text-lg px-4 py-3 h-12"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 text-lg px-4 py-3"
              rows="6"
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900">{todo.title}</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Edit
              </button>
            </div>
            {todo.description && (
              <p className="mt-4 text-gray-600 whitespace-pre-wrap">{todo.description}</p>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Created: {formatDate(todo.date || todo.createdAt)}</span>
              <span className={`px-2 py-1 rounded ${
                todo.checked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {todo.checked ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoDetail; 