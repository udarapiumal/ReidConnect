package reidConnect.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reidConnect.backend.dto.VenueRequestDto;
import reidConnect.backend.dto.VenueResponseDto;
import reidConnect.backend.entity.Venue;
import reidConnect.backend.mapper.VenueMapper;
import reidConnect.backend.repository.VenueRepository;
import reidConnect.backend.service.VenueService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;

    @Override
    public VenueResponseDto createVenue(VenueRequestDto request) {
        Venue venue = VenueMapper.toEntity(request);
        Venue saved = venueRepository.save(venue);
        return VenueMapper.toDto(saved);
    }

    @Override
    public VenueResponseDto getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        return VenueMapper.toDto(venue);
    }

    @Override
    public List<VenueResponseDto> getAllVenues() {
        return venueRepository.findAll()
                .stream()
                .map(VenueMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public VenueResponseDto updateVenue(Long id, VenueRequestDto request) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        VenueMapper.updateVenueFromDto(venue, request);
        return VenueMapper.toDto(venueRepository.save(venue));
    }

    @Override
    public void deleteVenue(Long id) {
        if (!venueRepository.existsById(id)) {
            throw new RuntimeException("Venue not found with id: " + id);
        }
        venueRepository.deleteById(id);
    }
}
