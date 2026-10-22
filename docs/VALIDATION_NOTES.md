# Validation checklist

- Verify `index.astro` has one `<span class="hero__masthead-pre">SOFTWARE</span>` and one `<span class="hero__masthead-core">ENGINEER</span>`.
- Verify last stylesheet is `hero-performance-v4.css`.
- Verify CV download points to your existing `/assets/Shajedul_Kabir_Rafi_CV.pdf` and file exists.
- Test at 320 / 390 / 768 / 1440 widths, including portrait/landscape small-height mobile.
- Check that another section's title doesn't change.
- Ensure first-visit intro video isn't accidentally reinstated.
- Scroll fast over the Projects filmstrip and Research carousel after all sections are integrated.
- Confirm the browser's Performance profiler shows no large repeated layout read caused by the Projects movement callback.
