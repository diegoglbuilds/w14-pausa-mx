export const ANALYTICS_KEY='pausa-mx:w14:events';
export const EVENT_NAMES=['pricing_viewed','tier_free_viewed','tier_plus_viewed','tier_partner_viewed','simulator_started','simulator_completed','scenario_saved','scenario_deleted','plus_cta_clicked','partner_cta_clicked','ten_to_one_memo_viewed'] as const;
export type EventName=typeof EVENT_NAMES[number];
type SafeCategory=string|boolean;
export function logEvent(name:EventName,screen:string,metadata:Record<string,SafeCategory>={}){
  if(typeof window==='undefined')return;
  try {
    const sessionId=getSessionId(); const safeMetadata=Object.fromEntries(Object.entries(metadata).filter(([key,value])=>/^(tier|scenario_count|valid|source)$/.test(key)&&['string','number','boolean'].includes(typeof value)));
    const event={name,timestamp:new Date().toISOString(),sessionId,screen,metadata:safeMetadata};
    const prior=JSON.parse(window.localStorage.getItem(ANALYTICS_KEY)||'[]');
    const events=Array.isArray(prior)?prior.slice(-499):[]; events.push(event);
    window.localStorage.setItem(ANALYTICS_KEY,JSON.stringify(events));
  }catch{/* Storage can be disabled; product flow stays available. */}
}
function getSessionId(){let id=sessionStorage.getItem('pausa-mx:w14:session');if(!id){id=`s-${Math.random().toString(36).slice(2,12)}`;sessionStorage.setItem('pausa-mx:w14:session',id);}return id;}
