import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Counter from "./pages/Counter";
import MovieSearch from "./pages/MovieSearch";
import MovieDetailPage from "./pages/MovieDetailPage";
import TodoList from "./pages/TodoList";
import TodoDetail from "./pages/TodoDetail";
import AddTodo from "./pages/Addtodo";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    const task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, task]);
  };

  const updateTask = (taskId, updates) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <Routes>
          {/* Home/Counter Route */}
          <Route path="/" element={<Counter />} />

          {/* Movie Routes */}
          <Route path="/movies" element={<MovieSearch />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />

          {/* Todo Routes */}
          <Route
            path="/todos"
            element={
              <TodoList
                tasks={tasks}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
                clearCompleted={clearCompleted}
              />
            }
          />
          <Route path="/todos/add" element={<AddTodo addTask={addTask} />} />
          <Route
            path="/todos/:id"
            element={
              <TodoDetail
                tasks={tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                toggleComplete={toggleComplete}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
