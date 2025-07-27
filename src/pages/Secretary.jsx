import { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { createClient } from '@supabase/supabase-js';
import { Toaster, toast } from 'react-hot-toast';

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SecretaryPage() {
  const pdfRef = useRef();
  const [showForm, setShowForm] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [editingFinalized, setEditingFinalized] = useState(false);

  const [form, setForm] = useState(initialForm());
  const [meetings, setMeetings] = useState([]);

  function initialForm() {
    return {
      id: null,
      meeting_date: '',
      start_time: '',
      end_time: '',
      secretary_name: '',
      purpose: '',
      absent_members: '',
      excused_members: '',
      present_members: '',
      tradition_read: false,
      minutes_read: false,
      treasurer_report: false,
      comptroller_report: false,
      coordinator_report: false,
      hsr_report: false,
      receipts_reviewed: false,
      audit_reviewed: false,
      adjourn_motion: false,
      unfinished_business: '',
      new_business: '',
      checking_begin: '',
      checking_end: '',
      savings_begin: '',
      savings_end: '',
      total_received: '',
      total_spent: '',
      next_audit_date: '',
      finalized: false
    };
  }

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const { data, error } = await supabase
      .from('meeting_minutes')
      .select('*')
      .order('meeting_date', { ascending: false });
    if (error) {
      toast.error('Error loading meetings');
      console.error(error);
    } else {
      setMeetings(data);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (readOnly) return;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewMeeting = () => {
    setForm(initialForm());
    setReadOnly(false);
    setShowForm(true);
  };

  const handleViewMeeting = (record) => {
    setForm(record);
    setReadOnly(true);
    setShowForm(true);
  };

  const handleFinalize = async (id) => {
    const { error } = await supabase
      .from('meeting_minutes')
      .update({ finalized: true })
      .eq('id', id);

    if (error) {
      toast.error('Error finalizing meeting');
    } else {
      toast.success('Meeting finalized');
      fetchMeetings();
    }
  };

  const saveToSupabase = async () => {
    if (readOnly || form.finalized) return;

    const payload = { ...form };
    delete payload.id;

    const { data, error } = await supabase
      .from('meeting_minutes')
      .insert([payload])
      .select();

    if (error) {
      console.error(error);
      toast.error('Error saving meeting');
    } else {
      toast.success('Meeting saved');
      setMeetings((prev) => [data[0], ...prev]);
      setShowForm(false);
    }
  };

  const exportPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <h1>Oxford House Meeting Minutes</h1>
      <p><strong>Date:</strong> ${form.meeting_date}</p>
      <p><strong>Secretary:</strong> ${form.secretary_name}</p>
      <p><strong>Time:</strong> ${form.start_time} – ${form.end_time}</p>
      <p><strong>Purpose:</strong> ${form.purpose}</p>
      <p><strong>Unfinished Business:</strong> ${form.unfinished_business}</p>
      <p><strong>New Business:</strong> ${form.new_business}</p>
    `;
    html2pdf().from(element).save(`Meeting_Minutes_${form.meeting_date || 'Draft'}.pdf`);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Secretary Dashboard</h1>
        <button
          onClick={handleNewMeeting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start New Meeting
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow space-y-6 mb-8">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">Weekly Meeting Minutes</h2>
            {!readOnly && (
              <button
                onClick={saveToSupabase}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Meeting
              </button>
            )}
            <button
              onClick={exportPDF}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Download PDF
            </button>
          </div>

          {/* Meeting Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              Meeting Date
              <input type="date" name="meeting_date" value={form.meeting_date} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
            <label>
              Start Time
              <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
            <label>
              End Time
              <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
            <label>
              Secretary Name
              <input type="text" name="secretary_name" value={form.secretary_name} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
            <label>
              Purpose
              <input type="text" name="purpose" value={form.purpose} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label>
              Unfinished Business
              <textarea name="unfinished_business" value={form.unfinished_business} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
            <label>
              New Business
              <textarea name="new_business" value={form.new_business} onChange={handleChange} className="w-full border p-2 rounded" disabled={readOnly} />
            </label>
          </div>
        </div>
      )}

      {/* Meeting History Table */}
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
                <td className="px-4 py-2">{m.finalized ? '✅ Yes' : '❌ No'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleViewMeeting(m)}
                    className="bg-slate-500 text-white px-3 py-1 rounded text-sm hover:bg-slate-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => exportPDF(m)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    PDF
                  </button>
                  {!m.finalized && (
                    <button
                      onClick={() => handleFinalize(m.id)}
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
    </div>
  );
}
