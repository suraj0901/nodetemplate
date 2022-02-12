import fs from "fs";
import path from "path";

export const readFile = (filename) => {
  let err = null,
    data = null;
  if (!fs.existsSync(filename)) {
    err = `${filename} dosen't exists`;
    // console.log(err);
  } else {
    try {
      data = fs.readFileSync(filename, "utf8");
    } catch (error) {
      // console.error(error);
      err = error;
    }
  }
  return [data, err];
};

export const writeFile = (filepath, content) => {
  let err = null,
    ok = null;
  const folderName = path.dirname(filepath);
  const filename = path.basename(filepath);

  if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);

  try {
    fs.writeFileSync(filepath, content);
    console.log(`success written ${filename}`);
    ok = true;
  } catch (error) {
    // console.error(error);
    err = error;
  }
  return [ok, err];
};
