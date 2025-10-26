import { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./TodoApp.css";

function TodoApp() {
  const [tasks, setTasks] = useState([]);

  const addTask = (newTask) => {
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  return (
    <div className="page-wrapper">
      <Routes>
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
    </div>
  );
}

/* ==================== Subcomponents ==================== */

function TodoList({ tasks, toggleComplete, deleteTask, clearCompleted }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    total: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    });

  return (
    <div>
      <div className="challenge-header">
        <h2>✓ Todo List App</h2>
        <span className="difficulty hard">Hard Challenge</span>
      </div>

      <div className="todo-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="todo-controls">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="todo-search"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="todo-filter"
        >
          <option value="all">All Tasks</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={() => navigate("/todos/add")} className="todo-add-btn">
          + Add Task
        </button>
      </div>

      <div className="todo-list">
        {filteredTasks.length === 0 ? (
          <p className="empty-state">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="todo-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="todo-checkbox"
              />
              <div
                onClick={() => navigate(`/todos/${task.id}`)}
                className="todo-content"
              >
                <div
                  className={`todo-title ${task.completed ? "completed" : ""}`}
                >
                  {task.title}
                </div>
                {task.description && (
                  <div
                    className={`todo-description ${
                      task.completed ? "completed" : ""
                    }`}
                  >
                    {task.description}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="todo-delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {stats.completed > 0 && (
        <button onClick={clearCompleted} className="clear-completed-btn">
          Clear Completed
        </button>
      )}
    </div>
  );
}

function AddTodo({ addTask }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a task title!");
    addTask({ title, description, priority, dueDate });
    navigate("/todos");
  };

  return (
    <div className="form-container">
      <button onClick={() => navigate("/todos")} className="back-btn">
        ← Back
      </button>
      <h2>Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <div className="priority-buttons">
          {["low", "medium", "high"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`priority-btn ${priority === p ? "active" : ""}`}
            >
              {p}
            </button>
          ))}
        </div>
        <input
          className="form-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add
          </button>
          <button
            onClick={() => navigate("/todos")}
            className="cancel-btn"
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function TodoDetail({ tasks, updateTask, deleteTask, toggleComplete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === id);

  if (!task)
    return (
      <div className="error-container">
        <h2>Task not found</h2>
        <button onClick={() => navigate("/todos")} className="back-btn">
          Go Back
        </button>
      </div>
    );

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button onClick={() => navigate("/todos")} className="back-btn">
          ← Back
        </button>
        <button
          onClick={() => {
            if (window.confirm("Delete task?")) deleteTask(task.id);
            navigate("/todos");
          }}
          className="delete-btn-header"
        >
          Delete
        </button>
      </div>

      <h2>Task Details</h2>

      <label>Title</label>
      <input
        className="detail-input"
        type="text"
        value={task.title}
        onChange={(e) => updateTask(task.id, { title: e.target.value })}
      />

      <label>Description</label>
      <textarea
        className="detail-textarea"
        value={task.description}
        onChange={(e) => updateTask(task.id, { description: e.target.value })}
      />

      <label>Priority</label>
      <div className="priority-buttons">
        {["low", "medium", "high"].map((p) => (
          <button
            key={p}
            onClick={() => updateTask(task.id, { priority: p })}
            className={`priority-btn ${task.priority === p ? "active" : ""}`}
          >
            {p}
          </button>
        ))}
      </div>
      <label>Due Date</label>
      <input
        className="detail-input"
        type="date"
        value={task.dueDate || ""}
        onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
      />
    </div>
  );
}

export default TodoApp;
