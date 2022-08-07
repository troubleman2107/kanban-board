import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://kanban-board-2107.herokuapp.com/api/",
  headers: { "content-type": "application/json" },
});

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status !== 200) {
      return Promise.reject(response);
    }

    return Promise.reject(response);
  }
);

export default axiosConfig;
