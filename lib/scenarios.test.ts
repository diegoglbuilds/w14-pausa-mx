import {beforeEach,describe,it,expect} from 'vitest';
import {DEFAULT_INPUT} from './finance';
import {deleteScenario,readScenarios,saveScenario,SCENARIO_KEY} from './scenarios';
describe('local scenarios',()=>{beforeEach(()=>localStorage.clear());
  it('saves, loads, persists after refresh, and deletes scenarios',()=>{let items=saveScenario(localStorage,'Primero',DEFAULT_INPUT);items=saveScenario(localStorage,'Segundo',DEFAULT_INPUT);items=saveScenario(localStorage,'Tercero',DEFAULT_INPUT);expect(items).toHaveLength(3);expect(readScenarios(localStorage)[1].name).toBe('Segundo');expect(deleteScenario(localStorage,items[0].id)).toHaveLength(2);expect(readScenarios(localStorage)).toHaveLength(2);});
  it('handles corrupted or invalid local data safely',()=>{localStorage.setItem(SCENARIO_KEY,'{broken');expect(readScenarios(localStorage)).toEqual([]);localStorage.setItem(SCENARIO_KEY,JSON.stringify([{id:'x',name:'bad',input:{...DEFAULT_INPUT,monthlyPrice:-3}}]));expect(readScenarios(localStorage)).toEqual([]);});
  it('preserves valid saved scenarios when another stored entry is malformed',()=>{const good=saveScenario(localStorage,'keep me',DEFAULT_INPUT)[0];localStorage.setItem(SCENARIO_KEY,JSON.stringify([good,{id:'bad',name:'',input:{}}]));expect(readScenarios(localStorage)).toEqual([good]);});
  it('rejects a fourth free scenario and invalid names',()=>{saveScenario(localStorage,'one',DEFAULT_INPUT);saveScenario(localStorage,'two',DEFAULT_INPUT);saveScenario(localStorage,'three',DEFAULT_INPUT);expect(()=>saveScenario(localStorage,'four',DEFAULT_INPUT)).toThrow(/hasta 3/);expect(()=>saveScenario(localStorage,' ',DEFAULT_INPUT)).toThrow();});
});
