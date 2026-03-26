import { useState, useMemo, useEffect } from "react";

// ═══════════════════════ 상수 ═══════════════════════
const CAPACITIES = ["16kW", "25kW", "35kW"];
const CAP_NUM = { "16kW": 16, "25kW": 25, "35kW": 35 };
const DEFAULT_BIZ_COST = { "16kW": 700, "25kW": 1000, "35kW": 1200 };
const DEFAULT_PRODUCTS = {
  LG: { "16kW": 410, "25kW": 540, "35kW": 620 },
  "캐리어": { "16kW": 400, "25kW": 520, "35kW": 620 },
};
const DEFAULT_INSTALL_COST = { "16kW": 250, "25kW": 300, "35kW": 350 };
const MOTHER_FEE_RATE = 0.05;
const SUBSIDY_RATE = 0.7;
const CONSULTING_FEE = 100;

const TANK_OPTIONS = [
  { label: "없음", price: 0 },
  { label: "1000L (3.2T)", price: 858000 },
  { label: "1200L (3.2T)", price: 880000 },
  { label: "1500L (3.2T)", price: 946000 },
  { label: "1800L (3.2T)", price: 1023000 },
  { label: "2000L (3.2T)", price: 1045000 },
  { label: "2500L (3.2T)", price: 1144000 },
  { label: "2700L (3.2T)", price: 1210000 },
  { label: "3000L (3.2T)", price: 1430000 },
  { label: "3000L (4T)", price: 1650000 },
  { label: "4000L (5T)", price: 3410000 },
  { label: "5000L (5T)", price: 3630000 },
];
const COIL_OPTIONS = [
  { label: "없음", price: 0 },
  { label: "Ø12.7×45M (15A)", price: 176000 },
  { label: "Ø12.7×60M", price: 220000 },
  { label: "Ø15.88×40M", price: 220000 },
  { label: "Ø15.88×50M (15A)", price: 275000 },
  { label: "Ø15.88×60M", price: 330000 },
  { label: "Ø19.01×40M", price: 275000 },
  { label: "Ø19.01×50M (20A)", price: 385000 },
  { label: "Ø19.01×60M", price: 440000 },
  { label: "Ø15.88×120M (25A~32A)", price: 770000 },
  { label: "Ø15.88×180M (32A~50A)", price: 990000 },
  { label: "Ø15.88×240M (50A~65A)", price: 1320000 },
  { label: "Ø19.01×120M (25A~32A)", price: 990000 },
  { label: "Ø19.01×180M (32A~50A)", price: 1320000 },
  { label: "Ø19.01×240M (50A~80A)", price: 1650000 },
];
const HEATER_OPTIONS = [
  { label: "없음", price: 0 },
  { label: "5kW~15kW", price: 385000 },
  { label: "20kW~30kW", price: 440000 },
];

// ═══════════════════════ 밝은 팔레트 ═══════════════════════
const C = {
  bg: "#f5f5f0",
  panel: "#ffffff",
  panelBorder: "#e0e0d8",
  inputBg: "#f8f8f5",
  inputBorder: "#d0d0c8",
  text: "#1a1a1a",
  textDim: "#555",
  textMuted: "#777",
  textFaint: "#999",
  textGhost: "#bbb",
  divider: "#ddd",
  dividerLight: "#eee",
  brand: "#006600",
  brandLight: "#2e7a4a",
  brandDark: "#083322",
  accent: "#1a8a3e",
  good: "#16a34a",
  goodBg: "#f0fdf4",
  warn: "#d97706",
  warnBg: "#fffbeb",
  bad: "#dc2626",
  badBg: "#fef2f2",
  info: "#2563eb",
  infoBg: "#eff6ff",
  purple: "#7c3aed",
  orange: "#ea580c",
  subtle: "#64748b",
};

// ═══════════════════════ 유틸 ═══════════════════════
function formatW(v) {
  const abs = Math.abs(v), sign = v < 0 ? "-" : "";
  return abs >= 10000 ? `${sign}${(abs / 10000).toFixed(1)}억` : `${sign}${abs.toLocaleString()}만`;
}
function formatWon(v) { return `${Math.round(v).toLocaleString()}원`; }
function exVatMan(vatIncluded) { return Math.round(vatIncluded / 1.1 / 10000); }

// ═══════════════════════ 계산 ═══════════════════════
function calcSite({ bizCost, capacity, units, brand, products, installCostPerUnit, volumeDiscount, salesFeePerUnit, warrantyRate, warrantyFeeRate, warrantyYears, targetMarginRate, extraCost, includeExtrasInBiz, includeConsulting }) {
  const baseBiz = (bizCost[capacity] || 0) * units;
  const totalBiz = includeExtrasInBiz ? baseBiz + extraCost : baseBiz;
  const motherFee = Math.round(totalBiz * MOTHER_FEE_RATE);
  const consulting = CONSULTING_FEE;
  const productCost = (products[brand]?.[capacity] || 0) * units;
  const effectiveInstall = Math.max(0, installCostPerUnit - (units > 1 ? volumeDiscount : 0));
  const totalInstall = effectiveInstall * units;
  const totalSalesFee = (salesFeePerUnit || 0) * units;
  const warrantyBondAmount = totalBiz * ((warrantyRate || 0) / 100);
  const warrantyFee = Math.round(warrantyBondAmount * ((warrantyFeeRate || 0) / 100) * (warrantyYears || 0));
  const extraInCost = includeExtrasInBiz ? extraCost : 0;
  const totalCost = motherFee + productCost + totalInstall + totalSalesFee + warrantyFee + extraInCost;
  const baseMargin = totalBiz - totalCost;
  const margin = includeConsulting ? baseMargin + consulting : baseMargin;
  const marginRate = totalBiz > 0 ? (margin / totalBiz) * 100 : 0;
  const subsidy = Math.round(totalBiz * SUBSIDY_RATE);
  const customerBizBurden = totalBiz - subsidy;
  const customerExtraBurden = includeExtrasInBiz ? 0 : extraCost;
  const targetMargin = totalBiz * (targetMarginRate / 100);
  const maxInstallBase = totalBiz - motherFee - productCost - totalSalesFee - warrantyFee - extraInCost - targetMargin + (includeConsulting ? consulting : 0);
  const maxInstallPerUnit = units > 0 ? Math.floor(maxInstallBase / units) : 0;
  return { baseBiz, totalBiz, motherFee, productCost, effectiveInstall, totalInstall, totalSalesFee, warrantyBondAmount, warrantyFee, totalCost, baseMargin, margin, marginRate, consulting, subsidy, customerBizBurden, customerExtraBurden, maxInstallPerUnit, targetMargin, extraInCost, includeConsulting };
}

// ═══════════════════════ 스타일 ═══════════════════════
const labelStyle = { display: "block", fontSize: "11px", color: C.textMuted, marginBottom: "6px", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.5px" };
const chipStyle = { padding: "7px 14px", borderRadius: "6px", border: `1px solid ${C.inputBorder}`, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s", background: C.panel };
const selectStyle = { padding: "6px 8px", border: `1px solid ${C.inputBorder}`, borderRadius: "4px", background: C.inputBg, color: C.text, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", width: "100%", cursor: "pointer" };
const tdStyle = { padding: "8px 6px", textAlign: "right", color: C.textDim, whiteSpace: "nowrap" };
const panelStyle = { background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: "10px", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };

// ═══════════════════════ UI 컴포넌트 ═══════════════════════
function Section({ title, children, accent = C.brand }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: accent, borderBottom: `2px solid ${accent}33`, paddingBottom: "8px", marginBottom: "16px", fontFamily: "'JetBrains Mono', monospace" }}>{title}</h2>
      {children}
    </div>
  );
}

function NumberInput({ value, onChange, suffix = "만원", min, step = 10, width = "5.5rem" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} step={step}
        style={{ width, padding: "6px 8px", border: `1px solid ${C.inputBorder}`, borderRadius: "4px", background: C.inputBg, color: C.text, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }} />
      <span style={{ fontSize: "12px", color: C.textMuted, whiteSpace: "nowrap" }}>{suffix}</span>
    </span>
  );
}

function Row({ label, value, highlight, bold, sub }) {
  const isNeg = value < 0;
  const displayColor = highlight || (isNeg ? C.bad : C.text);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 0", flexWrap: "wrap", gap: "4px" }}>
      <div style={{ minWidth: 0 }}>
        <span style={{ fontSize: "13px", color: highlight || C.textDim, fontWeight: bold ? 700 : 400 }}>{label}</span>
        {sub && <span style={{ fontSize: "11px", color: C.textGhost, marginLeft: "8px" }}>{sub}</span>}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: bold ? 800 : 600, color: displayColor, whiteSpace: "nowrap" }}>{formatW(value)}</span>
    </div>
  );
}

function KwRow({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
      <span style={{ color: C.textMuted, fontWeight: bold ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: bold ? 700 : 500, color: bold ? C.text : C.textDim }}>{formatW(value)}/kW</span>
    </div>
  );
}

function EquipRow({ label, options, optIdx, onOptChange, qty, onQtyChange }) {
  const unitExVat = exVatMan(options[optIdx].price);
  const totalExVat = unitExVat * qty;
  const isActive = optIdx > 0;
  return (
    <div style={{ marginBottom: "12px" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <select value={optIdx} onChange={(e) => onOptChange(Number(e.target.value))} style={{ ...selectStyle, flex: 1 }}>
          {options.map((opt, i) => { const ex = Math.round(opt.price / 1.1); return (<option key={i} value={i}>{opt.label}{opt.price > 0 ? ` → ${formatWon(ex)}` : ""}</option>); })}
        </select>
        {isActive && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            <span style={{ fontSize: "12px", color: C.textFaint }}>×</span>
            <input type="number" value={qty} min={1} step={1} onChange={(e) => onQtyChange(Math.max(1, Number(e.target.value)))}
              style={{ width: "3.2rem", padding: "6px 6px", border: `1px solid ${C.inputBorder}`, borderRadius: "4px", background: C.inputBg, color: C.text, fontSize: "13px", fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }} />
            <span style={{ fontSize: "12px", color: C.textMuted }}>개</span>
          </span>
        )}
      </div>
      {isActive && (
        <div style={{ marginTop: "4px", fontSize: "11px", color: C.textFaint }}>
          단가 {formatW(unitExVat)} (VAT별도)
          {qty > 1 && <span> × {qty}개 = <span style={{ color: C.subtle }}>{formatW(totalExVat)}</span></span>}
        </div>
      )}
    </div>
  );
}

function ComparisonTable({ rows, targetMarginRate, accentColor = C.info }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${C.divider}` }}>
            {["", "사업비", "제품비", "마진", "마진율", "만원/kW"].map((h) => (
              <th key={h} style={{ padding: "8px 6px", textAlign: "right", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const rowColor = r.marginRate >= targetMarginRate ? C.good : r.marginRate >= 5 ? C.warn : C.bad;
            return (
              <tr key={r.key} style={{ borderBottom: `1px solid ${C.dividerLight}`, background: r.isCurrent ? `${accentColor}08` : "transparent" }}>
                <td style={{ ...tdStyle, color: r.isCurrent ? accentColor : C.text, fontWeight: r.isCurrent ? 700 : 400, textAlign: "left" }}>{r.key}{r.isCurrent ? " ◀" : ""}</td>
                <td style={tdStyle}>{formatW(r.totalBiz)}</td>
                <td style={tdStyle}>{formatW(r.productCost)}</td>
                <td style={{ ...tdStyle, color: rowColor, fontWeight: 700 }}>{formatW(r.margin)}</td>
                <td style={{ ...tdStyle, color: rowColor }}>{r.marginRate.toFixed(1)}%</td>
                <td style={{ ...tdStyle, color: C.subtle }}>{formatW(r.costPerKw)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════ 메인 ═══════════════════════
export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [bizCost, setBizCost] = useState(DEFAULT_BIZ_COST);
  const [brand, setBrand] = useState("LG");
  const [capacity, setCapacity] = useState("25kW");
  const [units, setUnits] = useState(1);
  const [installCostPerUnit, setInstallCostPerUnit] = useState(DEFAULT_INSTALL_COST["25kW"]);
  const [volumeDiscount, setVolumeDiscount] = useState(0);
  const [salesFeePerUnit, setSalesFeePerUnit] = useState(150);
  const [targetMarginRate, setTargetMarginRate] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [warrantyRate, setWarrantyRate] = useState(5);
  const [warrantyFeeRate, setWarrantyFeeRate] = useState(0.439);
  const [warrantyYears, setWarrantyYears] = useState(3);
  const [includeConsulting, setIncludeConsulting] = useState(true);

  const [tankIdx, setTankIdx] = useState(0);
  const [tankQty, setTankQty] = useState(1);
  const [coilIdx, setCoilIdx] = useState(0);
  const [coilQty, setCoilQty] = useState(1);
  const [heaterIdx, setHeaterIdx] = useState(0);
  const [heaterQty, setHeaterQty] = useState(1);
  const [costFacilityCharge, setCostFacilityCharge] = useState(0);
  const [costElecWork, setCostElecWork] = useState(0);
  const [costEtc, setCostEtc] = useState(0);
  const [includeExtrasInBiz, setIncludeExtrasInBiz] = useState(false);

  const tankTotal = exVatMan(TANK_OPTIONS[tankIdx].price) * (tankIdx > 0 ? tankQty : 0);
  const coilTotal = exVatMan(COIL_OPTIONS[coilIdx].price) * (coilIdx > 0 ? coilQty : 0);
  const heaterTotal = exVatMan(HEATER_OPTIONS[heaterIdx].price) * (heaterIdx > 0 ? heaterQty : 0);
  const equipTotal = tankTotal + coilTotal + heaterTotal;
  const powerTotal = costFacilityCharge + costElecWork;
  const totalExtraCost = equipTotal + powerTotal + costEtc;

  useEffect(() => { setInstallCostPerUnit(DEFAULT_INSTALL_COST[capacity] || 300); }, [capacity]);

  const coreParams = { bizCost, capacity, units, brand, products, installCostPerUnit, volumeDiscount, salesFeePerUnit, warrantyRate, warrantyFeeRate, warrantyYears, targetMarginRate, extraCost: totalExtraCost, includeExtrasInBiz, includeConsulting };

  const calc = useMemo(() => calcSite(coreParams),
    [bizCost, capacity, units, brand, products, installCostPerUnit, volumeDiscount, salesFeePerUnit, warrantyRate, warrantyFeeRate, warrantyYears, targetMarginRate, totalExtraCost, includeExtrasInBiz, includeConsulting]);

  const extraItems = [
    ...(tankTotal > 0 ? [{ label: `축열탱크 ×${tankQty}`, value: tankTotal }] : []),
    ...(coilTotal > 0 ? [{ label: `온수코일 ×${coilQty}`, value: coilTotal }] : []),
    ...(heaterTotal > 0 ? [{ label: `보조히터 ×${heaterQty}`, value: heaterTotal }] : []),
    ...(costFacilityCharge > 0 ? [{ label: "설비부담금", value: costFacilityCharge }] : []),
    ...(costElecWork > 0 ? [{ label: "전기공사비", value: costElecWork }] : []),
    ...(costEtc > 0 ? [{ label: "기타", value: costEtc }] : []),
  ];

  const marginColor = calc.marginRate >= targetMarginRate ? C.good : calc.marginRate >= 5 ? C.warn : C.bad;
  const marginBg = calc.marginRate >= targetMarginRate ? C.goodBg : calc.marginRate >= 5 ? C.warnBg : C.badBg;
  const customerTotal = calc.customerBizBurden + calc.customerExtraBurden;
  const totalProjectCost = calc.totalBiz + calc.customerExtraBurden;
  const totalKw = CAP_NUM[capacity] * units;
  const kwBreakdown = totalKw > 0 ? { product: Math.round(calc.productCost / totalKw), install: Math.round(calc.totalInstall / totalKw), sales: Math.round(calc.totalSalesFee / totalKw), equip: Math.round(equipTotal / totalKw), power: Math.round(powerTotal / totalKw), etc: Math.round(costEtc / totalKw), total: Math.round(totalProjectCost / totalKw) } : null;
  const capComparison = CAPACITIES.map((cap) => { const c = calcSite({ ...coreParams, capacity: cap }); const tpc = c.totalBiz + c.customerExtraBurden; const kw = CAP_NUM[cap] * units; return { cap, ...c, costPerKw: kw > 0 ? Math.round(tpc / kw) : 0 }; });
  const brandComparison = Object.keys(products).map((b) => { const c = calcSite({ ...coreParams, brand: b }); const tpc = c.totalBiz + c.customerExtraBurden; return { brand: b, ...c, costPerKw: totalKw > 0 ? Math.round(tpc / totalKw) : 0 }; });

  return (
    <div style={{ fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif", background: C.bg, color: C.text, minHeight: "100vh", paddingTop: "68px" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* ── 고정 헤더 ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.panelBorder}`,
        padding: "10px 16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="/logo.png" height={34} alt="모닥불에너지" style={{ objectFit: "contain" }} />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: C.textMuted, textAlign: "right", lineHeight: 1.4 }}>
            <div style={{ color: C.brand, fontWeight: 700 }}>마진 시뮬레이터 v1.1</div>
            <div style={{ color: C.textFaint, fontSize: "10px" }}>소상공인지원사업</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "16px 16px 32px" }}>

        {/* 기준값 설정 토글 */}
        <div style={{ marginBottom: "16px" }}>
          <button onClick={() => setShowSettings(!showSettings)}
            style={{ background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: "6px", color: C.textMuted, padding: "8px 14px", fontSize: "12px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace" }}>
            {showSettings ? "▾ 기준값 설정 닫기" : "▸ 기준값 설정 (사업비·제품비·보증)"}
          </button>
        </div>

        {/* ── 기준값 설정 패널 ── */}
        {showSettings && (
          <div style={panelStyle}>
            <Section title="용량별 사업비" accent={C.info}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {CAPACITIES.map((cap) => (
                  <div key={cap} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>{cap}</div>
                    <NumberInput value={bizCost[cap]} onChange={(v) => setBizCost((p) => ({ ...p, [cap]: v }))} />
                  </div>
                ))}
              </div>
            </Section>
            <Section title="제품별 단가" accent={C.purple}>
              {Object.keys(products).map((b) => (
                <div key={b} style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: C.purple, marginBottom: "8px", fontFamily: "'JetBrains Mono', monospace" }}>{b}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    {CAPACITIES.map((cap) => (
                      <div key={cap} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "11px", color: C.textFaint, marginBottom: "4px" }}>{cap}</div>
                        <NumberInput value={products[b][cap]} onChange={(v) => setProducts((p) => ({ ...p, [b]: { ...p[b], [cap]: v } }))} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
            <Section title="하자보수증권" accent={C.orange}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>보증비율</div><NumberInput value={warrantyRate} onChange={setWarrantyRate} suffix="%" step={1} width="4rem" /></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>보증수수료율</div><NumberInput value={warrantyFeeRate} onChange={setWarrantyFeeRate} suffix="%" step={0.1} width="4rem" /></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>보증기간</div><NumberInput value={warrantyYears} onChange={setWarrantyYears} suffix="년" step={1} width="3.5rem" /></div>
              </div>
              <div style={{ fontSize: "11px", color: C.textFaint, marginTop: "10px" }}>발급료 = 공사비 × {warrantyRate}% × {warrantyFeeRate}% × {warrantyYears}년</div>
            </Section>
            <div style={{ fontSize: "11px", color: C.textFaint }}>마더피(CTR): 공사비의 {(MOTHER_FEE_RATE * 100).toFixed(0)}% · 정부보조율: {(SUBSIDY_RATE * 100).toFixed(0)}% · 컨설팅비: 일괄 {CONSULTING_FEE}만원</div>
          </div>
        )}

        {/* ── 현장 조건 입력 ── */}
        <div style={panelStyle}>
          <Section title="현장 조건 입력" accent={C.brand}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
              <div>
                <label style={labelStyle}>용량</label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {CAPACITIES.map((c) => (<button key={c} onClick={() => setCapacity(c)} style={{ ...chipStyle, background: capacity === c ? "#e8f5e9" : C.panel, borderColor: capacity === c ? C.brand : C.inputBorder, color: capacity === c ? C.brand : C.textMuted }}>{c}</button>))}
                </div>
              </div>
              <div>
                <label style={labelStyle}>브랜드</label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Object.keys(products).map((b) => (<button key={b} onClick={() => setBrand(b)} style={{ ...chipStyle, background: brand === b ? "#f3e8ff" : C.panel, borderColor: brand === b ? C.purple : C.inputBorder, color: brand === b ? C.purple : C.textMuted }}>{b}</button>))}
                </div>
              </div>
              <div><label style={labelStyle}>설치 대수</label><NumberInput value={units} onChange={(v) => setUnits(Math.max(1, v))} suffix="대" step={1} width="4rem" /></div>
              <div><label style={labelStyle}>대당 설치비</label><NumberInput value={installCostPerUnit} onChange={setInstallCostPerUnit} min={0} /></div>
              {units > 1 && <div><label style={labelStyle}>다수 설치 할인 (대당)</label><NumberInput value={volumeDiscount} onChange={setVolumeDiscount} min={0} /></div>}
              <div><label style={labelStyle}>영업비 (대당)</label><NumberInput value={salesFeePerUnit} onChange={setSalesFeePerUnit} min={0} /></div>
              <div><label style={labelStyle}>목표 마진율</label><NumberInput value={targetMarginRate} onChange={setTargetMarginRate} suffix="%" step={1} width="3.5rem" /></div>
            </div>
          </Section>

          <Section title="부대비용 (원가 · 마진 미반영)" accent={C.subtle}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", cursor: "pointer", fontSize: "13px" }}>
              <input type="checkbox" checked={includeExtrasInBiz} onChange={(e) => setIncludeExtrasInBiz(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: C.brand, cursor: "pointer" }} />
              <span style={{ color: includeExtrasInBiz ? C.brand : C.textMuted }}>부대비용을 공사비(사업비)에 포함</span>
            </label>
            {includeExtrasInBiz && totalExtraCost > 0 && (
              <div style={{ marginBottom: "14px", padding: "10px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", fontSize: "11px", color: C.textDim }}>
                마더피 5% · 보증료 → <span style={{ color: C.warn, fontWeight: 600 }}>사업비+부대 전체 기준</span><br />컨설팅비 → 원래 사업비 기준 (변동 없음)<br />부대비용 원가 그대로 차감 (마진 0%)
              </div>
            )}
            <EquipRow label="축열탱크" options={TANK_OPTIONS} optIdx={tankIdx} onOptChange={setTankIdx} qty={tankQty} onQtyChange={setTankQty} />
            <EquipRow label="STS 온수코일" options={COIL_OPTIONS} optIdx={coilIdx} onOptChange={setCoilIdx} qty={coilQty} onQtyChange={setCoilQty} />
            <EquipRow label="보조히터 및 컨트롤" options={HEATER_OPTIONS} optIdx={heaterIdx} onOptChange={setHeaterIdx} qty={heaterQty} onQtyChange={setHeaterQty} />
            <div style={{ marginTop: "4px", marginBottom: "12px" }}>
              <label style={{ ...labelStyle, marginBottom: "10px", fontSize: "12px", color: C.subtle, borderBottom: `1px solid ${C.dividerLight}`, paddingBottom: "6px" }}>전력증설</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div><label style={labelStyle}>시설부담금</label><NumberInput value={costFacilityCharge} onChange={setCostFacilityCharge} min={0} /></div>
                <div><label style={labelStyle}>전기공사비</label><NumberInput value={costElecWork} onChange={setCostElecWork} min={0} /></div>
              </div>
            </div>
            <div><label style={labelStyle}>기타</label><NumberInput value={costEtc} onChange={setCostEtc} min={0} /></div>
            {totalExtraCost > 0 && (
              <div style={{ marginTop: "16px", padding: "12px", background: includeExtrasInBiz ? "#f0fdf4" : C.inputBg, border: includeExtrasInBiz ? "1px solid #bbf7d0" : `1px solid ${C.dividerLight}`, borderRadius: "6px" }}>
                {extraItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                    <span style={{ fontSize: "12px", color: C.textMuted }}>{item.label}</span>
                    <span style={{ fontSize: "12px", color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>{formatW(item.value)}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${C.divider}`, margin: "6px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><span style={{ fontSize: "13px", color: C.text, fontWeight: 600 }}>합계</span>{includeExtrasInBiz && <span style={{ fontSize: "11px", color: C.brand, marginLeft: "8px" }}>공사비 포함</span>}</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700, color: C.text }}>{formatW(totalExtraCost)}</span>
                </div>
              </div>
            )}
          </Section>
        </div>

        {/* ── 마진 분석 ── */}
        <div style={{ ...panelStyle, borderColor: `${marginColor}66` }}>
          <Section title="마진 분석" accent={marginColor}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", cursor: "pointer" }}>
              <input type="checkbox" checked={includeConsulting} onChange={(e) => setIncludeConsulting(e.target.checked)} style={{ width: "15px", height: "15px", accentColor: C.info, cursor: "pointer" }} />
              <span style={{ fontSize: "12px", color: includeConsulting ? C.info : C.textFaint }}>컨설팅비 {CONSULTING_FEE}만원 마진에 포함</span>
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "16px", marginBottom: "20px", padding: "16px", background: marginBg, borderRadius: "8px", borderLeft: `4px solid ${marginColor}` }}>
              <div>
                <div style={{ fontSize: "11px", color: C.textMuted, marginBottom: "4px" }}>우리 마진{includeConsulting ? " (컨설팅 포함)" : ""}</div>
                <span style={{ fontSize: "28px", fontWeight: 800, color: marginColor, fontFamily: "'JetBrains Mono', monospace" }}>{formatW(calc.margin)}</span>
                <span style={{ fontSize: "13px", color: C.textMuted, marginLeft: "4px" }}>원</span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: marginColor, fontFamily: "'JetBrains Mono', monospace" }}>{calc.marginRate.toFixed(1)}%</div>
            </div>

            <div style={{ fontSize: "13px" }}>
              {includeExtrasInBiz
                ? <Row label="총 공사비 (사업비+부대)" value={calc.totalBiz} sub={`사업비 ${formatW(calc.baseBiz)} + 부대 ${formatW(totalExtraCost)}`} />
                : <Row label="총 사업비" value={calc.totalBiz} sub={`${capacity} × ${units}대 · 대당 ${formatW(calc.totalBiz / units)}`} />}
              <Row label="(−) 마더피 5%" value={-calc.motherFee} sub={includeExtrasInBiz ? "공사비 전체 기준" : undefined} />
              <Row label={`(−) 제품비 (${brand})`} value={-calc.productCost} sub={`대당 ${formatW(products[brand][capacity])}`} />
              <Row label="(−) 설치비" value={-calc.totalInstall} sub={units > 1 ? `대당 ${formatW(calc.effectiveInstall)} (원가 ${formatW(installCostPerUnit)} − 할인 ${formatW(volumeDiscount)})` : `대당 ${formatW(installCostPerUnit)}`} />
              {calc.totalSalesFee > 0 && <Row label="(−) 영업비" value={-calc.totalSalesFee} sub={`대당 ${formatW(salesFeePerUnit)}`} />}
              {calc.warrantyFee > 0 && <Row label="(−) 하자보수증권" value={-calc.warrantyFee} sub={`보증금 ${formatW(calc.warrantyBondAmount)} × ${warrantyFeeRate}% × ${warrantyYears}년`} />}
              {includeExtrasInBiz && totalExtraCost > 0 && <Row label="(−) 부대비용 (원가)" value={-totalExtraCost} />}
              {includeConsulting && <Row label="(+) 컨설팅비" value={CONSULTING_FEE} highlight={C.info} sub="일괄 100만원" />}
              <div style={{ borderTop: `2px solid ${marginColor}44`, margin: "8px 0" }} />
              <Row label="= 마진" value={calc.margin} highlight={marginColor} bold />
            </div>
          </Section>

          <div style={{ background: C.inputBg, borderRadius: "6px", padding: "14px", marginBottom: "16px", border: `1px dashed ${calc.maxInstallPerUnit < 0 ? C.bad : C.inputBorder}` }}>
            <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "6px" }}>📐 목표 마진율 {targetMarginRate}% 달성 기준</div>
            {calc.maxInstallPerUnit >= 0
              ? <div style={{ fontSize: "14px" }}><span style={{ color: C.warn, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>대당 최대 설치비: {formatW(calc.maxInstallPerUnit)}원</span><span style={{ color: C.textFaint, fontSize: "12px", marginLeft: "8px" }}>(현재 대당 {calc.maxInstallPerUnit >= installCostPerUnit ? "+" : ""}{formatW(calc.maxInstallPerUnit - installCostPerUnit)}원)</span></div>
              : <div style={{ fontSize: "13px", color: C.bad, fontWeight: 600 }}>⚠ 달성 불가 — 고정비만으로 사업비의 {(100 - targetMarginRate).toFixed(0)}%를 초과</div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: C.inputBg, borderRadius: "6px", padding: "14px" }}>
              <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "8px" }}>🤝 고객 부담</div>
              <div style={{ fontSize: "13px" }}>
                <Row label={includeExtrasInBiz ? "자부담 30% (부대 포함)" : "자부담 30%"} value={calc.customerBizBurden} />
                {calc.customerExtraBurden > 0 && <Row label="부대비용 별도" value={calc.customerExtraBurden} />}
                <div style={{ borderTop: `1px solid ${C.dividerLight}`, margin: "6px 0" }} />
                <Row label="합계" value={customerTotal} bold />
              </div>
            </div>
            <div style={{ background: C.inputBg, borderRadius: "6px", padding: "14px" }}>
              <div style={{ fontSize: "12px", color: C.textMuted, marginBottom: "8px" }}>📊 kW당 비용 분해</div>
              {kwBreakdown && (
                <div style={{ fontSize: "12px" }}>
                  <KwRow label="제품비" value={kwBreakdown.product} />
                  <KwRow label="설치비" value={kwBreakdown.install} />
                  {kwBreakdown.sales > 0 && <KwRow label="영업비" value={kwBreakdown.sales} />}
                  {kwBreakdown.equip > 0 && <KwRow label="축열조 등" value={kwBreakdown.equip} />}
                  {kwBreakdown.power > 0 && <KwRow label="전력증설" value={kwBreakdown.power} />}
                  {kwBreakdown.etc > 0 && <KwRow label="기타" value={kwBreakdown.etc} />}
                  <div style={{ borderTop: `1px solid ${C.dividerLight}`, margin: "5px 0" }} />
                  <KwRow label="합계" value={kwBreakdown.total} bold />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 용량별 비교 ── */}
        <div style={panelStyle}>
          <Section title="용량별 비교" accent={C.info}>
            <div style={{ fontSize: "11px", color: C.textFaint, marginBottom: "12px" }}>{brand} · {units}대 · 설치비 {formatW(installCostPerUnit)}/대{salesFeePerUnit > 0 ? ` · 영업 ${formatW(salesFeePerUnit)}/대` : ""}{includeConsulting ? " · 컨설팅 포함" : ""}</div>
            <ComparisonTable rows={capComparison.map((r) => ({ key: r.cap, isCurrent: r.cap === capacity, ...r }))} targetMarginRate={targetMarginRate} />
          </Section>
        </div>

        {/* ── 제조사별 비교 ── */}
        <div style={panelStyle}>
          <Section title="제조사별 비교" accent={C.purple}>
            <div style={{ fontSize: "11px", color: C.textFaint, marginBottom: "12px" }}>{capacity} · {units}대 · 설치비 {formatW(installCostPerUnit)}/대{includeConsulting ? " · 컨설팅 포함" : ""}</div>
            <ComparisonTable rows={brandComparison.map((r) => ({ key: r.brand, isCurrent: r.brand === brand, ...r }))} targetMarginRate={targetMarginRate} accentColor={C.purple} />
          </Section>
        </div>

        {/* ── 설치비 시나리오 비교 ── */}
        <div style={panelStyle}>
          <Section title="설치비 시나리오 비교" accent={C.warn}>
            <div style={{ fontSize: "11px", color: C.textFaint, marginBottom: "12px" }}>{capacity} · {brand} · {units}대 기준{includeConsulting ? " · 컨설팅 포함" : ""}</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace" }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${C.divider}` }}>
                    {["설치비/대", "총원가", "마진", "마진율"].map((h) => (
                      <th key={h} style={{ padding: "8px 6px", textAlign: "right", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[-50, -30, -10, 0, 10, 30, 50].map((delta) => {
                    const ic = installCostPerUnit + delta;
                    if (ic < 0) return null;
                    const r = calcSite({ ...coreParams, installCostPerUnit: ic });
                    const isBase = delta === 0;
                    const rowColor = r.marginRate >= targetMarginRate ? C.good : r.marginRate >= 5 ? C.warn : C.bad;
                    return (
                      <tr key={delta} style={{ borderBottom: `1px solid ${C.dividerLight}`, background: isBase ? "#f0fdf4" : "transparent" }}>
                        <td style={{ ...tdStyle, color: isBase ? C.text : C.textDim }}>{formatW(ic)}{isBase ? " ◀" : ""}</td>
                        <td style={tdStyle}>{formatW(r.totalCost)}</td>
                        <td style={{ ...tdStyle, color: rowColor, fontWeight: 700 }}>{formatW(r.margin)}</td>
                        <td style={{ ...tdStyle, color: rowColor }}>{r.marginRate.toFixed(1)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>
        </div>

        <div style={{ textAlign: "center", fontSize: "11px", color: C.textGhost, marginTop: "24px", paddingBottom: "16px" }}>모닥불에너지 · 시공협의 내부용</div>
      </div>
    </div>
  );
}
