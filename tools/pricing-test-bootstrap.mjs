// Node tests and checks load pricing.js computeEstimate(); rates live outside the public site tree.
import * as rates from "./pricing-rates-data.mjs";
globalThis.__ARC_PRICING_RATES__ = rates;
