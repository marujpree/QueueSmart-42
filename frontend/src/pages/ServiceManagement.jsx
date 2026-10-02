// Service Management
// A2 requirements for this screen:
//  - Create / edit services
//  - Name (required, max 100 chars), Description (required)
//  - Expected duration in minutes (required)
//  - Priority: low / medium / high
import { useState } from "react";
import { Link } from "react-router-dom";
import { useServices } from "../context/ServiceContext";
import "./ServiceManagement.css";

export default function ServiceManagement() {
  const { services, getQueueLength } = useServices();

  // list, create, or edit screen
  const [mode, setMode] = useState("list");

  // id of service being edited
  const [editingId, setEditingId] = useState(null);

  const startCreate = () => {
    setEditingId(null);
    setMode("create");
  };

  const startEdit = (id) => {
    setEditingId(id);
    setMode("edit");
  };

  // back to table and forget editing
  const backToList = () => {
    setEditingId(null);
    setMode("list");
  };

  return (
    <div className="svc-page">
      <h1 className="svc-title">Service Management</h1>

      {/* same sub nav links as admin dashboard */}
      <div className="svc-subnav">
        <Link to="/admin">Overview</Link>
        <Link to="/admin/services">Service Management</Link>
        <Link to="/admin/queues">Queue Management</Link>
      </div>

      {mode === "list" ? (
        <>
          <div className="svc-toolbar">
            <p className="svc-subtitle">Create and edit the services students can queue for.</p>
            <button type="button" className="svc-button" onClick={startCreate}>
              + New service
            </button>
          </div>

          {services.length === 0 ? (
            <p className="svc-empty">No services yet. Click &quot;+ New service&quot; to add one.</p>
          ) : (
            // sideways scroll on table
            <div className="svc-table-wrap">
              <table className="svc-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Duration</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Queue</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <span className="svc-name">{s.name}</span>
                        {/* title shows in full on hover */}
                        <span className="svc-desc" title={s.description}>
                          {s.description}
                        </span>
                      </td>
                      <td>{s.durationMinutes} min</td>
                      <td>{s.priority}</td>
                      <td>{s.isOpen ? "Open" : "Closed"}</td>
                      <td>{getQueueLength(s.id)}</td>
                      <td>
                        <button type="button" className="svc-button" onClick={() => startEdit(s.id)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        // create and edit both show this for now
        <div className="svc-placeholder">
          <p>
            Form coming next ({mode === "create" ? "new service" : `editing service #${editingId}`})
          </p>
          <button type="button" className="svc-button" onClick={backToList}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}
