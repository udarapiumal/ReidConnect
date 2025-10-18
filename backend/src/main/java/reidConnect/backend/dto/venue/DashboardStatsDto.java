package reidConnect.backend.dto.venue;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalClubs;
    private long totalStudentProfiles;
    private long totalBookings;
    private long fullyApprovedBookings;
    private long pendingBookings;
    private long rejectedBookings;
}