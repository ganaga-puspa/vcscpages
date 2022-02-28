import React, { useContext } from "react";
import AppContainer from "./components/AppContainer";
import "./App.css";
import { Login, Dashboard } from "./components/";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./useAuth";
import UploadImage from "./ImageUpload/UploadImage";

function RequireAuth({ children }) {
  const authCtx = useContext(AuthContext);

  return authCtx.isLoggedIn === true ? (
    children
  ) : (
    <Navigate to="/Velankanni-admin" replace />
  );
}

const Alrlogin = () => {
  const authCtx = useContext(AuthContext);
  return authCtx.isLoggedIn === true ? (
    <Navigate to="/Velankanni-dashboard" replace />
  ) : (
    <Login />
  );
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContainer />} />
          <Route path="/i" element={<UploadImage />} />

          <Route path="/Velankanni-admin" element={<Alrlogin />} />
          <Route
            path="/Velankanni-dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
