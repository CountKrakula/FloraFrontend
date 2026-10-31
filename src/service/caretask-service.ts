import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

// ": number" tells TypeScript that plantId must be a number.
// Without it, TypeScript doesn't know what plantId is and underlines it.
// It also means you get an error if you accidentally pass a string like "3".
export const getAllCareTasks = async (plantId: number) => {
  const response = await api.get(`/api/plants/${plantId}/caretasks`);
  return response.data;
}

export const completeCareTask = async (plantId: number, careTaskId: number) => {
  const response = await api.post(`/api/plants/${plantId}/caretasks/${careTaskId}/complete`);
  return response.data;
}

