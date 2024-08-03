package com.example.cda.controller;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.*;

import com.example.cda.service.*;
import com.example.cda.entity.*;
import com.example.cda.models.FacultyModel;
import com.example.cda.models.StudentModel;

@Controller
public class AdministratorController {

	private UserService userService;
	private StudentProfileService studentProfileService;
	private FacultyProfileService facultyProfileService;
	 private AdministratorProfileService administratorService;
	

	
	public AdministratorController(UserService userService, StudentProfileService studentProfileService,
			FacultyProfileService facultyProfileService, AdministratorProfileService administratorService) {
		super();
		this.userService = userService;
		this.studentProfileService = studentProfileService;
		this.facultyProfileService = facultyProfileService;
		this.administratorService = administratorService;
	}
	
	
	@GetMapping("/Login")
	public String Home()
	{
		return "Login";
	}
	@PostMapping("/Login")
	@ResponseBody
	public ResponseEntity<LoginResponse>  Home(@RequestParam String email,@RequestParam String password,@RequestParam String role)
	{
		
		User  user = userService.getUserByemail(email);
		System.out.println(email+"-----"+password+" "+role+" "+user.getRole());
		if(user!=null && user.getPassword().compareTo(password)==0 && user.getRole().compareTo(role)==0)
		{
			String redirectUrl;
			Object profile;
            switch (role) {
                case "student":
                	profile = studentProfileService.getStudentProfileByuserId(user.getId());
                    redirectUrl = "/studentDashboard";
                    break;
                case "faculty":
                	profile = facultyProfileService.getFacultyProfileByuserId(user.getId());
                    redirectUrl = "/facultyDashboard";
                    break;
                case "admin":
                	profile = administratorService.getAdministratorProfileByuserId(user.getId());
                    redirectUrl = "/administratorDashboard";
                    break;
                default:
                	return ResponseEntity.badRequest().body(null);            }
            System.out.println(email+" "+password+" "+role+"--------"+user.getRole()+" "+redirectUrl+" "+profile);
            LoginResponse response = new LoginResponse(user, profile);
            return ResponseEntity.ok(response);
        }
		return ResponseEntity.badRequest().body(null);	
	}
	
	@GetMapping("/admin/getAllStudent")
	@ResponseBody
	public ResponseEntity<?> getAllStudents() {
	    List<StudentModel> studentList = studentProfileService.getAllStudentModel();
	    return ResponseEntity.ok(studentList);
	}
	
	@GetMapping("/admin/getAllFaculty")
	@ResponseBody
	public ResponseEntity<?> getAllFaculty()
	{
		List<FacultyModel> studentList = facultyProfileService.getAllFacultyModel();
        return ResponseEntity.ok(studentList);
	}
	
	@PostMapping("/admin/add-Student")
	public ResponseEntity<String>  saveStudent(@RequestBody StudentModel studentModel)
	{
		System.out.println(studentModel.getEmail()+" "+studentModel.getName()+" "+studentModel.getPassword()+" "+studentModel.getUserName()+" "+studentModel.getYear());
		studentProfileService.saveStudentProfile(studentModel);
		return ResponseEntity.ok("Saved Sucessfully");
	}
	@PostMapping("/admin/add-Faculty")
	public ResponseEntity<String>  saveFaculty(@RequestBody FacultyModel facultyModel)
	{
		facultyProfileService.saveFacultyProfile(facultyModel);
		return ResponseEntity.ok("Saved Sucessfully");
	}
	@DeleteMapping("/admin/deleteFaculty/{id}")
    public ResponseEntity<String> deleteFaculty(@PathVariable String  id) {
        try {
        	facultyProfileService.deleteFacultyProfileById(Long.parseLong(id));
            return ResponseEntity.ok("Faculty deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting faculty: " + e.getMessage());
        }
    }
	
	 @DeleteMapping("/admin/deleteStudent/{id}")
	    public ResponseEntity<String> deleteStudent(@PathVariable String id) {
	        try {
	        	studentProfileService.deleteStudentProfileById(Long.parseLong(id));
	            return ResponseEntity.ok("Student deleted successfully.");
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body("Error deleting student: " + e.getMessage());
	        }
	    }
	 @PutMapping("/admin/update/faculty/{Id}")
	 public ResponseEntity<String> updateFaculty(@PathVariable String Id,@RequestBody FacultyModel facultyModel)
	 {
		 FacultyProfile  fp = facultyProfileService.updateFacultyProfile(Long.parseLong(Id), facultyModel);
		 return ResponseEntity.ok("Updated Faculty successfully");
	 }
}
