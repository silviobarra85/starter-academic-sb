/* V561 - Calciomercato feed disattivato.
   La funzione resta pubblicata per compatibilita' con eventuali URL/call legacy,
   ma non recupera piu' articoli da siti esterni e non legge archivi statici. */

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=900, stale-while-revalidate=1800'
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async () => jsonResponse(200, {
  version: 'V561',
  sourceMode: 'disabled-v561',
  generatedAt: new Date().toISOString(),
  sources: [],
  warnings: ['Calciomercato disattivato in V561: nessun recupero da siti esterni eseguito.'],
  feedRange: {
    earliest: '',
    latest: '',
    totalBeforeDateRange: 0,
    totalFetched: 0
  },
  articles: []
});
