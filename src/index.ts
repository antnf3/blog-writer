import "chromedriver";
import writeNaverPost, { writeNaverPostBeta } from "./utils/naverUtils";
import writeTistoryPost from "./utils/tistoryUtils";
import "dotenv/config";

// const param = {
//   id: `${process.env.NAVER_ID}`,
//   password: `${process.env.NAVER_PW}`,
//   imgUrl: [`C:/Users/antnf/Desktop/39f8ae47-d08a-4954-b993-7ec00ee25974.jpg`],
//   subject: "베베숲 라이트 아기물티슈 캡형, 80매, 10개",
//   content: {
//     ctnt1: `ctnt1`,
//     ctnt2: "ctnt2",
//     ctnt3: `내용입니다. 니여랜열닝런열ㄴㅇ
//     ㅇㄴ
//     $review0$
//     ㄹㄴ일ㄴ이런ㅇㄹ

//     ㄴ이러닝러니
//     $review1$
//     ㄹㄴ일ㄴ이런ㅇㄹ

//     ㄴ이러닝러니
//     ㄹㄴ일ㄴ이런ㅇㄹ
//     $review2$
//     ㄴ이러닝러니
//     ㄹㄴ일ㄴ이런ㅇㄹ
//     $review3$
//     ㄴ이러닝러니
//     ㄹㄴ일ㄴ이런ㅇㄹ

//     ㄴ이러닝러니
//     `,
//     reviewCnt: 4,
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
