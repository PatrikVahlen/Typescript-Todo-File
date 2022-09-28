import React, { useState, useEffect } from 'react';
import TodoItem from "@my-todo-app/shared"
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_TODO_API || "http://localhost:3001"

const fetchTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>("/todos")
  return response.data
}

function App() {
  const [todoText, setTodoText] = useState<string>('');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string | undefined>();

  const createTodo = async (todoText: string): Promise<void> => {
    const todoItem: TodoItem = {
      text: todoText,
      timeStamp: new Date()
    }
    try {
      const response = await axios.post<TodoItem[]>('/todos', todoItem)
      setTodos(response.data)
    } catch (err) {
      setTodos([])
      setError('Something went wrong when fetching my todos...')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTodos()
        .then(setTodos)
        .catch((error) => {
          setTodos([])
          setError('Something went wrong when fetching my todos...')
        });
    }, 10000)

    return () => clearInterval(interval)
  }, []);

  const output = () => {
    if (error) {
      return (<div>{error}</div>)
    } else if (todos) {
      return (<div>{
        todos.map((item) => {
          return (<p key={item._id}>{item.text}</p>)
        })
      }</div>)
    } else {
      (<div>'Something went wrong fetching my todos...'</div>)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* {todo ? todo.text : error ? error : "Waiting for todos.."} */}
        {output()}
        <section>
          <input type="text" value={todoText} onChange={(e) => setTodoText(e.target.value)} />
          <button onClick={(e) => createTodo(todoText)}>Create Todo</button>
        </section>
      </header>
    </div>
  );
}

export default App;
