import { formatW } from "../../lib/format";

export default function KwRow({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
      <span style={{ color: "#888", fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: bold ? 700 : 500,
          color: bold ? "#e0e0e0" : "#aaa",
        }}
      >
        {formatW(value)}/kW
      </span>
    </div>
  );
}
