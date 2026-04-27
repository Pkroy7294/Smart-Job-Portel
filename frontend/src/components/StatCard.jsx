function StatCard({ label, value, helper }) {
  return (
    <article className="card stat-card">
      <p className="eyebrow">{label}</p>
      <h3>{value}</h3>
      <p className="muted-text">{helper}</p>
    </article>
  );
}

export default StatCard;
