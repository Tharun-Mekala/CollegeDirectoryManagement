package com.example.cda.service.impl;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Service;

import com.example.cda.entity.Department;
import com.example.cda.entity.StudentProfile;
import com.example.cda.entity.User;
import com.example.cda.models.StudentModel;
import com.example.cda.repository.DepartmentRepository;
import com.example.cda.repository.StudentProfileRepository;
import com.example.cda.repository.UserRepository;
import com.example.cda.service.StudentProfileService;


@Service
public class StudentServiceImpl implements StudentProfileService {

	private StudentProfileRepository studentProfileRepository;
	private UserRepository userRepository;
	private DepartmentRepository departmentRepository;
	public StudentServiceImpl(StudentProfileRepository studentProfileRepository, UserRepository userRepository,DepartmentRepository departmentRepository) {
		super();
		this.studentProfileRepository = studentProfileRepository;
		 this.userRepository = userRepository;
		 this.departmentRepository = departmentRepository;
	}

	@Override
	public List<StudentProfile> getAllStudentProfiles() {
		// TODO Auto-generated method stub
		return studentProfileRepository.findAll();
	}
	@Override
	public void saveStudentProfile(StudentModel studentModel) {
		System.out.println(studentModel.getEmail()+" "+studentModel.getName()+" "+studentModel.getPassword()+" "+studentModel.getUserName()+" "+studentModel.getYear());
	    User user = new User(studentModel.getId(),studentModel.getUserName(),studentModel.getRole(),studentModel.getName(),studentModel.getEmail(),studentModel.getPhone());
	    User savedUser = userRepository.save(user);
	    System.out.println(savedUser.getId()+" "+savedUser.getEmail()+" "+savedUser.getPassword());
	    Department department = departmentRepository.findById(studentModel.getDepartmentId())
	        .orElseThrow(() -> new RuntimeException("Department not found"));
	    System.out.println(savedUser.getId()+" "+savedUser+" "+studentModel.getPhoto()+" "+department+" "+studentModel.getYear());
	    StudentProfile sp = new StudentProfile();
	    sp.setUser(savedUser);
	    sp.setUser(savedUser);
	    sp.setDepartment(department);
	    sp.setPhoto(studentModel.getPhoto());
	    sp.setYear(studentModel.getYear());
	    studentProfileRepository.save(sp);
	}

	@Override
	public StudentProfile getStudentProfileById(Long id) {
		// TODO Auto-generated method stub
		return studentProfileRepository.findById(id).get();
	}

	@Override
	public StudentProfile updateStudentProfile(StudentProfile studentProfile) {
		// TODO Auto-generated method stub
		return studentProfileRepository.save(studentProfile);
	}

	@Override
	public StudentModel getStudentProfileByuserId(Long userId) {
		// TODO Auto-generated method stub
		return studentProfileRepository.findUserIdPhotoYearDepartmentByUserId(userId);
	}

	@Override
	public void deleteStudentProfileById(Long id) {
		// TODO Auto-generated method stub
		studentProfileRepository.deleteById(id);
		
	}

	@Override
	public List<StudentModel> getStudentByKey(String key) {
		// TODO Auto-generated method stub
		return studentProfileRepository.findStudentBYKey(key);
	}

	@Override
	public List<StudentModel> getAllStudentModel() {
		return studentProfileRepository.findAllStudentModel();
	}
	
	
	
}
