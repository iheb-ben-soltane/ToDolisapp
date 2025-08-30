import axios from "axios";

// Utilise l'URL définie dans le fichier .env
const API_URL = "http://localhost:3000";

// Récupérer toutes les todos d'une date spécifique
export const getTodos = (date) => {
  return axios.get(`${API_URL}/todos`, { params: { date } });
};

// Créer une nouvelle todo
export const createTodo = (todo) => {
  return axios.post(`${API_URL}/todos`, todo);
};

// Supprimer une todo par son ID
export const deleteTodo = (id) => {
  return axios.delete(`${API_URL}/todos/${id}`);
};

// Récupérer une todo par ID (optionnel)
export const getTodoById = (id) => {
  return axios.get(`${API_URL}/todos/${id}`);
};

// Mettre à jour une todo (optionnel)
export const updateTodo = (id, data) => {
  return axios.patch(`${API_URL}/todos/${id}`, data);
};
