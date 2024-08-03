// StudentForm.jsx
import React, { useState, useEffect } from 'react';
import './StudentForm.css';
const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    photo: '',
    departmentId: '',
    year: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        id:student.id||'',
        userId:student.userId||'',
        photo: student.photo || '',
        departmentId: student.departmentId || '',
        year: student.year || '',
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        userName:student.userName||''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/admin/add-Student', {
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
      window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('Error saving student: ' + error.message);
    }
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
       <label>
        ID:
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />
      </label>
      <label>
        User ID:
        <input
          type="text"
          name="id"
          value={formData.userId}
          onChange={handleChange}
        />
      </label>
      <label>
        Photo URL:
        <input
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
        />
      </label>
      <label>
        Department ID:
        <input
          type="text"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Year:
        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleChange}
        />
      </label>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        User Name:
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <button type="submit">{student ? 'Update Student' : 'Add Student'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default StudentForm;
