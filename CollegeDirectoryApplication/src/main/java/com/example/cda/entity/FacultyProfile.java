package com.example.cda.entity;

import jakarta.persistence.*;


@Entity
public class FacultyProfile {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String photo;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
    
    private String officeHours;

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public String getOfficeHours() {
		return officeHours;
	}

	public void setOfficeHours(String officeHours) {
		this.officeHours = officeHours;
	}
	
	
}
