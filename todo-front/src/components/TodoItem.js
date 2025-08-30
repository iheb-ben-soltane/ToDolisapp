import React from "react";
import { deleteTodo } from "../services/api";

function TodoItem({ todo, onTodoDeleted }) {
  const handleDelete = async () => {
    if (window.confirm("Supprimer cette tâche ?")) {
      try {
        await deleteTodo(todo.id);
        onTodoDeleted(todo.id); // informer le parent
      } catch (error) {
        console.error("Erreur suppression :", error);
        alert("Impossible de supprimer ");
      }
    }
  };

  return (
    <li>
      <strong>{todo.title}</strong> – {todo.description}
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        🗑️ Supprimer
      </button>
    </li>
  );
}

export default TodoItem;
