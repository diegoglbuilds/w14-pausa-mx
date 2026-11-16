import { z } from 'zod';
import { simulatorInputSchema, type SimulatorInput } from './finance';
export const SCENARIO_KEY = 'pausa-mx:w14:scenarios';
const scenarioSchema = z.object({id:z.string().min(1).max(80),name:z.string().trim().min(1).max(40),input:simulatorInputSchema});
export type Scenario = z.infer<typeof scenarioSchema>;
export function readScenarios(storage:Pick<Storage,'getItem'>):Scenario[] {
  try { const raw=storage.getItem(SCENARIO_KEY); if(!raw)return []; const parsed=JSON.parse(raw); if(!Array.isArray(parsed))return []; return parsed.map(item=>scenarioSchema.safeParse(item)).filter((result):result is {success:true;data:Scenario}=>result.success).slice(0,3).map(result=>result.data); } catch { return []; }
}
export function saveScenario(storage:Pick<Storage,'getItem'|'setItem'>,name:string,input:SimulatorInput):Scenario[] {
  const safeName=name.trim(); if(!safeName || safeName.length>40) throw new Error('El nombre debe tener entre 1 y 40 caracteres.');
  const parsedInput=simulatorInputSchema.parse(input); const previous=readScenarios(storage);
  if(previous.length>=3) throw new Error('El plan Free permite hasta 3 escenarios locales. Elimina uno para guardar otro.');
  const scenario:Scenario={id:makeId(),name:safeName,input:parsedInput}; const next=[...previous,scenario];
  storage.setItem(SCENARIO_KEY,JSON.stringify(next)); return next;
}
export function deleteScenario(storage:Pick<Storage,'getItem'|'setItem'>,id:string):Scenario[] { const next=readScenarios(storage).filter(item=>item.id!==id); storage.setItem(SCENARIO_KEY,JSON.stringify(next)); return next; }
function makeId(){return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;}
