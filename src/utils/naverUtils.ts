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
import { WebDriver, By, Key } from "selenium-webdriver";
import { getRandom } from ".";

/**
 * 네이버 로그인하기
 */
async function naverLogin(id: string, password: string, site: string) {
  const naverLoginUrl = `https://nid.naver.com/nidlogin.login`; // 네이버 로그인 url
  const eleId = `//*[@id="id"]`; // 아이디
  const elePw = `//*[@id="pw"]`; // 비밀번호
  const eleLoginBtn = `//*[@id="frmNIDLogin"]/fieldset/input`; // 로그인 버튼
  const eleAwalysBtn = `//*[@id="new.dontsave"]`; // 자주사용 등록안함 버튼
  const driver = await getDrive(site);

  // 1. 로그인 페이지 호출
  await getLoginPage(driver, naverLoginUrl);
  // 2. 아이디,비밀번호 입력
  await copyClipBoard(driver, eleId, id); // 아이디
  await copyClipBoard(driver, elePw, password); // 비밀번호
  // 3. 로그인버튼 클릭
  await btnClick(driver, eleLoginBtn);

  const donSave = await (await driver.findElements(By.xpath(eleAwalysBtn)))
    .length;

  if (donSave > 0) {
    const isAwalyBtn = await (
      await driver.findElement(By.xpath(eleAwalysBtn))
    ).isDisplayed();
    if (isAwalyBtn) {
      // 4. 자주사용등록안함 버튼 클릭
      await btnClick(driver, eleAwalysBtn);
    }
  }
  const mainPage = await driver;

  return mainPage;
}

/**
 * 메인화면 블로그TAB 버튼
 */
async function moveBlog(selfDriver: WebDriver) {
  const eleBlogTab = `//*[@id="NM_FAVORITE"]/div[1]/ul[1]/li[3]/a`; // 네이버 메인화면의 블로그탭
  try {
    // const mainDriver = await naverLogin();
    await btnClick(selfDriver, eleBlogTab); // 블로그 탭버튼 클릭
  } catch (err) {
    await logOut(selfDriver);
    throw "moveBlog err";
  }

  return selfDriver;
}

/**
 * 글쓰기버튼 클릭
 */
async function clickWriteButton(selfDriver: WebDriver) {
  const eleWriteBtn = `//*[@id="container"]/div/aside/div/div[1]/nav/a[2]`; // 글쓰기버튼

  const writerDriver = await moveBlog(selfDriver);
  await btnClick(writerDriver, eleWriteBtn); // 글쓰기버튼 클릭

  return writerDriver;
}

/**
 * chrome 탭화면 전환
 */
async function moveLastTab(selfDriver: WebDriver) {
  const arrTabs = await selfDriver.getAllWindowHandles();
  await selfDriver.switchTo().window(arrTabs[arrTabs.length - 1]);
  await selfDriver.sleep(getRandom());

  return selfDriver;
}

/**
 * 사진첨부버튼 클릭
 * @param selfDriver
 * @param imgUrl
 */
async function clickPictureButton(selfDriver: WebDriver, imgUrl: string) {
  const eleAttachFileBtn = `//*[@id="se2_tool"]/div[1]/ul[1]/li[1]/button/span[1]`; // 사진첨부 버튼
  const eleImgFileTag = `//*[@id="pc_image_file"]`; // 이미지 파일 업로드 태그
  const eleUploadBtn = `/html/body/div[3]/header/div[2]/button`; // 이미지파일 업로드 버튼
  const nextViewBtn = `/html/body/div[2]/div/button`; // 파일업로드 메시지 팝업 X 버튼

  // 1. 사진첨부 버튼 클릭
  await btnClick(selfDriver, eleAttachFileBtn);
  // 2. 이미지등록화면 진입후 alert 경고창 화면으로 전환
  let alertDriver = await moveLastTab(selfDriver);
  const closeNextViewBtn = await (
    await alertDriver.findElement(By.xpath(nextViewBtn))
  ).isDisplayed();
  if (closeNextViewBtn) {
    await btnClick(alertDriver, nextViewBtn); //  X 버튼 클릭
  }
  // 3. chrome windows 이미지등록  화면으로 전환
  const pictureDriver = await moveLastTab(alertDriver);
  // 4. 이미지 첨부파일 선택
  await pictureDriver.findElement(By.xpath(eleImgFileTag)).sendKeys(imgUrl);
  await pictureDriver.sleep(getRandom(2000));
  // 5. 이미지 첨부파일 업로드 버튼 클릭
  await (await pictureDriver.findElement(By.xpath(eleUploadBtn))).click();
  await pictureDriver.sleep(getRandom(2000));

  return pictureDriver;
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
/**
 * 네이저 자동 블로그 포스팅
 */
async function writeNaverPost({
  id,
  password,
  imgUrl,
  subject,
  content,
  selectType,
  tags,
  site,
}: WriteNaverPostProps) {
  const eleType = `//*[@id="post.category.categoryNo"]`; // 게시판 종류
  const eleSubject = `//*[@id="subject"]`; // 제목
  const eleHtmlBtn = `//*[@id="smart_editor2_content"]/div[5]/ul/li[2]/button`; // html 입력버튼
  const eleTextarea = `//*[@id="smart_editor2_content"]/div[4]/textarea[1]`; // html textarea
  const eleTag = `//*[@id="tagList"]`; // 태그
  const eleSaveBtn = `//*[@id="btn_submit"]/img`; // 발행 버튼
  const eleMainFrame = `//*[@id="mainFrame"]`; // 메인 iframe

  const driver = await naverLogin(id, password, site); // 네이버 로그인하기
  // 글쓰기버튼클릭
  const writerDriver = await clickWriteButton(driver);
  // chrome탭화면 전환
  const lastWindowDriver = await moveLastTab(writerDriver);

  // iframe 전환
  const mainFrame = await moveMainFrame(lastWindowDriver, eleMainFrame);

  // 게시판 종류 선택
  await selectBox(mainFrame, eleType, selectType);
  // 제목 입력
  await copyClipBoard(mainFrame, eleSubject, subject);

  // 사진첨부버튼 클릭
  const pictureDriver = await clickPictureButton(mainFrame, imgUrl);

  // chrome탭화면 전환
  const lastWindowDriver2 = await moveLastTab(pictureDriver);
  // iframe 전환
  const mainFrame2 = await moveMainFrame(lastWindowDriver2, eleMainFrame);

  // html 입력창으로 이동
  await btnClick(mainFrame2, eleHtmlBtn);

  // html 이미지등록 태그 복사
  await btnClick(mainFrame2, eleTextarea);
  const txtValue = await (
    await mainFrame2.findElement(By.xpath(eleTextarea))
  ).getAttribute("value");

  // html 내용 입력(이미지등록태그 + 내용)
  await copyClipBoard(mainFrame2, eleTextarea, `${txtValue} ${content}`);

  const eleSubjectCombo = `//*[@id="directoryArea"]/div/div[1]/div[1]`; // 주제분류 콤보
  const eleSubjectType = `//*[@id="seq21"]`; // 상품리뷰
  await btnClick(mainFrame2, eleSubjectCombo);
  await btnClick(mainFrame2, eleSubjectType); // 상품리뷰 라디오버튼
  // 태그 입력
  await copyClipBoard(mainFrame2, eleTag, tags);

  // chrome 메인 탭화면 전환
  const lastWindowDriver3 = await moveLastTab(mainFrame2);
  // 메인 iframe 전환
  const mainFrame3 = await moveMainFrame(lastWindowDriver3, eleMainFrame);
  //  발행
  await btnClick(mainFrame3, eleSaveBtn);

  // 로그아웃
  await logOut(mainFrame3);
}

/**
 * 네이버 자동 블로그 포스팅 beta버전 미완성 버전  미사용
 */
async function writeNaverPostBeta({
  id,
  password,
  imgUrl,
  subject,
  content,
  selectType,
  tags,
  site,
}: WriteNaverPostProps) {
  const eleType = `//*[@id="post.category.categoryNo"]`; // 게시판 종류
  const eleSubject = `//*[@id="subject"]`; // 제목
  const eleHtmlBtn = `//*[@id="smart_editor2_content"]/div[5]/ul/li[2]/button`; // html 입력버튼
  const eleTextarea = `//*[@id="smart_editor2_content"]/div[4]/textarea[1]`; // html textarea
  const eleTag = `//*[@id="tagList"]`; // 태그
  const eleSaveBtn = `//*[@id="btn_submit"]/img`; // 발행 버튼
  const eleMainFrame = `//*[@id="mainFrame"]`; // 메인 iframe

  const driver = await naverLogin(id, password, site); // 네이버 로그인하기
  // 글쓰기버튼클릭
  const writerDriver = await clickWriteButton(driver);
  // chrome탭화면 전환
  const lastWindowDriver = await moveLastTab(writerDriver);

  // iframe 전환
  const mainFrame = await moveMainFrame(lastWindowDriver, eleMainFrame);

  // 작성중인 글을 작성하사겠습니까? layer팝업창 닫기
  const cancelBtn = `//*[@id="blog-editor"]/div/div[1]/div/div[4]/div[2]/div/div[3]/button[1]`;
  const isCancelBtn = (await mainFrame.findElements(By.xpath(cancelBtn)))
    .length;
  if (isCancelBtn > 0) {
    const cancelViewBtn = await (
      await mainFrame.findElement(By.xpath(cancelBtn))
    ).isDisplayed();
    if (cancelViewBtn) {
      await btnClick(mainFrame, cancelBtn); //  X 버튼 클릭
    }
  }
  // 제목입력
  await copyClipBoardBeta(mainFrame, subject, Key.ARROW_LEFT);
  // 내용부분으로 이동
  await keyMove(mainFrame, Key.ARROW_RIGHT);
  const pictureBtn = `//*[@id="blog-editor"]/div/div[1]/div/header/div[1]/ul/li[1]/button/span[1]`;
  mainFrame.findElement(By.xpath(pictureBtn)).sendKeys(imgUrl);
  // await btnClick(mainFrame, pictureBtn); //  사진 클릭
  // 내용입력
  // await copyClipBoardBeta(mainFrame, content);

  // await btnClick(mainFrame, title);
}

export default writeNaverPost;
export {
  naverLogin,
  moveLastTab,
  getLoginPage,
  clickWriteButton,
  clickPictureButton,
  writeNaverPostBeta,
};
