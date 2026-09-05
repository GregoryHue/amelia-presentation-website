import './Stats.css';

const STATS = [
  { value: '10K+', label: 'Placeholder users' },
  { value: '99.9%', label: 'Placeholder uptime' },
  { value: '4.9/5', label: 'Placeholder rating' },
  { value: '2.4x', label: 'Placeholder efficiency gain' },
];

function Stats() {
  return (
    <section id="results" className="stats">
      <div className="container stats__grid">
        {STATS.map((stat) => (
          <div className="stat" key={stat.label}>
            <span className="stat__value">{stat.value}</span>
            <span className="stat__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
