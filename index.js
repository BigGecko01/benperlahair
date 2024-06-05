const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
let img = new Image();

img.src = "bald.jpg";
img.onload = () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
};

const resizeCanvas = () => {
  const aspectRatio = img.width / img.height;
  if (window.innerWidth / window.innerHeight > aspectRatio) {
    canvas.height = window.innerHeight - toolbar.offsetHeight;
    canvas.width = canvas.height * aspectRatio;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = canvas.width / aspectRatio;
  }
  canvas.style.marginTop = `${toolbar.offsetHeight}px`;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

function shareCanvas() {
  canvas.toBlob((blob) => {
    const file = new File([blob], "drawing.png", { type: "image/png" });
    const filesArray = [file];

    if (navigator.share) {
      navigator
        .share({
          title: "Bald Ben",
          text: "Check out this drawing of Bald Ben I made on bejaminperla.hair!",
          files: filesArray,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      // alert("Web Share API is not supported in your browser :(");
      // Fallback to download
      downloadCanvas();
    }
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    clearCanvas();
  } else if (e.target.id === "download") {
    var audio = new Audio("wink.wav");
    audio.play();
    // change img
    img.src = "smile.jpg"
    shareCanvas();
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
