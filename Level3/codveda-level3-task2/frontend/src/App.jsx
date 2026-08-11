import { useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000/api";

function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || ""
  );
  const [profile, setProfile] = useState(null);

  const register = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Now login.");
        setMode("login");
        setEmail("");
        setPassword("");
      } else {
        setMessage(JSON.stringify(data));
      }
    } catch {
      setMessage("Could not connect to Django server.");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        setToken(data.access);
        setMessage("Login successful!");
        setPassword("");
      } else {
        setMessage(JSON.stringify(data));
      }
    } catch {
      setMessage("Could not connect to Django server.");
    }
  };

  const getProfile = async () => {
    try {
      const response = await fetch(`${API}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
        setMessage("");
      } else {
        setMessage(data.detail || "Authentication failed.");
      }
    } catch {
      setMessage("Could not connect to Django server.");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setToken("");
    setProfile(null);
    setMessage("Logged out successfully.");
  };

  return (
    <div className="app">
      <div className="card">
        <h1>User Authentication</h1>

        {!token ? (
          <>
            <div className="tabs">
              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                Login
              </button>

              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                Register
              </button>
            </div>

            <form onSubmit={mode === "login" ? login : register}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              {mode === "register" && (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">
                {mode === "login" ? "Login" : "Create Account"}
              </button>
            </form>
          </>
        ) : (
          <div className="profile-section">
            <h2>Welcome! 🔐</h2>

            <button onClick={getProfile}>View Protected Profile</button>

            {profile && (
              <div className="profile">
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>{profile.message}</p>
              </div>
            )}

            <button className="logout" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;