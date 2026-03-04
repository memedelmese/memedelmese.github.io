# 🏆 Meme del Mese

Archivio ufficiale dei meme del mese. Un meme al mese, ogni mese.

**Live:** [memedelmese.github.io](https://memedelmese.github.io)

---

## Come aggiungere un nuovo mese

### In 5 passi:

1. **Prepara l'immagine**
   Salva il meme vincitore come `winner.gif` (o `winner.png`).

2. **Crea la cartella**
   Crea la cartella `assets/YYYY-MM/` (es. `assets/2025-10/`) e metti il file dentro.
   ```
   assets/
   └── 2025-10/
       └── winner.gif
   ```

3. **Aggiorna `data/memes.json`**
   Aggiungi un nuovo oggetto all'array:
   ```json
   {
     "year": 2025,
     "month": 10,
     "title": "Ottobre 2025",
     "file": "assets/2025-10/winner.gif",
     "alt": "Meme del mese - Ottobre 2025",
     "notes": "Didascalia opzionale"
   }
   ```

4. **Commit e push**
   ```bash
   git add assets/2025-10/ data/memes.json
   git commit -m "Aggiunge meme di Ottobre 2025"
   git push
   ```

5. **Verifica**
   Vai su [memedelmese.github.io](https://memedelmese.github.io) e controlla che il nuovo mese sia attivo nella griglia.

---

## Struttura del progetto

```
/
├── index.html          # Pagina principale
├── 404.html            # Pagina 404
├── .nojekyll           # Disabilita Jekyll su GitHub Pages
├── css/styles.css      # Stile vaporwave
├── js/app.js           # Logica e routing
├── data/memes.json     # Database dei meme
└── assets/
    ├── 2022-07/winner.png
    ├── 2023-01/winner.png
    ├── ...
    └── 2025-09/winner.gif
```

## Easter eggs 🥚

Ce ne sono almeno 5. Buona caccia.
