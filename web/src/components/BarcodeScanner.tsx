import { useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
export default function BarcodeScanner({ onResult, onClose }:{ onResult:(code:string)=>void; onClose:()=>void }){
  const videoRef=useRef<HTMLVideoElement|null>(null)
  useEffect(()=>{const reader=new BrowserMultiFormatReader(); let active=true; (async()=>{try{const devices=await BrowserMultiFormatReader.listVideoInputDevices(); const deviceId=devices[0]?.deviceId; if(!deviceId||!videoRef.current)return; await reader.decodeFromVideoDevice(deviceId, videoRef.current, (res)=>{ if(res&&active){ active=false; reader.reset(); onResult(res.getText()) } })}catch(e){console.error(e)}})(); return()=>{active=false; reader.reset()}},[])
  return (<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',zIndex:1000}}><div style={{maxWidth:720,margin:'3rem auto',background:'#111623',padding:12,borderRadius:12}}><video ref={videoRef} style={{width:'100%',borderRadius:8}}/><div style={{display:'flex',justifyContent:'space-between',marginTop:8}}><span>Aponta a câmara para o código…</span><button onClick={onClose}>Fechar</button></div></div></div>) }
