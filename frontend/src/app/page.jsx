"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoDetail from './components/TodoDetail';
import AppFooter from './components/AppFooter';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/todos', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch todos');
      }
      
      const data = await res.json();
      setTodos(data.todos || []);
      setError('');
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError(error.message);
    }
  };

  const handleTodoUpdate = (updatedTodo) => {
    setTodos(todos.map(todo => 
      todo._id === updatedTodo._id ? updatedTodo : todo
    ));
    setSelectedTodo(updatedTodo);
  };

  const handleTodoDelete = async (todoId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(todo => todo._id !== todoId));
      if (selectedTodo?._id === todoId) {
        setSelectedTodo(null);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError(error.message);
    }
  };

  const handleTodoToggle = async (todoId, checked) => {
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ checked }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }
      const updatedTodo = await res.json();
      setTodos(todos.map(todo => 
        todo._id === todoId ? updatedTodo : todo
      ));
      if (selectedTodo?._id === todoId) {
        setSelectedTodo(updatedTodo);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="flex-1 max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Todo App</h1>
          <TodoForm onSuccess={fetchTodos} />
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          <TodoList
            todos={todos}
            onDelete={handleTodoDelete}
            onToggle={handleTodoToggle}
            onSelect={setSelectedTodo}
          />
        </div>
        <TodoDetail todo={selectedTodo} onUpdate={handleTodoUpdate} />
      </div>
      <AppFooter />
    </div>
  );
}
