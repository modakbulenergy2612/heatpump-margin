import { CAPACITIES, TANK_OPTIONS, COIL_OPTIONS, HEATER_OPTIONS } from "../lib/constants";
import { exVatMan, formatW } from "../lib/format";
import Section from "./ui/Section";
import NumberInput from "./ui/NumberInput";
import EquipRow from "./ui/EquipRow";
import { labelStyle, chipStyle } from "./ui/styles";

export default function InputPanel({
  brand, capacity, units, installCostPerUnit, volumeDiscount, salesFeePerUnit, targetMarginRate,
  tankIdx, tankQty, coilIdx, coilQty, heaterIdx, heaterQty,
  costFacilityCharge, costElecWork, costEtc,
  includeExtrasInBiz, totalExtraCost, extraItems,
  products,
  onBrandChange, onCapacityChange, onUnitsChange, onInstallCostChange, onVolumeDiscountChange,
  onSalesFeeChange, onTargetMarginRateChange,
  onTankIdxChange, onTankQtyChange, onCoilIdxChange, onCoilQtyChange, onHeaterIdxChange, onHeaterQtyChange,
  onFacilityChargeChange, onElecWorkChange, onEtcChange, onIncludeExtrasChange,
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
      <Section title="현장 조건 입력">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
          <div>
            <label style={labelStyle}>용량</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {CAPACITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => onCapacityChange(c)}
                  style={{
                    ...chipStyle,
                    background: capacity === c ? "#4ade8022" : "#1a1a1a",
                    borderColor: capacity === c ? "#4ade80" : "#333",
                    color: capacity === c ? "#4ade80" : "#888",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>브랜드</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {Object.keys(products).map((b) => (
                <button
                  key={b}
                  onClick={() => onBrandChange(b)}
                  style={{
                    ...chipStyle,
                    background: brand === b ? "#c084fc22" : "#1a1a1a",
                    borderColor: brand === b ? "#c084fc" : "#333",
                    color: brand === b ? "#c084fc" : "#888",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={labelStyle}>설치 대수</label>
            <NumberInput value={units} onChange={(v) => onUnitsChange(Math.max(1, v))} suffix="대" step={1} width="4rem" />
          </div>
          <div>
            <label style={labelStyle}>대당 설치비</label>
            <NumberInput value={installCostPerUnit} onChange={onInstallCostChange} min={0} />
          </div>
          {units > 1 && (
            <div>
              <label style={labelStyle}>다수 설치 할인 (대당)</label>
              <NumberInput value={volumeDiscount} onChange={onVolumeDiscountChange} min={0} />
            </div>
          )}
          <div>
            <label style={labelStyle}>영업비 (대당)</label>
            <NumberInput value={salesFeePerUnit} onChange={onSalesFeeChange} min={0} />
          </div>
          <div>
            <label style={labelStyle}>목표 마진율</label>
            <NumberInput value={targetMarginRate} onChange={onTargetMarginRateChange} suffix="%" step={1} width="3.5rem" />
          </div>
        </div>
      </Section>

      <Section title="부대비용 (원가 · 마진 미반영)" accent="#94a3b8">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          <input
            type="checkbox"
            checked={includeExtrasInBiz}
            onChange={(e) => onIncludeExtrasChange(e.target.checked)}
            style={{ width: "16px", height: "16px", accentColor: "#4ade80", cursor: "pointer" }}
          />
          <span style={{ color: includeExtrasInBiz ? "#4ade80" : "#888" }}>
            부대비용을 공사비(사업비)에 포함
          </span>
        </label>

        {includeExtrasInBiz && totalExtraCost > 0 && (
          <div
            style={{
              marginBottom: "14px",
              padding: "10px 12px",
              background: "#4ade8008",
              border: "1px solid #4ade8022",
              borderRadius: "6px",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            마더피 5% · 보증료 → <span style={{ color: "#fbbf24" }}>사업비+부대 전체 기준</span>
            <br />
            컨설팅비 → 원래 사업비 기준 (변동 없음)
            <br />
            부대비용 원가 그대로 차감 (마진 0%)
          </div>
        )}

        <EquipRow label="축열탱크" options={TANK_OPTIONS} optIdx={tankIdx} onOptChange={onTankIdxChange} qty={tankQty} onQtyChange={onTankQtyChange} />
        <EquipRow label="STS 온수코일" options={COIL_OPTIONS} optIdx={coilIdx} onOptChange={onCoilIdxChange} qty={coilQty} onQtyChange={onCoilQtyChange} />
        <EquipRow label="보조히터 및 컨트롤" options={HEATER_OPTIONS} optIdx={heaterIdx} onOptChange={onHeaterIdxChange} qty={heaterQty} onQtyChange={onHeaterQtyChange} />

        <div style={{ marginTop: "4px", marginBottom: "12px" }}>
          <label
            style={{
              ...labelStyle,
              marginBottom: "10px",
              fontSize: "12px",
              color: "#94a3b8",
              borderBottom: "1px solid #2a2a2a",
              paddingBottom: "6px",
            }}
          >
            전력증설
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>시설부담금</label>
              <NumberInput value={costFacilityCharge} onChange={onFacilityChargeChange} min={0} />
            </div>
            <div>
              <label style={labelStyle}>전기공사비</label>
              <NumberInput value={costElecWork} onChange={onElecWorkChange} min={0} />
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>기타</label>
          <NumberInput value={costEtc} onChange={onEtcChange} min={0} />
        </div>

        {totalExtraCost > 0 && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: includeExtrasInBiz ? "#4ade8010" : "#1a1a1a",
              border: includeExtrasInBiz ? "1px solid #4ade8033" : "1px solid #2a2a2a",
              borderRadius: "6px",
            }}
          >
            {extraItems.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                <span style={{ fontSize: "12px", color: "#888" }}>{item.label}</span>
                <span style={{ fontSize: "12px", color: "#aaa", fontFamily: "'JetBrains Mono', monospace" }}>
                  {formatW(item.value)}
                </span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #333", margin: "6px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "13px", color: "#e0e0e0", fontWeight: 600 }}>합계</span>
                {includeExtrasInBiz && (
                  <span style={{ fontSize: "11px", color: "#4ade80", marginLeft: "8px" }}>공사비 포함</span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#e0e0e0",
                }}
              >
                {formatW(totalExtraCost)}
              </span>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
