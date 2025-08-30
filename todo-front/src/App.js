import React, { useEffect, useState } from "react";
import { getTodos, createTodo, deleteTodo, updateTodo } from "./services/api";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import WaveBackground from "./WaveBackground";
import "./App.css";

// Formatage date
function formatDateInput(d) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  return `${y}-${m}-${dd}`;
}

// Message accueil
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning ☀️";
  if (hour < 18) return "Good afternoon 🌤️";
  return "Good evening 🌙";
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // States pour Add Task
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // States pour Update Task
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Charger todos
  const fetchTodos = () => {
    if (!selectedDate) return;
    setLoading(true);
    getTodos(formatDateInput(selectedDate))
      .then((res) => {
        setTodos(res.data || []);
        setError("");
      })
      .catch((e) => setError(e?.message || "Erreur lors du chargement"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTodos();
  }, [selectedDate]);

  // Ajouter
  const onAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTodo({
      title,
      description,
      date: formatDateInput(selectedDate),
      done: false,
    })
      .then((res) => {
        setTodos((prev) => [...prev, res.data]);
        setTitle("");
        setDescription("");
        setShowModal(false);
      })
      .catch((e) =>
        alert("Impossible d'ajouter la tâche : " + (e?.message || ""))
      );
  };

  // Modifier
  const onUpdate = (task) => {
    setTaskToUpdate(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description || "");
    setShowUpdateModal(true);
  };

  // Supprimer
  const onDelete = (id) => {
    if (!window.confirm("Supprimer cette tâche ?")) return;
    deleteTodo(id)
      .then(() => setTodos((prev) => prev.filter((t) => t.id !== id)))
      .catch((e) => alert("Suppression impossible : " + (e?.message || "")));
  };

  // Toggle done
  const toggleDone = (todo) => {
    updateTodo(todo.id, { done: !todo.done })
      .then((res) => {
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? res.data : t)));
      })
      .catch((e) =>
        alert("Impossible de mettre à jour : " + (e?.message || ""))
      );
  };

  const todosPending = todos.filter((t) => !t.done);
  const todosDone = todos.filter((t) => t.done);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <WaveBackground darkMode={darkMode} />

      <div className="mode-toggle-container">
        <Button
          variant={darkMode ? "light" : "dark"}
          onClick={() => setDarkMode(!darkMode)}
          className="mode-toggle-btn"
        >
          {darkMode ? "🌞" : "🌙"}
        </Button>
      </div>

      <Container fluid className="app-container p-4">
        <Row>
          <Col md={3} className="calendar-col">
            <Card className="calendar-panel shadow-lg">
              <Card.Body>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  className="custom-calendar"
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={9} className="tasks-col">
            {!selectedDate ? (
              <Card className="welcome-card shadow-lg">
                <Card.Body className="text-center">
                  <h1>{getGreeting()}</h1>
                  <h3>What's your plan for today?</h3>
                  <Button
                    variant={darkMode ? "light" : "dark"}
                    onClick={() => setSelectedDate(new Date())}
                  >
                    See Today
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {loading && (
                  <Spinner animation="border" className="custom-spinner" />
                )}
                {error && <Alert variant="danger">{error}</Alert>}

                <div className="tasks-section">
                  {/* Tâches à faire */}
                  <Card className="task-card shadow-sm">
                    <Card.Header className="task-header pending">
                      🕑 To do
                    </Card.Header>
                    <Card.Body>
                      {todosPending.length === 0 ? (
                        <p className="empty-text">Nothing to do for today 🎉</p>
                      ) : (
                        todosPending.map((t) => (
                          <div key={t.id} className="task-item fade-in">
                            <span>
                              <strong>{t.title}</strong>{" "}
                              {t.description && `— ${t.description}`}
                            </span>
                            <div>
                              <Button
                                size="sm"
                                className="btn-done"
                                onClick={() => toggleDone(t)}
                              >
                                ✔️
                              </Button>{" "}
                              <Button
                                size="sm"
                                className="btn-update"
                                onClick={() => onUpdate(t)}
                              >
                                ✏️
                              </Button>{" "}
                              <Button
                                size="sm"
                                className="btn-delete"
                                onClick={() => onDelete(t.id)}
                              >
                                ❌
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>

                  {/* Tâches terminées */}
                  <Card className="task-card shadow-sm mt-3">
                    <Card.Header className="task-header done">
                      ✅ Done
                    </Card.Header>
                    <Card.Body>
                      {todosDone.length === 0 ? (
                        <p className="empty-text">Still no task done</p>
                      ) : (
                        todosDone.map((t) => (
                          <div
                            key={t.id}
                            className="task-item task-done fade-in"
                          >
                            <span>
                              <strong>{t.title}</strong>{" "}
                              {t.description && `— ${t.description}`}
                            </span>
                            <div>
                              <Button
                                size="sm"
                                className="btn-undo"
                                onClick={() => toggleDone(t)}
                              >
                                ↩️
                              </Button>{" "}
                              <Button
                                size="sm"
                                className="btn-delete"
                                onClick={() => onDelete(t.id)}
                              >
                                ❌
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </Card.Body>
                  </Card>

                  {/* Bouton Ajouter */}
                  <div className="add-button-container mt-3">
                    <Button
                      className="btn-add"
                      onClick={() => setShowModal(true)}
                    >
                      ➕ Add a Task
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Modal Ajouter une tâche */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a Task</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onAdd}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-add-task">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Modifier une tâche */}
      <Modal
        show={showUpdateModal}
        onHide={() => setShowUpdateModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (!updatedTitle.trim()) return;

            updateTodo(taskToUpdate.id, {
              title: updatedTitle,
              description: updatedDescription,
            })
              .then((res) => {
                setTodos((prev) =>
                  prev.map((t) => (t.id === taskToUpdate.id ? res.data : t))
                );
                setShowUpdateModal(false);
              })
              .catch((err) =>
                alert("Impossible de mettre à jour la tâche : " + err?.message)
              );
          }}
        >
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUpdateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-add-task">
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
