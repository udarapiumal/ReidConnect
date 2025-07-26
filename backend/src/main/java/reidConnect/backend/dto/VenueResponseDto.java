package reidConnect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import reidConnect.backend.enums.CapacityRange;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class VenueResponseDto {
    private Long id;
    private String name;
    private CapacityRange capacityRange;
    private String faculty;

}
