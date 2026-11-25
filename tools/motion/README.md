# Hero motion video (source)

`reel.html` is the 13-second hero animation, driven frame-by-frame by `window.render(t)`.
It opens and closes on the same dark frame, so the loop restarts without a jump.
Copy the Inter Tight woff2 files (`@fontsource/inter-tight`) and `project/assets/calon-mark.png` next to it, then:

```
node render.mjs site     # 1920x1080 website cut  -> frames-site/
node render.mjs mobile   # mobile composition      -> frames-mobile/ (crop 1080x1080 at x=420)
node render.mjs full     # showreel with captions  -> frames-full/
```

Encode (as shipped in `project/assets/video/`):
```
ffmpeg -framerate 30 -i frames-site/f%04d.jpg -vf scale=1280:720 -c:v libvpx-vp9 -b:v 0 -crf 36 -an calon-hero.webm
ffmpeg -framerate 30 -i frames-site/f%04d.jpg -vf scale=1280:720 -c:v libx264 -pix_fmt yuv420p -crf 24 -g 30 -movflags +faststart -an calon-hero.mp4
ffmpeg -framerate 30 -i frames-mobile/f%04d.jpg -vf "crop=1080:1080:420:0,scale=720:720" -c:v libvpx-vp9 -b:v 0 -crf 36 -an calon-hero-mobile.webm
ffmpeg -framerate 30 -i frames-site/f%04d.jpg -vf "fps=24,scale=960:540" -c:v libwebp_anim -quality 60 -loop 0 calon-hero.webp
ffmpeg -framerate 30 -i frames-mobile/f%04d.jpg -vf "fps=24,crop=1080:1080:420:0,scale=540:540" -c:v libwebp_anim -quality 62 -loop 0 calon-hero-mobile.webp
```
Posters come from frame 312 (the finished dashboard). The WebP files are the fallback when a phone refuses video autoplay (iPhone Low Power Mode).
