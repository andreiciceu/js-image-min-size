const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = process.argv[2];
const MIN_SIZE = 256;

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|tiff)$/.test(url);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function convertFile(file) {
  const image = sharp(file);
  const meta = await image.metadata();

  if (meta.width < MIN_SIZE || meta.height < MIN_SIZE) {
    const zoom = Math.ceil(MIN_SIZE / Math.min(meta.width, meta.height));

    await image
      .resize({ width: meta.width * zoom, height: meta.height * zoom })
      .jpeg()
      .toFile(`${file}_resized.jpg`);
    return [true];
  }
  return [false, `${meta.width} ${meta.height}`];
}

async function processFiles(dirPath) {
  const files = getAllFiles(dirPath);
  for (let idx = 0; idx < files.length; idx++) {
    let fileName = files[idx];
    // remove thumbnails
    if (
      fileName.includes("512x512") ||
      fileName.includes("256x256") ||
      fileName.includes("128x128")
    ) {
      fs.unlinkSync(fileName);
      continue;
    }

    if (fileName.includes("_resized")) {
      fs.unlinkSync(fileName);
      continue;
    }
    if (!isImage(fileName)) {
      continue;
    }

    try {
      let [done, msg] = await convertFile(fileName);
      console.log(
        `${idx + 1} / ${files.length} | ${fileName}   > ${
          done ? "RESIZED" : "no-need"
        } ${msg}`
      );
    } catch (err) {
      console.error("Failed converting", fileName, err);
    }

    // await sleep(10);
  }

  console.log("@ !! DONE !! @");
}

processFiles(DIR);
