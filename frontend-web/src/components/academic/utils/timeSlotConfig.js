export const timeSlotConfig = {
  slotToTime: {
    1: { start: "08:00", end: "08:30" },
    2: { start: "08:30", end: "09:00" },
    3: { start: "09:00", end: "09:30" },
    4: { start: "09:30", end: "10:00" },
    5: { start: "10:00", end: "10:30" },
    6: { start: "10:30", end: "11:00" },
    7: { start: "11:00", end: "11:30" },
    8: { start: "11:30", end: "12:00" },
    9: { start: "12:00", end: "12:30" },
    10: { start: "12:30", end: "13:00" },
    11: { start: "13:00", end: "13:30" },
    12: { start: "13:30", end: "14:00" },
    13: { start: "14:00", end: "14:30" },
    14: { start: "14:30", end: "15:00" },
    15: { start: "15:00", end: "15:30" },
    16: { start: "15:30", end: "16:00" },
    17: { start: "16:00", end: "16:30" },
    18: { start: "16:30", end: "17:00" },
    19: { start: "17:00", end: "17:30" },
    20: { start: "17:30", end: "18:00" },
    21: { start: "18:00", end: "18:30" },
    22: { start: "18:30", end: "19:00" }
  },

  convertSlotsToTime(slotIds) {
    if (!slotIds || slotIds.length === 0) return null;
    
    const sortedSlots = [...slotIds].sort((a, b) => a - b);
    const startTime = this.slotToTime[sortedSlots[0]]?.start;
    const endTime = this.slotToTime[sortedSlots[sortedSlots.length - 1]]?.end;
    
    return { startTime, endTime };
  }
};