
import { useEffect } from 'react'
export default function useInfiniteScroll(cb:()=>void){
  useEffect(()=>{
    const el = document.getElementById('sentinel')
    if(!el) return
    const io = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting) cb()
    })
    io.observe(el)
    return ()=>io.disconnect()
  }, [cb])
}
