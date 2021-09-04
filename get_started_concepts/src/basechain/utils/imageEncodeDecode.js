const fs = require("fs");
const path = require("path");

function encodeImage(pathToFile) {
  const imageBuffer = fs.readFileSync(path.resolve(pathToFile));
  const imageEncoded = Buffer.from(imageBuffer).toString("hex");
  return imageEncoded;
}

function decodeImage(encodedFile) {
  const pathFile = "./src/basechain/assets/test-pattern-decoded.jpg";
  const fileHex = Buffer.from(encodedFile, "hex");
  fs.writeFileSync(path.resolve(pathFile), fileHex);
}
