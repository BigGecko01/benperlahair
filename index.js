const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");
const bg = document.getElementById("bald-bg");
const container = document.getElementById("bald-container");

let isPainting = false;
let canPaint = true;
let startX;
let startY;
let currentColor = "#000000"; // Default color is black
let img = new Image();

let currentImage = "images/bald.jpg";
img.src = currentImage;
img.onload = () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
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

  // Save current canvas state
  let tempImg = new Image();
  tempImg.src = canvas.toDataURL();
  tempImg.onload = () => {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
    let imageToDraw = new Image();
    imageToDraw.onload = () => {
      ctx.drawImage(imageToDraw, 0, 0, canvas.width, canvas.height);
    };
  };

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
  // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
    currentImage.src = "images/smile.jpg"
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
  if (!canPaint) {
    return;
  }

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = currentColor;

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

document.querySelectorAll(".color-button").forEach((button) => {
  button.addEventListener("click", (e) => {
    currentColor = e.target.style.backgroundColor;
  });
});

console.log(" ██████  ██ ████████ ██   ██ ██    ██ ██████\n██       ██    ██    ██   ██ ██    ██ ██   ██\n██   ███ ██    ██    ███████ ██    ██ ██████\n██    ██ ██    ██    ██   ██ ██    ██ ██   ██\n ██████  ██    ██    ██   ██  ██████  ██████\n");
console.log("https://github.com/BigGecko01/benperlahair");