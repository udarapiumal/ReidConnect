package reidConnect.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@EqualsAndHashCode
public class EventSlotId implements Serializable {

    @Column(name = "event_id")
    private Long eventId;

    @Column(name = "slot_id")
    private Long slotId;

    // No-args constructor is required
    public EventSlotId() {}

    public EventSlotId(Long eventId, Long slotId) {
        this.eventId = eventId;
        this.slotId = slotId;
    }
}
