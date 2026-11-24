package com.mediclinic.security;

import com.mediclinic.user.entity.User;
import com.mediclinic.user.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(
        UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
        String email
    ) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(
            email.trim().toLowerCase(Locale.ROOT)
        ).orElseThrow(() ->
            new UsernameNotFoundException(
                "Tài khoản không tồn tại"
            )
        );

        String[] roles = user.getRoles()
            .stream()
            .map(role -> role.getName().name())
            .toArray(String[]::new);

        return org.springframework.security.core.userdetails.User

            .withUsername(user.getEmail())

            .password(user.getPasswordHash())

            .roles(roles)

            .disabled(!user.isActive())

            .build();
    }
}