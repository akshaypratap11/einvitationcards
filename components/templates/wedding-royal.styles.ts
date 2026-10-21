export const WEDDING_ROYAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@500;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');

:root {
  --wine: #2b0d16;
  --maroon: #5a1731;
  --rose: #c2185b;
  --gold: #c9a24b;
  --gold2: #f3e2a9;
  --cream: #fbf3e4;
  --blush: #f6e3e1;
  --ink: #5a1731;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --wine: #2b0d16;
    --maroon: #5a1731;
    --cream: #fbf3e4;
    --blush: #f6e3e1;
    --ink: #5a1731;
  }
}

:root[data-theme="dark"] {
  --wine: #2b0d16;
  --maroon: #5a1731;
  --cream: #fbf3e4;
  --blush: #f6e3e1;
  --ink: #5a1731;
}

html {
  scroll-padding-top: env(safe-area-inset-top, 0px);
  scroll-behavior: smooth;
}

* {
  box-sizing: border-box;
  margin: 0;
}

.wedding-royal-wrapper {
  color: var(--ink);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 19px;
  background: var(--wine);
}

body {
  background: var(--wine);
  color: var(--ink);
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 19px;
  overflow-x: hidden;
}

body.locked {
  overflow: hidden;
  height: 100vh;
}

.script {
  font-family: 'Great Vibes', cursive;
  font-weight: 400;
}

.serif {
  font-family: 'Playfair Display', Georgia, serif;
}

.gold-text {
  background: linear-gradient(90deg, #a47a2a, #e8d28a, #a47a2a);
  background-size: 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shine 5s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% 0;
  }
}

/* ROYAL DOORS INTRO */
#intro {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  cursor: pointer;
  perspective: 2000px;
  transition: visibility 0s 3s;
}

#intro.gone {
  visibility: hidden;
  pointer-events: none;
}

.door {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.1%;
  will-change: transform;
  backface-visibility: hidden;
  transition: transform 2.2s cubic-bezier(0.76, 0, 0.2, 1) 0.7s, filter 2.2s ease 0.7s;
  background: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.06), transparent 70%),
    repeating-linear-gradient(45deg, rgba(201, 162, 75, 0.05) 0 1px, transparent 1px 16px),
    repeating-linear-gradient(-45deg, rgba(201, 162, 75, 0.05) 0 1px, transparent 1px 16px),
    linear-gradient(#3b1121, #220912);
}

.door.l {
  left: 0;
  transform-origin: left center;
}

.door.r {
  right: 0;
  transform-origin: right center;
}

.door::before,
.door::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.door::before {
  inset: clamp(14px, 3vw, 34px);
  border: 1px solid rgba(201, 162, 75, 0.6);
}

.door::after {
  inset: calc(clamp(14px, 3vw, 34px) + 9px);
  border: 1px solid rgba(201, 162, 75, 0.22);
}

.door.l::before {
  border-right-width: 0;
}
.door.l::after {
  border-right-width: 0;
}
.door.r::before {
  border-left-width: 0;
}
.door.r::after {
  border-left-width: 0;
}

.seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: linear-gradient(transparent, rgba(243, 226, 169, 0.55), transparent);
  z-index: 3;
  transition: opacity 0.6s;
}

.cn {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.cn > * {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
  animation: rise 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}

.cn .a1 { animation-delay: 0.3s; }
.cn .a2 { animation-delay: 0.7s; }
.cn .a3 { animation-delay: 1.1s; }
.cn .a4 { animation-delay: 1.5s; }
.cn .a5 { animation-delay: 1.9s; }
.cn .a6 { animation-delay: 2.4s; }

@keyframes rise {
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.sl {
  color: var(--gold2);
  letter-spacing: 0.3em;
  font-size: 16px;
  margin-bottom: 34px;
}

.crest {
  position: relative;
  width: min(170px, 40vw);
  aspect-ratio: 1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(201, 162, 75, 0.8);
  box-shadow: inset 0 0 0 7px #2b0d16, inset 0 0 0 8px rgba(201, 162, 75, 0.45), 0 0 60px rgba(201, 162, 75, 0.12);
}

.crest::before {
  content: "";
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  border: 1px dashed rgba(201, 162, 75, 0.35);
  animation: spin 50s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.crest span {
  font-family: 'Great Vibes', cursive;
  font-size: clamp(44px, 11vw, 58px);
  color: var(--gold2);
  line-height: 1;
}

.crest span b {
  color: var(--gold);
  font-weight: 400;
  font-size: 0.6em;
  margin: 0 0.08em;
}

.inv {
  margin-top: 36px;
  color: rgba(251, 243, 228, 0.7);
  letter-spacing: 0.38em;
  font-size: 13px;
  text-transform: uppercase;
}

.nm {
  margin-top: 8px;
  font-family: 'Great Vibes', cursive;
  font-size: clamp(34px, 8vw, 48px);
  color: var(--cream);
}

.dt {
  margin-top: 2px;
  color: var(--gold);
  letter-spacing: 0.35em;
  font-size: 13px;
}

.tp {
  margin-top: 44px;
  color: var(--gold2);
  letter-spacing: 0.45em;
  font-size: 12px;
  text-transform: uppercase;
}

.tp i {
  display: block;
  width: 1px;
  height: 38px;
  margin: 14px auto 0;
  background: linear-gradient(var(--gold), transparent);
  transform-origin: top;
  animation: ln 2.2s ease-in-out infinite;
}

@keyframes ln {
  0% { transform: scaleY(0); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(1); opacity: 0; }
}

#intro.open .cn {
  opacity: 0;
  transform: scale(1.06);
}

#intro.open .seam {
  opacity: 0;
}

#intro.open .door.l {
  transform: rotateY(-108deg);
  filter: brightness(0.5);
}

#intro.open .door.r {
  transform: rotateY(108deg);
  filter: brightness(0.5);
}

.diya {
  position: relative;
  display: grid;
  place-items: center;
  width: 210px;
  height: 150px;
}

.diya::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 190px;
  height: 190px;
  margin: -95px 0 0 -95px;
  border-radius: 50%;
  border: 1px solid rgba(201, 162, 75, 0.55);
  animation: ping 2.6s ease-out infinite;
}

@keyframes ping {
  0% { transform: scale(0.55); opacity: 0.9; }
  100% { transform: scale(1.25); opacity: 0; }
}

.flame {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transform: scale(0);
  transition: transform 0.9s cubic-bezier(0.2, 1.5, 0.3, 1);
}

#intro.lit .flame {
  transform: scale(1);
  filter: drop-shadow(0 0 14px rgba(255, 170, 60, 0.95));
  animation: flick 1.2s 0.9s ease-in-out infinite;
}

@keyframes flick {
  0%, 100% { transform: scale(1, 1) skewX(0); }
  30% { transform: scale(0.95, 1.07) skewX(2deg); }
  60% { transform: scale(1.03, 0.96) skewX(-2deg); }
}

#intro.lit .diya::after {
  animation: none;
  opacity: 0;
}

.glow {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 150vmax;
  height: 150vmax;
  margin: -75vmax 0 0 -75vmax;
  border-radius: 50%;
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  transform: scale(0);
  background: radial-gradient(circle, rgba(255, 196, 110, 0.55), rgba(255, 140, 60, 0.16) 28%, transparent 58%);
  transition: transform 1.8s cubic-bezier(0.2, 0.7, 0.2, 1), opacity 1.2s;
}

#intro.lit .glow {
  transform: scale(1);
  opacity: 1;
}

#intro.open .glow {
  opacity: 0;
  transition: opacity 1.8s ease 0.4s;
}

/* SECTIONS */
section {
  position: relative;
  padding: 90px 22px;
  text-align: center;
  overflow: hidden;
}

.wrap {
  max-width: 1000px;
  margin: auto;
  position: relative;
  z-index: 2;
}

.eyebrow {
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-size: 15px;
  color: #a47a2a;
  margin-bottom: 14px;
}

h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 6vw, 54px);
  color: var(--maroon);
  margin-bottom: 16px;
}

.sub {
  max-width: 620px;
  margin: 0 auto 46px;
  opacity: 0.85;
  line-height: 1.7;
}

.orn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 26px;
  color: var(--gold);
}

.orn i {
  display: block;
  width: 110px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.dark {
  background: radial-gradient(circle at 50% 30%, #4a2a22, var(--wine) 65%);
  color: var(--cream);
}

.dark h2 {
  color: var(--cream);
}

.cream {
  background: var(--cream);
  color: var(--maroon);
}

.blush {
  background: var(--blush);
  color: var(--maroon);
}

.cream .sub,
.blush .sub {
  color: #4a1a28;
  opacity: 0.9;
}

/* soft gradient where one section meets the next */
section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 18px;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(circle at 50% 0, var(--from, transparent) 0 17px, #c9a24b 17px 18px, transparent 18px) 0 0/36px 18px repeat-x;
}

#hero::before { display: none; }
.dark + .cream, .dark + .blush { --from: #2b0d16; }
.cream + .blush, .cream + .dark, .cream + .contact { --from: var(--cream); }
.blush + .cream, .blush + .dark { --from: var(--blush); }
.contact + .dark { --from: #6b2038; }

/* reveal */
.rv {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}

.rv.in {
  opacity: 1;
  transform: none;
}

.rv.l { transform: translateX(-60px); }
.rv.r { transform: translateX(60px); }
.rv.z { transform: scale(0.85); }
.rv.in.l, .rv.in.r, .rv.in.z { transform: none; }
.d1 { transition-delay: 0.15s; }
.d2 { transition-delay: 0.3s; }
.d3 { transition-delay: 0.45s; }

/* hero */
#hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.names {
  font-size: clamp(56px, 13vw, 120px);
  line-height: 1.05;
  color: var(--gold2);
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.names small {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.2em;
  letter-spacing: 0.4em;
  color: var(--gold);
  margin: 0 0.6em;
}

.hero-date {
  font-size: 28px;
  color: #fff;
  margin: 6px 0;
}

.hero-loc { opacity: 0.8; }
.hero-tag {
  color: var(--gold2);
  font-size: 26px;
  margin-top: 26px;
}

.hash {
  font-size: 36px;
  color: var(--gold2);
  margin-top: 10px;
}

.scroll {
  position: absolute;
  bottom: 26px;
  left: 0;
  right: 0;
  letter-spacing: 0.35em;
  font-size: 13px;
  color: var(--gold);
  text-transform: uppercase;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* invitation */
.invite {
  color: var(--maroon);
}

.invite p.big {
  font-size: clamp(22px, 3.6vw, 30px);
  line-height: 1.8;
  max-width: 760px;
  margin: 0 auto 34px;
  color: #3b0d1e;
}

.together {
  letter-spacing: 0.35em;
  font-size: 14px;
  text-transform: uppercase;
  color: #5a1731;
  opacity: 0.85;
}

.invite p {
  color: #4a1a28;
}

.pair {
  font-size: clamp(54px, 11vw, 96px);
  color: var(--maroon);
}

.pair b {
  color: var(--gold);
  font-weight: 400;
}

/* couple */
.couple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.person {
  flex: 1 1 280px;
  max-width: 380px;
  color: var(--maroon);
}

.photo-wrap {
  display: inline-block;
  margin: 0 auto;
}

.photo {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  margin: 0 auto 0;
  border: 5px solid #f1d6c8;
  box-shadow: 0 0 0 8px rgba(201, 162, 75, 0.18), 0 20px 40px rgba(90, 23, 49, 0.2);
  display: block;
  object-fit: cover;
  transition: transform 0.8s;
}

.photo-placeholder {
  display: grid;
  place-items: center;
}

.photo-placeholder.groom-bg {
  background: radial-gradient(circle at 40% 30%, #7a2140, #2b0d16);
}

.photo-placeholder.bride-bg {
  background: radial-gradient(circle at 40% 30%, #99324b, #3b0d1e);
}

.initial-letter {
  font-size: 90px;
  color: var(--gold2);
  line-height: 1;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.person:hover .photo {
  transform: rotate(4deg) scale(1.05);
}

.pill {
  display: inline-block;
  margin: -18px 0 8px;
  padding: 6px 22px;
  background: var(--cream);
  border-radius: 30px;
  letter-spacing: 0.3em;
  font-size: 13px;
  color: #a47a2a;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.person .script {
  font-size: 60px;
  color: var(--maroon);
}

.person h3 {
  letter-spacing: 0.3em;
  font-weight: 600;
  color: var(--maroon);
  opacity: 0.9;
  margin: 4px 0 12px;
}

.person em {
  display: block;
  color: #4a1325;
  font-weight: 500;
  opacity: 0.95;
  line-height: 1.5;
}

.person a {
  color: #d0527f;
  text-decoration: none;
  font-size: 16px;
}

.heart {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: var(--cream);
  display: grid;
  place-items: center;
  font-size: 34px;
  color: var(--rose);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  animation: beat 1.4s infinite;
}

@keyframes beat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.18); }
  30% { transform: scale(1); }
  45% { transform: scale(1.12); }
}

/* photos rush together, collide, rebound, return */
.couple {
  position: relative;
  --x: 0px;
  --y: 0px;
  --sx: 50%;
  --sy: 30%;
}

.heart {
  position: relative;
  z-index: 3;
}

.photo, .photo-wrap, .pill {
  --s: 1;
}

.couple.go .person:last-child .photo,
.couple.go .person:last-child .photo-wrap,
.couple.go .person:last-child .pill {
  --s: -1;
}

.couple.go .photo,
.couple.go .photo-wrap,
.couple.go .pill {
  animation: bump 7s ease-in-out infinite;
}

@keyframes bump {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  8% {
    transform: translate(calc(var(--s) * var(--x) * -0.12), calc(var(--s) * var(--y) * -0.12));
    animation-timing-function: cubic-bezier(0.6, 0, 0.9, 0.5);
  }
  20% {
    transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))) rotate(calc(var(--s) * 3deg));
  }
  25% {
    transform: translate(calc(var(--s) * var(--x) * 0.8), calc(var(--s) * var(--y) * 0.8)) rotate(calc(var(--s) * -2deg));
  }
  30% {
    transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))) rotate(0);
  }
  48% {
    transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y)));
  }
  75% {
    transform: translate(0, 0) rotate(0);
  }
}

.couple::before {
  content: "";
  position: absolute;
  left: var(--sx);
  top: var(--sy);
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  border-radius: 50%;
  border: 2px solid #e8c36a;
  box-shadow: 0 0 24px rgba(232, 195, 106, 0.8);
  opacity: 0;
  z-index: 4;
  pointer-events: none;
}

.couple.go::before {
  animation: spark 7s ease-out infinite;
}

@keyframes spark {
  0%, 19% { opacity: 0; transform: scale(0.2); }
  20% { opacity: 1; transform: scale(0.6); }
  34% { opacity: 0; transform: scale(5); }
  100% { opacity: 0; }
}

.couple.go .heart {
  animation: heartHit 7s ease-in-out infinite;
}

@keyframes heartHit {
  0%, 16% { transform: scale(1); }
  20% { transform: scale(1.5); }
  30% { transform: scale(1.12); }
  36%, 100% { transform: scale(1); }
}

/* itinerary */
.events {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1060px;
  margin: auto;
}

.ev {
  display: flex;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(90, 23, 49, 0.12);
  text-align: left;
  border: 1px solid #f0e2cd;
  min-height: 260px;
  transition: transform 0.5s, box-shadow 0.5s;
  color: #2b0d16;
}

.ev:hover {
  transform: translateY(-6px);
  box-shadow: 0 26px 50px rgba(90, 23, 49, 0.2);
}

.ev:nth-child(even) {
  flex-direction: row-reverse;
}

.ev .img {
  flex: 0 0 40%;
  position: relative;
  display: grid;
  place-items: center;
  font-size: 84px;
}

.ev .img img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-placeholder-icon {
  font-size: 64px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
}

.ev .no {
  position: absolute;
  top: 18px;
  left: 18px;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--wine);
  color: var(--gold2);
  display: grid;
  place-items: center;
  border: 1px solid var(--gold);
  font-family: 'Playfair Display', serif;
}

.ev .txt {
  flex: 1;
  padding: 34px 36px;
  color: #2b0d16;
}

.ev h3 {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  color: var(--maroon);
}

.ev .tl {
  color: #c2185b;
  font-style: italic;
  font-size: 20px;
  margin: 6px 0 18px;
}

.ev ul {
  padding: 0;
  margin: 0;
}

.ev li {
  list-style: none;
  margin: 9px 0;
  display: flex;
  gap: 12px;
  align-items: center;
  color: #3b0d1e;
  font-size: 19px;
  font-weight: 500;
}

.ev li span {
  color: var(--gold);
  width: 22px;
  flex-shrink: 0;
}

/* countdown */
.cd {
  display: flex;
  justify-content: center;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0 30px;
}

.cd div {
  width: 100px;
  padding: 20px 0 14px;
  border-radius: 12px;
  background: #efd8d6;
  border: 1px solid #e3c79a;
  color: var(--maroon);
}

.cd b {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  color: var(--maroon);
}

.cd small {
  letter-spacing: 0.2em;
  font-size: 12px;
  color: var(--maroon);
  font-weight: 600;
  opacity: 0.85;
}

.cd i {
  color: var(--gold);
  font-style: normal;
  font-size: 30px;
}

.when {
  letter-spacing: 0.25em;
  font-size: 15px;
  text-transform: uppercase;
  color: var(--maroon);
  font-weight: 600;
  opacity: 0.85;
}

/* gallery */
.gal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 980px;
  margin: auto;
}

.gal div {
  height: 230px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 58px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.6s;
}

.gal div img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gal div:nth-child(1),
.gal div:nth-child(6) {
  grid-row: span 2;
  height: 476px;
}

.gal div:hover {
  transform: scale(1.04) rotate(-1deg);
}

/* venue */
.venue {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  align-items: center;
  text-align: left;
  max-width: 1000px;
  margin: auto;
  color: #2b0d16;
}

.venue > * {
  flex: 1 1 320px;
  color: #2b0d16;
}

.venue h3 {
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  color: var(--maroon);
}

.venue .by {
  color: #c2185b;
  font-style: italic;
  margin: 4px 0 14px;
}

.box {
  border: 1px solid #f0e2cd;
  background: #fff8ea;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 22px 0;
  color: #2b0d16;
}

.box small {
  display: block;
  letter-spacing: 0.3em;
  color: #7a2140;
  font-weight: 600;
  opacity: 0.9;
  text-transform: uppercase;
}

.box div {
  color: #2b0d16;
}

.box .serif {
  color: #2b0d16;
  font-weight: 600;
}

.btn {
  display: inline-block;
  padding: 15px 28px;
  border-radius: 40px;
  letter-spacing: 0.25em;
  font-size: 14px;
  text-transform: uppercase;
  text-decoration: none;
  margin: 6px 8px 6px 0;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  font-family: inherit;
}

.btn:hover {
  transform: translateY(-3px);
}

.b1 {
  background: linear-gradient(90deg, var(--maroon), var(--rose));
  color: #fff;
  border: 0;
  box-shadow: 0 10px 24px rgba(194, 24, 91, 0.3);
}

.b2 {
  border: 1px solid var(--gold);
  color: var(--maroon);
  background: transparent;
}

.map {
  height: 300px;
  border-radius: 18px;
  border: 2px solid #e3c79a;
  position: relative;
  overflow: hidden;
  background: #e8dfd0;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

.map iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}

/* contact / footer */
.contact {
  background: linear-gradient(var(--maroon), #6b2038);
}

.contact .btn {
  border: 1px solid var(--gold2);
  color: var(--gold2);
}

footer .cta {
  margin-top: 30px;
  color: var(--gold);
  letter-spacing: 0.25em;
  font-size: 14px;
  text-transform: uppercase;
}

footer .script {
  font-size: clamp(40px, 8vw, 64px);
  color: var(--gold2);
}

.hash2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 7vw, 56px);
  margin: 10px 0 24px;
}

/* share + petals */
#share {
  position: fixed;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--wine);
  color: var(--gold2);
  border: 1px solid var(--gold);
  font-size: 22px;
  z-index: 50;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s;
  display: grid;
  place-items: center;
}

body.ready #share {
  opacity: 1;
  pointer-events: auto;
}

.petal {
  position: fixed;
  top: -40px;
  z-index: 60;
  pointer-events: none;
  border-radius: 150% 0 150% 0;
  animation: fall linear infinite;
}

@keyframes fall {
  to {
    transform: translate3d(var(--dx), 110vh, 0) rotate(var(--r));
  }
}

#bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 0;
  background: linear-gradient(90deg, var(--gold), var(--rose));
  z-index: 90;
}

@media (max-width: 720px) {
  .ev, .ev:nth-child(even) { flex-direction: column; }
  .ev .img { flex-basis: 200px; }
  .gal div:nth-child(1), .gal div:nth-child(6) { height: 230px; grid-row: auto; }
  .ev .txt { padding: 24px; }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01s !important;
    transition-duration: 0.01s !important;
  }
}
`;
