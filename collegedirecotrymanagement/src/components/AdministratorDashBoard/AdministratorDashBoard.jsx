import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './administratorDashboard.css';
import StudentForm from './StudentForm'; // Import the form component
import FacultyForm from './FacultyForm';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons for edit and delete

const AdministratorDashboard = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const Student = JSON.parse(sessionStorage.getItem('profile'));
  const [studentId, setStudentId] = useState(Student?.id);
  const [view, setView] = useState('courses');
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); // For edit mode
  const [selectedFaculty, setSelectedFaculty] = useState(null); // For edit mode
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
      const url = `http://localhost:8080/admin/getAllFaculty`;
      fetchData(url, setCourseData);
    }
  }, [view, studentId]);

  useEffect(() => {
    if (view === 'searchStudents' && searchKey) {
      const url = `http://localhost:8080/student/search/${searchKey}`;
      fetchData(url, setData);
    } else if (view === 'searchStudents') {
      const url = `http://localhost:8080/admin/getAllStudent`;
      fetchData(url, setData);
    }
  }, [view, searchKey]);

  useEffect(() => {
    if (view === 'viewFaculty' && Student && Student.id) {
      const url = `http://localhost:8080/admin/getAllStudent`;
      fetchData(url, setFacultyProfile);
    }
  }, [view, studentId]);

  const handleSearch = () => {
    setView('searchStudents');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = formData.id ? 'PUT' : 'POST'; // PUT if updating, POST if adding
      const url = formData.id
        ? `http://localhost:8080/admin/updateStudent/${formData.id}`
        : `http://localhost:8080/admin/addStudent`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
      
      setView('courses'); // Return to list view after submission
      setSelectedStudent(null); // Clear selected student after submission
      fetchData(`http://localhost:8080/admin/getAllStudent`, setData); // Refresh the student list
    } catch (error) {
      console.error('Error during form submission:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      const url = `http://localhost:8080/admin/delete${type}/${id}`;
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      fetchData(`http://localhost:8080/admin/getAll${type}`, type === 'Faculty' ? setCourseData : setData);
    } catch (error) {
      console.error('Error during delete operation:', error);
      setError(error.message);
    }
  };

  const handleEdit = (id, type) => {
    if (type === 'Faculty') {
      const faculty = courseData.find(faculty => faculty.id === id);
      setSelectedFaculty(faculty);
      setView('addFaculty');
    } else {
      const student = data.find(student => student.id === id);
      setSelectedStudent(student);
      setView('addStudent');
    }
  };

  const renderContent = () => {
    if (error) {
      return <p>Error: {error}</p>;
    }

    switch (view) {
      case 'courses':
        return (
          <>
            <div className="fixed-heading">
              <h2 className="heading">Faculty List</h2>
            </div>
            <div className="scrollable-content">
              <table className="list-table">
                <thead>
                  <tr>
                    <th>Faculty Id</th>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Department Name</th>
                    <th>Office Hours</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.length > 0 ? courseData.map(faculty => (
                    <tr key={faculty.id}>
                      <td>{faculty.id}</td>
                      <td>{faculty.userId}</td>
                      <td>{faculty.name}</td>
                      <td>{faculty.departmentName}</td>
                      <td>{faculty.officeHours}</td>
                      <td>{faculty.email}</td>
                      <td>{faculty.phone}</td>
                      <td>
                        <FaEdit onClick={() => handleEdit(faculty.id, 'Faculty')} />
                        <FaTrash onClick={() => handleDelete(faculty.id, 'Faculty')} />
                      </td>
                    </tr>
                  )) : <tr><td colSpan="8">No faculty data available</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'searchStudents':
        return (
          <>
            <div className="fixed-heading">
              <h2 className="heading">Student List</h2>
            </div>
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
              <table className="list-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Department ID</th>
                    <th>Year</th>
                    <th>Email</th>
                    <th>Actions</th>
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
                      <td>
                        <FaEdit onClick={() => handleEdit(student.id, 'Student')} />
                        <FaTrash onClick={() => handleDelete(student.id, 'Student')} />
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6">No students found</td></tr>}
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
      case 'addStudent':
        return (
          <StudentForm
            student={selectedStudent}
            onSubmit={handleFormSubmit}
            onCancel={() => setView('courses')}
          />
        );
      case 'addFaculty':
        return (
          <FacultyForm
            faculty={selectedFaculty}
            onSubmit={handleFormSubmit}
            onCancel={() => setView('courses')}
          />
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
          <li><button onClick={() => setView('courses')}>Faculty Details</button></li>
          <li><button onClick={() => setView('searchStudents')}>Student Details</button></li>
          <li><button onClick={() => setView('addStudent')}>Add Student</button></li>
          <li><button onClick={() => setView('addFaculty')}>Add Faculty</button></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>
      <main className="view-area">
        {renderContent()}
      </main>
      <aside className="profilebox">
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

export default AdministratorDashboard;
