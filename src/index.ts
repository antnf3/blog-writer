import "chromedriver";
import writeNaverPost, { writeNaverPostBeta } from "./utils/naverUtils";
import writeTistoryPost from "./utils/tistoryUtils";
import "dotenv/config";

// const param = {
//   id: `${process.env.NAVER_ID}`,
//   password: `${process.env.NAVER_PW}`,
//   imgUrl: [
//     `C:/Users/antnf/Desktop/7028390930032-016cbfa5-5fa7-4b65-aba1-cd7d2d54861b.jpg`,
//   ],
//   subject: "제목입니다.",
//   content: {
//     ctnt1: "내용1",
//     ctnt2: "내용2",
//     ctnt3: "내용3",
//     reviews: ["리뷰1", "리뷰2", "리뷰3"],
//     ctnt4: "마지막",
//   },
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
