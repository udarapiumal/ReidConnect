package reidConnect.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "event_slot")
@Getter
@Setter
@NoArgsConstructor
public class EventSlot {

    @EmbeddedId
    private EventSlotId id;

    @ManyToOne
    @MapsId("eventId") // maps to id.eventId
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @MapsId("slotId") // maps to id.slotId
    @JoinColumn(name = "slot_id")
    private Slot slot;

    public EventSlot(Event event, Slot slot) {
        this.event = event;
        this.slot = slot;
        this.id = new EventSlotId(event.getId(), slot.getId());
    }
}
