// import "chromedriver";
import {
  getDrive,
  getLoginPage,
  copyClipBoard,
  btnClick,
  moveMainFrame,
  logOut,
  selectBox,
  copyClipBoardBeta,
  keyMove,
} from "./webDriverUtils";
import { WebDriver, By, Key, until } from "selenium-webdriver";
import { getRandom } from ".";
import { moveLastTab } from "./naverUtils";
import { log } from "console";

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

interface WriteNaverPostProps {
  id: string;
  password: string;
  imgUrl: string;
  subject: string;
  content: string;
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

  // 제목 입력
  const blogTitle = `//*[@id="editorContainer"]/div[2]/textarea`;
  await copyClipBoard(mainDriver, blogTitle, "제목입니다.");

  await mainDriver.switchTo().frame(0);
  await mainDriver.sleep(getRandom());
  const ctnt = `//*[@id="tinymce"]`;
  await copyClipBoard(mainDriver, ctnt, "내요입니다.");

  await mainDriver.switchTo().defaultContent();
  // 첫번재 공개발행 버튼
  const saveBtn = `//*[@id="kakaoWrap"]/div[3]/div[2]/button`;
  await postingBtnClick(mainDriver, saveBtn);

  await switchToFrame(mainDriver, 1);
  // recatpcha 체크박스 버튼
  const reCaptcha = `//*[@id="recaptcha-anchor"]/div[1]`;
  await btnClick(mainDriver, reCaptcha);
  await mainDriver.sleep(getRandom()); // reCaptcha 클릭시 로딩이 좀 오래걸려서 sleep 추가

  await switchToDefault(mainDriver);

  await switchToFrame(mainDriver, 3);

  await resolveRecaptcha(mainDriver);

  await switchToParent(mainDriver);

  // 최종 공개발행 버튼
  const saveBtn2 = `//*[@id="editor-root"]/div[6]/div/div/div/form/fieldset/div[3]/div/button[2]`;
  await postingBtnClick(mainDriver, saveBtn2);
}

/**
 * default로 변경
 */
async function switchToDefault(selfDriver: WebDriver) {
  await selfDriver.switchTo().defaultContent();
}

/**
 * parent 변경
 */
async function switchToParent(selfDriver: WebDriver) {
  await selfDriver.switchTo().parentFrame();
}

/**
 * iframe로 변경
 */
async function switchToFrame(selfDriver: WebDriver, frameIdx: number) {
  await selfDriver.switchTo().frame(frameIdx);
}
/**
 * recaptcha 우회
 */
async function resolveRecaptcha(selfDriver: WebDriver) {
  const reCaptchaConfirmBtn = `//*[@id="solver-button"]`;
  const reFrame = `//*[@id="editor-root"]/div[9]`;

  await btnClick(selfDriver, reCaptchaConfirmBtn);
  const delaySeconds = getRandom(1000);
  await selfDriver.sleep(delaySeconds);

  await switchToDefault(selfDriver);
  let isDisplay: boolean = false;
  const isStillReFrame = (await selfDriver.findElements(By.xpath(reFrame)))
    .length;
  if (isStillReFrame > 0) {
    isDisplay = await (
      await selfDriver.findElement(By.xpath(reFrame))
    ).isDisplayed();
  }

  if (isDisplay) {
    await switchToFrame(selfDriver, 3);
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

export default writeTistoryPost;
// `//*[@id="mceu_37-text"]`; // 마크다운
