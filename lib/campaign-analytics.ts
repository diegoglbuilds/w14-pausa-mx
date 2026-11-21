export const CAMPAIGN_ANALYTICS_KEY = 'pausa-mx:w15:campaign-events';
export const CAMPAIGN_EVENT_NAMES = [
  'campaign_asset_viewed',
  'campaign_cta_clicked',
  'quick_check_from_campaign_started',
  'venture_page_viewed',
] as const;
export type CampaignEventName = typeof CAMPAIGN_EVENT_NAMES[number];
export type SeriesId = 'A' | 'B' | 'C';
export type AssetId = 'A1' | 'B1' | 'C1';
const SERIES = new Set<SeriesId>(['A', 'B', 'C']);
const ASSETS = new Set<AssetId>(['A1', 'B1', 'C1']);
const ROUTES = new Set(['launch', 'quick-check']);

export function logCampaignEvent(name: CampaignEventName, route: string, seriesId?: string, assetId?: string) {
  if (typeof window === 'undefined' || !CAMPAIGN_EVENT_NAMES.includes(name) || !ROUTES.has(route)) return;
  if (seriesId !== undefined && !SERIES.has(seriesId as SeriesId)) return;
  if (assetId !== undefined && !ASSETS.has(assetId as AssetId)) return;
  if ((seriesId === undefined) !== (assetId === undefined)) return;
  try {
    let sessionId = sessionStorage.getItem('pausa-mx:w15:anonymous-session');
    if (!sessionId) {
      sessionId = `s-${Math.random().toString(36).slice(2, 12)}`;
      sessionStorage.setItem('pausa-mx:w15:anonymous-session', sessionId);
    }
    const event = { name, timestamp: new Date().toISOString(), sessionId, route, ...(seriesId ? { seriesId, assetId } : {}) };
    const previous: unknown = JSON.parse(localStorage.getItem(CAMPAIGN_ANALYTICS_KEY) || '[]');
    const events = Array.isArray(previous) ? previous.slice(-499) : [];
    events.push(event);
    localStorage.setItem(CAMPAIGN_ANALYTICS_KEY, JSON.stringify(events));
  } catch { /* Local analytics must never block the product. */ }
}
