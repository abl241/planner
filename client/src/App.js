import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* redirect to login by default */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* dashboard routes */}
        
      </Routes>
    </Router>
  );
}

export default App;
