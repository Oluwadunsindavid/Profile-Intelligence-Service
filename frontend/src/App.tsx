// import { ProfileDashboard } from "./features/profile-search/ProfileDashboard";

// function App() {
//   return (
//     <main className="min-h-screen bg-slate-50 py-12 px-4">
//       <ProfileDashboard />
//     </main>
//   );
// }

// export default App;

import { Route, Routes,  } from "react-router-dom";
import { ProfileDashboard } from "./features/profile-search/ProfileDashboard";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <main className="min-h-screen">
        <Routes>
          {/* Main Dashboard - The Home Page */}
          <Route
            path="/"
            element={
              <div className="py-12 px-4">
                <ProfileDashboard />
              </div>
            }
          />

          {/* Login Page - Standalone (No Dashboard visible) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          {/* Redirect any unknown routes to Home */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;