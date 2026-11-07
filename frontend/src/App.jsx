import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AppLayout from "./components/AppLayout";
import ExplorePage from "./pages/ExplorePage";
import SubmitPage from "./pages/SubmitPage";
import PopularPage from "./pages/PopularPage";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/popular" element={<PopularPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/submit" element={<SubmitPage />} />
            </Route>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}