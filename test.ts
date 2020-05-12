import "chromedriver";
import { write, read } from "clipboardy";

// ncp.copy("학교종이 땡댕댕", function () {
//   // complete...
// });

async function copyPaste() {
  await write("학wwwe교qqqq종이 ddd땡땡댕");
  const str = await read();
  console.log(str);
}
copyPaste();
/**
 * random 숫자를 가져온다.(1000단위)
 */
function getRandom() {
  let random = Math.floor(Math.random() * 10000);
  if (random < 1000) {
    random = random + 1000;
  }
  return random;
}
