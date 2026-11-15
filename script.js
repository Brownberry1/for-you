// ✏️ Make it yours: edit this part
const LETTER = {
  title: "For you,",
  message:
    "I wanted to say this somewhere quiet.\n\n" +
    "I'm bored so i created a website to say ....\n\n" +
    "I never chop today. make i hold 20 cedis erh. Dont tell anyone I'm begging o",
  sign: "Yours, always"
};

// ---------- Elements ----------
const content = document.getElementById("content");
const seal = document.getElementById("seal");
const win = document.getElementById("window");
const closeBtn = document.getElementById("close");
const titleEl = document.getElementById("title");
const messageEl = document.getElementById("message");
const signEl = document.getElementById("sign");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let typer = null;
let ambient = null;

// ---------- Hearts ----------
function spawnHeart(x, y) {
  const h = document.createElement("div");
  h.className = "fly";
  h.innerHTML = '<svg viewBox="0 0 100 90"><use href="#heart"/></svg>';
  h.style.left = x + "px";
  h.style.top = y + "px";
  h.style.setProperty("--s", 14 + Math.random() * 22 + "px");
  h.style.setProperty("--dx", (Math.random() - 0.5) * 220 + "px");
  h.style.setProperty("--r", (Math.random() - 0.5) * 80 + "deg");
  h.style.setProperty("--dur", 2.2 + Math.random() * 1.6 + "s");
  h.style.opacity = 0;
  document.body.appendChild(h);
  h.addEventListener("animationend", () => h.remove());
}

function burst(x, y, count = 22) {
  for (let i = 0; i < count; i++) setTimeout(() => spawnHeart(x, y), i * 45);
}

// ---------- Typewriter ----------
function typeMessage() {
  clearInterval(typer);
  titleEl.textContent = LETTER.title;
  messageEl.textContent = "";
  signEl.textContent = "";

  if (reduceMotion) {
    messageEl.textContent = LETTER.message;
    signEl.textContent = LETTER.sign;
    return;
  }

  let i = 0;
  typer = setInterval(() => {
    messageEl.textContent = LETTER.message.slice(0, ++i);
    if (i >= LETTER.message.length) {
      clearInterval(typer);
      signEl.textContent = LETTER.sign;
    }
  }, 38);
}

// ---------- Open / close ----------
function openLetter() {
  const r = seal.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2);

  content.classList.add("is-won");
  setTimeout(() => {
    win.classList.add("is-open");
    typeMessage();
    closeBtn.focus({ preventScroll: true });
  }, 350);

  // Gentle hearts drifting up from the bottom while the letter is open
  ambient = setInterval(() => {
    spawnHeart(Math.random() * window.innerWidth, window.innerHeight - 10);
  }, 700);
}

function closeLetter() {
  clearInterval(typer);
  clearInterval(ambient);
  win.classList.remove("is-open");
  content.classList.remove("is-won");
  seal.focus({ preventScroll: true });
}

seal.addEventListener("click", openLetter);
closeBtn.addEventListener("click", closeLetter);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && win.classList.contains("is-open")) closeLetter();
});

// Tapping anywhere while the letter is open sends a little burst
document.addEventListener("pointerdown", (e) => {
  if (win.classList.contains("is-open") && !win.contains(e.target)) {
    burst(e.clientX, e.clientY, 6);
  }
});
