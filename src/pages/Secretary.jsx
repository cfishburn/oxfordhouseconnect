import { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SecretaryPage() {
  const pdfRef = useRef();

  const [form, setForm] = useState({
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
    next_audit_date: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const saveToSupabase = async () => {
    const { data, error } = await supabase.from('meeting_minutes').insert([form]);
    if (error) {
      console.error('Supabase insert error:', error);
      alert(`Error saving to database: ${error.message}`);
    } else {
      alert('Meeting successfully saved to Supabase.');
    }
  };

  const exportPDF = () => {
    html2pdf().from(pdfRef.current).save(`Meeting_Minutes_${form.meeting_date || 'Draft'}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Secretary - Weekly Meeting Minutes</h1>
        <div className="space-x-2">
          <button onClick={saveToSupabase} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save
          </button>
          <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Export PDF
          </button>
        </div>
      </div>

      <form ref={pdfRef} className="bg-white p-6 rounded shadow space-y-6">
        {/* Date, Time, Secretary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Date of Meeting
            <input type="date" name="meeting_date" value={form.meeting_date} onChange={handleChange} className="w-full border p-2 rounded" required />
          </label>
          <label>
            Start Time
            <input type="time" name="start_time" value={form.start_time} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            End Time
            <input type="time" name="end_time" value={form.end_time} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Secretary Name
            <input type="text" name="secretary_name" value={form.secretary_name} onChange={handleChange} className="w-full border p-2 rounded" required />
          </label>
        </div>

        {/* Roll Call */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Absent Members
            <textarea name="absent_members" value={form.absent_members} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Excused Members
            <textarea name="excused_members" value={form.excused_members} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Present Members
            <textarea name="present_members" value={form.present_members} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            ['tradition_read', 'Tradition Read'],
            ['minutes_read', 'Minutes Read'],
            ['treasurer_report', 'Treasurer Report'],
            ['comptroller_report', 'Comptroller Report'],
            ['coordinator_report', 'Coordinator Report'],
            ['hsr_report', 'HSR Report'],
            ['receipts_reviewed', 'Receipts Reviewed'],
            ['audit_reviewed', 'Audit Reviewed'],
            ['adjourn_motion', 'Adjournment Motion Made']
          ].map(([name, label]) => (
            <label key={name} className="flex items-center space-x-2">
              <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
              <span>{label}</span>
            </label>
          ))}
        </div>

        {/* Business Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Unfinished Business
            <textarea name="unfinished_business" value={form.unfinished_business} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            New Business
            <textarea name="new_business" value={form.new_business} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>

        {/* Financial Section */}
        <h2 className="text-lg font-semibold pt-4">Finance Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Checking Beginning Balance ($)
            <input type="number" name="checking_begin" value={form.checking_begin} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Checking Ending Balance ($)
            <input type="number" name="checking_end" value={form.checking_end} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Savings Beginning Balance ($)
            <input type="number" name="savings_begin" value={form.savings_begin} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Savings Ending Balance ($)
            <input type="number" name="savings_end" value={form.savings_end} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Total Received ($)
            <input type="number" name="total_received" value={form.total_received} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Total Spent ($)
            <input type="number" name="total_spent" value={form.total_spent} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Next Audit Date
            <input type="date" name="next_audit_date" value={form.next_audit_date} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>
      </form>
    </div>
  );
}
