export const BIRTHDAY_CELEBRATION_CSS = `
/* Scoped Birthday Celebration Template Styles */
.bday-cel {
  --navy: #0d1230;
  --navy2: #1b2150;
  --gold: #c9a24b;
  --gold2: #f3e2a9;
  --ivory: #faf6ee;
  --mist: #ecebf6;
  --ink: #1b2150;
  --coral: #e8576f;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: var(--navy);
  color: var(--ink);
  font-family: var(--font-body), 'Cormorant Garamond', Georgia, serif;
  font-size: 19px;
  overflow-x: hidden;
  position: relative;
  width: 100%;
  min-height: 100vh;
}

body.locked {
  overflow: hidden !important;
  height: 100vh !important;
}

.bday-cel * {
  box-sizing: border-box;
  margin: 0;
}

.bday-cel .script {
  font-family: var(--font-script), 'Great Vibes', cursive;
  font-weight: 400;
}

.bday-cel .gold-text {
  background: linear-gradient(90deg, #a47a2a, #f0dc96, #a47a2a);
  background-size: 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: bday_shine 5s linear infinite;
}

@keyframes bday_shine {
  to { background-position: 200% 0; }
}

/* INTRO: doors + candle */
.bday-cel #intro,
.bday-cel .intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  cursor: pointer;
  perspective: 2000px;
  transition: visibility 0s 3s;
}

.bday-cel #intro.gone,
.bday-cel .intro-overlay.gone {
  visibility: hidden;
  pointer-events: none;
}

.bday-cel .door {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50.1%;
  will-change: transform;
  backface-visibility: hidden;
  transition: transform 2.2s cubic-bezier(.76, 0, .2, 1) .7s, filter 2.2s ease .7s;
  background: radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, .06), transparent 70%),
              repeating-linear-gradient(45deg, rgba(201, 162, 75, .05) 0 1px, transparent 1px 16px),
              repeating-linear-gradient(-45deg, rgba(201, 162, 75, .05) 0 1px, transparent 1px 16px),
              linear-gradient(#171d4a, #0a0e26);
}

.bday-cel .door.l {
  left: 0;
  transform-origin: left center;
}

.bday-cel .door.r {
  right: 0;
  transform-origin: right center;
}

.bday-cel .door::before,
.bday-cel .door::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.bday-cel .door::before {
  inset: clamp(14px, 3vw, 34px);
  border: 1px solid rgba(201, 162, 75, .6);
}

.bday-cel .door::after {
  inset: calc(clamp(14px, 3vw, 34px) + 9px);
  border: 1px solid rgba(201, 162, 75, .22);
}

.bday-cel .door.l::before,
.bday-cel .door.l::after {
  border-right-width: 0;
}

.bday-cel .door.r::before,
.bday-cel .door.r::after {
  border-left-width: 0;
}

.bday-cel .seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: linear-gradient(transparent, rgba(243, 226, 169, .55), transparent);
  z-index: 3;
  transition: opacity .6s;
}

.bday-cel .cn {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  transition: opacity .8s, transform .8s;
}

.bday-cel .cn > * {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
  animation: bday_rise 1.4s cubic-bezier(.2, .7, .2, 1) forwards;
}

.bday-cel .a1 { animation-delay: .3s !important; }
.bday-cel .a2 { animation-delay: .7s !important; }
.bday-cel .a3 { animation-delay: 1.1s !important; }
.bday-cel .a4 { animation-delay: 1.5s !important; }
.bday-cel .a5 { animation-delay: 1.9s !important; }
.bday-cel .a6 { animation-delay: 2.4s !important; }

@keyframes bday_rise {
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.bday-cel .sl {
  color: var(--gold2);
  letter-spacing: .35em;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 30px;
}

.bday-cel .candle {
  position: relative;
  display: grid;
  place-items: center;
  width: 210px;
  height: 170px;
}

.bday-cel .candle::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 190px;
  height: 190px;
  margin: -95px 0 0 -95px;
  border-radius: 50%;
  border: 1px solid rgba(201, 162, 75, .55);
  animation: bday_ping 2.6s ease-out infinite;
}

@keyframes bday_ping {
  0% { transform: scale(.55); opacity: .9; }
  100% { transform: scale(1.25); opacity: 0; }
}

.bday-cel .flame {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transform: scale(0);
  transition: transform .9s cubic-bezier(.2, 1.5, .3, 1);
}

.bday-cel #intro.lit .flame,
.bday-cel .intro-overlay.lit .flame {
  transform: scale(1);
  filter: drop-shadow(0 0 14px rgba(255, 170, 60, .95));
  animation: bday_flick 1.2s .9s ease-in-out infinite;
}

@keyframes bday_flick {
  0%, 100% { transform: scale(1, 1) skewX(0); }
  30% { transform: scale(.95, 1.07) skewX(2deg); }
  60% { transform: scale(1.03, .96) skewX(-2deg); }
}

.bday-cel #intro.lit .candle::after,
.bday-cel .intro-overlay.lit .candle::after {
  animation: none;
  opacity: 0;
}

.bday-cel .glow {
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
  background: radial-gradient(circle, rgba(255, 196, 110, .5), rgba(255, 140, 60, .14) 28%, transparent 58%);
  transition: transform 1.8s cubic-bezier(.2, .7, .2, 1), opacity 1.2s;
}

.bday-cel #intro.lit .glow,
.bday-cel .intro-overlay.lit .glow {
  transform: scale(1);
  opacity: 1;
}

.bday-cel .inv {
  margin-top: 26px;
  color: rgba(250, 246, 238, .7);
  letter-spacing: .38em;
  font-size: 13px;
  text-transform: uppercase;
}

.bday-cel .nm {
  margin-top: 6px;
  font-family: var(--font-script), 'Great Vibes', cursive;
  font-size: clamp(40px, 9vw, 58px);
  color: var(--ivory);
}

.bday-cel .dt {
  color: var(--gold);
  letter-spacing: .35em;
  font-size: 13px;
}

.bday-cel .tp {
  margin-top: 40px;
  color: var(--gold2);
  letter-spacing: .45em;
  font-size: 12px;
  text-transform: uppercase;
}

.bday-cel .tp i {
  display: block;
  width: 1px;
  height: 38px;
  margin: 14px auto 0;
  background: linear-gradient(var(--gold), transparent);
  transform-origin: top;
  animation: bday_ln 2.2s ease-in-out infinite;
}

@keyframes bday_ln {
  0% { transform: scaleY(0); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(1); opacity: 0; }
}

.bday-cel #intro.open .cn,
.bday-cel .intro-overlay.open .cn {
  opacity: 0;
  transform: scale(1.06);
}

.bday-cel #intro.open .seam,
.bday-cel .intro-overlay.open .seam {
  opacity: 0;
}

.bday-cel #intro.open .door.l,
.bday-cel .intro-overlay.open .door.l {
  transform: rotateY(-108deg);
  filter: brightness(.5);
}

.bday-cel #intro.open .door.r,
.bday-cel .intro-overlay.open .door.r {
  transform: rotateY(108deg);
  filter: brightness(.5);
}

.bday-cel #intro.open .glow,
.bday-cel .intro-overlay.open .glow {
  opacity: 0;
  transition: opacity 1.8s ease .4s;
}

/* SECTIONS */
.bday-cel section {
  position: relative;
  padding: 96px 22px;
  text-align: center;
  overflow: hidden;
}

.bday-cel .wrap {
  max-width: 1000px;
  margin: auto;
  position: relative;
  z-index: 2;
}

.bday-cel .eyebrow {
  letter-spacing: .4em;
  text-transform: uppercase;
  font-size: 15px;
  color: #a47a2a;
  margin-bottom: 14px;
}

.bday-cel h2 {
  font-family: var(--font-title), 'Playfair Display', serif;
  font-size: clamp(32px, 6vw, 54px);
  color: var(--navy2);
  margin-bottom: 16px;
}

.bday-cel .sub {
  max-width: 620px;
  margin: 0 auto 46px;
  opacity: .8;
  line-height: 1.7;
}

.bday-cel .orn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 26px;
  color: var(--gold);
}

.bday-cel .orn i {
  display: block;
  width: 110px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.bday-cel .dark {
  background: radial-gradient(circle at 50% 30%, #232a63, var(--navy) 65%);
  color: var(--ivory);
}

.bday-cel .dark h2 {
  color: var(--ivory);
}

.bday-cel .dark .eyebrow {
  color: var(--gold2);
}

.bday-cel .ivory {
  background: var(--ivory);
  color: var(--ink);
}

.bday-cel .mist {
  background: var(--mist);
  color: var(--ink);
}

.bday-cel section::before {
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

.bday-cel #hero::before,
.bday-cel .hero-section::before {
  display: none;
}

.bday-cel .dark + .ivory,
.bday-cel .dark + .mist {
  --from: #0d1230;
}

.bday-cel .ivory + .mist,
.bday-cel .ivory + .dark {
  --from: var(--ivory);
}

.bday-cel .mist + .ivory,
.bday-cel .mist + .dark {
  --from: var(--mist);
}

.bday-cel .rv {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}

.bday-cel .rv.in {
  opacity: 1;
  transform: none;
}

.bday-cel .rv.l {
  transform: translateX(-60px);
}

.bday-cel .rv.r {
  transform: translateX(60px);
}

.bday-cel .rv.z {
  transform: scale(.85);
}

.bday-cel .rv.in.l,
.bday-cel .rv.in.r,
.bday-cel .rv.in.z {
  transform: none;
}

.bday-cel .d1 { transition-delay: .15s; }
.bday-cel .d2 { transition-delay: .3s; }
.bday-cel .d3 { transition-delay: .45s; }

.bday-cel #hero,
.bday-cel .hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bday-cel .big {
  font-size: clamp(70px, 17vw, 150px);
  line-height: 1;
  color: var(--gold2);
  text-shadow: 0 8px 30px rgba(0, 0, 0, .4);
}

.bday-cel .turns {
  font-family: var(--font-title), 'Playfair Display', serif;
  font-size: clamp(22px, 4vw, 34px);
  letter-spacing: .2em;
  color: var(--ivory);
  margin-top: 8px;
}

.bday-cel .turns b {
  color: var(--gold);
  font-size: 1.6em;
}

.bday-cel .hero-date {
  font-size: 26px;
  margin-top: 26px;
}

.bday-cel .hero-loc {
  opacity: .8;
  margin-top: 4px;
}

.bday-cel .scroll {
  position: absolute;
  bottom: 26px;
  left: 0;
  right: 0;
  letter-spacing: .35em;
  font-size: 13px;
  color: var(--gold);
  text-transform: uppercase;
  animation: bday_blink 2s infinite;
}

@keyframes bday_blink {
  50% { opacity: .35; }
}

.bday-cel .lead {
  font-size: clamp(22px, 3.6vw, 30px);
  line-height: 1.8;
  max-width: 760px;
  margin: 0 auto 34px;
}

/* then & now */
.bday-cel .couple {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  --x: 0px;
  --y: 0px;
  --sx: 50%;
  --sy: 30%;
}

.bday-cel .person {
  flex: 1 1 280px;
  max-width: 380px;
}

.bday-cel .photo {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  margin: auto;
  border: 5px solid #e9dfc2;
  box-shadow: 0 0 0 8px rgba(201, 162, 75, .18), 0 20px 40px rgba(27, 33, 80, .22);
  display: grid;
  place-items: center;
  font-size: 96px;
  background: linear-gradient(135deg, #7a86d9, #1b2150) center/cover;
  overflow: hidden;
  position: relative;
}

.bday-cel .photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bday-cel .pill {
  display: inline-block;
  margin: -18px 0 8px;
  padding: 6px 22px;
  background: var(--ivory);
  border-radius: 30px;
  letter-spacing: .3em;
  font-size: 13px;
  color: #a47a2a;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
}

.bday-cel .person .script {
  font-size: 54px;
  color: var(--navy2);
  display: block;
}

.bday-cel .person {
  flex: 1 1 280px;
  max-width: 380px;
  color: var(--navy2);
}

.bday-cel .person em {
  opacity: .95;
  display: block;
  font-style: italic;
  color: #3b4580;
  font-weight: 500;
}

.bday-cel .mid {
  position: relative;
  z-index: 3;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: var(--ivory);
  display: grid;
  place-items: center;
  font-size: 34px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, .12);
}

.bday-cel .photo,
.bday-cel .pill {
  --s: 1;
}

.bday-cel .couple.go .person:last-child .photo,
.bday-cel .couple.go .person:last-child .pill {
  --s: -1;
}

.bday-cel .couple.go .photo,
.bday-cel .couple.go .pill {
  animation: bday_bump 7s ease-in-out infinite;
}

@keyframes bday_bump {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  8% { transform: translate(calc(var(--s) * var(--x) * -.12), calc(var(--s) * var(--y) * -.12)); animation-timing-function: cubic-bezier(.6, 0, .9, .5); }
  20% { transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))) rotate(calc(var(--s) * 3deg)); }
  25% { transform: translate(calc(var(--s) * var(--x) * .8), calc(var(--s) * var(--y) * .8)) rotate(calc(var(--s) * -2deg)); }
  30% { transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))) rotate(0); }
  48% { transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))); }
  75% { transform: translate(0, 0) rotate(0); }
}

.bday-cel .couple::before {
  content: "";
  position: absolute;
  left: var(--sx);
  top: var(--sy);
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  border-radius: 50%;
  border: 2px solid #e8c36a;
  box-shadow: 0 0 24px rgba(232, 195, 106, .8);
  opacity: 0;
  z-index: 4;
  pointer-events: none;
}

.bday-cel .couple.go::before {
  animation: bday_spark 7s ease-out infinite;
}

@keyframes bday_spark {
  0%, 19% { opacity: 0; transform: scale(.2); }
  20% { opacity: 1; transform: scale(.6); }
  34% { opacity: 0; transform: scale(5); }
  100% { opacity: 0; }
}

.bday-cel .couple.go .mid {
  animation: bday_hit 7s ease-in-out infinite;
}

@keyframes bday_hit {
  0%, 16% { transform: scale(1); }
  20% { transform: scale(1.5); }
  30% { transform: scale(1.12); }
  36%, 100% { transform: scale(1); }
}

/* details cards */
.bday-cel .cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 22px;
  max-width: 960px;
  margin: auto;
}

.bday-cel .card {
  background: #fff;
  border: 1px solid #e9dfc2;
  border-radius: 20px;
  padding: 34px 24px;
  box-shadow: 0 16px 36px rgba(27, 33, 80, .1);
  transition: transform .5s, box-shadow .5s;
  text-align: center;
  color: var(--navy2);
}

.bday-cel .card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 46px rgba(27, 33, 80, .18);
}

.bday-cel .card .ic {
  font-size: 40px;
  margin-bottom: 8px;
}

.bday-cel .card h3 {
  font-family: var(--font-title), 'Playfair Display', serif;
  font-size: 24px;
  margin: 10px 0 6px;
  color: var(--navy2);
}

.bday-cel .card p {
  opacity: .95;
  line-height: 1.5;
  color: #1b2150;
  font-weight: 500;
}

/* countdown */
.bday-cel .cd {
  display: flex;
  justify-content: center;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0 30px;
}

.bday-cel .cd div {
  width: 100px;
  padding: 20px 0 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(201, 162, 75, .45);
  text-align: center;
}

.bday-cel .cd b {
  display: block;
  font-family: var(--font-title), 'Playfair Display', serif;
  font-size: 42px;
  color: var(--gold2);
}

.bday-cel .cd small {
  letter-spacing: .2em;
  font-size: 12px;
  opacity: .7;
}

.bday-cel .cd i {
  color: var(--gold);
  font-style: normal;
  font-size: 30px;
}

/* timeline */
.bday-cel .tl {
  max-width: 640px;
  margin: auto;
  text-align: left;
  position: relative;
  padding-left: 34px;
}

.bday-cel .tl::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(var(--gold), rgba(201, 162, 75, .15));
}

.bday-cel .tl > div {
  position: relative;
  padding: 0 0 30px;
}

.bday-cel .tl > div::before {
  content: "";
  position: absolute;
  left: -31px;
  top: 8px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 5px rgba(201, 162, 75, .2);
}

.bday-cel .tl b {
  font-family: var(--font-title), 'Playfair Display', serif;
  color: #a47a2a;
  font-size: 18px;
  letter-spacing: .08em;
  display: block;
  margin-bottom: 2px;
}

.bday-cel .tl h4 {
  font-family: var(--font-title), 'Playfair Display', serif;
  font-size: 22px;
  color: var(--navy2);
  font-weight: 500;
  margin-bottom: 4px;
}

.bday-cel .tl p {
  opacity: .95;
  line-height: 1.5;
  color: #2b3368;
  font-weight: 500;
}

/* gallery */
.bday-cel .gal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 980px;
  margin: auto;
}

.bday-cel .gal > div {
  height: 230px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 56px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .1);
  transition: transform .6s;
  background-size: cover;
  background-position: center;
  position: relative;
}

.bday-cel .gal > div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bday-cel .gal > div:nth-child(1),
.bday-cel .gal > div:nth-child(6) {
  grid-row: span 2;
  height: 476px;
}

.bday-cel .gal > div:hover {
  transform: scale(1.04) rotate(-1deg);
}

/* venue + rsvp */
.bday-cel .venue {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  align-items: center;
  text-align: left;
  max-width: 1000px;
  margin: auto;
  color: #1b2150;
}

.bday-cel .venue > * {
  flex: 1 1 320px;
  color: #1b2150;
}

.bday-cel .venue h3 {
  font-family: var(--font-title), 'Playfair Display', serif;
  font-size: 34px;
  color: var(--navy2);
}

.bday-cel .box {
  border: 1px solid #e9dfc2;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 22px 0;
  color: #1b2150;
}

.bday-cel .box small {
  display: block;
  letter-spacing: .3em;
  color: #4f5b99;
  font-weight: 600;
  opacity: .95;
  text-transform: uppercase;
}

.bday-cel .box div {
  color: #0d1230;
  font-weight: 600;
}

.bday-cel .btn {
  display: inline-block;
  padding: 15px 28px;
  border-radius: 40px;
  letter-spacing: .25em;
  font-size: 14px;
  text-transform: uppercase;
  text-decoration: none;
  margin: 6px 8px 6px 0;
  transition: transform .3s;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  text-align: center;
}

.bday-cel .btn:hover {
  transform: translateY(-3px);
}

.bday-cel .b1 {
  background: linear-gradient(90deg, var(--navy2), #3b46a0);
  color: #fff;
  border: 0;
  box-shadow: 0 10px 24px rgba(27, 33, 80, .3);
}

.bday-cel .b2 {
  border: 1px solid var(--gold);
  color: var(--navy2);
  background: transparent;
}

.bday-cel .b3 {
  background: linear-gradient(90deg, #b98a2e, #f0d98a);
  color: var(--navy);
  border: 0;
  box-shadow: 0 10px 26px rgba(201, 162, 75, .35);
}

.bday-cel .map {
  height: 300px;
  border-radius: 18px;
  border: 2px solid #e3c79a;
  display: grid;
  place-items: center;
  text-align: center;
  background: linear-gradient(135deg, #e6e4f2, #cfd3ea);
  font-size: 56px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, .12);
  overflow: hidden;
  position: relative;
}

.bday-cel .map span {
  display: block;
  font-size: 17px;
  margin-top: 6px;
  padding: 0 12px;
}

.bday-cel .rsvp {
  max-width: 640px;
  margin: auto;
  color: #1b2150;
}

.bday-cel .rsvp p {
  opacity: .95;
  line-height: 1.7;
  margin-bottom: 26px;
  color: #1b2150;
  font-weight: 500;
}

.bday-cel footer .script {
  font-size: clamp(40px, 8vw, 64px);
  color: var(--gold2);
}

.bday-cel #share,
.bday-cel .share-btn {
  position: fixed;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--navy);
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, .3);
}

.bday-cel.ready #share,
.bday-cel.ready .share-btn,
body.ready .bday-cel #share,
body.ready .bday-cel .share-btn {
  opacity: 1;
  pointer-events: auto;
}

.bday-cel .bit {
  position: fixed;
  top: -40px;
  z-index: 60;
  pointer-events: none;
  animation: bday_fall linear infinite;
}

@keyframes bday_fall {
  to {
    transform: translate3d(var(--dx), 110vh, 0) rotate(var(--r));
  }
}

.bday-cel #bar,
.bday-cel .scroll-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--coral));
  z-index: 90;
  transition: width 0.1s ease-out;
}

/* Toast message for link copied */
.bday-cel .toast {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(13, 18, 48, 0.95);
  color: var(--gold2);
  border: 1px solid var(--gold);
  padding: 10px 22px;
  border-radius: 30px;
  font-size: 14px;
  letter-spacing: .1em;
  z-index: 120;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  animation: bday_toast_in 0.3s ease-out forwards;
}

@keyframes bday_toast_in {
  from { opacity: 0; transform: translate(-50%, 15px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

@media (max-width: 720px) {
  .bday-cel .gal > div:nth-child(1),
  .bday-cel .gal > div:nth-child(6) {
    height: 230px;
    grid-row: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bday-cel * {
    animation-duration: .01s !important;
    transition-duration: .01s !important;
  }
}
`;
