export type InvestmentEtf = {
    uuid: string;
    name: string;
    price?: number;
    units?: number;
    cpu?: number;
  
    distributionFrequencey: "monthly" | "quarterly";
    allocationPct?: number;
  }
  