'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from '../../components/TodoForm';

async function getTodo(id) {
  const res = await fetch(`http://localhost:5000/api/todos/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch todo');
  }
  return res.json();
}

async function updateTodo(id, data) {
  const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update todo');
  }
  return res.json();
}

export default function TodoPage({ params }) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function loadTodo() {
      try {
        const data = await getTodo(params.id);
        setTodo(data);
      } catch (err) {
        setError('Failed to load todo');
      } finally {
        setLoading(false);
      }
    }
    loadTodo();
  }, [params.id]);

  const handleSubmit = async (formData) => {
    try {
      setError(null);
      await updateTodo(params.id, formData);
      router.push('/');
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!todo) {
    return <div className="text-center py-8">Todo not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Todo</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <TodoForm initialData={todo} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
} 