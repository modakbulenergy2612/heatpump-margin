import { formatW } from "../../lib/format";
import { tdStyle } from "./styles";

export default function ComparisonTable({ rows, targetMarginRate, accentColor = "#60a5fa" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #333" }}>
            {["", "사업비", "제품비", "마진", "마진율", "순수익", "만원/kW"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 6px",
                  textAlign: "right",
                  color: "#888",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const rowColor =
              r.marginRate >= targetMarginRate
                ? "#4ade80"
                : r.marginRate >= 5
                ? "#fbbf24"
                : "#f87171";
            return (
              <tr
                key={r.key}
                style={{
                  borderBottom: "1px solid #222",
                  background: r.isCurrent ? `${accentColor}10` : "transparent",
                }}
              >
                <td
                  style={{
                    ...tdStyle,
                    color: r.isCurrent ? accentColor : "#ccc",
                    fontWeight: r.isCurrent ? 700 : 400,
                    textAlign: "left",
                  }}
                >
                  {r.key}
                  {r.isCurrent ? " ◀" : ""}
                </td>
                <td style={tdStyle}>{formatW(r.totalBiz)}</td>
                <td style={tdStyle}>{formatW(r.productCost)}</td>
                <td style={{ ...tdStyle, color: rowColor, fontWeight: 700 }}>{formatW(r.margin)}</td>
                <td style={{ ...tdStyle, color: rowColor }}>{r.marginRate.toFixed(1)}%</td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{formatW(r.netIncome)}</td>
                <td style={{ ...tdStyle, color: "#94a3b8" }}>{formatW(r.costPerKw)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
