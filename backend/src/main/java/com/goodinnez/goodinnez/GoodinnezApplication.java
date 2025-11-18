package com.goodinnez.goodinnez;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
@SpringBootApplication
@ComponentScan("com.goodinnez.goodinnez")
public class GoodinnezApplication {

	public static void main(String[] args) {
		SpringApplication.run(GoodinnezApplication.class, args);
	}
}
