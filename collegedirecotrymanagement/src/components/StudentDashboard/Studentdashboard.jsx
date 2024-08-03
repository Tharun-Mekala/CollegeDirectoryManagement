import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './studentdashboard.css';

const Studentdashboard = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const Student = JSON.parse(sessionStorage.getItem('profile'));
  const [studentId, setStudentId] = useState(Student?.id);
  console.log("Student: ", Student);

  const [view, setView] = useState('courses');
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };


  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
      const result = await response.json();
      setter(result);
      setError(null);
    } catch (error) {
      console.error('Error during fetch:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (view === 'courses' && studentId) {
      const url = `http://localhost:8080/student/course/${studentId}`;
      fetchData(url, setCourseData);
    }
  }, [view, studentId]);

  useEffect(() => {
    if (view === 'searchStudents' && searchKey) {
      const url = `http://localhost:8080/student/search/${searchKey}`;
      fetchData(url, setData);
    }
  }, [view, searchKey]);

  useEffect(() => {
    if (view === 'viewFaculty' && Student && Student.id) {
      const url = `http://localhost:8080/student/faculty-advised/${studentId}`;
      fetchData(url, setFacultyProfile);
    }
  }, [view, studentId]);

  const handleSearch = () => {
    setView('searchStudents');
  };

  const renderContent = () => {
    if (error) {
      return <p>Error: {error}</p>;
    }

    switch (view) {
      case 'courses':
        return (
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Department ID</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {courseData.length > 0 ? courseData.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.departmentId}</td>
                  <td>{course.facultyName}</td>
                </tr>
              )) : <tr><td colSpan="3">No courses available</td></tr>}
            </tbody>
          </table>
        );
      case 'searchStudents':
        return (
          <>
            <div className="fixed-search">
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="Search students"
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            <div className="scrollable-content">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department ID</th>
                    <th>Year</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? data.map(student => (
                    <tr key={student.id}>
                      <td>{student.userId}</td>
                      <td>{student.name}</td>
                      <td>{student.departmentId}</td>
                      <td>{student.year}</td>
                      <td>{student.email}</td>
                    </tr>
                  )) : <tr><td colSpan="5">No students found</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'viewFaculty':
        if (!facultyProfile || facultyProfile.length === 0) return <p>No faculty data available.</p>;
        return (
          <div className="profile-card">
            {facultyProfile.map(faculty => (
              <div key={faculty.id}>
                <h2>{faculty.name}</h2>
                <p>{faculty.departmentName}</p>
                <p>{faculty.officeHours}</p>
                <p>{faculty.email}</p>
                <p>{faculty.phone}</p>
              </div>
            ))}
          </div>
        );
      default:
        return <p>Welcome to your dashboard!</p>;
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li><button onClick={() => setView('courses')}>Course Details</button></li>
          <li><button onClick={() => setView('searchStudents')}>Search Students</button></li>
          <li><button onClick={() => setView('viewFaculty')}>View Faculty</button></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>
      <main className="view-area">
        {renderContent()}
      </main>
      <aside className="proilebox">
        <img src="profile.jpg" alt="Profile" className="profile_img" />
        <div className="profile-info">
          <p>Name: {user.name}</p>
          <p>Department: {Student.departmentId}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {Student.phone}</p>
        </div>
      </aside>
    </div>
  );
};

export default Studentdashboard;
