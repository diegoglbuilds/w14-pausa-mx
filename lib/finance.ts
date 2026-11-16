import { z } from 'zod';

export const simulatorInputSchema = z.object({
  activeUsers: z.number().finite().min(0).max(10_000_000),
  conversionPct: z.number().finite().min(0).max(100),
  monthlyPrice: z.number().finite().min(0).max(1_000_000),
  monthlyCost: z.number().finite().min(0).max(1_000_000),
  downsideConversionPct: z.number().finite().min(0).max(100),
});
export type SimulatorInput = z.infer<typeof simulatorInputSchema>;
export type Projection = {paidUsers:number;monthlyRevenue:number;annualRevenue:number;monthlyVariableCost:number;monthlyContribution:number;annualContribution:number;conversionPct:number};
export function calculateProjection(input: SimulatorInput): {base:Projection;downside:Projection} {
  const valid = simulatorInputSchema.parse(input);
  const project = (conversionPct:number):Projection => {
    const paidUsers = Math.round(valid.activeUsers * conversionPct / 100);
    const monthlyRevenue = roundMoney(paidUsers * valid.monthlyPrice);
    const monthlyVariableCost = roundMoney(paidUsers * valid.monthlyCost);
    const monthlyContribution = roundMoney(monthlyRevenue - monthlyVariableCost);
    return {paidUsers,monthlyRevenue,annualRevenue:roundMoney(monthlyRevenue*12),monthlyVariableCost,monthlyContribution,annualContribution:roundMoney(monthlyContribution*12),conversionPct};
  };
  return {base:project(valid.conversionPct),downside:project(valid.downsideConversionPct)};
}
export const roundMoney = (value:number) => Math.round((value + Number.EPSILON) * 100) / 100;
export const DEFAULT_INPUT: SimulatorInput = {activeUsers:300,conversionPct:5,monthlyPrice:59,monthlyCost:10,downsideConversionPct:1};
