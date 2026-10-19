# Відео курсу CDTO (Remotion)

Один проєкт на всі анімовані відео-пояснення курсу. Брифи — у `../briefs/`.

## Як влаштовано

- Урок — тека `src/lessons/<урок>/`: `script.ts` (текст субтитрів і якорі анімації),
  `pronunciation.ts` (таблиця вимови для синтезу), `meta.ts` (назви, смуга глосарію, ключові
  кадри), `scenes/` і `Video.tsx`. Реєстр уроків — `src/lessons/registry.ts`, композиції — `src/Root.tsx`.
- Спільне для всіх уроків — `src/shared/`: тема, смуга глосарію, картка терміна, рамка сцени,
  фабрика ролика (`LessonVideo.tsx`), таймінг, діаграми, чек-лист і фінальна картка.
- Голос: MP3 по сценах у `public/voiceover/<урок>/<id сцени>.mp3`. Поки файлу немає,
  тривалість сцени — оцінка `слова / 2,3 + 1,5 с`; коли є — тривалість аудіо + 0,6 с.
- Вирівнювання: `scripts/align.ts` розпізнає MP3 через whisper.cpp (модель `medium`, мова `uk`)
  і зберігає час кожного слова. Якщо файл `<id>.words.json` є, анімація спрацьовує на реальному
  слові, інакше — пропорційно кількості символів.

## Команди

Перший аргумент скриптів — урок (`t2z3`, `t2z4`, …).

```console
npm i
npx remotion studio --no-open             # перегляд у Studio
npx tsx scripts/keyframes.ts t2z4         # ключові кадри у out/keyframes/t2z4/*.png
npx tsx scripts/voiceover-md.ts t2z4      # текст для ElevenLabs у voiceover/t2z4.md
npx tsx scripts/align.ts t2z4 [id]        # вирівняти голос із текстом → <id>.words.json
npx tsx scripts/captions.ts t2z4          # субтитри й розділи → out/<outName>.uk.vtt, .chapters.json
npx tsx scripts/render.ts t2z4 v1 18      # MP4 (CRF 18, faststart, назва з атрибуцією) і постер
npx tsx scripts/embed.ts t2z4            # блок відео на сторінці заняття, постер і VTT → docs/assets/video/
npx tsc --noEmit && npx eslint src scripts
```

Шрифт e-Ukraine © Мінцифри, CC BY 4.0 (thedigital.gov.ua/fonts).
