import { CAPACITIES, MOTHER_FEE_RATE, SUBSIDY_RATE } from "../lib/constants";
import Section from "./ui/Section";
import NumberInput from "./ui/NumberInput";

export default function SettingsPanel({
  bizCost, products, warrantyRate, warrantyFeeRate, warrantyYears,
  onBizCostChange, onProductChange, onWarrantyRateChange, onWarrantyFeeRateChange, onWarrantyYearsChange,
}) {
  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #2a2a2a",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "24px",
      }}
    >
      <Section title="용량별 사업비" accent="#60a5fa">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {CAPACITIES.map((cap) => (
            <div key={cap} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>{cap}</div>
              <NumberInput value={bizCost[cap]} onChange={(v) => onBizCostChange(cap, v)} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="제품별 단가" accent="#c084fc">
        {Object.keys(products).map((b) => (
          <div key={b} style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#c084fc",
                marginBottom: "8px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {b}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
              {CAPACITIES.map((cap) => (
                <div key={cap} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>{cap}</div>
                  <NumberInput value={products[b][cap]} onChange={(v) => onProductChange(b, cap, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="하자보수증권" accent="#fb923c">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>보증비율</div>
            <NumberInput value={warrantyRate} onChange={onWarrantyRateChange} suffix="%" step={1} width="4rem" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>보증수수료율</div>
            <NumberInput value={warrantyFeeRate} onChange={onWarrantyFeeRateChange} suffix="%" step={0.1} width="4rem" />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>보증기간</div>
            <NumberInput value={warrantyYears} onChange={onWarrantyYearsChange} suffix="년" step={1} width="3.5rem" />
          </div>
        </div>
        <div style={{ fontSize: "11px", color: "#555", marginTop: "10px" }}>
          발급료 = 공사비 × {warrantyRate}% × {warrantyFeeRate}% × {warrantyYears}년
        </div>
      </Section>

      <div style={{ fontSize: "11px", color: "#555" }}>
        마더피(CTR): 공사비의 {(MOTHER_FEE_RATE * 100).toFixed(0)}% · 정부보조율:{" "}
        {(SUBSIDY_RATE * 100).toFixed(0)}%
      </div>
    </div>
  );
}
