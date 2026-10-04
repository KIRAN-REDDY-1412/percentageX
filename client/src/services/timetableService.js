/**
 * Shared Timetable & Academic Management Service
 * 
 * Provides a single source of truth for:
 * - Assigned classes (My Classes)
 * - Daily & Weekly Timetables (View Schedule)
 * - Class attendance sessions (Mark Attendance)
 * 
 * Designed for future Admin control (adding/editing faculty, courses, sections, schedules).
 */

export const INITIAL_ASSIGNED_CLASSES = [];

const STORAGE_KEY = "percentagex_assigned_classes";

/**
 * Parses time string e.g. "09:00 AM - 10:00 AM" into start minutes from midnight for sorting.
 */
function parseStartTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const startPart = timeStr.split("-")[0].trim();
  const match = startPart.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Retrieves all assigned classes (from localStorage if present, else default).
 */
export function getAssignedClasses() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Error reading assigned classes from localStorage:", err);
  }
  return INITIAL_ASSIGNED_CLASSES;
}

/**
 * Saves assigned classes to storage (Admin support).
 */
export function saveAssignedClasses(classesList) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classesList));
  } catch (err) {
    console.warn("Error saving assigned classes to localStorage:", err);
  }
}

/**
 * Returns all classes for a specific day of the week, sorted by start time.
 */
export function getScheduleForDay(dayName) {
  const classes = getAssignedClasses();
  const dailySlots = [];

  classes.forEach((cls) => {
    cls.schedule.forEach((slot) => {
      if (slot.day.toLowerCase() === dayName.toLowerCase()) {
        dailySlots.push({
          classId: cls.id,
          subject: cls.subject,
          course: cls.course,
          year: cls.year,
          section: cls.section,
          students: cls.students,
          room: cls.room,
          type: cls.type || "blue",
          time: slot.time,
          period: slot.period || "Period",
          day: slot.day,
        });
      }
    });
  });

  dailySlots.sort(
    (a, b) => parseStartTimeToMinutes(a.time) - parseStartTimeToMinutes(b.time)
  );

  return dailySlots;
}

/**
 * Returns schedule for a specific Date object.
 */
export function getScheduleForDate(date) {
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  return getScheduleForDay(dayName);
}

/**
 * Formats date into YYYY-MM-DD using local time (timezone safe).
 */
export function formatDateYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Parses YYYY-MM-DD string into a safe Date (noon local time).
 */
export function parseDateYMD(dateStr) {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day, 12, 0, 0);
  }
  return new Date(dateStr);
}

/**
 * Computes a target date in the week corresponding to a given weekday name.
 */
export function getDateForWeekday(baseDate, targetDayName) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const targetIndex = daysOfWeek.findIndex(
    (d) => d.toLowerCase() === targetDayName.toLowerCase()
  );
  if (targetIndex === -1) return new Date(baseDate);

  const result = new Date(baseDate);
  const currentDayIndex = result.getDay();
  const diff = targetIndex - currentDayIndex;
  result.setDate(result.getDate() + diff);
  return result;
}

/**
 * Returns schedule for a specific section on a specific day of the week.
 * (Used for Student and Incharge schedules).
 */
export function getScheduleForSection(course, year, section, dayName) {
  const classes = getAssignedClasses();
  const slots = [];

  classes.forEach((cls) => {
    const matchesCourse = !course || cls.course.toLowerCase() === course.toLowerCase();
    const matchesYear = !year || cls.year.toLowerCase() === year.toLowerCase();
    const matchesSection = !section || cls.section.toLowerCase() === section.toLowerCase();

    if (matchesCourse && matchesYear && matchesSection) {
      cls.schedule.forEach((slot) => {
        if (!dayName || slot.day.toLowerCase() === dayName.toLowerCase()) {
          slots.push({
            subject: cls.subject,
            course: cls.course,
            year: cls.year,
            section: cls.section,
            room: cls.room,
            type: cls.type || "blue",
            time: slot.time,
            period: slot.period || "Period",
            day: slot.day,
            facultyName: cls.facultyName || "Assigned Faculty",
          });
        }
      });
    }
  });

  slots.sort(
    (a, b) => parseStartTimeToMinutes(a.time) - parseStartTimeToMinutes(b.time)
  );

  return slots;
}

