
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type Dict = Record<string, string | undefined>

export default function useUrlState<T extends Dict>(defaults: T){
  const [params, setParams] = useSearchParams()

  const state = { ...defaults } as T
  Object.keys(defaults).forEach(k=>{
    const v = params.get(k)
    if(v !== null) (state as any)[k] = v
  })

  const setState = useCallback((patch: Partial<T>)=>{
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k,v])=>{
      if(v === undefined || v === null || v === '') next.delete(k)
      else next.set(k, String(v))
    })
    setParams(next, { replace: true })
  }, [params, setParams])

  return [state, setState] as const
}
