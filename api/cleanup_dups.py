import sqlite3
con=sqlite3.connect("games.db")
cur=con.cursor()
dups=list(cur.execute(
    "SELECT slug, COALESCE(platform,''), COUNT(*) "
    "FROM game GROUP BY 1,2 HAVING COUNT(*)>1"
))
print("Duplicados:", dups)
for slug, platform, _ in dups:
    ids=[r[0] for r in cur.execute(
        "SELECT id FROM game WHERE slug=? AND COALESCE(platform,'')=? ORDER BY id DESC",
        (slug, platform)
    )]
    for id_ in ids[1:]:  # mantém o mais recente
        cur.execute("DELETE FROM game WHERE id=?", (id_,))
con.commit()
print("Limpos:", len(dups))
