import { readFile, writeFile } from "./src/astCompiler/handleFile.js";
import { Modifier } from "./src/astCompiler/modify.js";

export function compile(inputPath, dataObj) {
  const [file, err] = readFile(inputPath);
  if (err) console.log(err);
  else {
    const modifier = new Modifier(file, dataObj);
    const modifiedOutput = modifier.modify();
    return {
      output: modifiedOutput,
      write(path) {
        const [_, err] = writeFile(path, modifiedOutput);
        if (err) console.error(err);
      },
    };
  }
}
