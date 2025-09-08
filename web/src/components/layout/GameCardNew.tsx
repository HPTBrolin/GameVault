import React from "react";

export type CardGame = {
  id:number;
  title:string;
  platform?:string|null;
  cover_url?:string|null;
  status?:string; // owned, wishlist, etc.
};

type Props = {
  game: CardGame;
  onClick?: ()=>void;
};

export default function GameCardNew({ game, onClick }: Props){
  const status = game.status || "owned";
  return (
    <div className="gv-card" onClick={onClick}>
      <div className={"ribbon "+status} />
      <div className="thumb">
        {game.cover_url ? <img src={game.cover_url} alt={game.title}/> : <div className="ph" />}
      </div>
      <div className="meta">
        <div className="title" title={game.title}>{game.title}</div>
        <div className="sub">{game.platform || "—"}</div>
      </div>
    </div>
  );
}
