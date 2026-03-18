export default function Section({ title, children, accent = "#4ade80" }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2
        style={{
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          color: accent,
          borderBottom: `2px solid ${accent}33`,
          paddingBottom: "8px",
          marginBottom: "16px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
