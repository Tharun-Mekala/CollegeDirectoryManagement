package com.example.cda.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.example.cda.entity.User;



public interface UserRepository extends JpaRepository<User, Long> {
	public User findByEmail(String email);
}
