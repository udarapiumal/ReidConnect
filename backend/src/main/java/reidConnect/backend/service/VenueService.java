package reidConnect.backend.service;

import reidConnect.backend.dto.VenueRequestDto;
import reidConnect.backend.dto.VenueResponseDto;

import java.util.List;

public interface VenueService {
    VenueResponseDto createVenue(VenueRequestDto request);
    VenueResponseDto getVenueById(Long id);
    List<VenueResponseDto> getAllVenues();
    VenueResponseDto updateVenue(Long id, VenueRequestDto request);
    void deleteVenue(Long id);
}
