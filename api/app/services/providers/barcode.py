import httpx, urllib.parse
from ...config import get_settings
def _first(lst): return lst[0] if isinstance(lst,list) and lst else None
async def lookup(barcode:str)->list[dict]:
    s=get_settings()
    if not s.BARCODE_API_URL: return []
    url=s.BARCODE_API_URL.strip().lower(); params={}; headers={}
    if 'barcodelookup.com' in url: params={'barcode':barcode,'key':s.BARCODE_API_KEY or ''}
    elif 'upcitemdb.com' in url: params={'upc':barcode}
    elif 'ean-search.org' in url or 'ean-db.com' in url: params={'token':s.BARCODE_API_KEY or '','op':'barcode-lookup','ean':barcode,'format':'json'}
    else: params={'barcode':barcode,'key':s.BARCODE_API_KEY or ''}
    async with httpx.AsyncClient(timeout=20) as c:
        r=await c.get(s.BARCODE_API_URL, params=params, headers=headers); r.raise_for_status()
        data=r.json() if 'json' in r.headers.get('content-type','').lower() else {}
    items=data.get('products') or data.get('items') or data.get('results') or data.get('productlist') or []
    out=[]
    for it in items:
        title=it.get('title') or it.get('name') or it.get('product_name') or 'Unknown'
        img=_first(it.get('images')) or it.get('image') or it.get('thumbnail')
        platform=it.get('platform') or it.get('console-name') or ''
        release_date=it.get('release_date') or it.get('release-date')
        out.append({'slug': urllib.parse.quote_plus(f'{title}-{barcode}')[:80],'title':title,'platforms':[platform] if platform else [],'release_date':release_date,'cover_url':img,'barcode':barcode,'source':'barcode'})
    return out
