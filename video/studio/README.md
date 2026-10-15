# Відео курсу CDTO (Remotion)

Один проєкт на всі анімовані відео-пояснення курсу. Брифи — у `../briefs/`.

## Т2·З3 · «6 понять для моніторингу проєкту»

- Текст (субтитри, озвучка, якорі анімації): `src/lessons/t2z3/script.ts`
- Таблиця вимови для синтезу: `src/lessons/t2z3/pronunciation.ts`
- Сцени: `src/lessons/t2z3/scenes/`, ролик: `src/lessons/t2z3/Video.tsx` (композиція `T2-Z3-Terms`)
- Голос: MP3 по сценах у `public/voiceover/t2z3/<id сцени>.mp3`. Поки файлу немає,
  тривалість сцени — оцінка `слова / 2,3 + 1,5 с`; коли є — тривалість аудіо + 0,6 с.
- Вирівнювання: `scripts/align.ts` розпізнає MP3 через whisper.cpp (модель `medium`, мова `uk`)
  і зберігає час кожного слова. Якщо файл `<id>.words.json` є, анімація спрацьовує на реальному
  слові, інакше — пропорційно кількості символів.

## Команди

```console
npm i
npx remotion studio --no-open        # перегляд у Studio
npx tsx scripts/keyframes.ts         # ключові кадри у out/keyframes/*.png
npx tsx scripts/voiceover-md.ts      # текст для ElevenLabs у voiceover/t2z3.md
npx tsx scripts/align.ts [id]         # вирівняти голос із текстом → public/voiceover/t2z3/<id>.words.json
npx tsx scripts/captions.ts          # субтитри й розділи → out/t2z3-terms.uk.vtt, .chapters.json
npx tsx scripts/render.ts v1 18      # MP4 (CRF 18, faststart, назва з атрибуцією) і постер у out/
npx tsc --noEmit && npx eslint src scripts
```

Шрифт e-Ukraine © Мінцифри, CC BY 4.0 (thedigital.gov.ua/fonts).
