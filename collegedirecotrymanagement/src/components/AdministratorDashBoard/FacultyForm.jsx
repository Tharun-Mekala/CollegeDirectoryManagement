import './StudentForm.css'; // Adjust the import as needed
import React, { useState, useEffect } from 'react';

const FacultyForm = ({ faculty, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    userId: '',
    photo: '',
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    departmentName: '',
    officeHours: ''
  });

  useEffect(() => {
    if (faculty) {
      setFormData({
        id: faculty.id || '',
        userId: faculty.userId || '',
        photo: faculty.photo || '',
        name: faculty.name || '',
        email: faculty.email || '',
        phone: faculty.phone || '',
        departmentId: faculty.departmentId || '',
        departmentName: faculty.departmentName || '',
        officeHours: faculty.officeHours || ''
      });
    }
  }, [faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/admin/add-Faculty', {
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
      alert('Error saving faculty: ' + error.message);
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
          name="userId"
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
        Department Name:
        <input
          type="text"
          name="departmentName"
          value={formData.departmentName}
          onChange={handleChange}
        />
      </label>
      <label>
        Office Hours:
        <input
          type="text"
          name="officeHours"
          value={formData.officeHours}
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
      <button type="submit">{faculty ? 'Update Faculty' : 'Add Faculty'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default FacultyForm;
