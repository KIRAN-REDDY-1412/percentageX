import { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_SUBJECTS,
  INITIAL_FACULTY_MEMBERS,
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ATTENDANCE_LOGS,
  INITIAL_INTERNAL_MARKS,
  INITIAL_ASSIGNMENTS_POSTED,
  INITIAL_COLLEGES,
} from "../data/initialData";

const CollegeContext = createContext(null);

export function CollegeProvider({ children }) {
  // Current logged in user & role (null if not logged in)
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("percentagex_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.role) return parsed;
      } catch {
        // fallback
      }
    }
    return null;
  });

  // Colleges (Multi-Tenant platform)
  const [colleges, setColleges] = useState(() => {
    const saved = localStorage.getItem("percentagex_colleges");
    return saved ? JSON.parse(saved) : INITIAL_COLLEGES;
  });

  // Verified student for student access
  const [verifiedStudentData, setVerifiedStudentData] = useState(() => {
    const saved = sessionStorage.getItem("percentagex_student_session");
    return saved ? JSON.parse(saved) : null;
  });

  // Academic Entities
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("percentagex_courses");
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("percentagex_subjects");
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [facultyMembers, setFacultyMembers] = useState(() => {
    const saved = localStorage.getItem("percentagex_faculty");
    return saved ? JSON.parse(saved) : INITIAL_FACULTY_MEMBERS;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("percentagex_students");
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("percentagex_assigned_classes");
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [attendanceLogs, setAttendanceLogs] = useState(() => {
    const saved = localStorage.getItem("percentagex_attendance_logs");
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_LOGS;
  });

  const [internalMarks, setInternalMarks] = useState(() => {
    const saved = localStorage.getItem("percentagex_internal_marks");
    return saved ? JSON.parse(saved) : INITIAL_INTERNAL_MARKS;
  });

  const [assignmentsPosted, setAssignmentsPosted] = useState(() => {
    const saved = localStorage.getItem("percentagex_assignments_posted");
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS_POSTED;
  });

  // Sync state changes with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("percentagex_role", currentUser.role);
      localStorage.setItem("percentagex_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("percentagex_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("percentagex_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("percentagex_faculty", JSON.stringify(facultyMembers));
  }, [facultyMembers]);

  useEffect(() => {
    localStorage.setItem("percentagex_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("percentagex_assigned_classes", JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem("percentagex_attendance_logs", JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem("percentagex_internal_marks", JSON.stringify(internalMarks));
  }, [internalMarks]);

  useEffect(() => {
    localStorage.setItem("percentagex_assignments_posted", JSON.stringify(assignmentsPosted));
  }, [assignmentsPosted]);

  useEffect(() => {
    localStorage.setItem("percentagex_colleges", JSON.stringify(colleges));
  }, [colleges]);

  // Load Colleges from API
  const fetchColleges = async () => {
    try {
      const res = await fetch("/api/colleges");
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const data = await res.json();
        if (Array.isArray(data)) setColleges(data);
      }
    } catch (err) {
      console.warn("API fetchColleges error:", err);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Sync College Data whenever active college changes
  useEffect(() => {
    if (!currentUser?.collegeId) return;

    const bootstrapCollegeData = async () => {
      try {
        const res = await fetch(`/api/academic/bootstrap?collegeId=${encodeURIComponent(currentUser.collegeId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.courses) setCourses(data.courses);
          if (data.subjects) setSubjects(data.subjects);
          if (data.users) {
            const fac = data.users
              .filter((u) => u.role === "faculty")
              .map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                department: u.department,
                designation: u.designation,
                assignedSections: u.assigned_section ? [u.assigned_section] : [],
                status: u.status || "Active",
                subjects: [],
              }));
            setFacultyMembers(fac);
          }
          if (data.students) {
            const stu = data.students.map((s) => ({
              id: s.id,
              rollNumber: s.roll_number,
              name: s.name,
              email: s.email,
              phone: s.phone,
              course: s.course,
              year: s.year,
              section: s.section,
              status: s.status || "Active",
            }));
            setStudents(stu);
          }
          if (data.timetable) {
            setAssignments(data.timetable);
          }
          if (data.attendanceLogs) {
            setAttendanceLogs(data.attendanceLogs);
          }
          if (data.assignments) {
            setAssignmentsPosted(data.assignments);
          }
        }
      } catch (err) {
        console.warn("Error bootstrapping college data:", err);
      }
    };

    bootstrapCollegeData();
  }, [currentUser?.collegeId]);

  // College Creation
  const createCollege = async (collegeData) => {
    try {
      const res = await fetch("/api/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collegeData),
      });
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.includes("application/json")) {
        const newCol = await res.json();
        setColleges((prev) => [newCol, ...prev]);
        return newCol;
      }
    } catch (e) {
      console.warn("API createCollege fallback:", e);
    }
    const localCol = {
      id: `col-${collegeData.code.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      status: "active",
      ...collegeData,
    };
    setColleges((prev) => [localCol, ...prev]);
    return localCol;
  };

  const updateCollegeStatus = async (collegeId, status) => {
    try {
      await fetch(`/api/colleges/${collegeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      console.warn("API updateCollegeStatus fallback:", e);
    }
    setColleges((prev) =>
      prev.map((c) => (c.id === collegeId ? { ...c, status } : c))
    );
  };

  const updateCollegeDetails = async (collegeId, updatedData) => {
    try {
      const res = await fetch(`/api/colleges/${collegeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const data = await res.json();
        setColleges((prev) =>
          prev.map((c) => (c.id === collegeId ? { ...c, ...data } : c))
        );
        return { success: true, college: data };
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update college on server");
      }
    } catch (e) {
      console.warn("API updateCollegeDetails fallback:", e);
      setColleges((prev) =>
        prev.map((c) => (c.id === collegeId ? { ...c, ...updatedData } : c))
      );
      return { success: true, warning: e.message };
    }
  };

  const updateCollegeLogo = async (collegeId, logo) => {
    try {
      const res = await fetch(`/api/colleges/${collegeId}/logo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo }),
      });
      if (res.ok) {
        const data = await res.json();
        const savedLogo = data.logo;
        setColleges((prev) =>
          prev.map((c) => (c.id === collegeId ? { ...c, logo: savedLogo } : c))
        );
        if (currentUser && currentUser.collegeId === collegeId) {
          const updatedUser = { ...currentUser, collegeLogo: savedLogo };
          setCurrentUser(updatedUser);
          localStorage.setItem("percentagex_user", JSON.stringify(updatedUser));
        }
        return { success: true, logo: savedLogo };
      }
    } catch (e) {
      console.warn("API updateCollegeLogo fallback:", e);
    }
    // Local fallback
    setColleges((prev) =>
      prev.map((c) => (c.id === collegeId ? { ...c, logo } : c))
    );
    if (currentUser && currentUser.collegeId === collegeId) {
      const updatedUser = { ...currentUser, collegeLogo: logo };
      setCurrentUser(updatedUser);
      localStorage.setItem("percentagex_user", JSON.stringify(updatedUser));
    }
    return { success: true, logo };
  };

  const setVerifiedStudent = (verificationData) => {
    setVerifiedStudentData(verificationData);
    if (verificationData?.student) {
      setCurrentUser({
        id: verificationData.student.id,
        rollNumber: verificationData.student.rollNumber,
        name: verificationData.student.name,
        email: verificationData.student.email,
        phone: verificationData.student.phone,
        course: verificationData.student.course,
        year: verificationData.student.year,
        section: verificationData.student.section,
        role: "student",
        roleLabel: "Verified Student",
        collegeId: verificationData.student.collegeId,
      });
    }
  };

  // Auth & Session Management
  const setAuthenticatedUser = (user) => {
    if (!user) {
      logout();
      return;
    }
    const cleanUser = {
      ...user,
      collegeId: user.collegeId || null,
      roleLabel: user.roleLabel || (
        user.role === "super_admin"
          ? "Platform Super Administrator"
          : user.role === "admin"
          ? `${user.collegeName || "College"} Administrator`
          : user.role.toUpperCase()
      ),
      avatar: user.avatar || (user.name ? user.name.slice(0, 2).toUpperCase() : (user.role === "super_admin" ? "SA" : "PX")),
    };
    setCurrentUser(cleanUser);
    localStorage.setItem("percentagex_user", JSON.stringify(cleanUser));
    localStorage.setItem("percentagex_role", cleanUser.role);
  };

  const switchRole = (roleKey) => {
    if (roleKey === "super_admin") {
      const sa = INITIAL_USERS.super_admin;
      setCurrentUser(sa);
      localStorage.setItem("percentagex_user", JSON.stringify(sa));
      localStorage.setItem("percentagex_role", "super_admin");
      return sa;
    }
    if (roleKey === "admin") {
      const activeCol = colleges.find((c) => c.id === currentUser?.collegeId) || colleges[0];
      const adm = {
        id: `usr-admin-${activeCol?.code?.toLowerCase() || "01"}`,
        name: activeCol ? `${activeCol.name} Administrator` : "College Administrator",
        email: activeCol?.adminEmail || activeCol?.email || "admin@kvdc.edu",
        role: "admin",
        roleLabel: `${activeCol?.name || "College"} Administrator`,
        collegeId: activeCol ? activeCol.id : "col-kvdc-8820",
        collegeName: activeCol ? activeCol.name : "krishna veni degree college",
        collegeCode: activeCol ? activeCol.code : "KVDC",
        department: "Administration",
        designation: "College Administrator",
        phone: activeCol?.phone || "+91 98888 11111",
        avatar: "CA",
      };
      setCurrentUser(adm);
      localStorage.setItem("percentagex_user", JSON.stringify(adm));
      localStorage.setItem("percentagex_role", "admin");
      return adm;
    }
    const user = INITIAL_USERS[roleKey] || {
      id: `usr-${roleKey}-${Date.now().toString().slice(-4)}`,
      name: `${roleKey.toUpperCase()} Staff`,
      role: roleKey,
      roleLabel: roleKey.toUpperCase(),
      collegeId: currentUser?.collegeId || null,
      collegeName: currentUser?.collegeName || null,
      collegeCode: currentUser?.collegeCode || null,
      email: `${roleKey}@percentagex.edu`,
      avatar: roleKey.slice(0, 2).toUpperCase(),
    };
    setCurrentUser(user);
    localStorage.setItem("percentagex_user", JSON.stringify(user));
    localStorage.setItem("percentagex_role", roleKey);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    setVerifiedStudentData(null);
    localStorage.removeItem("percentagex_user");
    localStorage.removeItem("percentagex_role");
    sessionStorage.removeItem("percentagex_student_session");
    // Clear tenant-scoped academic state to avoid cross-tenant leakage
    setCourses([]);
    setSubjects([]);
    setFacultyMembers([]);
    setStudents([]);
    setAssignments([]);
    setAttendanceLogs([]);
    setInternalMarks({});
    setAssignmentsPosted([]);
    localStorage.removeItem("percentagex_courses");
    localStorage.removeItem("percentagex_subjects");
    localStorage.removeItem("percentagex_faculty");
    localStorage.removeItem("percentagex_students");
    localStorage.removeItem("percentagex_assigned_classes");
    localStorage.removeItem("percentagex_attendance_logs");
    localStorage.removeItem("percentagex_internal_marks");
    localStorage.removeItem("percentagex_assignments_posted");
  };

  const updateUserProfile = async (updatedFields) => {
    const updatedUser = {
      ...currentUser,
      ...updatedFields,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("percentagex_user", JSON.stringify(updatedUser));

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentUser?.id,
          currentEmail: currentUser?.email,
          name: updatedFields.name,
          email: updatedFields.email,
          phone: updatedFields.phone,
          password: updatedFields.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile on server");
      }

      if (data.user) {
        const merged = { ...updatedUser, ...data.user };
        // Preserve college attributes
        if (currentUser?.collegeName && !merged.collegeName) {
          merged.collegeName = currentUser.collegeName;
        }
        if (currentUser?.collegeCode && !merged.collegeCode) {
          merged.collegeCode = currentUser.collegeCode;
        }
        if (currentUser?.collegeId && !merged.collegeId) {
          merged.collegeId = currentUser.collegeId;
        }
        setCurrentUser(merged);
        localStorage.setItem("percentagex_user", JSON.stringify(merged));
      }
      return { success: true, message: data.message };
    } catch (err) {
      console.warn("Profile database update warning:", err.message);
      return { success: true, warning: err.message };
    }
  };

  // Faculty CRUD
  const addFaculty = async (faculty) => {
    const college_id = faculty.college_id || currentUser?.collegeId;
    const newFaculty = {
      ...faculty,
      college_id,
      id: faculty.id || `usr-fac-${Date.now().toString().slice(-4)}`,
      status: faculty.status || "Active",
      assignedSections: faculty.assignedSections || [],
      subjects: faculty.subjects || [],
    };
    setFacultyMembers((prev) => [newFaculty, ...prev]);

    if (college_id) {
      try {
        await fetch("/api/academic/faculty", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            name: faculty.name,
            email: faculty.email,
            phone: faculty.phone,
            department: faculty.department,
            designation: faculty.designation,
            assigned_section: faculty.assignedSections?.[0] || "",
          }),
        });
      } catch (err) {
        console.warn("Failed to persist faculty to database:", err);
      }
    }
    return newFaculty;
  };

  const editFaculty = async (id, updatedFields) => {
    setFacultyMembers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f))
    );
    try {
      await fetch(`/api/academic/faculty/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.warn("Failed to update faculty in DB:", err);
    }
  };

  const deleteFaculty = async (id) => {
    setFacultyMembers((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`/api/academic/faculty/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete faculty from DB:", err);
    }
  };

  // Student CRUD
  const addStudent = async (student) => {
    const college_id = student.college_id || currentUser?.collegeId;
    const newStudent = {
      ...student,
      college_id,
      id: student.id || `stu-${student.rollNumber || Date.now().toString().slice(-4)}`,
      status: student.status || "Active",
      attendancePercentage: student.attendancePercentage || 85,
    };
    setStudents((prev) => [newStudent, ...prev]);

    if (college_id) {
      try {
        await fetch("/api/academic/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            roll_number: student.rollNumber,
            name: student.name,
            email: student.email,
            phone: student.phone,
            course: student.course,
            year: student.year,
            section: student.section,
          }),
        });
      } catch (err) {
        console.warn("Failed to persist student to DB:", err);
      }
    }
    return newStudent;
  };

  const editStudent = async (id, updatedFields) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
    try {
      await fetch(`/api/academic/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
    } catch (err) {
      console.warn("Failed to update student in DB:", err);
    }
  };

  const deleteStudent = async (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/academic/students/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete student from DB:", err);
    }
  };

  // Courses & Subjects CRUD
  const addCourse = async (course) => {
    const college_id = course.college_id || currentUser?.collegeId;
    const newCourse = {
      ...course,
      college_id,
      id: course.id || `course-${course.code?.toLowerCase() || Date.now()}`,
    };
    setCourses((prev) => [newCourse, ...prev]);

    if (college_id) {
      try {
        await fetch("/api/academic/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            code: course.code,
            name: course.name,
            fullName: course.fullName,
            department: course.department,
            duration: course.duration,
            years: course.years,
            sections: course.sections,
          }),
        });
      } catch (err) {
        console.warn("Failed to persist course to DB:", err);
      }
    }
    return newCourse;
  };

  const deleteCourse = async (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/academic/courses/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete course from DB:", err);
    }
  };

  const addSubject = async (subject) => {
    const college_id = subject.college_id || currentUser?.collegeId;
    const newSub = {
      ...subject,
      college_id,
      id: subject.id || `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSub]);

    if (college_id) {
      try {
        await fetch("/api/academic/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            code: subject.code,
            name: subject.name,
            department: subject.department,
            credits: subject.credits,
          }),
        });
      } catch (err) {
        console.warn("Failed to persist subject to DB:", err);
      }
    }
    return newSub;
  };

  // Timetable / Faculty Assignment CRUD
  const addAssignment = async (newAssignment) => {
    const college_id = newAssignment.college_id || currentUser?.collegeId;
    const id = newAssignment.id || `tt-${Date.now()}`;
    const formatted = {
      ...newAssignment,
      college_id,
      id,
      schedule: newAssignment.schedule || [],
    };
    setAssignments((prev) => [...prev, formatted]);

    if (college_id) {
      try {
        await fetch("/api/academic/timetable", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            faculty_id: newAssignment.faculty_id || newAssignment.facultyId,
            faculty_name: newAssignment.faculty_name || newAssignment.facultyName,
            subject_id: newAssignment.subject_id || newAssignment.subjectId,
            subject_name: newAssignment.subject_name || newAssignment.subject || newAssignment.subjectName,
            course: newAssignment.course,
            year: newAssignment.year,
            section: newAssignment.section,
            day: newAssignment.day || "Monday",
            time: newAssignment.time || "09:00 AM - 10:00 AM",
            room: newAssignment.room || "Room 101",
            period: newAssignment.period || "Period 1",
            type: newAssignment.type || "blue",
          }),
        });
      } catch (err) {
        console.warn("Failed to persist timetable to DB:", err);
      }
    }
    return formatted;
  };

  const editAssignment = (id, updatedFields) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
    );
  };

  const deleteAssignment = async (id) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    try {
      await fetch(`/api/academic/timetable/${id}`, { method: "DELETE" });
    } catch (err) {
      console.warn("Failed to delete timetable from DB:", err);
    }
  };

  // Attendance Submission
  const submitAttendanceLog = async (logData) => {
    const college_id = logData.college_id || currentUser?.collegeId;
    const newLog = {
      id: `att-${Date.now()}`,
      timestamp: new Date().toISOString(),
      college_id,
      ...logData,
    };
    setAttendanceLogs((prev) => [newLog, ...prev]);

    if (college_id) {
      try {
        await fetch("/api/academic/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            faculty_id: logData.facultyId || currentUser?.id,
            faculty_name: logData.facultyName || currentUser?.name,
            subject: logData.subject,
            course: logData.course,
            year: logData.year,
            section: logData.section,
            date: logData.date || new Date().toISOString().split("T")[0],
            day: logData.day || "Monday",
            time: logData.time || "09:00 AM",
            total_students: logData.totalStudents || 40,
            present_count: logData.presentCount || 0,
            absent_count: logData.absentCount || 0,
            absent_rolls: logData.absentRolls || [],
          }),
        });
      } catch (err) {
        console.warn("Failed to persist attendance to DB:", err);
      }
    }
    return newLog;
  };

  const updateAttendanceLog = (id, updatedFields) => {
    setAttendanceLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updatedFields } : log))
    );
  };

  // Internal Marks Saving
  const saveStudentMarks = async (rollNo, subjectName, marksData) => {
    const college_id = currentUser?.collegeId;
    setInternalMarks((prev) => {
      const studentObj = prev[rollNo] || {};
      return {
        ...prev,
        [rollNo]: {
          ...studentObj,
          [subjectName]: marksData,
        },
      };
    });

    if (college_id) {
      try {
        await fetch("/api/academic/marks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            roll_number: rollNo,
            subject: subjectName,
            assignment: marksData.assignment,
            mid1: marksData.mid1,
            mid2: marksData.mid2,
            quiz: marksData.quiz,
            total: marksData.total,
          }),
        });
      } catch (err) {
        console.warn("Failed to persist marks to DB:", err);
      }
    }
  };

  // Assignment Creation
  const createAssignment = async (assignmentData) => {
    const college_id = assignmentData.college_id || currentUser?.collegeId;
    const newAsn = {
      id: Date.now(),
      submissionsCount: 0,
      studentStatus: "Pending",
      college_id,
      ...assignmentData,
    };
    setAssignmentsPosted((prev) => [newAsn, ...prev]);

    if (college_id) {
      try {
        await fetch("/api/academic/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            college_id,
            faculty_id: assignmentData.facultyId || currentUser?.id,
            subject: assignmentData.subject,
            course: assignmentData.course,
            year: assignmentData.year,
            section: assignmentData.section,
            title: assignmentData.title,
            due_date: assignmentData.dueDate,
            total_marks: assignmentData.totalMarks || 10,
            description: assignmentData.description,
          }),
        });
      } catch (err) {
        console.warn("Failed to persist assignment to DB:", err);
      }
    }
    return newAsn;
  };

  const toggleStudentSubmission = (assignmentId) => {
    setAssignmentsPosted((prev) =>
      prev.map((asn) => {
        if (asn.id === assignmentId) {
          const nextStatus = asn.studentStatus === "Submitted" ? "Pending" : "Submitted";
          return {
            ...asn,
            studentStatus: nextStatus,
            submissionsCount:
              nextStatus === "Submitted"
                ? asn.submissionsCount + 1
                : Math.max(0, asn.submissionsCount - 1),
          };
        }
        return asn;
      })
    );
  };

  return (
    <CollegeContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        setAuthenticatedUser,
        switchRole,
        updateUserProfile,
        courses,
        addCourse,
        deleteCourse,
        subjects,
        addSubject,
        facultyMembers,
        addFaculty,
        editFaculty,
        deleteFaculty,
        students,
        addStudent,
        editStudent,
        deleteStudent,
        assignments,
        addAssignment,
        editAssignment,
        deleteAssignment,
        attendanceLogs,
        submitAttendanceLog,
        updateAttendanceLog,
        internalMarks,
        saveStudentMarks,
        assignmentsPosted,
        createAssignment,
        toggleStudentSubmission,
        colleges,
        fetchColleges,
        createCollege,
        updateCollegeStatus,
        updateCollegeDetails,
        updateCollegeLogo,
        verifiedStudentData,
        setVerifiedStudent,
        logout,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCollege() {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error("useCollege must be used within a CollegeProvider");
  }
  return context;
}
