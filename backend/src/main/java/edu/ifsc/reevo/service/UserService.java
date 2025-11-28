package edu.ifsc.reevo.service;

import edu.ifsc.reevo.dto.AuthRequest;
import edu.ifsc.reevo.dto.AuthResponse;
import edu.ifsc.reevo.dto.DtoRequest.ProfileRequestDTO;
import edu.ifsc.reevo.dto.DtoRequest.UserRequestDTO;
import edu.ifsc.reevo.dto.UserDashboardDTO;
import edu.ifsc.reevo.model.Notification;
import edu.ifsc.reevo.model.Organization;
import edu.ifsc.reevo.model.Profile;
import edu.ifsc.reevo.model.User;
import edu.ifsc.reevo.model.enums.NewsType;
import edu.ifsc.reevo.model.events.Certificate;
import edu.ifsc.reevo.model.events.Event;
import edu.ifsc.reevo.model.helper.Tag;
import edu.ifsc.reevo.model.helper.ProfileMetadata;
import java.time.Duration;
import edu.ifsc.reevo.repository.CertificateRepository;
import edu.ifsc.reevo.repository.NewsRepository;
import edu.ifsc.reevo.repository.NotificationRepository;
import edu.ifsc.reevo.repository.OrganizationRepository;
import edu.ifsc.reevo.repository.TagRepository;
import edu.ifsc.reevo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import edu.ifsc.reevo.model.news.News;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository; // Injeção necessária
    private final CertificateRepository certificateRepository;
    private final TagRepository tagRepository;
    private final GeneralMapper generalMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final NotificationRepository notificationRepository;
    private final NewsRepository newsRepository;

    public AuthResponse authUser(AuthRequest request) {
        log.info("AUTHENTICATING ENTITY WITH EMAIL :: {}", request.email());

        // Autenticação via Spring Security (verifica senha)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        // Gera Tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // 1. Tenta identificar como USUÁRIO
        User user = userRepository.findByEmail(request.email());

        if (user != null) {
            if (!user.isActive()) {
                throw new EntityNotFoundException("Usuário inativo");
            }
            return AuthResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .email(user.getEmail())
                    .userType(user.getUserType().name())
                    .userId(user.getUserId())
                    .build();
        }

        // 2. Se não achou usuário, tenta identificar como ORGANIZAÇÃO
        // CORREÇÃO: O repositório retorna Organization direto, então verificamos null
        Organization org = organizationRepository.findByEmail(request.email());

        if (org != null) {
            if (!org.isActive()) {
                throw new EntityNotFoundException("Organização inativa");
            }
            return AuthResponse.builder()
                    .token(jwtToken)
                    .refreshToken(refreshToken)
                    .email(org.getEmail())
                    .userType("ORGANIZATION") // Tipo específico para o front identificar
                    .userId(org.getOrganizationId())
                    .build();
        }

        // 3. Se não achou ninguém
        throw new EntityNotFoundException("Usuário ou Organização não encontrado");
    }

    public AuthResponse addUser(UserRequestDTO requestDTO) {
        log.info("ADDING USER BY REQUEST :: {}", requestDTO);

        User existingUser = userRepository.findByEmail(requestDTO.email());
        if (existingUser != null) {
            throw new IllegalArgumentException("Email already registered");
        }

        Profile profile = new Profile();
        profile.setProfileMetadata(new ProfileMetadata());
        var user = generalMapper.toUser(requestDTO, profile);

        profile.setUser(user);
        user.setProfile(profile);

        user.setPasswordHash(passwordEncoder.encode(requestDTO.passwordHash()));
        User savedUser = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwtToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .email(savedUser.getEmail())
                .userType(savedUser.getUserType().name())
                .userId(savedUser.getUserId())
                .build();
    }

    @Transactional
    public User updateUserById(UserRequestDTO userRequestDTO, ProfileRequestDTO profileRequestDTO) {
        log.info("UPDATING USER AND PROFILE :: USER ID = {}", profileRequestDTO.userId());
        User user = this.findUserById(profileRequestDTO.userId());
        Profile profile = user.getProfile();
        if (profile == null) {
            throw new EntityNotFoundException(
                    "PROFILE NOT FOUND WITH USER ID :: " + profileRequestDTO.userId());
        }

        user.setCPF(userRequestDTO.CPF());
        user.setFirstname(userRequestDTO.firstname());
        user.setLastname(userRequestDTO.lastname());
        user.setEmail(userRequestDTO.email());
        user.setPhone(userRequestDTO.phone());
        if (userRequestDTO.passwordHash() != null && !userRequestDTO.passwordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userRequestDTO.passwordHash()));
        }
        user.setUserType(userRequestDTO.userType());
        user.setBirthDate(userRequestDTO.birthDate());

        profile.setProfileUrl(profileRequestDTO.profileUrl());
        profile.setHeadline(profileRequestDTO.headline());
        profile.setBio(profileRequestDTO.bio());
        profile.setProfileImageUrl(profileRequestDTO.profileImageUrl());
        profile.setProfession(profileRequestDTO.profession());
        profile.setAddress(profileRequestDTO.address());
        profile.setProfileMetadata(profileRequestDTO.profileMetadata());
        profile.setSkills(profileRequestDTO.skills());
        profile.setLinks(profileRequestDTO.links());

        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(profileRequestDTO.tagIds()));
        profile.setTags(tags);

        return user;
    }

    public void deactivatingUser(Long userId) {
        log.info("DEACTIVATING USER BY ID :: {}", userId);
        var user = this.findUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        log.info("GETTING ALL USERS");
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        log.info("GETTING USER BY ID :: {}", userId);
        return this.findUserById(userId);
    }

    public List<User> getActiveUsers() {
        log.info("GETTING ACTIVE USERS");
        return userRepository.findByActiveTrue();
    }

    public User getUserByEmail(String email) {
        log.info("GETTING USER BY EMAIL :: {}", email);
        return userRepository.findByEmail(email);
    }

    protected User findUserById(Long userId) {
        log.info("FINDING USER BY ID :: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("USER NOT FOUND WITH ID :: " + userId));
    }

    public String findUserEmailById(Long userId) {
        log.info("FINDING USER EMAIL BY ID :: {}", userId);
        return userRepository.findEmailById(userId);
    }

    public Set<Tag> getTagsByUser(Long userId) {
        log.info("FINDING USER TAGS BY ID :: {}", userId);
        User user = this.findUserById(userId);
        Profile profile = user.getProfile();
        if (profile == null) {
            throw new EntityNotFoundException("Perfil não encontrado para o usuário com ID :: " + userId);
        }
        return profile.getTags();
    }

    public UserDashboardDTO getStats(Long userId) {

        User user = findUserById(userId);
        List<Event> eventosUsuario = user.getEvents();

        List<UserDashboardDTO.EventResume> eventosPassados = eventosUsuario.stream()
                .filter(e -> e.getEndDate() != null && e.getEndDate().isBefore(LocalDateTime.now()))
                .map(e -> UserDashboardDTO.EventResume.builder()
                        .id(e.getEventId())
                        .titulo(e.getTitle())
                        .inicio(e.getStartDate())
                        .fim(e.getEndDate())
                        .completed(e.isCompleted())
                        .pontos(e.getPointsReward())
                        .horasVoluntariadas(
                                Math.max(1,
                                        (int) java.time.Duration.between(
                                                e.getStartDate(),
                                                e.getEndDate())
                                                .toHours()))
                        .build())
                .toList();

        List<UserDashboardDTO.EventResume> eventosCompletados = eventosUsuario.stream()
                .filter(Event::isCompleted)
                .map(e -> UserDashboardDTO.EventResume.builder()
                        .id(e.getEventId())
                        .titulo(e.getTitle())
                        .inicio(e.getStartDate())
                        .fim(e.getEndDate())
                        .completed(true)
                        .pontos(e.getPointsReward())
                        .horasVoluntariadas(
                                Math.max(1,
                                        (int) java.time.Duration.between(
                                                e.getStartDate(),
                                                e.getEndDate())
                                                .toHours()))
                        .build())
                .toList();

        List<Certificate> certificados = certificateRepository.findByOwnerUserId(userId);

        int totalCertificados = certificados.size();
        int totalHorasCertificadas = certificados.stream()
                .mapToInt(Certificate::getHours)
                .sum();

        List<UserDashboardDTO.CertificateResume> certificadosResumo = certificados.stream()
                .map(c -> UserDashboardDTO.CertificateResume.builder()
                        .id(c.getCertificateId())
                        .nomeEvento(c.getEvent().getTitle())
                        .organizacao(
                                c.getOrganization() != null
                                        ? c.getOrganization().getName()
                                        : "Desconhecida")
                        .horasCertificadas(c.getHours())
                        .dataCertificacao(c.getDateCertified())
                        .build())
                .toList();

        int totalEventosParticipados = eventosUsuario.size();
        int totalHorasVoluntariadas = certificados.stream().mapToInt(Certificate::getHours).sum();
        int pontosAcumulados = eventosUsuario.stream().mapToInt(Event::getPointsReward).sum();

        Map<String, UserDashboardDTO.MonthlyActivity> atividadesMensais = certificados.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getDateCertified()
                                .format(DateTimeFormatter.ofPattern("yyyy-MM")),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> UserDashboardDTO.MonthlyActivity.builder()
                                        .eventos((int) list.stream().map(
                                                Certificate::getEvent)
                                                .distinct().count())
                                        .horas(list.stream().mapToInt(
                                                Certificate::getHours)
                                                .sum())
                                        .build())));

        // Calcular categoryStats
        Map<String, Long> categoryCounts = eventosUsuario.stream()
                .filter(Event::isCompleted)
                .flatMap(e -> e.getTags().stream())
                .collect(Collectors.groupingBy(Tag::getLabel, Collectors.counting()));

        int totalCompletedEvents = eventosCompletados.size();
        List<UserDashboardDTO.CategoryStats> categoryStats = categoryCounts.entrySet().stream()
                .map(entry -> UserDashboardDTO.CategoryStats.builder()
                        .category(entry.getKey())
                        .events(entry.getValue().intValue())
                        .percentage(totalCompletedEvents > 0
                                ? (int) ((entry.getValue() * 100.0)
                                        / totalCompletedEvents)
                                : 0)
                        .build())
                .toList();

        List<News> allConquestNews = newsRepository.findByType(NewsType.CONQUEST);
        String userFullName = user.getFirstname() + " " + user.getLastname();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        List<UserDashboardDTO.Achievement> achievements = allConquestNews.stream()
                .filter(n -> n.getTitle().contains(userFullName) || n.getBody().contains(userFullName))
                .map(n -> UserDashboardDTO.Achievement.builder()
                        .title(n.getTitle())
                        .description(n.getBody())
                        .date(n.getPublishDate().format(dateFormatter))
                        .icon(n.getImageUrl())
                        .build())
                .toList();

        List<Notification> notifications = notificationRepository.findByUserUserId(userId);
        List<UserDashboardDTO.NotificationResume> notificationResumes = notifications.stream()
                .map(n -> UserDashboardDTO.NotificationResume.builder()
                        .id(n.getNotificationId())
                        .text(n.getMessage())
                        .time(calculateRelativeTime(n.getSentAt()))
                        .build())
                .toList();

        return UserDashboardDTO.builder()
                .eventosPassados(eventosPassados)
                .eventosCompletados(eventosCompletados)
                .avaliacaoMediaUsuario(0f)
                .eventoDetalhes(null)
                .totalEventosParticipados(totalEventosParticipados)
                .totalHorasVoluntariadas(totalHorasVoluntariadas)
                .pontosAcumulados(pontosAcumulados)
                .atividadesMensais(atividadesMensais)
                .totalCertificados(totalCertificados)
                .totalHorasCertificadas(totalHorasCertificadas)
                .certificados(certificadosResumo)
                .categoryStats(categoryStats)
                .achievements(achievements)
                .notifications(notificationResumes)
                .build();
    }

    private String calculateRelativeTime(LocalDateTime sentAt) {
        Duration duration = Duration.between(sentAt, LocalDateTime.now());
        if (duration.toDays() > 0) {
            return duration.toDays() + "d atrás";
        } else if (duration.toHours() > 0) {
            return duration.toHours() + "h atrás";
        } else if (duration.toMinutes() > 0) {
            return duration.toMinutes() + "min atrás";
        } else {
            return "agora";
        }
    }
}