# Sitio web de EDYCOM Ltda.

Página web de EDYCOM Ltda. (Comercial e Industrial Edycom Limitada): fabricación de piezas técnicas de caucho y soluciones de sellado para la minería y la industria. Juliet 2412, Independencia, Santiago.

Este repositorio publica el sitio con **GitHub Pages**. Cada cambio que se guarda en la rama `main` se publica solo en uno o dos minutos.

## Qué hay aquí

- `index.html`: la página completa (textos, secciones y formulario de cotización).
- `assets/css/styles.css` y `assets/js/main.js`: estilos y funciones (menú, pestañas, galería, formulario).
- `assets/img/`: fotos optimizadas en varios tamaños (WebP y JPG).
- `assets/docs/EDYCOM-Catalogo-2026.pdf`: catálogo descargable.
- `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, íconos y `og-image.jpg` (imagen al compartir el enlace).

## Cambiar un dato (teléfono, horario, textos)

1. Abre `index.html` en GitHub y presiona el lápiz (Edit).
2. Usa Ctrl+F para buscar el texto: por ejemplo `2732 1490`, `6655 4182`, `edycom@edycom.cl` o `Lunes a jueves`.
3. Cambia el texto y presiona **Commit changes**. El sitio se actualiza en un par de minutos.

El número de WhatsApp y el correo del formulario también están al inicio de `assets/js/main.js`.

## Conectar el dominio edycom.cl

1. En GitHub: Settings > Pages > Custom domain, escribe `edycom.cl` y guarda (ya está configurado en el archivo `CNAME`; `www.edycom.cl` redirige solo a `edycom.cl`).
2. En el administrador del dominio (donde se gestiona el DNS de edycom.cl) crea:
   - un registro **CNAME** para `www` que apunte a `edycomltda.github.io`
   - registros **A** para `edycom.cl` que apunten a 185.199.108.153, 185.199.109.153, 185.199.110.153 y 185.199.111.153
3. Cuando GitHub muestre el dominio como verificado, activa **Enforce HTTPS**.
4. No toques los registros **MX** del dominio: son los del correo.

## Visibilidad en Google

- La dirección principal del sitio es `https://edycom.cl/` (canonical, sitemap y datos estructurados apuntan ahí).
- Para que Google la indexe rápido: entra a Google Search Console, agrega la propiedad `edycom.cl`, verifica el dominio con el registro TXT que te indique y envía el sitemap `https://edycom.cl/sitemap.xml`.
- Crea o reclama la ficha de Google Business Profile con la dirección Juliet 2412, Independencia, para aparecer en Google Maps.
