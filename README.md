# RILMIA — SOLUZIONE FINALE

Questa versione usa un bridge Apps Script robusto basato su:
- HtmlService
- iframe nascosto
- window.top.postMessage
- google.script.run
- cattura della vera finestra interna googleusercontent

Non usa ContentService/JSONP per il sito.

Backend:
https://script.google.com/macros/s/AKfycbxsMFN6wtDQnZLeILydhGnTCQIdBZ5mix4perwW59-XrvgP5bIa4fxM4Z-cCzrNdbBt/exec

Prima aggiorna Apps Script con:
RILMIA_APPS_SCRIPT_SOLUZIONE_FINALE.zip

Poi carica questi file GitHub.

Test:
https://facaxa10-sketch.github.io/rilmia/diagnostica.html?final=2

Risultato atteso:
OK — bridge Apps Script inizializzato

e JSON con:
Torino in rilievo
