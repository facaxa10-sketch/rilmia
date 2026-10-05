# RILMIA — Bridge v1

Questa versione NON usa più JSONP per leggere Google Apps Script.

Tutte le richieste, comprese:
- getHome
- getProducts
- getProduct
- subscribe
- unsubscribe
- futura area admin

passano attraverso l'iframe Bridge di Apps Script e `google.script.run`.

Prima di testare verifica nelle Script Properties di Apps Script:

SITE_URL
https://facaxa10-sketch.github.io/rilmia

ALLOWED_ORIGINS
https://facaxa10-sketch.github.io

Poi apri:
https://facaxa10-sketch.github.io/rilmia/diagnostica.html?bridge=v1

Se funziona deve comparire il JSON con "Torino in rilievo".
