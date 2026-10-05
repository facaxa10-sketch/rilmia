# RILMIA — Fase 2
## Sito pubblico statico per GitHub Pages

Il sito è già configurato con questo Apps Script:

`https://script.google.com/macros/s/AKfycbxpstta-IPKTsCfPFCd_gz6tDozQT1Y1ZQXSO4klVCf-EoifDDIz3c9u5u9SpzESmj2/exec`

Non sono presenti framework, build step, carrello o pagamenti.

## File inclusi

- `index.html`
- `prodotto.html`
- `privacy.html`
- `unsubscribe.html`
- `404.html`
- `.nojekyll`
- `assets/css/style.css`
- `assets/js/config.js`
- `assets/js/api.js`
- `assets/js/common.js`
- `assets/js/analytics.js`
- `assets/js/home.js`
- `assets/js/product.js`
- `assets/js/subscribe.js`
- `assets/js/unsubscribe.js`
- `assets/img/rilmia-logo.png`

---


## Logo e scritta RILMIA

Questa versione integra direttamente l'identità approvata:

- `assets/img/rilmia-symbol.png` — simbolo RILMIA;
- `assets/img/rilmia-wordmark.png` — scritta RILMIA elegante;
- `assets/img/favicon.png` — favicon ricavata dal simbolo.

Simbolo e scritta sono separati, quindi possono essere ridimensionati
correttamente su desktop e mobile. Nel sito ricevono una finitura bronzo
con ombre leggere per richiamare il rilievo 3D del mockup approvato.


## Prima cosa da controllare: ALLOWED_ORIGINS

Il Bridge Apps Script accetta richieste solo dal dominio autorizzato.

Quando avrai l'URL GitHub Pages, per esempio:

`https://tuousername.github.io/rilmia/`

nell'Apps Script devi avere nelle Script Properties:

`SITE_URL = https://tuousername.github.io/rilmia`

`ALLOWED_ORIGINS = https://tuousername.github.io`

IMPORTANTE:
`ALLOWED_ORIGINS` deve contenere soltanto schema + dominio, senza `/rilmia`.

Dopo aver modificato proprietà o codice Apps Script, aggiorna il deployment
se necessario.

---

## Pubblicazione GitHub Pages

### 1. Crea repository

Su GitHub crea un nuovo repository, ad esempio:

`rilmia`

Può essere pubblico.

### 2. Carica i file

Carica **il contenuto della cartella**, non la cartella esterna.

La radice del repository deve apparire così:

```text
rilmia/
├── index.html
├── prodotto.html
├── privacy.html
├── unsubscribe.html
├── 404.html
├── .nojekyll
└── assets/
```

### 3. Attiva GitHub Pages

Repository:

`Settings → Pages`

Imposta:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

Salva.

Dopo qualche minuto GitHub mostrerà un URL tipo:

`https://USERNAME.github.io/rilmia/`

### 4. Aggiorna Apps Script

Torna nelle Script Properties del backend.

Inserisci l'URL reale:

`SITE_URL = https://USERNAME.github.io/rilmia`

e:

`ALLOWED_ORIGINS = https://USERNAME.github.io`

Se usi in seguito un dominio personalizzato, aggiungi anche quello
separato da virgola.

Esempio:

`https://USERNAME.github.io,https://rilmia.it,https://www.rilmia.it`

### 5. Test

Apri la home GitHub Pages.

Controlla:

1. la home si apre;
2. la sezione prodotti termina di mostrare gli skeleton;
3. eventuali prodotti visibili nel foglio `Prodotti` appaiono;
4. cliccando su un prodotto si apre `prodotto.html?slug=...`;
5. il pulsante `Lo comprerei, avvisami quando esce` apre il modulo;
6. un'iscrizione di prova appare in `Iscrizioni`;
7. una seconda iscrizione con stessa email allo stesso prodotto mostra
   che l'utente è già nella lista;
8. `Eventi` riceve `page_view`, `product_view` e `cta_click`.

---

## Se non hai ancora prodotti

La home mostrerà correttamente uno stato vuoto.

Fino alla fase 3 (area admin) puoi aggiungere una riga manualmente nel foglio
`Prodotti`.

Usa:

- `tipo_record`: `product`
- `id`: un valore univoco, ad esempio `prd_test_001`
- `slug`: `quadro-torino`
- `nome`: `Torino in rilievo`
- `sottotitolo`: una frase breve
- `descrizione`: descrizione completa
- `materiali`: `PLA`
- `dimensioni`: `13 × 13 cm`
- `prezzo`: `59.90`
- `stato`: `in_arrivo`
- `foto_cover`: URL immagine oppure lascia vuoto
- `foto_gallery`: `[]`
- `visibile`: `TRUE`
- `ordine`: `1`
- `created_at`: puoi lasciarlo vuoto per questo test manuale
- `updated_at`: puoi lasciarlo vuoto per questo test manuale
- `config_json`: vuoto

Non modificare la riga `tipo_record=home`.

---

## Privacy

La pagina inclusa descrive il funzionamento tecnico attuale del prototipo.
Prima di un lancio pubblico definitivo è consigliabile inserire i dati reali
del titolare/contatto privacy e verificare l'informativa in base alla situazione
giuridica effettiva di RILMIA.

Il valore `PRIVACY_EMAIL` si trova in:

`assets/js/config.js`

Attualmente è impostato a:

`privacy@rilmia.it`

Sostituiscilo quando hai definito l'indirizzo effettivo.

---

## Come funziona il collegamento API

GitHub Pages carica un iframe invisibile:

`https://script.google.com/macros/s/AKfycbxpstta-IPKTsCfPFCd_gz6tDozQT1Y1ZQXSO4klVCf-EoifDDIz3c9u5u9SpzESmj2/exec?bridge=1`

Il sito invia richieste con `postMessage`.

Il Bridge:
1. verifica che il sito chiamante sia in `ALLOWED_ORIGINS`;
2. chiama Apps Script con `google.script.run`;
3. restituisce la risposta al sito.

In questo modo non mettiamo password nel frontend e non dipendiamo dagli
header CORS di Apps Script.

---

## Test locale

Il bridge blocca origini non autorizzate.

Se vuoi testare in locale con VS Code Live Server, aggiungi temporaneamente:

`http://127.0.0.1:5500`

o:

`http://localhost:5500`

a `ALLOWED_ORIGINS`.

Esempio:

`https://USERNAME.github.io,http://127.0.0.1:5500`

Ricordati di rimuovere l'origine locale quando non serve più.

Non aprire semplicemente `index.html` con `file://`: l'origine non sarebbe
adatta al controllo del bridge.

---

## Fase successiva

La fase 3 aggiungerà `/admin` con:

- login server-side;
- dashboard;
- statistiche;
- iscritti e filtri;
- export CSV;
- editor home;
- CRUD prodotti;
- upload immagini;
- mostra/nascondi;
- invio avviso agli iscritti.


## Correzione lettura prodotti

Questa versione usa JSONP per le sole letture pubbliche:

- `getHome`
- `getProducts`
- `getProduct`

Per questo motivo i prodotti possono essere visualizzati anche aprendo il sito
in locale.

Le operazioni che modificano dati (`subscribe`, `unsubscribe`, analytics e
futura area admin) continuano invece a usare il bridge sicuro e richiedono
un'origine presente in `ALLOWED_ORIGINS`.

È inclusa anche `diagnostica.html`: aprendola puoi vedere direttamente la
risposta `getProducts` restituita dal backend.


# VERSIONE FLAT — IMPORTANTE

Questa versione NON usa la cartella `assets`.

Carica TUTTI i file direttamente nella radice del repository GitHub.

La radice deve apparire così:

index.html
prodotto.html
privacy.html
unsubscribe.html
404.html
diagnostica.html
style.css
config.js
api.js
common.js
analytics.js
home.js
product.js
subscribe.js
unsubscribe.js
rilmia-symbol.png
rilmia-wordmark.png
rilmia-logo.png
favicon.png

NON creare cartelle e NON cambiare i nomi.

Test:
1. pubblica GitHub Pages;
2. apri /diagnostica.html;
3. devono comparire:
   - OK — config.js caricato
   - OK — api.js caricato
   - JSON con Torino in rilievo.
