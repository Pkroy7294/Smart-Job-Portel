function SectionCard({ title, subtitle, actions, children }) {
  return (
    <section className="card section-card">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p className="muted-text">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
