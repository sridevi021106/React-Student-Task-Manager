import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Circle, Plus, Trash2, ListTodo, Sparkles } from 'lucide-react';

const starterTasks = [
  { id: 1, title: 'Revise React components', subject: 'Web Development', done: false },
  { id: 2, title: 'Complete DBMS notes', subject: 'College', done: true },
  { id: 3, title: 'Practice JavaScript arrays', subject: 'Coding', done: false },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('studyflow-tasks');
    return saved ? JSON.parse(saved) : starterTasks;
  });
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('College');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('studyflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter(task => task.done).length;
  const remaining = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  const visibleTasks = useMemo(() => {
    if (filter === 'Pending') return tasks.filter(task => !task.done);
    if (filter === 'Completed') return tasks.filter(task => task.done);
    return tasks;
  }, [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    setTasks(current => [
      { id: Date.now(), title: title.trim(), subject, done: false },
      ...current,
    ]);
    setTitle('');
  }

  function toggleTask(id) {
    setTasks(current => current.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  }

  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon"><BookOpen size={20} /></span> StudyFlow</a>
        <span className="tagline">Plan a little. Achieve a lot.</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL STUDY SPACE</p>
          <h1>Make today <span>count.</span></h1>
          <p className="subtitle">Keep your college work and coding goals in one simple place.</p>
        </div>
        <div className="hero-mark"><BookOpen size={42} /></div>
      </section>

      <section className="stats">
        <article className="stat-card"><span className="stat-icon purple"><ListTodo size={19} /></span><div><strong>{tasks.length}</strong><small>Total tasks</small></div></article>
        <article className="stat-card"><span className="stat-icon orange"><Circle size={19} /></span><div><strong>{remaining}</strong><small>To do</small></div></article>
        <article className="stat-card"><span className="stat-icon green"><CheckCircle2 size={19} /></span><div><strong>{completed}</strong><small>Completed</small></div></article>
      </section>

      <section className="content-grid">
        <div className="panel add-panel">
          <div className="panel-heading"><div><p className="eyebrow">GET IT OUT OF YOUR HEAD</p><h2>Add a task</h2></div><span className="heading-icon"><Plus size={20} /></span></div>
          <form onSubmit={addTask}>
            <label htmlFor="task">Task name</label>
            <input id="task" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Learn React props..." />
            <label htmlFor="subject">Category</label>
            <select id="subject" value={subject} onChange={e => setSubject(e.target.value)}>
              <option>College</option><option>Coding</option><option>Web Development</option><option>Personal</option>
            </select>
            <button className="add-button" type="submit"><Plus size={18} /> Add task</button>
          </form>
          <div className="tip"><Sparkles size={16} /><span>Tip: Break big goals into small tasks you can finish today.</span></div>
        </div>

        <div className="panel task-panel">
          <div className="task-header">
            <div><p className="eyebrow">YOUR DAILY PLAN</p><h2>My tasks</h2></div>
            <select className="filter" aria-label="Filter tasks" value={filter} onChange={e => setFilter(e.target.value)}>
              <option>All</option><option>Pending</option><option>Completed</option>
            </select>
          </div>
          <div className="progress-area"><div className="progress-label"><span>Daily progress</span><strong>{progress}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div></div>
          <div className="task-list">
            {visibleTasks.length === 0 ? <div className="empty"><BookOpen size={28} /><strong>Nothing here yet</strong><span>Add a task to get started.</span></div> :
              visibleTasks.map(task => (
                <article className={`task ${task.done ? 'is-done' : ''}`} key={task.id}>
                  <button className="check-button" onClick={() => toggleTask(task.id)} aria-label={task.done ? 'Mark as pending' : 'Mark as completed'}>
                    {task.done ? <CheckCircle2 size={21} /> : <Circle size={21} />}
                  </button>
                  <div className="task-info"><strong>{task.title}</strong><span>{task.subject}</span></div>
                  <button className="delete-button" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={17} /></button>
                </article>
              ))}
          </div>
          <p className="task-foot">{completed} of {tasks.length} tasks completed</p>
        </div>
      </section>
      <footer>Made with <span>♥</span> for your next big goal.</footer>
    </main>
  );
}
