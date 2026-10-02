// Service Management
// A2 requirements for this screen:
//  - Create / edit services
//  - Name (required, max 100 chars), Description (required)
//  - Expected duration in minutes (required)
//  - Priority: low / medium / high
import { useState } from "react";
import { Link } from "react-router-dom";
import { useServices } from "../context/ServiceContext";
import { useNotifications } from "../context/NotificationContext";
import ServiceForm from "../components/ServiceForm";
import "./ServiceManagement.css";

export default function ServiceManagement() {
  const { services, getQueueLength, getServiceById, addService, updateService } = useServices();
  const { addNotification } = useNotifications();

  // success message shown above table after saving
  const [banner, setBanner] = useState(null);

  // list, create, or edit screen
  const [mode, setMode] = useState("list");

  // id of service being edited
  const [editingId, setEditingId] = useState(null);

  // opening the form hides old banner
  const startCreate = () => {
    setBanner(null);
    setEditingId(null);
    setMode("create");
  };

  const startEdit = (id) => {
    setBanner(null);
    setEditingId(id);
    setMode("edit");
  };

  // back to table and forget editing
  const backToList = () => {
    setEditingId(null);
    setMode("list");
  };

  // the form validates, this saves
  const handleSave = (values) => {
    const isCreating = mode === "create";

    if (isCreating) {
      addService(values);
    } else {
      updateService(editingId, values);
    }

    // admin notification
    addNotification({
      audience: "admin",
      type: "status_change",
      title: isCreating ? "Service created" : "Service updated",
      message: `${values.name} was saved.`,
    });

    // sends success banner
    setBanner(`${values.name} was ${isCreating ? "created" : "updated"}.`);
    backToList();
  };

  // the service being edited
  const editingService = mode === "edit" ? getServiceById(editingId) : null;

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
          {/* success banner after save */}
          {banner && (
            <div className="svc-banner" role="status">
              <span>{banner}</span>
              <button
                type="button"
                className="svc-banner-close"
                aria-label="Dismiss message"
                onClick={() => setBanner(null)}
              >
                &times;
              </button>
            </div>
          )}

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
        mode === "edit" && !editingService ? (
          // edit service not found case
          <div className="svc-placeholder">
            <p>That service could not be found.</p>
            <button type="button" className="svc-button" onClick={backToList}>
              Back
            </button>
          </div>
        ) : (
          // fresh form each time
          <ServiceForm
            key={editingId ?? "new"}
            service={editingService}
            existingServices={services}
            onSave={handleSave}
            onCancel={backToList}
          />
        )
      )}
    </div>
  );
}
