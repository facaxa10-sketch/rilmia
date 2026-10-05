# RILMIA — versione autocontenuta

Questa versione elimina completamente i problemi di percorsi degli asset.

Carica nella radice del repository GitHub ESCLUSIVAMENTE:

- index.html
- prodotto.html
- privacy.html
- unsubscribe.html
- 404.html
- diagnostica.html
- .nojekyll

CSS, JavaScript, logo RILMIA, scritta RILMIA e favicon sono già incorporati
direttamente dentro le pagine HTML.

Non servono:
- assets/
- style.css
- config.js
- api.js
- altri file .js
- favicon.png
- file logo separati

Dopo il caricamento:
1. elimina dal repository i vecchi CSS/JS/PNG, per evitare confusione;
2. attendi il nuovo deployment GitHub Pages;
3. apri:
   https://facaxa10-sketch.github.io/rilmia/diagnostica.html
4. fai Ctrl+F5.

La diagnostica deve mostrare:
- OK — configurazione presente
- OK — API presente nella pagina
- JSON con il prodotto Torino in rilievo

Il sito usa già il deployment Apps Script:
https://script.google.com/macros/s/AKfycbxsMFN6wtDQnZLeILydhGnTCQIdBZ5mix4perwW59-XrvgP5bIa4fxM4Z-cCzrNdbBt/exec


Backend attuale:
https://script.google.com/macros/s/AKfycbxsMFN6wtDQnZLeILydhGnTCQIdBZ5mix4perwW59-XrvgP5bIa4fxM4Z-cCzrNdbBt/exec
