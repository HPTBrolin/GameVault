export default function Skeleton({ h=120, w='100%', r=12, style }: { h?: number; w?: number|string; r?: number; style?: any }){
  return <div className="skel" style={{ height:h, width:w, borderRadius:r, ...style }} />
}
