package edu.ifsc.reevo.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDashboardDTO {

    private List<EventResume> eventosPassados;
    private List<EventResume> eventosCompletados;
    private float avaliacaoMediaUsuario;
    private EventDetail eventoDetalhes;

    private int totalEventosParticipados;
    private int totalHorasVoluntariadas;
    private int pontosAcumulados;

    private Map<String, MonthlyActivity> atividadesMensais;

    private int totalCertificados;
    private int totalHorasCertificadas;
    private List<CertificateResume> certificados;

    // Novos campos adicionados
    private List<CategoryStats> categoryStats;     // Para MOCK_CATEGORY_STATS
    private List<Achievement> achievements;        // Para MOCK_ACHIEVEMENTS
    private List<NotificationResume> notifications; // Para MOCK_NOTIFICATIONS

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventResume {
        private Long id;
        private String titulo;
        private LocalDateTime inicio;
        private LocalDateTime fim;
        private boolean completed;
        private int pontos;
        private int horasVoluntariadas;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventDetail {
        private Long id;
        private String titulo;
        private String descricao;
        private int totalLikes;
        private int totalComentarios;
        private String organizacao;
        private List<String> tags;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyActivity {
        private int eventos;
        private int horas;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificateResume {
        private Long id;
        private String nomeEvento;
        private String organizacao;
        private int horasCertificadas;
        private LocalDateTime dataCertificacao;
    }

    // Nova subclasse para category stats (inspirado em MOCK_CATEGORY_STATS)
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryStats {
        private String category;
        private int events;
        private int percentage;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Achievement {
        private String title;
        private String description;
        private String date;  
        private String icon;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationResume {
        private Long id;
        private String text;
        private String time;  
    }
}