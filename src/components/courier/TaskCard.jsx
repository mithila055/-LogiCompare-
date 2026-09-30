import Button from '../common/Button';

export default function TaskCard({ task, onAccept }) { return <article className="task-card"><div><span className="eyebrow">{task.trackingId}</span><h3>{task.route}</h3><p>{task.parcelType} · {task.weight} kg · {task.window}</p></div><Button onClick={() => onAccept(task)}>Accept pickup ↗</Button></article>; }
