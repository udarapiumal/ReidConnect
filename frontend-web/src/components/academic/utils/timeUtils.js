export const timeUtils = {
  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  },

  calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return (end - start) / (1000 * 60 * 60); // Duration in hours
  },

  getClassesForTimeSlot(day, timeSlot, timetableArray = []) {
    const classes = timetableArray.filter(item => {
      if (item.day !== day) return false;
      
      const itemStartMinutes = this.timeToMinutes(item.startTime);
      const itemEndMinutes = this.timeToMinutes(item.endTime);
      const slotStartMinutes = this.timeToMinutes(timeSlot.start);
      const slotEndMinutes = this.timeToMinutes(timeSlot.end);
      
      return itemStartMinutes < slotEndMinutes && itemEndMinutes > slotStartMinutes;
    });
    
    return classes;
  }
};