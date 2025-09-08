Hotfix: jogos vazios e "Carregar mais" a incrementar infinito
-------------------------------------------------------------
1) Este ZIP substitui `web/src/features/games/api.ts` e passa a **normalizar o offset**.
   - Se o offset atual estiver fora do total (ex.: filtros mudaram), o backend devolve items=[].
   - Agora a função volta a pedir a **1ª página** e devolve itens válidos.

2) Opcional (recomendado): ajusta o teu `loadMore` em `App.tsx` para não somar offset quando
   o backend devolve 0 itens. Copia o snippet `web/snippets/App_loadMore_fix.ts.txt`.

Resultado esperado:
- A grelha deixa de ficar vazia com "página 4 de 1".
- O botão "Carregar mais" desativa quando chegar ao fim.
