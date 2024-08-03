import React, { useEffect, useState } from 'react';
import './facultyDashboard.css';

const FacultyDashboard = () => {
  // Retrieve user and faculty data from sessionStorage
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [Faculty,setFaculty] = useState(JSON.parse(sessionStorage.getItem('profile')));
  const [facultyId, setFacultyId] = useState(Faculty.id);

  const [view, setView] = useState('students');
  const [studentsData, setStudentsData] = useState([]);
  const [formData, setFormData] = useState({
    officeHours: Faculty.officeHours,
    email: Faculty.email,
    phone: Faculty.phone,
  });
  const [error, setError] = useState(null); // Add error state
  const [success, setSuccess] = useState(null); // Add success state


  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
      const result = await response.json();
      setter(result);
      setError(null); // Clear error if successful
    } catch (error) {
      console.error('Error during fetch:', error);
      setError(error.message); // Set error state
    }
  };

  // Fetch students in the faculty's courses
  useEffect(() => {
    if (view === 'students' && facultyId) {
      const url = `http://localhost:8080/faculty/student-by-corse/${facultyId}`;
      fetchData(url, setStudentsData);
    }
  }, [view, facultyId]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login'; // Redirect to login page
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    if (!facultyId) {
      console.error('Faculty ID is missing');
      setError('Faculty ID is missing');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/faculty/update/${facultyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
      const updatedFaculty = await response.json();
      setFaculty(updatedFaculty);
      setSuccess('Profile updated successfully!');
      setError(null); // Clear error if successful
    } catch (error) {
      console.error('Error during update:', error);
      setError(error.message); // Set error state
      setSuccess(null); // Clear success message if there's an error
    }
  };
  

  const renderContent = () => {
    if (error) {
      return <p>Error: {error}</p>;
    }

    switch (view) {
      case 'students':
        return (
          <div className="students-list">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Photo</th>
                  <th>Contact Email</th>
                  <th>Phone Number</th>
                  <th>CourseTitle</th>
                </tr>
              </thead>
              <tbody>
                {studentsData.length > 0 ? studentsData.map(student => (
                  <tr key={student.id}>
                    <td>{student.studentName}</td>
                    <td><img src={student.photo} alt={student.name} className="student-photo" /></td>
                    <td>{student.studentEmail}</td>
                    <td>{student.studentPhone}</td>
                    <td>{student.courseTitle}</td>
                  </tr>
                )) : <tr><td colSpan="4">No students found</td></tr>}
              </tbody>
            </table>
          </div>
        );
      case 'updateContact':
        return (
            <form className="update-contact-form" onSubmit={handleFormSubmit}>
            <label>
              Office Hours:
              <input type="text" name="officeHours" value={formData.officeHours} onChange={handleFormChange} />
            </label>
            <label>
              Contact Email:
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} />
            </label>
            <label>
              Phone Number:
              <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} />
            </label>
            <button type="submit">Update</button>
          </form>
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
          <li><button onClick={() => setView('students')}>Students</button></li>
          <li><button onClick={() => setView('updateContact')}>Update Contact Info</button></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </aside>
      <main className="view-area">
        {renderContent()}
      </main>
      <div className="profilebox">
        <img src="" alt="" className="profile_img" />
        <div className="profile-info">
          <p>{Faculty.name}</p>
          <p>{Faculty.email}</p>
          <p>{Faculty.phone}</p>
          <p>{Faculty.department}</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
