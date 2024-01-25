import Login from "./Login";
import UploadCSV from "./UploadCSV";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./const";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import Home from "./Home";

export default function App() {
  return (
    <Router basename={"/front/lib/dashboard/"}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
