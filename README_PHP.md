````markdown name=README_PHP.md
```markdown
# PHP verzió - telepítési útmutató

1. Másold a `config.php` fájlt és töltsd ki a valódi adatokat (adatbázis, SMTP). Ne tartsd a jelszavakat a publikus repo-ban.
2. Futtasd a `sql/schema.sql` fájlt a MySQL szerveren (`green_solar` adatbázisba) pl:

   mysql -u root -p green_solar < sql/schema.sql

3. Telepítsd a függőségeket Composer-rel:

   composer install

4. Ellenőrizd a `vendor/` könyvtárat és a `config.php` beállításokat, majd helyezd a fájlokat webkiszolgálóra (A php-version ágat használva).

5. Teszteld a kapcsolati űrlapot a /php-version/contact.php oldalon.
```
````