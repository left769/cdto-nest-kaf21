# Відео курсу CDTO (Remotion)

Один проєкт на всі анімовані відео-пояснення курсу. Брифи — у `../briefs/`.

## Т2·З3 · «6 понять для моніторингу проєкту»

- Текст (субтитри, озвучка, якорі анімації): `src/lessons/t2z3/script.ts`
- Таблиця вимови для синтезу: `src/lessons/t2z3/pronunciation.ts`
- Сцени: `src/lessons/t2z3/scenes/`, ролик: `src/lessons/t2z3/Video.tsx` (композиція `T2-Z3-Terms`)
- Голос: MP3 по сценах у `public/voiceover/t2z3/<id сцени>.mp3`. Поки файлу немає,
  тривалість сцени — оцінка `слова / 2,3 + 1,5 с`; коли є — тривалість аудіо + 0,6 с.

## Команди

```console
npm i
npx remotion studio --no-open        # перегляд у Studio
npx tsx scripts/keyframes.ts         # ключові кадри у out/keyframes/*.png
npx tsx scripts/voiceover-md.ts      # текст для ElevenLabs у voiceover/t2z3.md
npx tsc --noEmit && npx eslint src scripts
```

Шрифт e-Ukraine © Мінцифри, CC BY 4.0 (thedigital.gov.ua/fonts).
