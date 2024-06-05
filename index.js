const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

const startPosition = (e) => {
  isPainting = true;
  startX = (e.clientX || e.touches[0].clientX) - canvasOffsetX;
  startY = (e.clientY || e.touches[0].clientY) - canvasOffsetY;
};

const finishedPosition = () => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
};

const draw = (e) => {
  if (!isPainting) return;

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.lineTo(
    (e.clientX || e.touches[0].clientX) - canvasOffsetX,
    (e.clientY || e.touches[0].clientY) - canvasOffsetY,
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(
    (e.clientX || e.touches[0].clientX) - canvasOffsetX,
    (e.clientY || e.touches[0].clientY) - canvasOffsetY,
  );
};

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchmove", draw);

