import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, onTodoDeleted }) {
  if (!todos.length) return <p>Aucune tâche pour le moment.</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onTodoDeleted={onTodoDeleted} />
      ))}
    </ul>
  );
}

export default TodoList;
