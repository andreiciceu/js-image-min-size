/*
 * Usage: in-place deletion of duplicate files within a folder.
 * ```
 * ./deleteDuplicates.js relative/folder/path/of/duplicate/files
 * ```
 *
 * You may need to change the access control to run this as an executable.
 * ```
 * chmod 755 deleteDuplicates.js
 * ```
 *
 * Keep in mind this will delete *in place*, so make a backup of your folder
 * if you think you may need to keep the duplicates for whatever reason.
 *
 */

const crypto = require("crypto");
const fs = require("fs");

const folder = process.argv[2];
const absoluteFolder = `${__dirname}/${folder}`;

fs.readdir(absoluteFolder, async (err, files) => {
  if (err) {
    console.log(err);
    return;
  }

  const map = {};
  for (let i = 0; i < files.length; i++) {
    filename = files[i];
    const absoluteFilePath = `${absoluteFolder}/${filename}`;

    if (fs.existsSync(absoluteFilePath)) {
      if (filename.includes("_128x96") || filename.includes("_32x32")) {
        fs.unlinkSync(absoluteFilePath);
        continue;
      }

      const input = fs.createReadStream(absoluteFilePath);
      const hash = crypto.createHash("sha256");

      hash.setEncoding("hex");

      await new Promise((resolve) => {
        input.on("end", () => {
          hash.end();
          const hashValue = hash.read();

          //   console.log(hashValue, filename);
          if (map[hashValue]) {
            console.log("removed", filename);
            fs.unlinkSync(absoluteFilePath);
          } else {
            map[hashValue] = true;
          }
          resolve();
        });

        input.pipe(hash);
      });
    }
  }
});
