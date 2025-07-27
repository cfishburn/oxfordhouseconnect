import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle,
  Pencil,
  Trash,
  Download,
  ClipboardList,
  Calendar,
  DollarSign,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';

// ───────────── Supabase client ─────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
const houseId = null; // TODO auth

// ───────────── Constants ─────────────
const BLANK = {
  week_start: '',
  week_end: '',
  beginning_balance: '',
  total_received: '',
  total_spent: '',
  ending_balance: '',
  savings_beginning: '',
  savings_deposit: '',
  savings_withdrawal: '',
  savings_interest: '',
  savings_ending: '',
  notes: '',
};

const account = [
  ['beginning_balance', 'Beginning Balance'],
  ['total_received', 'Total Received'],
  ['total_spent', 'Total Spent'],
  ['ending_balance', 'Ending Balance'],
];
const savings = [
  ['savings_beginning', 'Beg. Balance'],
  ['savings_deposit', 'Deposits'],
  ['savings_withdrawal', 'Withdrawals'],
  ['savings_interest', 'Interest'],
  ['savings_ending', 'End Balance'],
];

// ───────────── Component ─────────────
export default function Treasurer() {
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [data, setData] = useState(BLANK);

  useEffect(() => {
    fetchRows();
  }, []);

  async function fetchRows() {
    const { data: d, error } = await supabase
      .from('treasurer_reports')
      .select('*')
      .eq('house_id', houseId)
      .order('week_start', { ascending: false });
    error ? toast.error('Load error') : setRows(d || []);
  }

  const change = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    const required = ['week_start', 'week_end', ...account.map(([k]) => k)];
    const miss = required.filter((k) => !data[k]);
    if (miss.length) return toast.error(`Fill: ${miss.join(', ')}`);
    const payload = { ...data, house_id: houseId };

    const { error } = editId
      ? await supabase.from('treasurer_reports').update(payload).eq('id', editId)
      : await supabase.from('treasurer_reports').insert(payload);
    if (error) return toast.error('Save error');
    toast.success('Saved');
    reset();
    fetchRows();
  }

  function reset() {
    setData(BLANK);
    setEditId(null);
    setShowForm(false);
  }

  async function remove(id) {
    if (!confirm('Delete report?')) return;
    const { error } = await supabase.from('treasurer_reports').delete().eq('id', id);
    error ? toast.error('Delete error') : (toast.success('Deleted'), fetchRows());
  }

  // ───────────── UI helpers ─────────────
  const Input = ({ name, placeholder }) => (
    <div className="flex items-center gap-1">
      <DollarSign className="w-4 h-4 text-gray-400" />
      <input
        name={name}
        value={data[name]}
        onChange={change}
        placeholder={placeholder}
        className="input flex-1"
        type="number"
        step="0.01"
      />
    </div>
  );

  // ───────────── Render ─────────────
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-right" />

      <main className="flex-1 max-w-6xl mx-auto p-6">
        {/* Top */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-semibold text-gray-800">
            <ClipboardList className="w-7 h-7" /> Treasurer
          </h1>
          <button
            onClick={() => setShowForm((p) => !p)}
            className={`${showForm ? 'bg-gray-600' : 'bg-blue-600'} flex items-center gap-2 text-white px-4 py-2 rounded-md shadow`}
          >
            <PlusCircle className="w-5 h-5" /> {showForm ? 'Close' : 'New'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={save} className="bg-white rounded-lg shadow p-6 mb-10 space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['week_start', 'Week Start'],
                ['week_end', 'Week End'],
              ].map(([n, lbl]) => (
                <label key={n} className="block text-sm font-medium text-gray-700">
                  {lbl}
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name={n}
                      value={data[n]}
                      onChange={change}
                      className="input flex-1"
                      required
                    />
                  </div>
                </label>
              ))}
            </div>

            {/* Operating account */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {account.map(([k, lbl]) => (
                <label key={k} className="block text-sm font-medium text-gray-700">
                  {lbl}
                  <Input name={k} placeholder={lbl} />
                </label>
              ))}
            </div>

            {/* Savings */}
            <details className="col-span-full" open>
              <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2 select-none">
                Savings (optional)
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savings.map(([k, ph]) => (
                  <Input key={k} name={k} placeholder={ph} />
                ))}
              </div>
            </details>

            {/* Notes */}
            <textarea
              name="notes"
              value={data.notes}
              onChange={change}
              placeholder="Notes"
              rows={3}
              className="input w-full"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md shadow">
                {editId ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={reset} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full whitespace-nowrap text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Week</th>
                <th className="px-4 py-2 text-left">Ending Balance</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No reports yet.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={r.id} className={i % 2 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-2">
                      {new Date(r.week_start).toLocaleDateString()} –{' '}
                      {new Date(r.week_end).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 font-medium">
                      ${parseFloat(r.ending_balance || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setData(r);
                            setEditId(r.id);
                            setShowForm(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast('PDF export coming soon')}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* Tailwind helper */
/* .input{ @apply w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 } */
