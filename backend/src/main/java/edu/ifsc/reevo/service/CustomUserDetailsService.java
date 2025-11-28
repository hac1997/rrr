package edu.ifsc.reevo.service;

import edu.ifsc.reevo.repository.OrganizationRepository;
import edu.ifsc.reevo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);

        // First try to find in users table
        edu.ifsc.reevo.model.User user = userRepository.findByEmail(email);

        if (user != null) {
            if (!user.isActive()) {
                log.error("User account is deactivated: {}", email);
                throw new UsernameNotFoundException("User account is deactivated: " + email);
            }

            return User.builder()
                    .username(user.getEmail())
                    .password(user.getPasswordHash())
                    .authorities(Collections.singletonList(
                            new SimpleGrantedAuthority("ROLE_" + user.getUserType().name())
                    ))
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(!user.isActive())
                    .build();
        }

        // If not found in users, try organizations table
        edu.ifsc.reevo.model.Organization organization = organizationRepository.findByEmail(email);

        if (organization == null) {
            log.error("User/Organization not found with email: {}", email);
            throw new UsernameNotFoundException("User/Organization not found with email: " + email);
        }

        if (!organization.isActive()) {
            log.error("Organization account is deactivated: {}", email);
            throw new UsernameNotFoundException("Organization account is deactivated: " + email);
        }

        return User.builder()
                .username(organization.getEmail())
                .password(organization.getPasswordHash())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_ORGANIZATION")
                ))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!organization.isActive())
                .build();
    }
}
