import "chromedriver";
import writeNaverPost, { writeNaverPostBeta } from "./utils/naverUtils";
import writeTistoryPost from "./utils/tistoryUtils";
import "dotenv/config";

// const param = {
//   id: `${process.env.NAVER_ID}`,
//   password: `${process.env.NAVER_PW}`,
//   imgUrl: [
//     `C:/Users/C14A-080/Desktop/img/1.jpg`,
//     `C:/Users/C14A-080/Desktop/img/2.jpg`,
//     `C:/Users/C14A-080/Desktop/img/3.jpg`,
//     `C:/Users/C14A-080/Desktop/img/4.jpg`,
//     `C:/Users/C14A-080/Desktop/img/5.jpg`,
//     `C:/Users/C14A-080/Desktop/img/6.jpg`,
//     `C:/Users/C14A-080/Desktop/img/7.jpg`,
//   ],
//   subject: "제목입니다.",
//   content: { ctnt1: "내용1", ctnt2: "내용2", ctnt3: "내용3" },
//   selectType: "6",
//   tags: `#학교, #하교, #등교`,
//   site: `naver`,
// };
// writeNaverPost(param);

// const param = {
//   id: `${process.env.TISTORY_ID}`,
//   password: `${process.env.TISTORY_PW}`,
//   imgUrl: [`C:/Users/C14A-080/Desktop/img/1.jpg`],
//   subject: "제목.",
//   content: { ctnt1: "내용1", ctnt2: "내용2", ctnt3: "내용3" },
//   selectType: "6",
//   tags: `학교,하교,등교`,
//   site: `tistory`,
// };
// writeTistoryPost(param);
export { writeNaverPost, writeTistoryPost };
