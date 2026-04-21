const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");
const bg = document.getElementById("bald-bg");
const container = document.getElementById("bald-container");

const offscreenCanvas = document.createElement("canvas");
const offscreenCtx = offscreenCanvas.getContext("2d");

let isPainting = false;
let canPaint = true;
let currentColor = "#000000"; // Default color is black
let img = new Image();

let currentImage = "images/bald.jpg";
img.src = currentImage;
let resizeTimer;
const debouncedResize = () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 100);
};

img.onload = () => {
  offscreenCanvas.width = img.width;
  offscreenCanvas.height = img.height;
  resizeCanvas();
  window.addEventListener("resize", debouncedResize);
};

const resizeCanvas = () => {
  const aspectRatio = img.width / img.height;
  let width;
  let height;
  if (window.innerWidth / window.innerHeight > aspectRatio) {
    height = window.innerHeight - toolbar.offsetHeight;
    width = height * aspectRatio;
  } else {
    width = window.innerWidth;
    height = width / aspectRatio;
  }

  container.style.width = width + "px";
  container.style.height = height + "px";
  bg.style.width = width + "px";
  bg.style.height = height + "px";

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);

  container.style.marginTop = `${toolbar.offsetHeight}px`;
};

const shareCanvas = async () => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], "drawing.png", { type: "image/png" });
      const filesArray = [file];

      if (navigator.share) {
        navigator
          .share({
            title: "Bald Ben",
            text: "Check out this drawing of Bald Ben I made on https://benjaminperla.hair/ !",
            files: filesArray,
          })
          .then(resolve)
          .catch((error) => {
            console.error("Error sharing", error);
            reject(error);
          });
      } else {
        downloadCanvas();
        resolve();
      }
    });
  });
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
};

toolbar.addEventListener("click", async (e) => {
  if (e.target.id === "clear") {
    clearCanvas();
    canPaint = true;
   
  } else if (e.target.id === "download") {
    var audio = new Audio("audio/wink.wav");
    audio.play();

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    img.src = "images/smile.jpg";
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);

      await shareCanvas();
      canPaint = false;
    };
  }
});

const startPosition = (e) => {
  isPainting = true;
  const x = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
  const y = (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
  ctx.moveTo(x, y);
  const scaleX = offscreenCanvas.width / canvas.width;
  const scaleY = offscreenCanvas.height / canvas.height;
  offscreenCtx.moveTo(x * scaleX, y * scaleY);
};

const finishedPosition = () => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
  offscreenCtx.stroke();
  offscreenCtx.beginPath();
};

const draw = (e) => {
  if (!isPainting || !canPaint) return;

  const x = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
  const y = (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
  const scaleX = offscreenCanvas.width / canvas.width;
  const scaleY = offscreenCanvas.height / canvas.height;

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  offscreenCtx.lineWidth = 10 * scaleX;
  offscreenCtx.lineCap = "round";
  offscreenCtx.strokeStyle = currentColor;
  offscreenCtx.lineTo(x * scaleX, y * scaleY);
  offscreenCtx.stroke();
  offscreenCtx.beginPath();
  offscreenCtx.moveTo(x * scaleX, y * scaleY);
};

const downloadCanvas = () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
};

canvas.addEventListener("mousedown", startPosition);
window.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition, { passive: false });
canvas.addEventListener("touchend", finishedPosition, { passive: false });
canvas.addEventListener("touchmove", (e) => { e.preventDefault(); draw(e); }, { passive: false });

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    currentColor = e.target.style.backgroundColor;
  });
});

console.log(" ██████  ██ ████████ ██   ██ ██    ██ ██████\n██       ██    ██    ██   ██ ██    ██ ██   ██\n██   ███ ██    ██    ███████ ██    ██ ██████\n██    ██ ██    ██    ██   ██ ██    ██ ██   ██\n ██████  ██    ██    ██   ██  ██████  ██████\n");
console.log("https://github.com/BigGecko01/benperlahair");