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

    if (!fs.existsSync(absoluteFilePath)) {
      continue;
    }

    if (filename.startsWith("1-")) {
      const newName = filename.replace(/^1-/, "");
      console.log("@@rename", filename, newName);

      fs.renameSync(absoluteFilePath, `${absoluteFolder}/${newName}`);
    }
  }
});
