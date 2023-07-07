import axios from "./axiosConfig";

export const testApi = () => {
  return axios.get("todos/1");
};
