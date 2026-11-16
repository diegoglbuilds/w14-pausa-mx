import {describe,it,expect} from 'vitest';
import {calculateProjection,DEFAULT_INPUT,simulatorInputSchema} from './finance';
describe('deterministic revenue simulator',()=>{
  it('calculates base and lower conversion downside with consistent rounding',()=>{const r=calculateProjection(DEFAULT_INPUT);expect(r.base.paidUsers).toBe(15);expect(r.base.monthlyRevenue).toBe(885);expect(r.base.annualRevenue).toBe(r.base.monthlyRevenue*12);expect(r.base.monthlyVariableCost).toBe(150);expect(r.base.monthlyContribution).toBe(r.base.monthlyRevenue-r.base.monthlyVariableCost);expect(r.base.annualContribution).toBe(r.base.monthlyContribution*12);expect(r.downside.paidUsers).toBe(3);});
  it('handles zero users, zero conversion, and full conversion',()=>{expect(calculateProjection({...DEFAULT_INPUT,activeUsers:0}).base.paidUsers).toBe(0);expect(calculateProjection({...DEFAULT_INPUT,conversionPct:0}).base.monthlyRevenue).toBe(0);expect(calculateProjection({...DEFAULT_INPUT,conversionPct:100}).base.paidUsers).toBe(300);});
  it('rejects invalid and negative values',()=>{expect(simulatorInputSchema.safeParse({...DEFAULT_INPUT,activeUsers:NaN}).success).toBe(false);expect(simulatorInputSchema.safeParse({...DEFAULT_INPUT,monthlyPrice:-1}).success).toBe(false);expect(simulatorInputSchema.safeParse({...DEFAULT_INPUT,conversionPct:101}).success).toBe(false);});
});
