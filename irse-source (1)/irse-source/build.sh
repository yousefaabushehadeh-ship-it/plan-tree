#!/bin/bash
# يجمّع الملفات الصغيرة بـ parts/ في ملف واحد: dist/index.html
cd "$(dirname "$0")/parts" && mkdir -p ../dist
{ cat head.html styles.css mid.html config.js sha.js data.js core.js views.js auth.js admin.js boot.js; echo '</script>'; echo '</body>'; echo '</html>'; } > ../dist/index.html
wc -c ../dist/index.html
