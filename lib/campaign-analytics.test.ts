import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CAMPAIGN_ANALYTICS_KEY, logCampaignEvent } from './campaign-analytics';
describe('Week 15 campaign analytics', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
  afterEach(() => { localStorage.clear(); sessionStorage.clear(); });
  it('records the four allowed events with only safe categorical metadata', () => {
    logCampaignEvent('campaign_asset_viewed','launch','A','A1'); logCampaignEvent('campaign_cta_clicked','launch','B','B1'); logCampaignEvent('quick_check_from_campaign_started','quick-check','C','C1'); logCampaignEvent('venture_page_viewed','launch');
    const events=JSON.parse(localStorage.getItem(CAMPAIGN_ANALYTICS_KEY)!);
    expect(events.map((e:{name:string})=>e.name)).toEqual(['campaign_asset_viewed','campaign_cta_clicked','quick_check_from_campaign_started','venture_page_viewed']);
    expect(events.every((e:Record<string,unknown>)=>Object.keys(e).every(k=>['name','timestamp','sessionId','route','seriesId','assetId'].includes(k)))).toBe(true);
  });
  it('rejects unallowlisted asset ids, series, routes, and unpaired identifiers', () => {
    logCampaignEvent('campaign_asset_viewed','launch','A','A2'); logCampaignEvent('campaign_asset_viewed','launch','D','A1'); logCampaignEvent('campaign_asset_viewed','pricing','A','A1'); logCampaignEvent('campaign_asset_viewed','launch','A');
    expect(localStorage.getItem(CAMPAIGN_ANALYTICS_KEY)).toBeNull();
  });
  it('never records financial or identity data and labels click as intent only', () => {
    logCampaignEvent('campaign_cta_clicked','launch','A','A1'); const raw=localStorage.getItem(CAMPAIGN_ANALYTICS_KEY)!;
    expect(raw).toContain('campaign_cta_clicked'); expect(raw).not.toMatch(/999|11988|income|expense|email|conversion|adoption/i);
  });
});
