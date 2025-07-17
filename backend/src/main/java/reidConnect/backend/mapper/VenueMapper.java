package reidConnect.backend.mapper;

import reidConnect.backend.dto.VenueRequestDto;
import reidConnect.backend.dto.VenueResponseDto;
import reidConnect.backend.entity.Venue;

public class VenueMapper {

    public static Venue toEntity(VenueRequestDto dto) {
        Venue venue = new Venue();
        venue.setName(dto.getName());
        venue.setFaculty(dto.getFaculty());
        venue.setCapacityRange(dto.getCapacityRange());
        return venue;
    }

    public static VenueResponseDto toDto(Venue venue) {
        return new VenueResponseDto(
                venue.getId(),
                venue.getName(),
                venue.getCapacityRange(),
                venue.getFaculty()
        );
    }

    public static void updateVenueFromDto(Venue venue, VenueRequestDto dto) {
        venue.setName(dto.getName());
        venue.setFaculty(dto.getFaculty());
        venue.setCapacityRange(dto.getCapacityRange());
    }
}
