import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  
  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("Could not add task.");
    } finally {
      setLoading(false);
    }
  };

  
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  
  const toggleTask = async (task) => {
    try {
      await fetch(`${API_URL}${task.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  
  const editTask = async (task) => {
    const newTitle = window.prompt("Enter new task title:", task.title);

    if (newTitle === null || !newTitle.trim()) {
      return;
    }

    try {
      await fetch(`${API_URL}${task.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle.trim(),
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Full-Stack CRUD Application</p>
      </header>

      <main className="container">

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>

        <section className="tasks-section">
          <div className="section-header">
            <h2>My Tasks</h2>
            <span>{tasks.length} tasks</span>
          </div>

          {tasks.length === 0 ? (
            <p className="empty">
              No tasks found. Add your first task!
            </p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task.id}
                >
                  <div className="task-content">
                    <h3>{task.title}</h3>

                    <p>
                      {task.description || "No description"}
                    </p>

                    <small>
                      {task.completed
                        ? "Completed"
                        : "Pending"}
                    </small>
                  </div>

                  <div className="actions">
                    <button
                      className="complete"
                      onClick={() => toggleTask(task)}
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>

                    <button
                      className="edit"
                      onClick={() => editTask(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      <footer>
        <p>Codveda Internship • Level 3 Task 1</p>
      </footer>
    </div>
  );
}

export default App;