export default function NumberInput({ value, onChange, suffix = "만원", min, step = 10, width = "5.5rem" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        step={step}
        style={{
          width,
          padding: "6px 8px",
          border: "1px solid #3a3a3a",
          borderRadius: "4px",
          background: "#1a1a1a",
          color: "#e8e8e8",
          fontSize: "13px",
          fontFamily: "'JetBrains Mono', monospace",
          textAlign: "right",
        }}
      />
      <span style={{ fontSize: "12px", color: "#888", whiteSpace: "nowrap" }}>{suffix}</span>
    </span>
  );
}
