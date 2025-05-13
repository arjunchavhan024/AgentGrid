import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import AddAgentForm from "./AddAgentForm";
import CSVUploader from "./CsvUploader";

const Main = () => {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/agents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to fetch agents", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>AgentGrid</h1>
        <div className={styles.nav_buttons}>
          <button
            className={styles.add_agent_btn}
            onClick={() => setShowAddForm(true)}
          >
            Add Agent
          </button>
          <button
            className={styles.upload_csv_btn}
            onClick={() => setShowUploader(true)}
          >
            Upload CSV
          </button>
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Add Agent Modal */}
      {showAddForm && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <AddAgentForm
              onAgentAdded={() => {
                setShowAddForm(false);
                fetchAgents();
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showUploader && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_content}>
            <CSVUploader
              onClose={() => {
                setShowUploader(false);
                fetchTasks(); // fetch new tasks after upload
              }}
            />
          </div>
        </div>
      )}

      {/* Agent Table */}
      <div className={styles.agent_list}>
        <h3>Registered Agents</h3>
        {agents.length === 0 ? (
          <p>No agents found.</p>
        ) : (
          <table className={styles.agent_table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact No</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent._id}>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>{agent.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Tasks Table */}
      <div className={styles.task_list}>
        <h3>Distributed Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <table className={styles.agent_table}>
            <thead>
              <tr>
                <th>Agent</th>
                <th>First Name</th>
                <th>Phone</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.agentId?.name || "N/A"}</td>
                  <td>{task.firstName}</td>
                  <td>{task.phone}</td>
                  <td>{task.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Main;
