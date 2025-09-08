import httpx,re,asyncio
THING_URL='https://boardgamegeek.com/xmlapi2/thing'
def _first_tag(text,tag):
    m=re.search(rf'<{tag}>(.*?)</{tag}>',text,re.S); return m.group(1) if m else None
async def _fetch_thumb(client,id_):
    r=await client.get(THING_URL, params={'id':id_}); r.raise_for_status(); xml=r.text
    return _first_tag(xml,'thumbnail') or _first_tag(xml,'image')
async def search(query:str)->list[dict]:
    async with httpx.AsyncClient(timeout=20) as client:
        r=await client.get('https://boardgamegeek.com/xmlapi2/search', params={'query':query,'type':'boardgame'}); r.raise_for_status(); xml=r.text
        items=re.findall(r'<item type="boardgame" id="(\d+)">.*?<name type="primary" value="(.*?)"',xml,re.S)
        top=items[:18]; thumbs=await asyncio.gather(*[_fetch_thumb(client,i) for i,_ in top], return_exceptions=True)
    out=[]; import types
    for (i,name),th in zip(top,thumbs):
        out.append({'slug':f'bgg-{i}','title':name,'release_date':None,'platforms':[],'cover_url':(None if isinstance(th,Exception) else th),'source':'bgg'})
    return out
