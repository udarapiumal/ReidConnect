package net.reidConnect.rc.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ClubCoordinatorDto {
    private Long id;
    private String userName;
    private String registrationNumber;
    private String indexNumber;
    private String email;
}
