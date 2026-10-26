// Scoped CSS styles for Griha Pravesh (Ghar Function) Template
// Ported exactly 1:1 from /reference/griha-pravesh.html

export const GRIHA_PRAVESH_CSS = `
.griha-pravesh {
  --font-script: 'Great Vibes', cursive;
  --font-title: 'Playfair Display', Georgia, serif;
  --font-body: 'Cormorant Garamond', Georgia, serif;
  --font-dev: 'Noto Serif Devanagari', 'Cormorant Garamond', serif;
  --dg: #0c2016;
  --dg2: #1c4a32;
  --gold: #c9a24b;
  --gold2: #f3e2a9;
  --ivory: #fbf5e6;
  --saf: #fdecd0;
  --ink: #1c4a32;
  --saffron: #e8590c;
  background: var(--dg);
  color: var(--ink);
  font-family: var(--font-body), 'Cormorant Garamond', Georgia, serif;
  font-size: 19px;
  overflow-x: hidden;
  position: relative;
  min-height: 100vh;
  box-sizing: border-box;
}

.griha-pravesh * {
  box-sizing: border-box;
  margin: 0;
}

.griha-pravesh .script {
  font-family: var(--font-script), 'Great Vibes', cursive;
  font-weight: 400;
}

.griha-pravesh .dev {
  font-family: var(--font-dev), 'Noto Serif Devanagari', 'Cormorant Garamond', serif;
}

.griha-pravesh h2,
.griha-pravesh h3,
.griha-pravesh h4,
.griha-pravesh .cd b,
.griha-pravesh .tl b,
.griha-pravesh .tl h4,
.griha-pravesh .venue h3 {
  font-family: var(--font-title), 'Playfair Display', serif;
}

.griha-pravesh .gold-text {
  background: linear-gradient(90deg, #a47a2a, #f0dc96, #a47a2a);
  background-size: 200%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gp-shine 5s linear infinite;
}

@keyframes gp-shine {
  to { background-position: 200% 0; }
}

/* INTRO: doors + kalash */
.griha-pravesh .intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
  cursor: pointer;
  perspective: 2000px;
  transition: visibility 0s 3s;
}

.griha-pravesh .intro-overlay.gone {
  visibility: hidden;
  pointer-events: none;
}

.griha-pravesh .door {
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
              linear-gradient(#1b4a33, #09180f);
}

.griha-pravesh .door.l {
  left: 0;
  transform-origin: left center;
}

.griha-pravesh .door.r {
  right: 0;
  transform-origin: right center;
}

.griha-pravesh .door::before,
.griha-pravesh .door::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.griha-pravesh .door::before {
  inset: clamp(14px, 3vw, 34px);
  border: 1px solid rgba(201, 162, 75, .6);
}

.griha-pravesh .door::after {
  inset: calc(clamp(14px, 3vw, 34px) + 9px);
  border: 1px solid rgba(201, 162, 75, .22);
}

.griha-pravesh .door.l::before,
.griha-pravesh .door.l::after {
  border-right-width: 0;
}

.griha-pravesh .door.r::before,
.griha-pravesh .door.r::after {
  border-left-width: 0;
}

.griha-pravesh .seam {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: linear-gradient(transparent, rgba(243, 226, 169, .55), transparent);
  z-index: 3;
  transition: opacity .6s;
}

.griha-pravesh .cn {
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

.griha-pravesh .cn > * {
  opacity: 0;
  transform: translateY(14px);
  filter: blur(6px);
  animation: gp-rise 1.4s cubic-bezier(.2, .7, .2, 1) forwards;
}

.griha-pravesh .a1 { animation-delay: .3s !important; }
.griha-pravesh .a2 { animation-delay: .7s !important; }
.griha-pravesh .a3 { animation-delay: 1.1s !important; }
.griha-pravesh .a4 { animation-delay: 1.5s !important; }
.griha-pravesh .a5 { animation-delay: 1.9s !important; }
.griha-pravesh .a6 { animation-delay: 2.4s !important; }

@keyframes gp-rise {
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.griha-pravesh .sl {
  color: var(--gold2);
  letter-spacing: .2em;
  font-size: 20px;
  margin-bottom: 26px;
}

.griha-pravesh .kal {
  position: relative;
  display: grid;
  place-items: center;
  width: 210px;
  height: 190px;
}

.griha-pravesh .kal::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 190px;
  height: 190px;
  margin: -95px 0 0 -95px;
  border-radius: 50%;
  border: 1px solid rgba(201, 162, 75, .55);
  animation: gp-ping 2.6s ease-out infinite;
}

@keyframes gp-ping {
  0% { transform: scale(.55); opacity: .9; }
  100% { transform: scale(1.25); opacity: 0; }
}

.griha-pravesh .lv {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

.griha-pravesh .intro-overlay.lit .kal svg {
  filter: drop-shadow(0 0 18px rgba(255, 190, 80, .9));
  transition: filter 1s;
}

.griha-pravesh .intro-overlay.lit .lv {
  animation: gp-sway 2s ease-in-out infinite;
}

@keyframes gp-sway {
  50% { transform: rotate(4deg); }
}

.griha-pravesh .intro-overlay.lit .kal::after {
  animation: none;
  opacity: 0;
}

.griha-pravesh .glow {
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

.griha-pravesh .intro-overlay.lit .glow {
  transform: scale(1);
  opacity: 1;
}

.griha-pravesh .inv {
  margin-top: 24px;
  color: rgba(251, 245, 230, .7);
  letter-spacing: .38em;
  font-size: 13px;
  text-transform: uppercase;
}

.griha-pravesh .nm {
  margin-top: 4px;
  font-family: var(--font-script), 'Great Vibes', cursive;
  font-size: clamp(40px, 9vw, 58px);
  color: var(--ivory);
}

.griha-pravesh .dt {
  color: var(--gold);
  letter-spacing: .35em;
  font-size: 13px;
}

.griha-pravesh .tp {
  margin-top: 38px;
  color: var(--gold2);
  letter-spacing: .4em;
  font-size: 12px;
  text-transform: uppercase;
}

.griha-pravesh .tp i {
  display: block;
  width: 1px;
  height: 38px;
  margin: 14px auto 0;
  background: linear-gradient(var(--gold), transparent);
  transform-origin: top;
  animation: gp-ln 2.2s ease-in-out infinite;
}

@keyframes gp-ln {
  0% { transform: scaleY(0); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(1); opacity: 0; }
}

.griha-pravesh .intro-overlay.open .cn {
  opacity: 0;
  transform: scale(1.06);
}

.griha-pravesh .intro-overlay.open .seam {
  opacity: 0;
}

.griha-pravesh .intro-overlay.open .door.l {
  transform: rotateY(-108deg);
  filter: brightness(.5);
}

.griha-pravesh .intro-overlay.open .door.r {
  transform: rotateY(108deg);
  filter: brightness(.5);
}

.griha-pravesh .intro-overlay.open .glow {
  opacity: 0;
  transition: opacity 1.8s ease .4s;
}

/* SECTIONS */
.griha-pravesh section {
  position: relative;
  padding: 96px 22px;
  text-align: center;
  overflow: hidden;
}

.griha-pravesh .wrap {
  max-width: 1000px;
  margin: auto;
  position: relative;
  z-index: 2;
}

.griha-pravesh .eyebrow {
  letter-spacing: .4em;
  text-transform: uppercase;
  font-size: 15px;
  color: #a47a2a;
  margin-bottom: 14px;
}

.griha-pravesh h2 {
  font-size: clamp(32px, 6vw, 54px);
  color: var(--dg2);
  margin-bottom: 16px;
}

.griha-pravesh .sub {
  max-width: 620px;
  margin: 0 auto 46px;
  opacity: .8;
  line-height: 1.7;
}

.griha-pravesh .orn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 26px;
  color: var(--gold);
}

.griha-pravesh .orn i {
  display: block;
  width: 110px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.griha-pravesh .dark {
  background: radial-gradient(circle at 50% 30%, #1f4d36, var(--dg) 65%);
  color: var(--ivory);
}

.griha-pravesh .dark h2 {
  color: var(--ivory);
}

.griha-pravesh .dark .eyebrow {
  color: var(--gold2);
}

.griha-pravesh .ivory {
  background: var(--ivory);
  color: var(--ink);
}

.griha-pravesh .saf {
  background: var(--saf);
  color: var(--ink);
}

.griha-pravesh section::before {
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

.griha-pravesh #hero::before {
  display: none;
}

.griha-pravesh .dark + .ivory,
.griha-pravesh .dark + .saf {
  --from: #0c2016;
}

.griha-pravesh .ivory + .saf,
.griha-pravesh .ivory + .dark {
  --from: var(--ivory);
}

.griha-pravesh .saf + .ivory,
.griha-pravesh .saf + .dark {
  --from: var(--saf);
}

.griha-pravesh .rv {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1s ease, transform 1s ease;
}

.griha-pravesh .rv.in {
  opacity: 1;
  transform: none;
}

.griha-pravesh .rv.l { transform: translateX(-60px); }
.griha-pravesh .rv.r { transform: translateX(60px); }
.griha-pravesh .rv.z { transform: scale(.85); }
.griha-pravesh .rv.in.l,
.griha-pravesh .rv.in.r,
.griha-pravesh .rv.in.z {
  transform: none;
}

.griha-pravesh .d1 { transition-delay: .15s; }
.griha-pravesh .d2 { transition-delay: .3s; }
.griha-pravesh .d3 { transition-delay: .45s; }

#hero.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.griha-pravesh .big {
  font-size: clamp(58px, 13vw, 130px);
  line-height: 1.05;
  color: var(--gold2);
  text-shadow: 0 8px 30px rgba(0, 0, 0, .4);
}

.griha-pravesh .hi {
  font-size: clamp(24px, 5vw, 38px);
  color: var(--ivory);
  margin-top: 6px;
  letter-spacing: .1em;
}

.griha-pravesh .hero-date {
  font-size: 26px;
  margin-top: 26px;
}

.griha-pravesh .hero-loc {
  opacity: .8;
  margin-top: 4px;
}

.griha-pravesh .scroll {
  position: absolute;
  bottom: 26px;
  left: 0;
  right: 0;
  letter-spacing: .35em;
  font-size: 13px;
  color: var(--gold);
  text-transform: uppercase;
  animation: gp-blink 2s infinite;
}

@keyframes gp-blink {
  50% { opacity: .35; }
}

.griha-pravesh .lead {
  font-size: clamp(22px, 3.6vw, 30px);
  line-height: 1.8;
  max-width: 760px;
  margin: 0 auto 30px;
}

/* old home -> new home */
.griha-pravesh .couple {
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

.griha-pravesh .person {
  flex: 1 1 280px;
  max-width: 380px;
}

.griha-pravesh .photo {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  margin: auto;
  border: 5px solid #e9dfc2;
  box-shadow: 0 0 0 8px rgba(201, 162, 75, .2), 0 20px 40px rgba(28, 74, 50, .22);
  display: grid;
  place-items: center;
  font-size: 96px;
  background: linear-gradient(135deg, #8a6a3a, #4a3418) center/cover;
}

.griha-pravesh .pill {
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

.griha-pravesh .person {
  flex: 1 1 280px;
  max-width: 380px;
  color: var(--dg2);
}

.griha-pravesh .person .script {
  font-size: 52px;
  color: var(--dg2);
  display: block;
}

.griha-pravesh .person em {
  display: block;
  opacity: .95;
  color: #2c5941;
  font-weight: 500;
}

.griha-pravesh .mid {
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

.griha-pravesh .photo,
.griha-pravesh .pill {
  --s: 1;
}

.griha-pravesh .couple.go .person:last-child .photo,
.griha-pravesh .couple.go .person:last-child .pill {
  --s: -1;
}

.griha-pravesh .couple.go .photo,
.griha-pravesh .couple.go .pill {
  animation: gp-bump 7s ease-in-out infinite;
}

@keyframes gp-bump {
  0%, 100% { transform: translate(0, 0) rotate(0); }
  8% {
    transform: translate(calc(var(--s) * var(--x) * -.12), calc(var(--s) * var(--y) * -.12));
    animation-timing-function: cubic-bezier(.6, 0, .9, .5);
  }
  20% { transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))) rotate(calc(var(--s) * 3deg)); }
  25% { transform: translate(calc(var(--s) * var(--x) * .8), calc(var(--s) * var(--y) * .8)) rotate(calc(var(--s) * -2deg)); }
  30% { transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))) rotate(0); }
  48% { transform: translate(calc(var(--s) * var(--x)), calc(var(--s) * var(--y))); }
  75% { transform: translate(0, 0) rotate(0); }
}

.griha-pravesh .couple::before {
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

.griha-pravesh .couple.go::before {
  animation: gp-spark 7s ease-out infinite;
}

@keyframes gp-spark {
  0%, 19% { opacity: 0; transform: scale(.2); }
  20% { opacity: 1; transform: scale(.6); }
  34% { opacity: 0; transform: scale(5); }
  100% { opacity: 0; }
}

.griha-pravesh .couple.go .mid {
  animation: gp-hit 7s ease-in-out infinite;
}

@keyframes gp-hit {
  0%, 16% { transform: scale(1); }
  20% { transform: scale(1.5); }
  30% { transform: scale(1.12); }
  36%, 100% { transform: scale(1); }
}

.griha-pravesh .cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 22px;
  max-width: 960px;
  margin: auto;
}

.griha-pravesh .card {
  background: #fff;
  border: 1px solid #e9dfc2;
  border-radius: 20px;
  padding: 34px 24px;
  box-shadow: 0 16px 36px rgba(28, 74, 50, .1);
  transition: transform .5s, box-shadow .5s;
  color: var(--dg2);
}

.griha-pravesh .card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 46px rgba(28, 74, 50, .18);
}

.griha-pravesh .card .ic {
  font-size: 40px;
}

.griha-pravesh .card h3 {
  font-size: 24px;
  margin: 10px 0 6px;
  color: var(--dg2);
}

.griha-pravesh .card p {
  opacity: .95;
  line-height: 1.5;
  color: #143826;
  font-weight: 500;
}

.griha-pravesh .cd {
  display: flex;
  justify-content: center;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;
  margin: 10px 0 30px;
}

.griha-pravesh .cd div {
  width: 100px;
  padding: 20px 0 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, .06);
  border: 1px solid rgba(201, 162, 75, .45);
}

.griha-pravesh .cd b {
  display: block;
  font-size: 42px;
  color: var(--gold2);
}

.griha-pravesh .cd small {
  letter-spacing: .2em;
  font-size: 12px;
  opacity: .7;
}

.griha-pravesh .cd i {
  color: var(--gold);
  font-style: normal;
  font-size: 30px;
}

.griha-pravesh .tl {
  max-width: 640px;
  margin: auto;
  text-align: left;
  position: relative;
  padding-left: 34px;
}

.griha-pravesh .tl::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(var(--gold), rgba(201, 162, 75, .15));
}

.griha-pravesh .tl div {
  position: relative;
  padding: 0 0 30px;
}

.griha-pravesh .tl div::before {
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

.griha-pravesh .tl b {
  color: #a47a2a;
  font-size: 18px;
  letter-spacing: .08em;
}

.griha-pravesh .tl h4 {
  font-size: 22px;
  color: var(--dg2);
  font-weight: 500;
}

.griha-pravesh .tl p {
  opacity: .95;
  color: #204d36;
  font-weight: 500;
  line-height: 1.5;
}

.griha-pravesh .gal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  max-width: 980px;
  margin: auto;
}

.griha-pravesh .gal div {
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
}

.griha-pravesh .gal div:nth-child(1),
.griha-pravesh .gal div:nth-child(6) {
  grid-row: span 2;
  height: 476px;
}

.griha-pravesh .gal div:hover {
  transform: scale(1.04) rotate(-1deg);
}

.griha-pravesh .venue {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  align-items: center;
  text-align: left;
  max-width: 1000px;
  margin: auto;
  color: #143826;
}

.griha-pravesh .venue > * {
  flex: 1 1 320px;
  color: #143826;
}

.griha-pravesh .venue h3 {
  font-size: 34px;
  color: var(--dg2);
}

.griha-pravesh .box {
  border: 1px solid #e9dfc2;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 22px 0;
  color: #143826;
}

.griha-pravesh .box small {
  display: block;
  letter-spacing: .3em;
  color: #b07015;
  font-weight: 600;
  opacity: .95;
  text-transform: uppercase;
}

.griha-pravesh .box div {
  color: #0c2016;
  font-weight: 600;
}

.griha-pravesh .btn {
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
}

.griha-pravesh .btn:hover {
  transform: translateY(-3px);
}

.griha-pravesh .b1 {
  background: linear-gradient(90deg, var(--dg2), #2f7a52);
  color: #fff;
  border: 0;
  box-shadow: 0 10px 24px rgba(28, 74, 50, .3);
}

.griha-pravesh .b2 {
  border: 1px solid var(--gold);
  color: var(--dg2);
  background: transparent;
}

.griha-pravesh .b3 {
  background: linear-gradient(90deg, #b98a2e, #f0d98a);
  color: var(--dg);
  border: 0;
  box-shadow: 0 10px 26px rgba(201, 162, 75, .35);
}

.griha-pravesh .map {
  height: 300px;
  border-radius: 18px;
  border: 2px solid #e3c79a;
  display: grid;
  place-items: center;
  text-align: center;
  background: linear-gradient(135deg, #e3ead6, #c9d9c0);
  font-size: 56px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, .12);
}

.griha-pravesh .map span {
  display: block;
  font-size: 17px;
  margin-top: 6px;
  padding: 0 16px;
}

.griha-pravesh .rsvp {
  max-width: 640px;
  margin: auto;
  color: #143826;
}

.griha-pravesh .rsvp p {
  opacity: .95;
  line-height: 1.7;
  margin-bottom: 26px;
  color: #143826;
  font-weight: 500;
}

.griha-pravesh footer .script {
  font-size: clamp(40px, 8vw, 64px);
  color: var(--gold2);
}

.griha-pravesh .share-btn {
  position: fixed;
  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: var(--dg);
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

.griha-pravesh.ready .share-btn {
  opacity: 1;
  pointer-events: auto;
}

.griha-pravesh .bit {
  position: fixed;
  top: -40px;
  z-index: 60;
  pointer-events: none;
  border-radius: 150% 0 150% 0;
  animation: gp-fall linear infinite;
}

@keyframes gp-fall {
  to {
    transform: translate3d(var(--dx), 110vh, 0) rotate(var(--r));
  }
}

.griha-pravesh .scroll-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold), var(--saffron));
  z-index: 90;
  transition: width 0.1s linear;
}

.griha-pravesh .toast {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(12, 32, 22, 0.95);
  color: var(--gold2);
  border: 1px solid var(--gold);
  padding: 10px 24px;
  border-radius: 30px;
  font-size: 14px;
  z-index: 120;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  animation: gp-fadeIn 0.3s ease;
}

@keyframes gp-fadeIn {
  from { opacity: 0; transform: translate(-50%, 10px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

@media(max-width: 720px) {
  .griha-pravesh .gal div:nth-child(1),
  .griha-pravesh .gal div:nth-child(6) {
    height: 230px;
    grid-row: auto;
  }
}

@media(prefers-reduced-motion: reduce) {
  .griha-pravesh * {
    animation-duration: .01s !important;
    transition-duration: .01s !important;
  }
}
`;
