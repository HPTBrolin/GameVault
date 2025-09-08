from fastapi import APIRouter

router = APIRouter(tags=["sync"])

@router.post("/sync/update_all")
async def update_all():
  # Plug your real job here
  return {"ok": True}

@router.post("/providers/sync")
async def providers_sync():
  # Plug your real provider sync here
  return {"ok": True}
