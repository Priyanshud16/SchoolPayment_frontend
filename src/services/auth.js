// services/auth.js
export const authAPI = {
  login: async (email, password) => {
    if (email === "admin@school.com" && password === "password123") {
      return {
        data: {
          token: "fake-jwt-token",
          user: { id: 1, email },
        },
      };
    } else {
      throw { response: { data: { message: "Invalid credentials" } } };
    }
  },
  verifyToken: async (token) => {
    return { id: 1, email: "admin@school.com" }; // fake user
  },
};