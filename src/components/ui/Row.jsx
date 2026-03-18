import { formatW } from "../../lib/format";

export default function Row({ label, value, highlight, bold, sub }) {
  const isNeg = value < 0;
  const displayColor = highlight || (isNeg ? "#f87171" : "#e0e0e0");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "4px 0",
        flexWrap: "wrap",
        gap: "4px",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <span style={{ fontSize: "13px", color: highlight || "#aaa", fontWeight: bold ? 700 : 400 }}>
          {label}
        </span>
        {sub && (
          <span style={{ fontSize: "11px", color: "#555", marginLeft: "8px" }}>{sub}</span>
        )}
      </div>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "14px",
          fontWeight: bold ? 800 : 600,
          color: displayColor,
          whiteSpace: "nowrap",
        }}
      >
        {formatW(value)}
      </span>
    </div>
  );
}
