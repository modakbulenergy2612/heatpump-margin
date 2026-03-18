import { MOTHER_FEE_RATE, SUBSIDY_RATE } from "./constants";

export function getConsultingFee(bizTotal) {
  return bizTotal >= 3000 ? 150 : bizTotal >= 1000 ? 100 : 50;
}

/**
 * 핵심 마진 계산 순수 함수
 *
 * includeExtrasInBiz: 부대비용을 공사비(사업비)에 포함할 경우
 *   - 마더피 5% · 보증료: (사업비+부대) 전체 기준 (증가)
 *   - 보조금 70%: 전체 공사비 대상이므로 고객 자부담에 부대 미포함
 *   - 컨설팅비: 항상 원래 사업비 기준 (변동 없음)
 *   - 부대비용 자체에서 마진은 남기지 않음 (상쇄 처리)
 */
export function calcSite({
  bizCost,
  capacity,
  units,
  brand,
  products,
  installCostPerUnit,
  volumeDiscount,
  salesFeePerUnit,
  warrantyRate,
  warrantyFeeRate,
  warrantyYears,
  targetMarginRate,
  extraCost,
  includeExtrasInBiz,
}) {
  const baseBiz = (bizCost[capacity] || 0) * units;
  const totalBiz = includeExtrasInBiz ? baseBiz + extraCost : baseBiz;
  const motherFee = Math.round(totalBiz * MOTHER_FEE_RATE);
  const consulting = getConsultingFee(baseBiz); // 항상 원래 사업비 기준

  const productCost = (products[brand]?.[capacity] || 0) * units;
  const effectiveInstall = Math.max(0, installCostPerUnit - (units > 1 ? volumeDiscount : 0));
  const totalInstall = effectiveInstall * units;
  const totalSalesFee = (salesFeePerUnit || 0) * units;
  const warrantyBondAmount = totalBiz * ((warrantyRate || 0) / 100);
  const warrantyFee = Math.round(warrantyBondAmount * ((warrantyFeeRate || 0) / 100) * (warrantyYears || 0));

  const extraInCost = includeExtrasInBiz ? extraCost : 0;
  const totalCost = motherFee + productCost + totalInstall + totalSalesFee + warrantyFee + extraInCost;
  const margin = totalBiz - totalCost;
  const marginRate = totalBiz > 0 ? (margin / totalBiz) * 100 : 0;
  const netIncome = margin + consulting;

  const subsidy = Math.round(totalBiz * SUBSIDY_RATE);
  const customerBizBurden = totalBiz - subsidy;
  const customerExtraBurden = includeExtrasInBiz ? 0 : extraCost;

  const targetMargin = totalBiz * (targetMarginRate / 100);
  const maxInstallTotal =
    totalBiz - motherFee - productCost - totalSalesFee - warrantyFee - extraInCost - targetMargin;
  const maxInstallPerUnit = units > 0 ? Math.floor(maxInstallTotal / units) : 0;

  return {
    baseBiz,
    totalBiz,
    motherFee,
    productCost,
    effectiveInstall,
    totalInstall,
    totalSalesFee,
    warrantyBondAmount,
    warrantyFee,
    totalCost,
    margin,
    marginRate,
    consulting,
    netIncome,
    subsidy,
    customerBizBurden,
    customerExtraBurden,
    maxInstallPerUnit,
    targetMargin,
    extraInCost,
  };
}
