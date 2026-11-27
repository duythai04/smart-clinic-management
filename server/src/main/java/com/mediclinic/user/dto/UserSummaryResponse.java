package com.mediclinic.user.dto;

public record UserSummaryResponse(
        long totalUsers,
        long activeUsers,
        long lockedUsers,
        long totalAdmins,
        long totalDoctors,
        long totalReceptionists,
        long totalPharmacists,
        long totalLabTechnicians,
        long totalCashiers
) {
}