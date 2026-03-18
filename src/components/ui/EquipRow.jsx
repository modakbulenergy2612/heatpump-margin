import { exVatMan, formatW, formatWon } from "../../lib/format";
import { labelStyle, selectStyle } from "./styles";

export default function EquipRow({ label, options, optIdx, onOptChange, qty, onQtyChange }) {
  const unitExVat = exVatMan(options[optIdx].price);
  const totalExVat = unitExVat * qty;
  const isActive = optIdx > 0;

  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <select
          value={optIdx}
          onChange={(e) => onOptChange(Number(e.target.value))}
          style={{ ...selectStyle, flex: 1 }}
        >
          {options.map((opt, i) => {
            const ex = Math.round(opt.price / 1.1);
            return (
              <option key={i} value={i}>
                {opt.label}
                {opt.price > 0 ? ` → ${formatWon(ex)}` : ""}
              </option>
            );
          })}
        </select>
        {isActive && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <span style={{ fontSize: "12px", color: "#666" }}>×</span>
            <input
              type="number"
              value={qty}
              min={1}
              step={1}
              onChange={(e) => onQtyChange(Math.max(1, Number(e.target.value)))}
              style={{
                width: "3.2rem",
                padding: "6px 6px",
                border: "1px solid #3a3a3a",
                borderRadius: "4px",
                background: "#1a1a1a",
                color: "#e8e8e8",
                fontSize: "13px",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
              }}
            />
            <span style={{ fontSize: "12px", color: "#888" }}>개</span>
          </span>
        )}
      </div>
      {isActive && (
        <div style={{ marginTop: "4px", fontSize: "11px", color: "#555" }}>
          단가 {formatW(unitExVat)} (VAT별도)
          {qty > 1 && (
            <span>
              {" "}× {qty}개 ={" "}
              <span style={{ color: "#94a3b8" }}>{formatW(totalExVat)}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
