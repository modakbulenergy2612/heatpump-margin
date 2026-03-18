import { formatW } from "../lib/format";
import { CAP_NUM, CAPACITIES } from "../lib/constants";
import { calcSite } from "../lib/calc";
import Section from "./ui/Section";
import Row from "./ui/Row";
import KwRow from "./ui/KwRow";
import ComparisonTable from "./ui/ComparisonTable";
import { tdStyle } from "./ui/styles";

export default function ResultPanel({
  calc, coreParams, capacity, brand, units, installCostPerUnit, salesFeePerUnit, targetMarginRate,
  products, totalExtraCost, includeExtrasInBiz,
  equipTotal, powerTotal, costEtc, warrantyFeeRate, warrantyYears,
}) {
  const marginColor =
    calc.marginRate >= targetMarginRate ? "#4ade80" : calc.marginRate >= 5 ? "#fbbf24" : "#f87171";

  const customerTotal = calc.customerBizBurden + calc.customerExtraBurden;
  const totalProjectCost = calc.totalBiz + calc.customerExtraBurden;
  const totalKw = CAP_NUM[capacity] * units;

  const kwBreakdown = totalKw > 0
    ? {
        product: Math.round(calc.productCost / totalKw),
        install: Math.round(calc.totalInstall / totalKw),
        sales: Math.round(calc.totalSalesFee / totalKw),
        equip: Math.round(equipTotal / totalKw),
        power: Math.round(powerTotal / totalKw),
        etc: Math.round(costEtc / totalKw),
        total: Math.round(totalProjectCost / totalKw),
      }
    : null;

  const capComparison = CAPACITIES.map((cap) => {
    const c = calcSite({ ...coreParams, capacity: cap });
    const tpc = c.totalBiz + c.customerExtraBurden;
    const kw = CAP_NUM[cap] * units;
    return { cap, ...c, costPerKw: kw > 0 ? Math.round(tpc / kw) : 0 };
  });

  const brandComparison = Object.keys(products).map((b) => {
    const c = calcSite({ ...coreParams, brand: b });
    const tpc = c.totalBiz + c.customerExtraBurden;
    return { brand: b, ...c, costPerKw: totalKw > 0 ? Math.round(tpc / totalKw) : 0 };
  });

  return (
    <>
      {/* 마진 분석 */}
      <div
        style={{
          background: "#161616",
          border: `1px solid ${marginColor}44`,
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <Section title="마진 분석" accent={marginColor}>
          {/* 요약 헤더 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "16px",
              marginBottom: "20px",
              padding: "16px",
              background: `${marginColor}08`,
              borderRadius: "8px",
              borderLeft: `4px solid ${marginColor}`,
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>우리 마진</div>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: marginColor,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {formatW(calc.margin)}
              </span>
              <span style={{ fontSize: "13px", color: "#888", marginLeft: "4px" }}>원</span>
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: marginColor,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {calc.marginRate.toFixed(1)}%
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>+ 컨설팅비</div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#60a5fa",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {formatW(calc.consulting)}
              </span>
            </div>
          </div>

          {/* 상세 내역 */}
          <div style={{ fontSize: "13px" }}>
            {includeExtrasInBiz ? (
              <Row
                label="총 공사비 (사업비+부대)"
                value={calc.totalBiz}
                sub={`사업비 ${formatW(calc.baseBiz)} + 부대 ${formatW(totalExtraCost)}`}
              />
            ) : (
              <Row
                label="총 사업비"
                value={calc.totalBiz}
                sub={`${capacity} × ${units}대 · 대당 ${formatW(calc.totalBiz / units)}`}
              />
            )}
            <Row
              label="(−) 마더피 5%"
              value={-calc.motherFee}
              sub={includeExtrasInBiz ? "공사비 전체 기준" : undefined}
            />
            <Row
              label={`(−) 제품비 (${brand})`}
              value={-calc.productCost}
              sub={`대당 ${formatW(products[brand][capacity])}`}
            />
            <Row
              label="(−) 설치비"
              value={-calc.totalInstall}
              sub={
                units > 1
                  ? `대당 ${formatW(calc.effectiveInstall)} (정가 ${formatW(installCostPerUnit)} → 할인 ${formatW(installCostPerUnit - calc.effectiveInstall)})`
                  : `대당 ${formatW(installCostPerUnit)}`
              }
            />
            {calc.totalSalesFee > 0 && (
              <Row label="(−) 영업비" value={-calc.totalSalesFee} sub={`대당 ${formatW(coreParams.salesFeePerUnit)}`} />
            )}
            {calc.warrantyFee > 0 && (
              <Row
                label="(−) 하자보수증권"
                value={-calc.warrantyFee}
                sub={`보증금 ${formatW(calc.warrantyBondAmount)} × ${warrantyFeeRate}% × ${warrantyYears}년`}
              />
            )}
            {includeExtrasInBiz && totalExtraCost > 0 && (
              <Row label="(−) 부대비용 (원가)" value={-totalExtraCost} />
            )}
            <div style={{ borderTop: "1px solid #333", margin: "8px 0" }} />
            <Row label="= 마진" value={calc.margin} highlight={marginColor} />
            <Row
              label="+ 컨설팅비"
              value={calc.consulting}
              highlight="#60a5fa"
              sub={includeExtrasInBiz ? `기준: 사업비 ${formatW(calc.baseBiz)}` : undefined}
            />
            <div style={{ borderTop: "1px dashed #333", margin: "8px 0" }} />
            <Row label="순이익 합계" value={calc.netIncome} highlight="#fff" bold />
          </div>
        </Section>

        {/* 목표 마진율 달성 조건 */}
        <div
          style={{
            background: "#1a1a1a",
            borderRadius: "6px",
            padding: "14px",
            marginBottom: "16px",
            border: `1px dashed ${calc.maxInstallPerUnit < 0 ? "#f87171" : "#333"}`,
          }}
        >
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "6px" }}>
            🎯 목표 마진율 {targetMarginRate}% 달성 기준
          </div>
          {calc.maxInstallPerUnit >= 0 ? (
            <div style={{ fontSize: "14px" }}>
              <span
                style={{
                  color: "#fbbf24",
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                대당 최대 설치비: {formatW(calc.maxInstallPerUnit)}원
              </span>
              <span style={{ color: "#666", fontSize: "12px", marginLeft: "8px" }}>
                (현재 대당{" "}
                {calc.maxInstallPerUnit >= installCostPerUnit ? "+" : ""}
                {formatW(calc.maxInstallPerUnit - installCostPerUnit)}원)
              </span>
            </div>
          ) : (
            <div style={{ fontSize: "13px", color: "#f87171", fontWeight: 600 }}>
              ⚠ 달성 불가 → 고정비만으로 사업비의 {(100 - targetMarginRate).toFixed(0)}%를 초과
            </div>
          )}
        </div>

        {/* 고객 부담 + kW당 비용 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>🤝 고객 부담</div>
            <div style={{ fontSize: "13px" }}>
              <Row
                label={includeExtrasInBiz ? "자부담 30% (부대 포함)" : "자부담 30%"}
                value={calc.customerBizBurden}
              />
              {calc.customerExtraBurden > 0 && (
                <Row label="부대비용 별도" value={calc.customerExtraBurden} />
              )}
              <div style={{ borderTop: "1px solid #2a2a2a", margin: "6px 0" }} />
              <Row label="합계" value={customerTotal} bold />
            </div>
          </div>
          <div style={{ background: "#1a1a1a", borderRadius: "6px", padding: "14px" }}>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>📊 kW당 비용 분해</div>
            {kwBreakdown && (
              <div style={{ fontSize: "12px" }}>
                <KwRow label="제품비" value={kwBreakdown.product} />
                <KwRow label="설치비" value={kwBreakdown.install} />
                {kwBreakdown.sales > 0 && <KwRow label="영업비" value={kwBreakdown.sales} />}
                {kwBreakdown.equip > 0 && <KwRow label="축열조 등" value={kwBreakdown.equip} />}
                {kwBreakdown.power > 0 && <KwRow label="전력증설" value={kwBreakdown.power} />}
                {kwBreakdown.etc > 0 && <KwRow label="기타" value={kwBreakdown.etc} />}
                <div style={{ borderTop: "1px solid #2a2a2a", margin: "5px 0" }} />
                <KwRow label="합계" value={kwBreakdown.total} bold />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 용량별 비교 */}
      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <Section title="용량별 비교" accent="#60a5fa">
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "12px" }}>
            {brand} · {units}대 · 설치비 {formatW(installCostPerUnit)}/대
            {salesFeePerUnit > 0 ? ` · 영업 ${formatW(salesFeePerUnit)}/대` : ""}
          </div>
          <ComparisonTable
            rows={capComparison.map((r) => ({ key: r.cap, isCurrent: r.cap === capacity, ...r }))}
            targetMarginRate={targetMarginRate}
          />
        </Section>
      </div>

      {/* 제조사별 비교 */}
      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <Section title="제조사별 비교" accent="#c084fc">
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "12px" }}>
            {capacity} · {units}대 · 설치비 {formatW(installCostPerUnit)}/대
          </div>
          <ComparisonTable
            rows={brandComparison.map((r) => ({ key: r.brand, isCurrent: r.brand === brand, ...r }))}
            targetMarginRate={targetMarginRate}
            accentColor="#c084fc"
          />
        </Section>
      </div>

      {/* 설치비 시나리오 비교 */}
      <div
        style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <Section title="설치비 시나리오 비교" accent="#fbbf24">
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "12px" }}>
            {capacity} · {brand} · {units}대 기준 · 순이익 = 마진 + 컨설팅비
          </div>
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
                  {["설치비/대", "총원가", "마진", "마진율", "순이익"].map((h) => (
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
                {[-50, -30, -10, 0, 10, 30, 50].map((delta) => {
                  const ic = installCostPerUnit + delta;
                  if (ic < 0) return null;
                  const r = calcSite({ ...coreParams, installCostPerUnit: ic });
                  const isBase = delta === 0;
                  const rowColor =
                    r.marginRate >= targetMarginRate
                      ? "#4ade80"
                      : r.marginRate >= 5
                      ? "#fbbf24"
                      : "#f87171";
                  return (
                    <tr
                      key={delta}
                      style={{ borderBottom: "1px solid #222", background: isBase ? "#4ade8010" : "transparent" }}
                    >
                      <td style={{ ...tdStyle, color: isBase ? "#fff" : "#ccc" }}>
                        {formatW(ic)}
                        {isBase ? " ◀" : ""}
                      </td>
                      <td style={tdStyle}>{formatW(r.totalCost)}</td>
                      <td style={{ ...tdStyle, color: rowColor, fontWeight: 700 }}>{formatW(r.margin)}</td>
                      <td style={{ ...tdStyle, color: rowColor }}>{r.marginRate.toFixed(1)}%</td>
                      <td style={tdStyle}>{formatW(r.netIncome)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </>
  );
}
