import './AuroraBackground.css';

function AuroraBackground({ inline = false, as = 'div' }) {
  const Tag = as;

  return (
    <Tag className={`aurora-background ${inline ? 'aurora-background--inline' : ''}`} aria-hidden="true">
      <span className="aurora-background__mask">
        <span className="aurora-background__glow" />
      </span>
    </Tag>
  );
}

export default AuroraBackground;
