# Grillhouse Nyhamnsläge

Webbplats (onepager) för Grillhouse – en grillrestaurang i Nyhamnsläge, Höganäs.

Statisk HTML/CSS/JS utan byggsteg. Mobilanpassad, SEO-vänlig och redo att
laddas upp direkt till webbhotell (one.com).

## Struktur

```
index.html          Hela sidan (en sida)
css/styles.css      Stilmall – färger hämtade från logotypen
js/main.js          Meny, animationer, beställningsknapp
assets/logo.jpg     Logotyp
favicon.svg         Webbplatsikon
robots.txt          För sökmotorer
sitemap.xml         Sajtkarta
site.webmanifest    PWA-manifest
```

## Att göra innan lansering (platshållare)

Sidan använder platshållare för uppgifter som inte är klara ännu. Sök i koden
och ersätt följande:

| Vad | Var |
|-----|-----|
| **Beställningslänk online** | `ORDER_URL` i `js/main.js` – sätt till riktig URL |
| **Meny, priser & rätter** | Menykorten i `index.html` (sektion `#meny`) |
| **Bilder** | Galleriet i `index.html` (sektion `#galleri`) – byt platshållarrutor mot `<img>` |
| **Öppettider** | Sektion `#oppettider` i `index.html` |
| **Adress** | `index.html` (kontakt + JSON-LD) och `#oppettider` (karta) |
| **Telefon & e-post** | Sektion `#kontakt` i `index.html` + JSON-LD i `<head>` |
| **Sociala medier** | Sektion `#kontakt` i `index.html` |
| **Domän** | Byt `grillhouse-nyhamnslage.se` mot riktig domän i `index.html` (meta-taggar), `robots.txt` och `sitemap.xml` |

## Publicering på one.com

Ladda upp innehållet i denna mapp (`index.html`, `css/`, `js/`, `assets/`
m.fl.) till webbhotellets rotmapp via one.coms filhanterare eller FTP.
Inget byggsteg krävs.
