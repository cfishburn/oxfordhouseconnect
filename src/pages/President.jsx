import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  PlusCircle,
  CheckCircle2,
  Pencil,
  Trash,
  Filter,
  ClipboardList,
  FileText,
  Download,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Replace with real house ID when auth is added
const houseId = null;

// PDF static path (must be in public/docs/)
const agendaPdf = '/docs/Meeting%20Agenda%20copy.pdf';

export default function President() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', due_date: '' });
  const [filter, setFilter] = useState('open'); // open | done | all

  const fetchTasks = useCallback(async () => {
    let query = supabase.from('PresidentTasks').select('*').order('due_date', { ascending: true });
    if (houseId) query = query.eq('house_id', houseId);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setTasks(data || []);
  }, []);

  useEffect(() => {
    fetchTasks();
    const channel = supabase
      .channel('president_tasks')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'PresidentTasks',
          ...(houseId && { filter: `house_id=eq.${houseId}` }),
        },
        fetchTasks
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title || !formData.due_date) {
      return toast.error('Title and due date are required');
    }

    if (editingId) {
      const { error } = await supabase
        .from('PresidentTasks')
        .update({ ...formData })
        .eq('id', editingId);
      if (error) toast.error(error.message);
      else toast.success('Task updated');
    } else {
      const payload = { ...formData, status: 'open' };
      if (houseId) payload.house_id = houseId;
      const { error } = await supabase.from('PresidentTasks').insert([payload]);
      if (error) toast.error(error.message);
      else toast.success('Task added');
    }

    setEditingId(null);
    setFormData({ title: '', description: '', due_date: '' });
    setShowForm(false);
  }

  function editTask(task) {
    setEditingId(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      due_date: task.due_date,
    });
    setShowForm(true);
  }

  async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const { error } = await supabase.from('PresidentTasks').delete().eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Task deleted');
  }

  async function toggleStatus(task) {
    const current = task.status ?? 'open';
    const newStatus = current === 'done' ? 'open' : 'done';

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );

    const { error } = await supabase
      .from('PresidentTasks')
      .update({ status: newStatus })
      .eq('id', task.id);

    if (error) {
      toast.error(error.message);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: current } : t))
      );
    } else {
      toast.success(newStatus === 'done' ? 'Marked complete' : 'Marked open');
    }
  }

  const filtered = tasks.filter((t) =>
    filter === 'all' ? true : (t.status ?? 'open') === filter
  );

  return (
    <>
      <Header />
      <section className="p-6 space-y-6 max-w-5xl mx-auto">
        <Toaster position="top-right" />

        {/* Header & Controls */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            President Dashboard
          </h1>
          <div className="flex gap-2 flex-wrap">
            <a
              href={agendaPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-100"
            >
              <FileText className="h-4 w-4" />
              View Agenda
            </a>
            <a
              href={agendaPdf}
              download
              className="flex items-center gap-1 px-3 py-2 border rounded-md hover:bg-gray-100"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </a>
            <button
              onClick={() =>
                setFilter(
                  filter === 'open' ? 'all' : filter === 'all' ? 'done' : 'open'
                )
              }
              className="flex items-center gap-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-100"
            >
              <Filter className="h-4 w-4" />
              {filter.toUpperCase()}
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <PlusCircle className="h-4 w-4" />
              {showForm ? 'Close' : 'New Task'}
            </button>
          </div>
        </header>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-lg p-4 grid md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Task Title *"
              className="border rounded-md p-2"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              type="date"
              className="border rounded-md p-2"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
            />
            <textarea
              placeholder="Description (optional)"
              className="md:col-span-3 border rounded-md p-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        {filtered.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((task) => (
              <li
                key={task.id}
                className={`bg-white border rounded-lg p-4 flex items-start justify-between gap-4 ${
                  (task.status ?? 'open') === 'done'
                    ? 'opacity-60 line-through'
                    : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600">
                      {task.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => toggleStatus(task)}
                    title={
                      (task.status ?? 'open') === 'done'
                        ? 'Mark open'
                        : 'Mark done'
                    }
                    className="hover:text-green-600"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => editTask(task)}
                    title="Edit"
                    className="hover:text-blue-600"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    title="Delete"
                    className="hover:text-red-600"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
