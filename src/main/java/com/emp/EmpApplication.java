package com.emp;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.emp")
public class EmpApplication {
	public static void main(String[] args) {
		SpringApplication.run(EmpApplication.class, args);
	}
}
