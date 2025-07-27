import { useEffect, useState, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import supabase from '../supabase.js';
import Header from '../components/Header.jsx';

const BLANK_MEMBER = {
  name: '',
  email: '',
  phone: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  move_in_date: '',
  leave_date: '',
  clean_date: '',
  role: '',
  status: '',
  form_of_pay: '',
  dues_paid: false,
  position_notes: '',
  notes: '',
};

export default function MembersPage() {
  const session = useSession();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ ...BLANK_MEMBER });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getMembers = useCallback(async () => {
    const { data, error } = await supabase.from('Members').select('*');
    if (!error) setMembers(data);
  }, []);

  useEffect(() => {
    if (session) {
      getMembers();
    }
  }, [session, getMembers]);

  function onInput(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  function validate() {
    const errs = {};
    if (!form.name) errs.name = 'Full Name is required';
    if (!form.phone) errs.phone = 'Phone Number is required';
    if (!form.role) errs.role = 'House Position is required';
    if (!form.status) errs.status = 'Status is required';
    if (!form.form_of_pay) errs.form_of_pay = 'Form of Pay is required';
    if (!form.clean_date) errs.clean_date = 'Clean Date is required';
    if (!form.move_in_date) errs.move_in_date = 'Move-in Date is required';
    if (!form.dues_paid) errs.dues_paid = 'Dues Paid confirmation is required';
    return errs;
  }

  async function save() {
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    const payload = {
      ...form,
      move_in_date: form.move_in_date || null,
      leave_date: form.leave_date || null,
      clean_date: form.clean_date || null,
    };

    const { error } = editingId
      ? await supabase.from('Members').update(payload).eq('id', editingId)
      : await supabase.from('Members').insert(payload);

    if (error) return alert('Save failed: ' + error.message);

    reset();
    getMembers();
  }

  async function remove(id) {
    if (!confirm('Delete this member?')) return;
    await supabase.from('Members').delete().eq('id', id);
    getMembers();
  }

  function edit(m) {
    setForm(m);
    setEditingId(m.id);
    setShowModal(true);
  }

  function reset() {
    setForm({ ...BLANK_MEMBER });
    setEditingId(null);
    setShowModal(false);
    setErrors({});
  }

  return (
    <>
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-1">Member Management</h2>
        <p className="text-sm text-gray-600 mb-4">Add, update, or remove members</p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
        >
          + Add Member
        </button>

        <section className="space-y-4">
          {members.map((m) => (
            <article key={m.id} className="border rounded p-4">
              <p className="font-medium">
                {m.name} • <span className="text-blue-600">{m.role}</span>
              </p>
              <p className="text-sm text-gray-600">
                {m.email || '—'} | {m.phone}
              </p>
              {m.move_in_date && (
                <p className="text-xs text-gray-500">Move-in: {m.move_in_date}</p>
              )}
              {m.clean_date && (
                <p className="text-xs text-gray-500">Clean: {m.clean_date}</p>
              )}
              <div className="mt-2 space-x-4">
                <button onClick={() => edit(m)} className="text-blue-600">
                  Edit
                </button>
                <button onClick={() => remove(m.id)} className="text-red-500">
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl overflow-y-auto max-h-[95vh]">
            <h3 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Member' : 'Add Member'}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <LabelInput
                  label="Full Name *"
                  name="name"
                  val={form.name}
                  on={onInput}
                  error={errors.name}
                />
                <LabelInput label="Email" name="email" val={form.email} on={onInput} />
                <LabelInput
                  label="Phone Number *"
                  name="phone"
                  val={form.phone}
                  on={onInput}
                  error={errors.phone}
                />
                <LabelInput
                  label="Emergency contact name"
                  name="emergency_contact_name"
                  val={form.emergency_contact_name}
                  on={onInput}
                />
                <LabelInput
                  label="Emergency contact phone"
                  name="emergency_contact_phone"
                  val={form.emergency_contact_phone}
                  on={onInput}
                />
              </div>

              <div>
                <LabelInput
                  type="date"
                  label="Clean date *"
                  name="clean_date"
                  val={form.clean_date}
                  on={onInput}
                  error={errors.clean_date}
                />
                <LabelInput
                  type="date"
                  label="Move-in date *"
                  name="move_in_date"
                  val={form.move_in_date}
                  on={onInput}
                  error={errors.move_in_date}
                />
                <LabelInput
                  type="date"
                  label="Leave date"
                  name="leave_date"
                  val={form.leave_date}
                  on={onInput}
                />
                <LabelSelect
                  label="House Position *"
                  name="role"
                  val={form.role}
                  on={onInput}
                  opts={[
                    'Member',
                    'President',
                    'Secretary',
                    'Treasurer',
                    'Comptroller',
                    'Coordinator',
                    'Housing Service Representative',
                  ]}
                  error={errors.role}
                />
                <LabelSelect
                  label="Status *"
                  name="status"
                  val={form.status}
                  on={onInput}
                  opts={['Active', 'Inactive', 'Relapsed', 'Expelled']}
                  error={errors.status}
                />
                <LabelSelect
                  label="Form of Pay *"
                  name="form_of_pay"
                  val={form.form_of_pay}
                  on={onInput}
                  opts={['Cash', 'Funding']}
                  error={errors.form_of_pay}
                />
                <div className="mt-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="dues_paid"
                      checked={form.dues_paid}
                      onChange={onInput}
                    />
                    Dues Paid *
                  </label>
                  {errors.dues_paid && (
                    <p className="text-red-500 text-sm">{errors.dues_paid}</p>
                  )}
                </div>
              </div>
            </div>

            <textarea
              name="position_notes"
              value={form.position_notes}
              onChange={onInput}
              placeholder="Position notes"
              className="w-full border rounded px-3 py-2 mt-6"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={onInput}
              placeholder="General notes"
              className="w-full border rounded px-3 py-2 mt-4"
            />

            <div className="mt-6 flex justify-end gap-4">
              <button onClick={reset} className="px-4 py-2 rounded border hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={save}
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LabelInput({ label, name, val, on, error, type = 'text' }) {
  return (
    <div className="mt-4 first:mt-0">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} name={name} value={val} onChange={on} className="w-full border rounded px-3 py-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

function LabelSelect({ label, name, val, on, opts, error }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select name={name} value={val} onChange={on} className="w-full border rounded px-3 py-2">
        <option value="">Select</option>
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
