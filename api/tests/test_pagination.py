from fastapi.testclient import TestClient
from app.main import app

def test_paged_ok():
    c = TestClient(app)
    r = c.get('/games/paged?offset=0&limit=5')
    assert r.status_code == 200
    body = r.json()
    assert set(body.keys()) >= {'items','total','limit','offset'}
    assert isinstance(body['total'], int)
    assert isinstance(body['items'], list)
    assert body['limit'] == 5
