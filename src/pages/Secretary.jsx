import { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function SecretaryPage() {
  const pdfRef = useRef();

  const [form, setForm] = useState({
    meetingDate: '',
    startTime: '',
    endTime: '',
    secretaryName: '',
    purpose: '',
    absentMembers: '',
    excusedMembers: '',
    presentMembers: '',
    traditionRead: false,
    minutesRead: false,
    treasurerReport: false,
    comptrollerReport: false,
    coordinatorReport: false,
    hsrReport: false,
    unfinishedBusiness: '',
    newBusiness: '',
    checkingBegin: '',
    checkingEnd: '',
    savingsBegin: '',
    savingsEnd: '',
    totalReceived: '',
    totalSpent: '',
    auditReviewed: false,
    nextAuditDate: '',
    receiptsReviewed: false,
    adjournMotion: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const saveToSupabase = async () => {
    const { error } = await supabase.from('meeting_minutes').insert([form]);
    if (error) {
      alert('Error saving to database');
    } else {
      alert('Meeting saved!');
    }
  };

  const exportPDF = () => {
    html2pdf().from(pdfRef.current).save(`Meeting_Minutes_${form.meetingDate || 'Draft'}.pdf`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
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

      <form ref={pdfRef} className="space-y-6 bg-white p-6 rounded shadow-md">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Date of Meeting
            <input type="date" name="meetingDate" value={form.meetingDate} onChange={handleChange} className="w-full border p-2 rounded" required />
          </label>
          <label>
            Start Time
            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            End Time
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Secretary Name
            <input type="text" name="secretaryName" value={form.secretaryName} onChange={handleChange} className="w-full border p-2 rounded" required />
          </label>
        </div>

        {/* Roll Call and Attendance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Absent Members
            <textarea name="absentMembers" value={form.absentMembers} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Excused Members
            <textarea name="excusedMembers" value={form.excusedMembers} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Present Members
            <textarea name="presentMembers" value={form.presentMembers} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>

        {/* Reports and Sections */}
        <div className="space-y-2">
          {[
            ['traditionRead', 'Tradition Read'],
            ['minutesRead', 'Minutes Read'],
            ['treasurerReport', 'Treasurer Report'],
            ['comptrollerReport', 'Comptroller Report'],
            ['coordinatorReport', 'Coordinator Report'],
            ['hsrReport', 'HSR Report'],
            ['receiptsReviewed', 'Receipts Reviewed'],
            ['auditReviewed', 'Audit Reviewed'],
            ['adjournMotion', 'Adjournment Motion Made'],
          ].map(([name, label]) => (
            <label key={name} className="flex items-center gap-2">
              <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
              {label}
            </label>
          ))}
        </div>

        {/* Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Unfinished Business
            <textarea name="unfinishedBusiness" value={form.unfinishedBusiness} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            New Business
            <textarea name="newBusiness" value={form.newBusiness} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>

        {/* Finance */}
        <h2 className="text-lg font-semibold mt-6">Finance Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label>
            Checking Beginning Balance ($)
            <input type="number" name="checkingBegin" value={form.checkingBegin} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Checking Ending Balance ($)
            <input type="number" name="checkingEnd" value={form.checkingEnd} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Savings Beginning Balance ($)
            <input type="number" name="savingsBegin" value={form.savingsBegin} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Savings Ending Balance ($)
            <input type="number" name="savingsEnd" value={form.savingsEnd} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Total Received ($)
            <input type="number" name="totalReceived" value={form.totalReceived} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Total Spent ($)
            <input type="number" name="totalSpent" value={form.totalSpent} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
          <label>
            Next Audit Date
            <input type="date" name="nextAuditDate" value={form.nextAuditDate} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>
      </form>
    </div>
  );
}
