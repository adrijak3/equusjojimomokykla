## Defaults (kurie reikalauja patvirtinimo)

1. **Individuali registracija** — automatinis confirm dialog, be Admin patvirtinimo (iškart matosi grafike kaip 1/1).
2. **Privataus žirgo savininkai** — tik Admin gali uždėti flag'ą profilyje (saugumas).
3. **Vienkartinis slot trynimas** — paslepia tos dienos slot'ą ir atšaukia esamas rezervacijas.
4. **Vartotojo abonimentas** — pasirenka iš Kainų sąrašo, pirkimo data = šiandien.

Jei kuris nors kitoks — pasakyk prieš pradedant.

---

## 1. DB migracija

- `profiles.is_private_horse_owner boolean default false`
- `time_slots.one_off_cancelled_dates date[] default '{}'` (paslėpti slot'ą konkrečiai dienai)
- `subscriptions.created_by uuid` (atskirti vartotojo vs admin sukurtus)
- Politika: vartotojas gali `insert` savo `subscriptions` (su `created_by = auth.uid()`), bet **negali update/delete** — tik admin
- Politika: vartotojas gali `update` savo `profiles.is_private_horse_owner` → **ne**, tik admin

## 2. Schema/biznio taisyklės

- Grupinė talpa max = 5 (default). Privataus žirgo savininkas gali prisijungti į 5/5 → 6/5. Niekam neleidžiama 6/5+.
- `Individuali` tipo slot'as visada talpa = 1. Kuriant/redaguojant — užforsinti.
- Laukimo sąrašas (`waitlist`) — esama lentelė; pridėti UI „kas laukia" + add/remove self.

## 3. UI — ikonos vietoj label'ių (Paskyra tab'ai)

- Treniruotės → `🐎` (lucide nėra arklio; naudosiu custom SVG arba `Sparkles`/`Award`; **naudosiu inline SVG horse**)
- Abonimentai → `Wallet`
- Žinutės → `Inbox`
- Nuostatos → `Settings`
- „Nuolatinis" badge → `Star` ikona (be teksto)

## 4. Tema — šviesiau

`src/index.css` — pakelti `--background` lightness, sumažinti gold transparency overlay'us, kad saulėje matytųsi (toliau dark theme, bet ne juodas — pvz. `220 15% 12%` → `220 12% 18%`, card `220 15% 16%` → `220 12% 22%`).

## 5. Grafikas.tsx

- Admin: prie kiekvieno slot'o pridėti „Praleisti šią dieną" mygtuką → įrašo į `one_off_cancelled_dates` ir atšaukia bookings.
- Filtruoti slot'us per dieną pagal `one_off_cancelled_dates`.
- Individuali: ant slot'o kurimo formos — jei `type = individual`, capacity = 1, disabled.
- Vartotojo individuali registracija:
  - Mygtukas „Užsirašyti individualiai" → dialog (data, laikas, custom arba pasirinkimas iš tuščių individualių slot'ų).
  - Patvirtinti → sukuria one-off slot (jei custom) + booking.
- Booking flow:
  - Jei `bookings_count >= capacity` ir vartotojas yra `is_private_horse_owner` ir capacity == 5 ir < 6 → leisti.
  - Kitaip — į waitlist.
- Laukimo sąrašas: clickable badge → popover su vardų sąrašu + „Prisidėti/Pasišalinti".

## 6. Paskyra.tsx

- Vartotojas mato „Pridėti abonimentą" → select iš `pricing_plans` (Kainos) + automatinė šiandienos data.
- Vartotojo abonimentų edit: **uždrausti keisti kartų skaičių** (tik admin).
- Tabs ikonomis (be teksto, su `Tooltip`).

## 7. Admin.tsx

- Abonimentas: galima sumažinti `total_count` žemiau buvusio (validate: ne mažiau už `actual_count`).
- Vartotojo pridėjimas (be account): checkbox „Pažymėti kaip naujokė".
- Vartotojo edit: switch „Privataus žirgo savininkas".

---

## Techniniai detalūs

- Booking insert RLS jau yra; reikia atnaujinti server-side capacity check (`process-lessons` arba RPC). Greitas variantas: client-side check + DB constraint per trigger (`before insert on bookings` — count + check).
- `Star` badge: pakeisti tekstą „Nuolatinis" → `<Star className="w-3 h-3 fill-current" />` su tooltip „Nuolatinis".
- Horse ikona: SVG inline component `src/components/icons/Horse.tsx` (Lucide neturi).

## Tvarka (kad nesusiveltų)

1. DB migracija
2. Tema (greitas vizualus fix)
3. Ikonos + Paskyra tabs
4. Admin pakeitimai (kartai down, naujokė, privatus savininkas, individuali = 1/1)
5. Grafikas — vienkartinis trynimas + waitlist popover
6. Grafikas/Paskyra — vartotojo individuali registracija + privataus savininko taisyklė
7. Vartotojo abonimento pridėjimas iš pricing

Pasakyk OK → pradėsiu. Jei nori pakeisti kuriuos defaults — pasakyk konkrečiai.