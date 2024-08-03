
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Login from './components/Login/Login';
import Studentdashboard from './components/StudentDashboard/Studentdashboard';
import FacultyDashboard from './components/FacultyDashboard/FacultyDashboard';
import AdministratorDashboard from './components/AdministratorDashBoard/AdministratorDashBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/studentDashboard" element={<Studentdashboard />} />
        <Route path="/facultyDashboard" element={<FacultyDashboard />} />
        <Route path="/administratorDashboard" element={<AdministratorDashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
