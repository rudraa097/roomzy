import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Use your existing pages
import AboutUsPage from "./pages/AboutUsPage";
import RoomsPage from "./pages/RoomsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<RoomsPage />} />

        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Optional fallback */}
        <Route path="*" element={<RoomsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
