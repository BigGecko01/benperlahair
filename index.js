const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");
const bg = document.getElementById("bald-bg");
const container = document.getElementById("bald-container");

let isPainting = false;
let lineWidth = 15;
let startX;
let startY;
let img = new Image();

img.src = "bald.jpg";
img.onload = () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  console.log('resized');
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
  // height: 100% includes the height of the margin even if it's on the wrapper and honestly i do not care enough

  container.style.marginTop = `${toolbar.offsetHeight}px`;
  // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
            text: "Check out this drawing of Bald Ben I made on benjaminperla.hair!",
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
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

toolbar.addEventListener("click", async (e) => {
  if (e.target.id === "clear") {
    clearCanvas();
    img.src = "bald.jpg";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);
    };
  } else if (e.target.id === "download") {
    var audio = new Audio("wink.wav");
    audio.play();

    // Save current canvas state
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    // Change image and clear canvas asynchronously
    img.src = "smile.jpg";
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);

      await shareCanvas();
      // clearCanvas();
    };
  }
});

const startPosition = (e) => {
  isPainting = true;
  startX = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
  startY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop;
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
    (e.clientX || e.touches[0].clientX) - canvas.offsetLeft,
    (e.clientY || e.touches[0].clientY) - canvas.offsetTop,
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(
    (e.clientX || e.touches[0].clientX) - canvas.offsetLeft,
    (e.clientY || e.touches[0].clientY) - canvas.offsetTop,
  );
};

const downloadCanvas = () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
};

canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", finishedPosition);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startPosition);
canvas.addEventListener("touchend", finishedPosition);
canvas.addEventListener("touchmove", draw);

