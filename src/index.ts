import "chromedriver";
import writeNaverPost, { writeNaverPostBeta } from "./utils/naverUtils";
import writeTistoryPost from "./utils/tistoryUtils";
// import "dotenv/config";

// const param = {
//   id: `${process.env.NAVER_ID}`,
//   password: `${process.env.NAVER_PW}`,
//   imgUrl: `C:/Users/antnf/Desktop/saafsf.jpg`,
//   subject: "제목입니다.",
//   content: "내용입니다.",
//   selectType: "6",
//   tags: `#학교, #하교, #등교`,
//   site: `naver`
// };
// writeNaverPost(param);

// const param = {
//   id: `${process.env.TISTORY_ID}`,
//   password: `${process.env.TISTORY_PW}`,
//   imgUrl: `C:/Users/C14A-080/Desktop/lens-4192777_960_720.jpg`,
//   subject: "제목.",
//   content: "내용입.",
//   selectType: "6",
//   tags: `학교,하교,등교`,
//   site: `tistory`,
// };
// writeTistoryPost(param);
export { writeNaverPost, writeTistoryPost };
