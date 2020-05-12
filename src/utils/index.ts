/**
 * random 숫자를 가져온다.(1000단위)
 */
function getRandom(milliseconds?: number) {
  milliseconds = milliseconds || 0;
  let random = Math.floor(Math.random() * 5000);
  if (random < 1000) {
    random = random + 1000;
  }
  return random + milliseconds;
}

export { getRandom };
