import { useState, useMemo, useEffect } from "react";
import {
  DEFAULT_BIZ_COST, DEFAULT_PRODUCTS,
  TANK_OPTIONS, COIL_OPTIONS, HEATER_OPTIONS,
} from "./lib/constants";
import { exVatMan } from "./lib/format";
import { calcSite } from "./lib/calc";
import SettingsPanel from "./components/SettingsPanel";
import InputPanel from "./components/InputPanel";
import ResultPanel from "./components/ResultPanel";

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [bizCost, setBizCost] = useState(DEFAULT_BIZ_COST);
  const [brand, setBrand] = useState("LG");
  const [capacity, setCapacity] = useState("25kW");
  const [units, setUnits] = useState(1);
  const [installCostPerUnit, setInstallCostPerUnit] = useState(400);
  const [volumeDiscount, setVolumeDiscount] = useState(0);
  const [salesFeePerUnit, setSalesFeePerUnit] = useState(150);
  const [targetMarginRate, setTargetMarginRate] = useState(10);
  const [showSettings, setShowSettings] = useState(false);
  const [warrantyRate, setWarrantyRate] = useState(5);
  const [warrantyFeeRate, setWarrantyFeeRate] = useState(0.5);
  const [warrantyYears, setWarrantyYears] = useState(3);

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

  useEffect(() => {
    setInstallCostPerUnit(units >= 2 ? 350 : 400);
  }, [units]);

  const coreParams = {
    bizCost, capacity, units, brand, products,
    installCostPerUnit, volumeDiscount, salesFeePerUnit,
    warrantyRate, warrantyFeeRate, warrantyYears, targetMarginRate,
    extraCost: totalExtraCost, includeExtrasInBiz,
  };

  const calc = useMemo(
    () => calcSite(coreParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bizCost, capacity, units, brand, products, installCostPerUnit, volumeDiscount,
      salesFeePerUnit, warrantyRate, warrantyFeeRate, warrantyYears, targetMarginRate,
      totalExtraCost, includeExtrasInBiz]
  );

  const extraItems = [
    ...(tankTotal > 0 ? [{ label: `축열탱크 ×${tankQty}`, value: tankTotal }] : []),
    ...(coilTotal > 0 ? [{ label: `온수코일 ×${coilQty}`, value: coilTotal }] : []),
    ...(heaterTotal > 0 ? [{ label: `보조히터 ×${heaterQty}`, value: heaterTotal }] : []),
    ...(costFacilityCharge > 0 ? [{ label: "설비부담금", value: costFacilityCharge }] : []),
    ...(costElecWork > 0 ? [{ label: "전기공사비", value: costElecWork }] : []),
    ...(costEtc > 0 ? [{ label: "기타", value: costEtc }] : []),
  ];

  return (
    <div
      style={{
        fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        background: "#0f0f0f",
        color: "#e0e0e0",
        minHeight: "100vh",
        padding: "32px 16px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div
              style={{
                width: "8px",
                height: "32px",
                background: "#4ade80",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 800,
                margin: 0,
                color: "#fff",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              시공 현장 마진 시뮬레이터
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "#666", margin: "4px 0 0 20px" }}>
            모닥불에너지 · 설치비 협의 기준 산출
          </p>
        </div>

        {/* 기준값 설정 토글 */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: "none",
              border: "1px solid #333",
              borderRadius: "6px",
              color: "#888",
              padding: "8px 14px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {showSettings ? "▾ 기준값 설정 닫기" : "▸ 기준값 설정 (사업비·제품비·보증)"}
          </button>
        </div>

        {showSettings && (
          <SettingsPanel
            bizCost={bizCost}
            products={products}
            warrantyRate={warrantyRate}
            warrantyFeeRate={warrantyFeeRate}
            warrantyYears={warrantyYears}
            onBizCostChange={(cap, v) => setBizCost((p) => ({ ...p, [cap]: v }))}
            onProductChange={(b, cap, v) => setProducts((p) => ({ ...p, [b]: { ...p[b], [cap]: v } }))}
            onWarrantyRateChange={setWarrantyRate}
            onWarrantyFeeRateChange={setWarrantyFeeRate}
            onWarrantyYearsChange={setWarrantyYears}
          />
        )}

        <InputPanel
          brand={brand}
          capacity={capacity}
          units={units}
          installCostPerUnit={installCostPerUnit}
          volumeDiscount={volumeDiscount}
          salesFeePerUnit={salesFeePerUnit}
          targetMarginRate={targetMarginRate}
          tankIdx={tankIdx} tankQty={tankQty}
          coilIdx={coilIdx} coilQty={coilQty}
          heaterIdx={heaterIdx} heaterQty={heaterQty}
          costFacilityCharge={costFacilityCharge}
          costElecWork={costElecWork}
          costEtc={costEtc}
          includeExtrasInBiz={includeExtrasInBiz}
          totalExtraCost={totalExtraCost}
          extraItems={extraItems}
          products={products}
          onBrandChange={setBrand}
          onCapacityChange={setCapacity}
          onUnitsChange={setUnits}
          onInstallCostChange={setInstallCostPerUnit}
          onVolumeDiscountChange={setVolumeDiscount}
          onSalesFeeChange={setSalesFeePerUnit}
          onTargetMarginRateChange={setTargetMarginRate}
          onTankIdxChange={setTankIdx} onTankQtyChange={setTankQty}
          onCoilIdxChange={setCoilIdx} onCoilQtyChange={setCoilQty}
          onHeaterIdxChange={setHeaterIdx} onHeaterQtyChange={setHeaterQty}
          onFacilityChargeChange={setCostFacilityCharge}
          onElecWorkChange={setCostElecWork}
          onEtcChange={setCostEtc}
          onIncludeExtrasChange={setIncludeExtrasInBiz}
        />

        <ResultPanel
          calc={calc}
          coreParams={coreParams}
          capacity={capacity}
          brand={brand}
          units={units}
          installCostPerUnit={installCostPerUnit}
          salesFeePerUnit={salesFeePerUnit}
          targetMarginRate={targetMarginRate}
          products={products}
          totalExtraCost={totalExtraCost}
          includeExtrasInBiz={includeExtrasInBiz}
          equipTotal={equipTotal}
          powerTotal={powerTotal}
          costEtc={costEtc}
          warrantyFeeRate={warrantyFeeRate}
          warrantyYears={warrantyYears}
        />

        <div style={{ textAlign: "center", fontSize: "11px", color: "#444", marginTop: "24px" }}>
          모닥불에너지 · 시공현장 내부용
        </div>
      </div>
    </div>
  );
}
