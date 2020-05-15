import {
  getDrive,
  getLoginPage,
  copyClipBoard,
  btnClick,
  switchToFrame,
  switchToDefault,
  switchToParent,
} from "./webDriverUtils";
import { WebDriver, By, Key, until } from "selenium-webdriver";
import { getRandom } from ".";
import { write } from "clipboardy";

/**
 * 티스토리 로그인하기
 */
async function tistoryLogin(id: string, password: string, site: string) {
  const naverLoginUrl = `https://www.tistory.com/auth/login?redirectUrl=https://www.tistory.com/`; // 티스토리 로그인 url
  const eleId = `//*[@id="loginId"]`; // 아이디
  const elePw = `//*[@id="loginPw"]`; // 비밀번호
  const eleLoginBtn = `//*[@id="authForm"]/fieldset/button`; // 로그인 버튼
  // const eleAwalysBtn = `//*[@id="new.dontsave"]`; // 자주사용 등록안함 버튼
  const driver = await getDrive(site);

  // 1. 로그인 페이지 호출
  await getLoginPage(driver, naverLoginUrl);
  // 로그인화면 존재여부 확인
  const isLogind = await (await driver.findElements(By.xpath(eleId))).length;
  if (isLogind > 0) {
    // 2. 아이디,비밀번호 입력
    await copyClipBoard(driver, eleId, id); // 아이디
    await copyClipBoard(driver, elePw, password); // 비밀번호
    // 3. 로그인버튼 클릭
    await btnClick(driver, eleLoginBtn);
  }

  const mainPage = await driver;

  return mainPage;
}

/**
 * 기본모드 글쓰기 interface
 */
interface ModeProps {
  imgUrl: string[];
  subject: string;
  content: contentProps;
  selectType: string;
  tags: string;
}
/**
 * 기본모드 글쓰기
 */
async function basicMode(
  selfDriver: WebDriver,
  { imgUrl, subject, content, selectType, tags }: ModeProps
) {
  // 제목 입력
  const blogTitle = `//*[@id="editorContainer"]/div[2]/textarea`;
  const ctnt = `//*[@id="tinymce"]`;
  await copyClipBoard(selfDriver, blogTitle, subject);

  await selfDriver.switchTo().frame(0);
  await selfDriver.sleep(getRandom());

  await copyClipBoard(selfDriver, ctnt, `${content.ctnt1 + content.ctnt3}`);

  await selfDriver.switchTo().defaultContent();
}

/**
 * MarkDown 모드 글쓰기
 */
async function makrdownMode(
  selfDriver: WebDriver,
  { imgUrl, subject, content, selectType, tags }: ModeProps
) {
  const modetypeBtn = `//*[@id="mceu_18-open"]`; // 모드 선택(기본, 마크다운, HTML)
  const markdownMode = `//*[@id="mceu_31"]`; // markdown 모드
  // const htmlMode = `//*[@id="mceu_32"]`; // html 모드
  const imgFileBtn = `//*[@id="editorContainer"]/div[1]/div[3]/div/div/div/div/div/div[1]/div/div[1]/button`; // 첨부파일 선택버튼
  const inputImg = `//*[@id="editorContainer"]/div[1]/div[3]/div/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/input`; // 이미지 업로드 input box
  const eleTitle = `//*[@id="editorContainer"]/div[1]/div[2]/textarea`; // 제목
  const eleCont = `//*[@id="editorContainer"]/div[1]/div[4]/div/div/div[6]/div[1]/div/div/div/div[5]/pre`; // 내용
  const eleTag = `//*[@id="tagText"]`; // 태그입력

  await btnClick(selfDriver, modetypeBtn); // 모드 선택
  await btnClick(selfDriver, markdownMode); // mark down 선택
  await (await selfDriver.switchTo().alert()).accept(); // alert 확인버튼 클릭
  await selfDriver.sleep(getRandom());

  await copyClipBoard(selfDriver, eleTitle, subject); // 제목입력
  await btnClick(selfDriver, eleCont); // 내용 클릭

  await btnClick(selfDriver, imgFileBtn); // 첨부파일 버튼 클릭
  await selfDriver.findElement(By.xpath(inputImg)).sendKeys(imgUrl[0]); // 이미지 첨부

  await selfDriver.sleep(getRandom());

  // markdown 내용 영역 클릭
  await btnClick(selfDriver, eleCont);

  // 첨부파일 이미지 제일뒤 엔터키2번 아래로 이동
  const actionId = await selfDriver.actions();
  actionId
    .keyDown(Key.END)
    .keyUp(Key.END)
    .keyDown(Key.ENTER)
    .keyUp(Key.ENTER)
    .keyDown(Key.ENTER)
    .keyUp(Key.ENTER)
    .perform();

  await selfDriver.sleep(getRandom());

  // 내용 클립보드 복사
  await write(`${content.ctnt1 + content.ctnt3}`);
  // 내용 붙여넣기
  actionId.keyDown(Key.CONTROL).sendKeys("v").keyUp(Key.CONTROL).perform();

  await selfDriver.sleep(getRandom());

  // 태그입력
  await copyClipBoard(selfDriver, eleTag, tags); // 제목입력

  await selfDriver.switchTo().defaultContent();
}

/**
 * recaptcha 우회
 */
async function resolveRecaptcha(selfDriver: WebDriver) {
  const reCaptchaConfirmBtn = `//*[@id="solver-button"]`; // reCaptcha 체크박스 버튼
  // const reFrame = `//*[@id="editor-root"]/div[9]`; // reCaptcha 프레임 , 기본모드
  const reFrame = `//*[@id="editor-root"]/div[8]/div[2]`; // reCaptcha 프레임, MarkDown 모드

  await switchToFrame(selfDriver, 2); // reCaptcha iframe로 포커스 변경,  기본모드: 3, MarkDown모드: 2

  await btnClick(selfDriver, reCaptchaConfirmBtn);
  await selfDriver.sleep(getRandom(1000));

  await switchToDefault(selfDriver); // 메인 frame로 변경
  let isDisplay: boolean = false;
  const isStillReFrame = (await selfDriver.findElements(By.xpath(reFrame)))
    .length;
  if (isStillReFrame > 0) {
    isDisplay = await (
      await selfDriver.findElement(By.xpath(reFrame))
    ).isDisplayed();
  }

  if (isDisplay) {
    await resolveRecaptcha(selfDriver);
  }
}

/**
 * 공개발행 버튼 클릭
 */
async function postingBtnClick(selfDriver: WebDriver, saveBtn: string) {
  // 공개발행 버튼
  await btnClick(selfDriver, saveBtn);
  await selfDriver.sleep(getRandom());
}

interface contentProps {
  ctnt1: string;
  ctnt2: string;
  ctnt3: string;
}
interface WriteNaverPostProps {
  id: string;
  password: string;
  imgUrl: string[];
  subject: string;
  content: contentProps;
  selectType: string;
  tags: string;
  site: string;
}
async function writeTistoryPost({
  id,
  password,
  imgUrl,
  subject,
  content,
  selectType,
  tags,
  site,
}: WriteNaverPostProps) {
  const mainDriver = await tistoryLogin(id, password, site);

  const headMenu = `//*[@id="kakaoHead"]/div/div[3]/div/a[2]`;
  await btnClick(mainDriver, headMenu);

  const blogBtn = `//*[@id="kakaoHead"]/div/div[3]/div/div/div/div[2]/div/div[1]/a[2]`;
  await btnClick(mainDriver, blogBtn);

  await mainDriver.wait(until.titleIs("새로운 글쓰기"), 1000);

  // await basicMode(mainDriver, { imgUrl, subject, content, selectType, tags }); // 기본모드 글쓰기
  await makrdownMode(mainDriver, {
    imgUrl,
    subject,
    content,
    selectType,
    tags,
  }); // MarkDown모드 글쓰기

  // 첫번재 공개발행 버튼
  const saveBtn = `//*[@id="kakaoWrap"]/div[3]/div[2]/button`;
  await postingBtnClick(mainDriver, saveBtn);

  await switchToFrame(mainDriver, 0); // 기본모드:1, MarkDown모드: 0
  // recatpcha 체크박스 버튼
  const reCaptcha = `//*[@id="recaptcha-anchor"]/div[1]`;
  //*[@id="recaptcha-anchor"]/div[1]
  await btnClick(mainDriver, reCaptcha);
  await mainDriver.sleep(getRandom()); // reCaptcha 클릭시 로딩이 좀 오래걸려서 sleep 추가

  await switchToDefault(mainDriver);

  await resolveRecaptcha(mainDriver);

  await switchToParent(mainDriver);

  // 최종 공개발행 버튼
  // const saveBtn2 = `//*[@id="editor-root"]/div[6]/div/div/div/form/fieldset/div[3]/div/button[2]`; // 기본모드
  const saveBtn2 = `//*[@id="editor-root"]/div[5]/div/div/div/form/fieldset/div[3]/div/button[2]`; // MarkDown 모드

  await postingBtnClick(mainDriver, saveBtn2);
}

export default writeTistoryPost;
// `//*[@id="mceu_37-text"]`; // 마크다운
