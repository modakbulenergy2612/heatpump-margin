export const CAPACITIES = ["16kW", "25kW", "35kW"];
export const CAP_NUM = { "16kW": 16, "25kW": 25, "35kW": 35 };

export const DEFAULT_BIZ_COST = { "16kW": 700, "25kW": 1000, "35kW": 1200 };

export const DEFAULT_PRODUCTS = {
  LG: { "16kW": 410, "25kW": 540, "35kW": 620 },
  캐리어: { "16kW": 380, "25kW": 500, "35kW": 580 },
};

export const MOTHER_FEE_RATE = 0.05;
export const SUBSIDY_RATE = 0.7;

export const TANK_OPTIONS = [
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

export const COIL_OPTIONS = [
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

export const HEATER_OPTIONS = [
  { label: "없음", price: 0 },
  { label: "5kW~15kW", price: 385000 },
  { label: "20kW~30kW", price: 440000 },
];
