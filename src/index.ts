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
//     ctnt1: `<p><br></p>
//     <p>
//       <span style="font-size: 24pt; color: rgb(217, 72, 15);">베베숲 라이트 아기물티슈 캡형, 80매, 10개</span>
//     </p>
//     <p><br /></p>
//     <p align="center">
//       <span style="color: rgb(172, 172, 172);font-size: 9pt;">오늘은 할인 상품을 소개합니다.<br />
//   우리같이 상품정보를 살펴볼까요?</span>
//     </p>
//           <p><br /></p>
//           <p>
//               <span style="color: rgb(255, 150, 0); font-size: 12pt;">★★★★★</span>
//               <span style="color: rgb(0, 117, 200); font-size: 12pt;">11,488개 상품평</span>
//           </p>
//           <p><br /></p>
//           <p>
//               <span style="font-size: 12pt;">5%
//               <span style="color: rgb(172, 172, 172); font-size: 12pt;"><strike>14,950원</strike></span></span>
//           </p>
//           <p><br /></p>
//           <p><span style="font-size: 24pt; color: rgb(255, 0, 0);">14,200 원<span></p>
//           <p><br></p>
//           <p><img src="https://postfiles.pstatic.net/MjAyMDA0MTBfMjcz/MDAxNTg2NDQ1OTAwMDc5.1T-Iy6-X12_V8iyof2OtSqUCu6urPUUOnjG41kbMy_kg.c1eqxaGayJ1XX0TGV24QXbZg9dvQ9C_dYZx39G_Z7Wog.PNG.cigshop2/rocket_logo.png?type=w773" width="103" height="26" alt="로켓배송"/></p>
//             <p><br></p>
//           <p align="center">
//               <a href="http://me2.do/Fh68I931" target="_blank"><span style="font-size: 18pt;"><b>상품 구매하러가기<b></span></a>
//           </p>
//           <p><br></p>
//           <p>
//             <span  style="font-size: 12pt; color: rgb(70, 70, 70);">상품정보</span>
//           </p>
//             <table style="display: inline-table;border: solid #d2d2d2;border-width: 1px 0 0 1px;width: 100%;border-spacing: 0;">
//               <tbody style="vertical-align: baseline;">
//                 <tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;">
//                   <td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #f7f7f7;">
//                     <p style="text-align:left;margin:0;padding:0;color:#8e8e8e;">
//                       <span>쿠팡상품번호</span>
//                     </p>
//                   </td>
//                   <td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;">
//                     <p style="text-align:left;margin:0;padding:0;">
//                       <span>5986371-33823430</span>
//                     </p>
//                   </td>
//                 </tr>
//                 <tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;"><td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #f7f7f7;"><p style="text-align:left;margin:0;padding:0;color:#8e8e8e;"><span>용량(중량)</span></p></td><td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;"><p style="text-align:left;margin:0;padding:0;"><span>280g (1팩)</span></p></td></tr><tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;"><td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #f7f7f7;"><p style="text-align:left;margin:0;padding:0;color:#8e8e8e;"><span>제품 주요 사양</span></p></td><td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;"><p style="text-align:left;margin:0;padding:0;"><span>모든피부용</span></p></td></tr><tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;"><td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #f7f7f7;"><p style="text-align:left;margin:0;padding:0;color:#8e8e8e;"><span>사용기한 또는 개봉 후 사
// 용기간</span></p></td><td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;"><p style="text-align:left;margin:0;padding:0;"><span>제조일부터 1년. 공급사 사정에 따라 제조일자가 다른 상품이 입고되어 정확한 제조년월일 및 사용기한 확인이 어렵습니다. 제조년월일 확인이 어려운 상품은 유통기한을 기준으로 배송되므로 구매 시 유통기한을 참고 부탁드립
// 니다.</span></p></td></tr><tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;"><td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing:
// border-box;vertical-align: middle;background-color: #f7f7f7;"><p style="text-align:left;margin:0;padding:0;color:#8e8e8e;"><span>사용방법</span></p></td><td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;"><p style="text-align:left;margin:0;padding:0;"><span>스티커 또는 캡으로 된 부분을 열어 원단을 뽑아 피부 결에 따라 가볍게 문질러 닦아준
// 다.</span></p></td></tr><tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;"><td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #f7f7f7;"><p style="text-align:left;margin:0;padding:0;color:#8e8e8e;"><span>제조업자 및 제조판매업자</span></p></td><td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;"><p style="text-align:left;margin:0;padding:0;"><span>에이제이(주)</span></p></td></tr><tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;"><td style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #f7f7f7;"><p style="text-align:left;margin:0;padding:0;color:#8e8e8e;"><span>제조국</span></p></td><td style="width: 65%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;"><p style="text-align:left;margin:0;padding:0;"><span>대한민국</span></p></td></tr>
//                 <tr style="margin:0;padding:0;border:0;vertical-align: baseline;height: 30px;">
//                   <td
//                     colspan="2"
//                     style="width: 35%;border: solid #d2d2d2;border-width: 0 1px 1px 0;box-sizing: border-box;-webkit-box-sizing: border-box;vertical-align: middle;background-color: #fff;text-align: center;"
//                   >
//                     <p style="margin:0;padding:0;">
//                       <a href="http://me2.do/Fh68I931" target="_blank"><span style="font-size: 14pt; color: #2d8bec;"><b>필수표기정보 더보기</b><span></a>
//                     </p>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>`,
//     ctnt2: "",
//     ctnt3: `<p><br></p>  <p><span style="font-size:14pt;color: rgb(37, 37, 37);"><b>상품평</b></span></p>`,
//     reviews: [
//       `'<article style="overflow: hidden;text-overflow: hidden;">\n' +
//     '              <p><span style="font-size: 13px;">김**</span></p>\n' +
//     '              <p>\n' +
//     '                  <span style="font-size: 16px;color: rgb(255,150,0)">★★★★★</span>\n' +
//     '                  <span style="font-size: 16px;color: #888;">2020.05.09</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p><span style="font-size: 9pt; color: rgb(154, 154, 154);">베베숲 라이트 아기물티슈 캡형, 80매, 20개</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p>\n' +
//     '                  \n' +
//     '              </p>\n' +
//     '              <p>\n' +
//     '                <span style="font-size: 11pt;"><b>※구매일: 2020년 5월 6일<br/>※구매가:23,800원<br/><br/>※구매이유:<br/>저희 아이가 신생아때부터 아토피가 있어, 물티슈는 기본이고, 화장품, 먹거리등 모든 사용제품에 유
// 해물질에 대해 꼼꼼히 따지고 공부하고 선별하는것이 습관이 되었었어요. 아토피가 있는 아이를 가진 부모라면 극히 공감하실겁니다. 아이가 벌써 중학교 3학년이네요. 아이 신생아때 물티슈 이슈가 터진적 있었는데 그때 그 이슈에서
// 안전한 제품을 알아보다가 베베숲을 알게되고 16년째인가 계속 베베숲을 정기구매 하게 되었습니다.<br/>처음에는 아이만 사용하다 둘째,  그리고 지금은 온가족이 사용합니다. 그동안 물티슈 이슈가 계속 있어왔지만 그때마다 베베숲
// 은 안전했어요. <br/>물티슈를 아예 안전하게 쓰려면 안전한 소재의 건티슈에 직접물을 가져다니며 쓰는건데 그건 정말 불편하고 번거로운 일이죠ㅜㅜ<br/>그래서 물이 들어간 티슈를 적정기간동안 보관하며 쓰려면 첨가물이 들어갈수
// 밖에 없는데 베베숲에서는 어찌되었던,<br/>최대한 안전한 첨가물을 쓰고,<br/>물관리, 위생관리, 연구소를 통한 안전성 테스트를 철저히 하더라구요. 그럴수밖에 없는게 중소기업이 이슈가 터지면<br/>엄청난 타격이 올수밖에 없는 구
// 조니까요.^^;;<br/><br/>※16년간 실사용 솔직후기:<br/><br/>물티슈는 두께, 넓이, 물의 함량, 엠보싱의 구조로 인한 닦임성,  냄새등이 중요한데.<br/>특히 두께와 넓이가  가장 중요하죠^^<br/>라이트제품은 두께가 50gsm 보급형, 가
// 성비 제품입니다.<br/>시그니쳐 레드 제품은 80gsm입니다.<br/>※<br/>평랑 이란?<br/>평량 단위는 gsm<br/>Gram per Square Metre의 줄임말.<br/>예를 들어 50gsm은<br/>가로세로 1m x 1m 원단 무게가 50g 이라는 뜻.<br/>숫자가 클수
// 록 두껍겠지요~~<br/><br/>80gsm까지 단계별로 두께 종류 제품라인이 있고 휴대용매수, 대용량 매수, 캡형, 스티커형등 그동안 용도별, 취향별 다양한 제품들이 나와서.<br/>솔직히 다른회사 제품과 비교가 무의미하더라구요.<br/>본인
// 이 필요로 하는 기능과 용도, 취향, 예산에 따라 어떤라인의 제품을 원하는지 선택후 구매하면 되니까요.<br/>저는 16년간 쭉~ 라이트만 썼어요.<br/>80매 한팩당 1100원 정도에 이정도 제품이라면 더 뭐를 고민하겠나 해서요.<br/>국
// 민가게 다** 가보면 최저가 물티슈가 천원인데 베베숲것과 비교해보면 베베숲의 가성비를 제대로 느낄수있더라구요. <br/>유***리등 탑브랜드 제품만 고집하는 분이 아니면 두고 두고 오래쓸수 있는 좋은제품, 개인적으로 추천합니다.</b></span>\n' +
//     '              </p>\n' +
//     '          </article>'`,
//       `'<article style="overflow: hidden;text-overflow: hidden;">\n' +
//     '              <p><span style="font-size: 13px;">문**</span></p>\n' +
//     '              <p>\n' +
//     '                  <span style="font-size: 16px;color: rgb(255,150,0)">★★★★★</span>\n' +
//     '                  <span style="font-size: 16px;color: #888;">2020.04.29</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p><span style="font-size: 9pt; color: rgb(154, 154, 154);">베베숲 라이트 아기물티슈 캡형, 80매, 10개</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p>\n' +
//     '                  \n' +
//     '              </p>\n' +
//     '              <p>\n' +
//     '                <span style="font-size: 11pt;"><b>제로  소프트  다 써봤었구요<br/>라이트는 안써봐서  구매해봤어요<br/>제로랑  매수는 똑같지만 표면은 엠보싱이 있고  <br/>길이가 조금  길어요<br/>수분감도 적당하고<br/>두께감도  괜찮구요~<br/>저는  원래  두장씩  사용했어서 <br/>좋아요</b></span>\n' +
//     '              </p>\n' +
//     '          </article>'`,
//       `'<article style="overflow: hidden;text-overflow: hidden;">\n' +
//     '              <p><span style="font-size: 13px;">김**</span></p>\n' +
//     '              <p>\n' +
//     '                  <span style="font-size: 16px;color: rgb(255,150,0)">★★★★☆</span>\n' +
//     '                  <span style="font-size: 16px;color: #888;">2020.03.17</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p><span style="font-size: 9pt; color: rgb(154, 154, 154);">베베숲 라이트 아기물티슈 캡형, 80매, 10개</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p>\n' +
//     '                  \n' +
//     '              </p>\n' +
//     '              <p>\n' +
//     '                <span style="font-size: 11pt;"><b>어린이집에서 물티슈필요하다고해서 구매했어요<br/>아이가 이제 어리지는 않아서 너무 비싼걸 사기에는 조금 부담이여서;;<br/>근데 베베숲 예전에 쓸땐 몰랐는데 요번에 케
// 이스 캡열고나면 안에 뭔가 엄마들 힘이 나는 문구들이 적혀 있어서 웃음이 나더라구요^^<br/>엠보싱처리되어 너무 두껍지도 않은 적당한 두께이고 크기도 너무 크지 않은거같아요ㅎ</b></span>\n' +
//     '              </p>\n' +
//     '          </article>'`,
//       `'<article style="overflow: hidden;text-overflow: hidden;">\n' +
//     '              <p><span style="font-size: 13px;">제**</span></p>\n' +
//     '              <p>\n' +
//     '                  <span style="font-size: 16px;color: rgb(255,150,0)">★★★★★</span>\n' +
//     '                  <span style="font-size: 16px;color: #888;">2020.02.25</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p><span style="font-size: 9pt; color: rgb(154, 154, 154);">베베숲 라이트 아기물티슈 캡형, 80매, 10개</span>\n' +
//     '              </p>\n' +
//     '              <p><br></p>\n' +
//     '              <p>\n' +
//     '                  <span style="font-size: 11pt; color: rgb(125, 125, 125);">무난하기 쓰기편하지만 두께감 얆아서 2장씩뽑네요</span>\n' +
//     '              </p>\n' +
//     '              <p>\n' +
//     '                <span style="font-size: 11pt;"><b>-구매이유<br/>6세아이를 키우는 맘으로 온집안청소 또는 아이에게 사용되는 물티슈로 항상 있어야하는 필수물품<br/><br/>-좋은점<br/>적당한 촉촉함에 무난히 쓰기에 괜찮은
// 거같어요<br/>뚜껑관리만 잘한다면 물티슈가 마르는 일이 없을듯하네요<br/><br/>-필요사항<br/>가격대가 드른제품에 비해 조금 저렴한것빼고는 1장의<br/>티슈만으로 조금 부족한 느낌이라 2장으로 사용해야<br/>만족감을 느낄수있네
// 요<br/><br/>-팁<br/>뚜껑관리가 안되면 물티슈가 마르기때문에 마른 티슈로 먼지를 닦으면 잘 닦이네요<br/><br/>-재구매의사<br/>향과 자극없는 물티슈지만 두께감이 아쉬어 조금더 가격을보테 두께감있는 제품을 사용을 하는게 좋을
// 듯하네요</b></span>\n' +
//     '              </p>\n' +
//     '          </article>'`,
//     ],
//     ctnt4: `<p><br></p>
//     <p>
//     <span style="font-size: 12pt;color: #888;">
//         해당 상품 포스팅은 2020년06월01일 07시15분에 작성되었으며 쿠팡 파트너스 활동으로, 일정액의 커미션을 쿠팡으로 부터 제공 받을 수 있습니다.
//         </span>
//     </p>`,
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
