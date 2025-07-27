import { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { createClient } from "@supabase/supabase-js";
import { Toaster, toast } from "react-hot-toast";
import Header from "../components/Header";

// 🔗 Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SecretaryPage() {
  const pdfRef = useRef();

  /* ---------------------------- local state ---------------------------- */
  const [showForm, setShowForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [form, setForm] = useState(initForm());
  const [meetings, setMeetings] = useState([]);

  function initForm() {
    return {
      id: null,
      /* BASIC INFO */
      meeting_date: "",
      start_time: "",
      end_time: "",
      house_name: "",
      secretary_name: "",
      purpose: "",
      guests: "",
      additions_corrections: "",

      /* ROLL-CALL */
      absent_members: "",
      excused_members: "",
      present_members: "",

      /* REPORT FLAGS */
      tradition_read: false,
      minutes_read: false,
      treasurer_report: false,
      comptroller_report: false,
      coordinator_report: false,
      hsr_report: false,
      receipts_reviewed: false,
      audit_reviewed: false,

      /* BUSINESS */
      unfinished_business: "",
      new_business: "",
      ees_discussion: "",

      /* FINANCE */
      checking_begin: "",
      total_received: "",
      total_spent: "",
      checking_end: "",
      savings_begin: "",
      savings_end: "",
      financial_notes: "",
      checks_approved: "",
      next_audit_date: "",

      /* VOTES */
      vote_minutes_yay: "",
      vote_minutes_nay: "",
      vote_treasurer_yay: "",
      vote_treasurer_nay: "",
      vote_comptroller_yay: "",
      vote_comptroller_nay: "",
      vote_coordinator_yay: "",
      vote_coordinator_nay: "",
      vote_adjourn_yay: "",
      vote_adjourn_nay: "",

      /* CHECKLIST */
      vacancy_checked: false,
      email_checked: false,
      voicemail_checked: false,
      narcan_available: false,

      finalized: false
    };
  }

  /* ------------------------- fetch history on load ------------------------- */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("meeting_minutes")
        .select("*")
        .order("meeting_date", { ascending: false });
      if (error) toast.error("Error loading meetings");
      else setMeetings(data);
    })();
  }, []);

  /* ----------------------------- form helpers ----------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (readOnly) return;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const startNew = () => {
    setForm(initForm());
    setReadOnly(false);
    setShowForm(true);
  };

  const viewMeeting = (rec) => {
    setForm(rec);
    setReadOnly(true);
    setShowForm(true);
  };

  const finalizeMeeting = async (id) => {
    const { error } = await supabase
      .from("meeting_minutes")
      .update({ finalized: true })
      .eq("id", id);
    if (error) toast.error("Could not finalize");
    else {
      toast.success("Finalized");
      setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, finalized: true } : m)));
    }
  };

  /* ------------------------------- SAVE DB ------------------------------- */
  const saveMeeting = async () => {
    if (readOnly || form.finalized) return;
    const payload = { ...form };
    delete payload.id;
    const { data, error } = await supabase
      .from("meeting_minutes")
      .insert([payload])
      .select();
    if (error) {
      toast.error("Save failed");
      console.error(error);
    } else {
      toast.success("Meeting saved");
      setMeetings((p) => [data[0], ...p]);
      setShowForm(false);
    }
  };

  /* ------------------------------ PDF export ------------------------------ */
  const downloadPDF = (rec = form) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h1>Oxford House – Meeting Minutes</h1>
      <p><strong>Date:</strong> ${rec.meeting_date}</p>
      <p><strong>House:</strong> ${rec.house_name}</p>
      <p><strong>Secretary:</strong> ${rec.secretary_name}</p>
      <p><strong>Time:</strong> ${rec.start_time} – ${rec.end_time}</p>
      <p><strong>Purpose:</strong> ${rec.purpose}</p>
      <p><strong>Unfinished Business:</strong> ${rec.unfinished_business}</p>
      <p><strong>New Business:</strong> ${rec.new_business}</p>
    `;
    html2pdf().from(div).save(`Meeting_Minutes_${rec.meeting_date || Date.now()}.pdf`);
  };

  /* ------------------------------- RENDER ------------------------------- */
  return (
    <>
      <Header />
      <div className="p-6 space-y-8">
        <Toaster position="top-right" />

        {/* dashboard header */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Secretary Dashboard</h1>
          <button
            onClick={showForm ? () => setShowForm(false) : startNew}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? "Close Form" : "Start New Meeting"}
          </button>
        </header>

        {/* FORM */}
        {showForm && (
          <section className="bg-white rounded shadow p-6 space-y-6">
            {/* form actions */}
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-semibold">Weekly Meeting Minutes</h2>
              <div className="space-x-2">
                {!readOnly && (
                  <button onClick={saveMeeting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save
                  </button>
                )}
                <button onClick={() => downloadPDF()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  PDF
                </button>
              </div>
            </div>

            {/* basic info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["meeting_date", "Meeting Date", "date"],
                ["start_time", "Start Time", "time"],
                ["end_time", "End Time", "time"],
                ["house_name", "Oxford House Name", "text"],
                ["secretary_name", "Secretary Name", "text"],
                ["purpose", "Purpose of Meeting", "text"],
                ["guests", "Names of Guests", "text"],
                ["additions_corrections", "Additions / Corrections", "text"],
              ].map(([name, label, type]) => (
                <label key={name} className="text-sm font-medium">
                  {label}
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    disabled={readOnly}
                  />
                </label>
              ))}
            </div>

            {/* attendance */}
            <h3 className="font-semibold">Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["absent_members", "Absent Members"],
                ["excused_members", "Excused Members"],
                ["present_members", "Present Members"],
              ].map(([n, l]) => (
                <label key={n} className="text-sm font-medium">
                  {l}
                  <textarea
                    name={n}
                    value={form[n]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    disabled={readOnly}
                  />
                </label>
              ))}
            </div>

            {/* checkboxes */}
            <h3 className="font-semibold">Reports & Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                ["tradition_read", "Tradition Read"],
                ["minutes_read", "Minutes Read"],
                ["treasurer_report", "Treasurer Report"],
                ["comptroller_report", "Comptroller Report"],
                ["coordinator_report", "Coordinator Report"],
                ["hsr_report", "HSR Report"],
                ["receipts_reviewed", "Receipts Reviewed"],
                ["audit_reviewed", "Audit Reviewed"],
                ["vacancy_checked", "Vacancy Website Checked"],
                ["email_checked", "House Email Checked"],
                ["voicemail_checked", "Voicemail Checked"],
                ["narcan_available", "Narcan Available"],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleChange}
                    disabled={readOnly}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>

            {/* business notes */}
            <h3 className="font-semibold">Business Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["unfinished_business", "Unfinished Business"],
                ["new_business", "New Business"],
                ["ees_discussion", "EES Discussion"],
              ].map(([n, l]) => (
                <label key={n} className="text-sm font-medium">
                  {l}
                  <textarea
                    name={n}
                    value={form[n]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    disabled={readOnly}
                  />
                </label>
              ))}
            </div>

            {/* finance */}
            <h3 className="font-semibold">Finance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["checking_begin", "Checking Begin ($)", "number"],
                ["total_received", "Total Received ($)", "number"],
                ["total_spent", "Total Spent ($)", "number"],
                ["checking_end", "Checking End ($)", "number"],
                ["savings_begin", "Savings Begin ($)", "number"],
                ["savings_end", "Savings End ($)", "number"],
                ["next_audit_date", "Next Audit Date", "date"],
              ].map(([n, l, t]) => (
                <label key={n} className="text-sm font-medium">
                  {l}
                  <input
                    type={t}
                    name={n}
                    value={form[n]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    disabled={readOnly}
                  />
                </label>
              ))}
              <label className="text-sm font-medium md:col-span-2">
                Financial Notes
                <textarea
                  name="financial_notes"
                  value={form.financial_notes}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  disabled={readOnly}
                />
              </label>
              <label className="text-sm font-medium md:col-span-2">
                Checks Approved at Meeting
                <textarea
                  name="checks_approved"
                  value={form.checks_approved}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  disabled={readOnly}
                />
              </label>
            </div>

            {/* vote counts */}
            <h3 className="font-semibold">Vote Counts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["vote_minutes", "Accept Minutes"],
                ["vote_treasurer", "Treasurer Report"],
                ["vote_comptroller", "Comptroller Report"],
                ["vote_coordinator", "Coordinator Report"],
                ["vote_adjourn", "Adjourn Meeting"],
              ].map(([prefix, label]) => (
                <label key={prefix} className="text-sm font-medium">
                  {label} (Yay / Nay)
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name={`${prefix}_yay`}
                      value={form[`${prefix}_yay`]}
                      onChange={handleChange}
                      placeholder="Yay"
                      className="w-full border p-2 rounded"
                      disabled={readOnly}
                    />
                    <input
                      type="number"
                      name={`${prefix}_nay`}
                      value={form[`${prefix}_nay`]}
                      onChange={handleChange}
                      placeholder="Nay"
                      className="w-full border p-2 rounded"
                      disabled={readOnly}
                    />
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* HISTORY */}
        <section>
          <h2 className="text-xl font-bold mb-2">Previous Meetings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white border rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Secretary</th>
                  <th className="px-4 py-2 text-left">Finalized</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-2">{m.meeting_date}</td>
                    <td className="px-4 py-2">{m.secretary_name}</td>
                    <td className="px-4 py-2">{m.finalized ? "✅" : "❌"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => viewMeeting(m)}
                        className="bg-slate-500 text-white px-3 py-1 rounded text-sm hover:bg-slate-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => downloadPDF(m)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        PDF
                      </button>
                      {!m.finalized && (
                        <button
                          onClick={() => finalizeMeeting(m.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Finalize
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}