import React from "react";

type Props = {
  onUpdateAll?: ()=>void;
  onSync?: ()=>void;
  children?: React.ReactNode;
};
export default function ToolbarRow({ onUpdateAll, onSync, children }: Props){
  return (
    <div className="gv-toolbar">
      <div className="left">
        <button className="btn" onClick={onUpdateAll}>⟳ Update All</button>
        <button className="btn" onClick={onSync}>📡 Provider Sync</button>
      </div>
      <div className="right">{children}</div>
    </div>
  );
}
