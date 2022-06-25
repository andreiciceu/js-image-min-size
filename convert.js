const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const DIR = process.argv[2];
const MIN_SIZE = parseInt(process.argv?.[3]) || 256;

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|tiff)$/.test(url);
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
  if (meta.width < MIN_SIZE || meta.height | MIN_SIZE) {
    const zoom = Math.ceil(MIN_SIZE / Math.min(meta.width, meta.height));

    await image
      .resize({ width: meta.width * zoom, height: meta.height * zoom })
      .jpeg()
      .toFile(`${file}_resized.jpg`);
  }
}

function processFiles(dirPath) {
  const files = getAllFiles(dirPath);

  files.forEach(async (fileName, idx) => {
    if (fileName.includes("_resized")) return;
    if (!isImage(fileName)) return;

    console.log(`${idx} / ${files.length} | ${fileName}`);
    await convertFile(fileName);
  });
}

processFiles(DIR);
