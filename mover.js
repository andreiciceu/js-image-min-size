const fs = require("fs");

const FROM = "../Poze Gata";
const TO = "../out";

const data = fs.readFileSync("out.csv").toString().split("\r\n");

data.forEach((line) => {
  if (!fs.existsSync(line) || !fs.lstatSync(line).isFile()) {
    return;
  }

  const filename = line.replace(/^.*[\\\/]/, "").trim();

  let prefix = 0;
  let dest = "";
  do {
    dest = `${TO}/${prefix > 0 ? `${prefix}-` : ""}${filename}`;
    prefix++;
  } while (fs.existsSync(dest));

  fs.copyFileSync(line, dest);

  console.log(`Copy ${line} => ${dest}`);
});
