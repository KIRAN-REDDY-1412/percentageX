import { useState } from "react";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Upload,
  X,
} from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import { useCollege } from "../../context/CollegeContext";
import { useToast } from "../../context/ToastContext";

function StudentAssignments() {
  const { assignmentsPosted, toggleStudentSubmission } = useCollege();
  const { showToast } = useToast();
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [uploadFileName, setUploadFileName] = useState("");

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      showToast("Please provide a file name or upload your assignment.", "warning");
      return;
    }
    toggleStudentSubmission(submittingAssignment.id);
    setSubmittingAssignment(null);
    setUploadFileName("");
    showToast("Assignment submitted successfully to faculty portal!", "success");
  };

  return (
    <AppLayout>
      <div className="student-page page-container-animated">
        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <p className="breadcrumb">Student / Assignments</p>
            <h1>Coursework & Assignments</h1>
            <p className="page-description">
              Submit assignments, check evaluation deadlines, and review task descriptions.
            </p>
          </div>
        </div>

        {/* ASSIGNMENTS LIST */}
        <div className="assignments-cards-list">
          {assignmentsPosted.map((asn) => {
            const isSubmitted = asn.studentStatus === "Submitted";
            return (
              <div
                className={`student-asn-card ${isSubmitted ? "submitted-border" : ""}`}
                key={asn.id}
              >
                <div className="asn-card-top-row">
                  <div>
                    <span className="asn-subject-tag">{asn.subject}</span>
                    <h2>{asn.title}</h2>
                    <p className="asn-faculty-meta">
                      Faculty: {asn.facultyName || "Prof. Rajesh Kumar"} • Maximum Marks:{" "}
                      {asn.totalMarks}
                    </p>
                  </div>

                  <span
                    className={`asn-status-badge ${
                      isSubmitted ? "badge-submitted" : "badge-pending"
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle size={14} />
                        <span>Submitted</span>
                      </>
                    ) : (
                      <>
                        <Clock size={14} />
                        <span>Pending Submission</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="asn-description-box">
                  <p>{asn.description}</p>
                </div>

                <div className="asn-card-bottom-row">
                  <div className="asn-due-date">
                    <CalendarDays size={16} />
                    <span>Due Date: <strong>{asn.dueDate}</strong></span>
                  </div>

                  <div className="asn-actions-cell">
                    {isSubmitted ? (
                      <button
                        type="button"
                        className="outline-button small"
                        onClick={() => toggleStudentSubmission(asn.id)}
                      >
                        Unsubmit / Resubmit
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="primary-button small"
                        onClick={() => setSubmittingAssignment(asn)}
                      >
                        <Upload size={14} />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMISSION MODAL */}
        {submittingAssignment && (
          <div
            className="slot-modal-backdrop"
            onClick={() => setSubmittingAssignment(null)}
          >
            <div className="slot-modal" onClick={(e) => e.stopPropagation()}>
              <div className="slot-modal-header">
                <div>
                  <h3>Submit Assignment</h3>
                  <p>{submittingAssignment.title} ({submittingAssignment.subject})</p>
                </div>
                <button
                  className="slot-modal-close"
                  onClick={() => setSubmittingAssignment(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitFile} className="modal-form-body">
                <div className="form-group">
                  <label>Document / Solution Title or Link *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul_2301_SQL_Queries_Solution.pdf"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                  />
                </div>

                <div className="file-upload-dropzone">
                  <Upload size={28} className="upload-icon" />
                  <p>Click or drag assignment PDF / ZIP document here</p>
                  <small>Maximum size: 25 MB</small>
                </div>

                <div className="form-actions-modal">
                  <button
                    type="button"
                    className="outline-button"
                    onClick={() => setSubmittingAssignment(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    <CheckCircle size={16} />
                    <span>Confirm & Turn In</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default StudentAssignments;
