import React, { useState } from "react";
import { createTodo } from "../services/api";

function AddTodo({ onTodoAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // nouvel état pour la date

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Le titre est obligatoire !");
    if (!date) return alert("La date est obligatoire !");

    try {
      const newTodo = { title, description, date };
      const response = await createTodo(newTodo);
      onTodoAdded(response.data); // ajouter à la liste
      setTitle("");
      setDescription("");
      setDate("");
    } catch (error) {
      console.error("Erreur ajout :", error);
      alert("Impossible d'ajouter la tâche ");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h2>➕ Ajouter une tâche</h2>
      <div>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">Ajouter</button>
    </form>
  );
}

export default AddTodo;
