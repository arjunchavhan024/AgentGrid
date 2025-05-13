import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import AddAgentForm from "./AddAgentForm";

const Main = () => {
  const [agents, setAgents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

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

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleAddAgentClick = () => {
    setShowAddForm(true);
  };

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>AgentGrid</h1>
        <div className={styles.nav_buttons}>
          <button
            className={styles.add_agent_btn}
            onClick={handleAddAgentClick}
          >
            Add Agent
          </button>
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

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
    </div>
  );
};

export default Main;
