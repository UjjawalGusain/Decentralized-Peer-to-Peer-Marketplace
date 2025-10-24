import axios from "axios";

// This function sets up the interceptor
export const setupAxiosInterceptor = (logout) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // If response status is 401 (unauthorized), force logout
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};
