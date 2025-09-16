import { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();
// Export named for consumers that import { AuthContext }
export { AuthContext };
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Verify current token by fetching profile
    authAPI
      .getProfile()
      .then((res) => {
        const userFromApi = res.data?.data?.user || res.data?.user || res;
        setUser(userFromApi || null);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const loginRes = await authAPI.login(email, password);
      const token = loginRes.data?.token || loginRes.data?.data?.token;
      if (!token) throw new Error("No token returned from server");
      localStorage.setItem("token", token);

      // Fetch profile after login to avoid assuming response shape
      const profileRes = await authAPI.getProfile();
      const userFromApi = profileRes.data?.data?.user || profileRes.data?.user || profileRes;
      setUser(userFromApi || null);
      return { success: true };
    } catch (error) {
      // Clear any bad token
      localStorage.removeItem("token");
      return {
        success: false,
        message: error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
