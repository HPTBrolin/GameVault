import datetime as dt
def to_date(s:str|None):
    if not s: return None
    try: return dt.datetime.strptime(s,'%Y-%m-%d').date()
    except: return None
def heartbeat(): print('[tracker] heartbeat', dt.datetime.utcnow().isoformat())
