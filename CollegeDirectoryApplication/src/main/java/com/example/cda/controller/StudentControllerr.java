package com.example.cda.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.cda.models.CourseModel;
import com.example.cda.models.FacultyModel;
import com.example.cda.models.StudentModel;
import com.example.cda.service.EnrollmentService;
import com.example.cda.service.FacultyProfileService;
import com.example.cda.service.StudentProfileService;
import com.example.cda.service.UserService;

@Controller
public class StudentControllerr {
	
	private UserService userService;
	private StudentProfileService studentProfileService;
	private FacultyProfileService facultyProfileService;
	private EnrollmentService enrollmentService;
	public StudentControllerr(UserService userService, StudentProfileService studentProfileService,
			FacultyProfileService facultyProfileService,EnrollmentService enrollmentService) {
		super();
		this.userService = userService;
		this.studentProfileService = studentProfileService;
		this.facultyProfileService = facultyProfileService;
		this.enrollmentService=enrollmentService;
	}

	@GetMapping("/student/search/{Key}")
	@ResponseBody
	public ResponseEntity<?> searchStudents(@PathVariable String Key)
	{
		System.out.println("Hii");
		List<StudentModel> studentsList  =  studentProfileService.getStudentByKey(Key);
		return ResponseEntity.ok(studentsList);
	}
	
	@GetMapping("/student/faculty-advised/{Id}")
	@ResponseBody
	public ResponseEntity<?> getFacultyAdvisedList(@PathVariable String Id)
	{	
		System.out.println("Hello");
		List<FacultyModel> facultyList = enrollmentService.getAssignedFacultyByStudentId(Long.parseLong(Id));
		return ResponseEntity.ok(facultyList);
	}
	
	@GetMapping("/student/course/{Id}")
	@ResponseBody
	public ResponseEntity<?> getCourseList(@PathVariable String Id)
	{
		System.out.println("Hey");
		List<CourseModel> courseList = enrollmentService.getCourseByStudentId(Long.parseLong(Id));
		return ResponseEntity.ok(courseList);
	}
	

   
}
