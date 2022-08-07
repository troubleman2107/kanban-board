import axios from "../plugins/axios.js";

export const getTasks = async () => {
  try {
    return await axios.get("/tasks");
  } catch (err) {
    throw err;
  }
};

export const postTask = async (data, onSuccess, onFail) => {
  try {
    const res = await axios.post("/tasks", data);
    if (onSuccess) {
      onSuccess(res?.data);
    }
  } catch (err) {
    throw err;
  }
};

export const updateTask = async (id, data, onSuccess, onFail) => {
  try {
    const res = await axios.put(`/tasks/${id}`, data);
    if (onSuccess) {
      onSuccess(res?.data);
    }
  } catch (err) {
    throw err;
  }
};

export const deleteTask = async (id, onSuccess, onFail) => {
  try {
    const res = await axios.delete(`/tasks/${id}`);
    if (onSuccess) {
      onSuccess(res?.data);
    }
  } catch (err) {
    throw err;
  }
};
