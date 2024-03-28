import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef, useEffect } from "react";
import MainPage from "./pages/main/MainPage";
import SignUp from "./pages/sign-up/SignUp";
import Login from "./pages/login/Login";
import Workspace from "./pages/workspace/Workspace";
import AuthProvider from "./contexts/AuthProvider";
import WorkspaceProvider from "./contexts/WorkspaceProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <WorkspaceProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/space" element={<Workspace />} />
            </Routes>
          </BrowserRouter>
        </WorkspaceProvider>
      </AuthProvider>
    </>
  );
}

export default App;
