let bgc, bgcResizeHandler;

function createNightCanvas(){
  if (bgc) return;
  document.body.style.position = "relative";
  bgc = document.createElement("canvas");
  bgc.id = "bg-night";
  bgc.style.position = "fixed";
  bgc.style.inset = "0";
  bgc.style.zIndex = "0";
  bgc.style.pointerEvents = "none";
  document.body.prepend(bgc);
  document.querySelectorAll(".navbar,.container").forEach(el=>{
    el.style.position = "relative";
    el.style.zIndex = "1";
  });
  const draw = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight);
    bgc.style.width = w + "px";
    bgc.style.height = h + "px";
    bgc.width = Math.floor(w * dpr);
    bgc.height = Math.floor(h * dpr);
    const ctx = bgc.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const sky = ctx.createLinearGradient(0,0,0,h);
    sky.addColorStop(0,"#0b1f5a");
    sky.addColorStop(1,"#0a0f22");
    ctx.fillStyle = sky;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = "#ffffff";
    for (let i=0;i<80;i++){
      const x = Math.random()*w;
      const y = Math.random()*(h*0.35);
      ctx.fillRect(x,y,2,2);
    }
    const mx = w*0.78, my = h*0.22, r = Math.max(28, w*0.045);
    const glow = ctx.createRadialGradient(mx,my,r*0.6,mx,my,r*1.8);
    glow.addColorStop(0,"rgba(255,255,210,0.35)");
    glow.addColorStop(1,"rgba(255,255,210,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mx,my,r*1.8,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#f4f0b5";
    ctx.beginPath();
    ctx.arc(mx-12,my,r+8,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#b5b8a9";
    ctx.beginPath();
    ctx.arc(mx-7,my-6,r,0,Math.PI*2);
    ctx.fill();
    const baseY = h*0.9;
    const buildings = [
      { x:w*0.06, w:w*0.08, h:h*0.36 },
      { x:w*0.17, w:w*0.10, h:h*0.44 },
      { x:w*0.30, w:w*0.12, h:h*0.52 },
      { x:w*0.45, w:w*0.10, h:h*0.40 },
      { x:w*0.60, w:w*0.14, h:h*0.48 }
    ];
    ctx.fillStyle = "#313e62";
    buildings.forEach(b=>ctx.fillRect(b.x, baseY-b.h, b.w, b.h));
    const WIN = Math.max(18, Math.floor(w * 0.014));
    ctx.fillStyle = "#f9e65b";
    buildings.forEach((b, i) => {
      const cx = b.x + b.w * 0.5;
      const top = baseY - b.h;
      const cy1 = top + b.h * 0.45;
      const cy2 = top + b.h * 0.58;
      const dx = Math.max(WIN, b.w * 0.22);
      const leftX  = cx - dx - WIN/2;
      const rightX = cx + dx - WIN/2;
      const firstLeft = (i % 2 === 0);
      const x1 = firstLeft ? leftX : rightX;
      const x2 = firstLeft ? rightX : leftX;
      ctx.fillRect(x1, cy1 - WIN/2, WIN, WIN);
      ctx.fillRect(x2, cy2 - WIN/2, WIN, WIN);
    });
  };
  draw();
  bgcResizeHandler = draw;
  window.addEventListener("resize", bgcResizeHandler);
}

function removeNightCanvas(){
  if (!bgc) return;
  window.removeEventListener("resize", bgcResizeHandler);
  bgc.remove();
  bgc = null;
}

(function(){
  function applySaved(){
    if(localStorage.getItem("themeDark")==="1"){
      document.body.classList.add("theme-dark");
      createNightCanvas();
    } else {
      document.body.classList.remove("theme-dark");
      removeNightCanvas();
    }
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", applySaved);
  } else {
    applySaved();
  }
})();


let t, defaults;

function initTableStyler() {
  const table = document.getElementById("ttt");
  if (!table) return;
  t = table;
  const td = t.tBodies[0]?.rows[0]?.cells[0];
  if (!td) return;
  defaults = {
    w: getComputedStyle(t).width,
    b: getComputedStyle(t).borderWidth,
    p: getComputedStyle(td).padding,
    bg: getComputedStyle(td).backgroundColor
  };
  document.querySelectorAll('[data-width]').forEach(btn =>
    btn.addEventListener('click', () => setWidth(parseInt(btn.dataset.width)))
  );
  document.querySelectorAll('[data-bp]').forEach(btn =>
    btn.addEventListener('click', () => setBP(parseInt(btn.dataset.bp)))
  );
  document.querySelectorAll('[data-bg]').forEach(btn =>
    btn.addEventListener('click', () => setColor(btn.dataset.bg))
  );
  const reset = document.getElementById('reset-btn');
  if (reset) reset.addEventListener('click', resetAll);
}

function setWidth(px) { if (t) t.style.width = px + "px"; }
function setBP(px) {
  if (!t) return;
  const v = px + "px";
  t.style.borderWidth = v;
  t.style.borderSpacing = v;
  t.querySelectorAll("th,td").forEach(c => { c.style.borderWidth = v; });
}

function setColor(c) { if (t) t.querySelectorAll("tbody td").forEach(td => td.style.backgroundColor = c); }

function resetAll() {
  if (!t || !defaults) return;
  t.style.width = defaults.w;
  t.style.borderWidth = defaults.b;
  t.style.borderSpacing = "";
  t.querySelectorAll("th,td").forEach(c => { c.style.borderWidth = ""; c.style.padding = defaults.p; });
  t.querySelectorAll("tbody td").forEach(td => td.style.backgroundColor = defaults.bg);
}

let images = [
  "https://assets.goal.com/images/v3/blt77343c47650bbfc1/2342f72fb9136c85780213e2ad65de2843a40911.jpg?auto=webp&format=pjpg&width=3840&quality=60",
  "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1240w,f_auto,q_auto:best/newscms/2014_27/547226/140704-james-rodriguez-10a.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-NGEQDekk2BwsllLjk4tcIM_BPIzXECdsg&s",
  "https://img.asmedia.epimg.net/resizer/v2/YNANO3CDKRPRFLNDWEUR5IHD7A.jpg?auth=a916649441b1f6f5ef8512f903841c2604cf5f6248d67c8dcc9d6ba6d42a3dde&width=1472&height=1104&smart=true",
  "https://media.tenor.com/4In4gADApYoAAAAM/messi-messi-world-cup.gif"
];

let currentIndex = 0;

function showImage(index) {
  const img = document.getElementById("myImage");
  const counter = document.getElementById("counter");
  if (!img || !counter) return;
  img.src = images[index];
  counter.textContent = "Image " + (index + 1) + " out of " + images.length;
}

function prevImage() { currentIndex = (currentIndex - 1 + images.length) % images.length; showImage(currentIndex); }
function nextImage() { currentIndex = (currentIndex + 1) % images.length; showImage(currentIndex); }

function initPolaroid() {
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  if (!prev || !next) return;
  prev.addEventListener("click", prevImage);
  next.addEventListener("click", nextImage);
  showImage(currentIndex);
}

let tttState = Array(9).fill(null);
let tttTurn = "X";
let tttOver = false;
const TTT_WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function initTicTacToe() {
  const board = document.getElementById("ttt");
  if (!board) return;
  board.querySelectorAll("tbody td").forEach(td => td.addEventListener("click", onTttClick));
  const reset = document.getElementById("reset-btn");
  if (reset) reset.addEventListener("click", resetTicTacToe);
  setFooter("");
}

function onTttClick(e) {
  if (tttOver) return;
  const cell = e.currentTarget;
  const idx = +cell.dataset.i;
  if (tttState[idx]) return;
  tttState[idx] = tttTurn;
  cell.textContent = tttTurn;
  cell.classList.add(tttTurn.toLowerCase());
  if (checkTttWin(tttTurn)) { tttOver = true; setFooter(tttTurn + " wins!"); return; }
  if (tttState.every(Boolean)) { tttOver = true; setFooter("Draw"); return; }
  tttTurn = tttTurn === "X" ? "O" : "X";
}

function checkTttWin(p) { return TTT_WINS.some(line => line.every(i => tttState[i] === p)); }

function resetTicTacToe() {
  tttState.fill(null); tttTurn = "X"; tttOver = false;
  const board = document.getElementById("ttt");
  if (!board) return;
  board.querySelectorAll("tbody td").forEach(td => { td.textContent = ""; td.classList.remove("x","o"); });
  setFooter("");
}

function setFooter(text) { const f = document.getElementById("ttt-footer"); if (f) f.textContent = text; }

function initThemeToggle(){
  const btn = document.getElementById("night-mode-btn");
  if (!btn) return;
  btn.textContent = document.body.classList.contains("theme-dark") ? "Day Mode" : "Night Mode";
  btn.addEventListener("click", ()=>{
    document.body.classList.toggle("theme-dark");
    const dark = document.body.classList.contains("theme-dark");
    btn.textContent = dark ? "Day Mode" : "Night Mode";
    localStorage.setItem("themeDark", dark ? "1" : "0");
    if (dark) createNightCanvas(); else removeNightCanvas();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initTableStyler();
  initPolaroid();
  initTicTacToe();
  initThemeToggle();
});



document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const message = form.elements["message"].value.trim();

    const to = "svw2404@gmail.com";
    const subject = `Website contact from ${name}`;
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`;

    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });
});
