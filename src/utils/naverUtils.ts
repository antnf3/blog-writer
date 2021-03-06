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
  keyMove_start,
  keyMove_end,
  copyClipBoardNOClear,
  setControlKey,
} from "./webDriverUtils";
import { WebDriver, By, Key, until } from "selenium-webdriver";
import { getRandom } from ".";
import { write } from "clipboardy";

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
  await pictureDriver.sleep(getRandom(5000));

  return pictureDriver;
}

/**
 * 멀티사진첨부버튼 클릭
 * @param selfDriver
 * @param imgUrl
 */
async function clickPictureMultiButton(selfDriver: WebDriver, imgUrl: string) {
  const eleImgFileTag = `//*[@id="pc_image_file"]`; // 이미지 파일 업로드 태그
  // 4. 이미지 첨부파일 선택
  await (await selfDriver.findElement(By.xpath(eleImgFileTag))).clear();
  await selfDriver.findElement(By.xpath(eleImgFileTag)).sendKeys(imgUrl);
  await selfDriver.sleep(getRandom(2000));
}

/**
 * 멀티 사진 등록
 */
async function addMultiImages(
  selfDriver: WebDriver,
  imgUrl: string[],
  { eleHtmlBtn, eleEditorBtn, eleTextarea, eleMainFrame }: any
) {
  let arrImgTags = [];
  let mainFrame2: WebDriver = selfDriver;
  try {
    for (let i = 0, len = 1; i < len; i++) {
      if (i === 0) {
        // 사진첨부버튼 클릭
        const pictureDriver = await clickPictureButton(selfDriver, imgUrl[i]);

        // chrome탭화면 전환
        const lastWindowDriver2 = await moveLastTab(pictureDriver);
        // iframe 전환
        mainFrame2 = await moveMainFrame(lastWindowDriver2, eleMainFrame);

        // html 입력창으로 이동
        await btnClick(mainFrame2, eleHtmlBtn);

        // html 이미지등록 태그 복사
        await btnClick(mainFrame2, eleTextarea);
        arrImgTags.push(
          await (
            await mainFrame2.findElement(By.xpath(eleTextarea))
          ).getAttribute("value")
        );
        // 클리어
        await (await mainFrame2.findElement(By.xpath(eleTextarea))).clear();

        // Editor 입력창으로 이동
        await btnClick(mainFrame2, eleEditorBtn);
      }
    }
    // 이미지가 2장이상일때
    if (imgUrl.length > 1) {
      const eleAttachFileBtn = `//*[@id="se2_tool"]/div[1]/ul[1]/li[1]/button/span[1]`; // 사진첨부 버튼
      const nextViewBtn = `/html/body/div[2]/div/button`; // 파일업로드 메시지 팝업 X 버튼
      const eleUploadBtn = `/html/body/div[3]/header/div[2]/button`; // 이미지파일 업로드 버튼
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

      for (let i = 1, len = imgUrl.length; i < len; i++) {
        // 사진첨부버튼 클릭
        await clickPictureMultiButton(pictureDriver, imgUrl[i]);
      }
      // 5. 이미지 첨부파일 업로드 버튼 클릭
      await (await pictureDriver.findElement(By.xpath(eleUploadBtn))).click();
      // const imgUploadAlert = `/html/body/div[2]`;
      // // await pictureDriver.wait(
      // //   until.elementIsNotVisible(
      // //     pictureDriver.findElement(By.xpath(imgUploadAlert))
      // //   ),
      // //   15000
      // // ); // 업로드 끝날때까지
      // let isUploading = 0;
      // while (isUploading !== -1) {
      //   await pictureDriver.sleep(getRandom());
      //   isUploading = await (
      //     await pictureDriver.findElements(By.xpath(imgUploadAlert))
      //   ).length;

      //   if (isUploading === -1) {
      //     break;
      //   }
      // }

      await pictureDriver.sleep(getRandom(10000));

      // chrome탭화면 전환
      const lastWindowDriver2 = await moveLastTab(pictureDriver);
      // iframe 전환
      mainFrame2 = await moveMainFrame(lastWindowDriver2, eleMainFrame);

      // html 입력창으로 이동
      await btnClick(mainFrame2, eleHtmlBtn);

      // html 이미지등록 태그 복사
      await btnClick(mainFrame2, eleTextarea);
      arrImgTags.push(
        await (
          await mainFrame2.findElement(By.xpath(eleTextarea))
        ).getAttribute("value")
      );
      // 클리어
      await (await mainFrame2.findElement(By.xpath(eleTextarea))).clear();

      // Editor 입력창으로 이동
      await btnClick(mainFrame2, eleEditorBtn);
    }
  } catch (err) {
    console.log(err);
    throw "error::addMultiImages";
  }
  return { mainFrame2, arrImgTags };
}

/**
 * 리뷰 사이에 이모티콘 등록 ( 미사용 )
 */
async function setImoticon(
  selfDriver: WebDriver,
  arrReviews: string[],
  eleHtmlBtn: string,
  eleEditorBtn: string,
  eleTextarea: string
) {
  const imoticonBtn = `//*[@id="se2_tool"]/div[2]/ul[7]/li/button`;
  const imoticonBox = `//*[@id="se2_tool"]/div[2]/ul[7]/li/div`;
  const centerBtn = `//*[@id="se2_tool"]/div[2]/ul[3]/li[2]/button`; // 가운데 정렬
  const arrImtcMenu = [
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/button`,
  ];
  const arrImtc = [
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/div/ul/li[1]/button`,
  ];

  const arrBase = [0, 1, 2, 3, 4, 5];

  for (let i = 0; i < arrReviews.length; i++) {
    console.log("arrBase.length", arrBase.length);
    const rd = Math.floor(Math.random() * 10) % arrBase.length;
    const rdNum = arrBase.splice(rd, 1)[0];
    console.log(rdNum);
    // 첨부파일 이미지 제일뒤 엔터키2번 아래로 이동
    const actionId = await selfDriver.actions();
    await actionId
      .keyDown(Key.CONTROL)
      .sendKeys("a")
      .keyUp(Key.CONTROL)
      .keyDown(Key.CONTROL)
      .sendKeys("x")
      .keyUp(Key.CONTROL)
      .keyDown(Key.CONTROL)
      .sendKeys("v")
      .keyUp(Key.CONTROL)
      .perform();
    await selfDriver.sleep(getRandom());
    await keyMove(selfDriver, Key.END);
    await keyMove(selfDriver, Key.ENTER);

    // 가운데 정렬
    await btnClick(selfDriver, centerBtn);
    // 1. 스티커(이모티콘) 버튼 클릭
    await btnClick(selfDriver, imoticonBtn);

    // await selfDriver.wait(
    //   until.elementIsVisible(selfDriver.findElement(By.xpath(imoticonBox))),
    //   3000
    // ); // 이모티콘화면이 나올때까지
    await selfDriver.sleep(getRandom());
    await btnClick(selfDriver, arrImtcMenu[rdNum]); // 이모티콘 메뉴
    await btnClick(selfDriver, arrImtc[rdNum]); // 이모티콘 선택

    // html 입력창으로 이동
    await btnClick(selfDriver, eleHtmlBtn);

    await copyClipBoardNOClear(selfDriver, eleTextarea, `${arrReviews[i]}`);
    // Editor 입력창으로 이동
    await btnClick(selfDriver, eleEditorBtn);
  }
}

/**
 * 이모티콘 선택 함수
 */
async function selectImoticon(
  selfDriver: WebDriver,
  rdNum: number,
  imoticonUnit: number
) {
  const imoticonBtn = `//*[@id="se2_tool"]/div[2]/ul[7]/li/button`;
  const imoticonBox = `//*[@id="se2_tool"]/div[2]/ul[7]/li/div`;
  const centerBtn = `//*[@id="se2_tool"]/div[2]/ul[3]/li[2]/button`; // 가운데 정렬
  const arrImtcMenu = [
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/button`,
  ];
  const arrImtc = [
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/div/ul/li[1]/button`,
    '//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/div/ul/li[2]/button',
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/div/ul/li[3]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/div/ul/li[4]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[1]/div/ul/li[11]/button`,

    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/div/ul/li[2]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/div/ul/li[3]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/div/ul/li[5]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[2]/div/ul/li[11]/button`,

    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/div/ul/li[3]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/div/ul/li[4]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/div/ul/li[7]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[3]/div/ul/li[12]/button`,

    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/div/ul/li[2]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/div/ul/li[8]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/div/ul/li[31]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[4]/div/ul/li[44]/button`,

    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/div/ul/li[2]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/div/ul/li[8]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/div/ul/li[18]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[5]/div/ul/li[68]/button`,

    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/div/ul/li[1]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/div/ul/li[7]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/div/ul/li[18]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/div/ul/li[34]/button`,
    `//*[@id="se2_tool"]/div[2]/ul[7]/li/div/div/div/ul/li[6]/div/ul/li[22]/button`,
  ];

  // 가운데 정렬
  await btnClick(selfDriver, centerBtn);

  // 1. 스티커(이모티콘) 버튼 클릭
  await btnClick(selfDriver, imoticonBtn);

  await selfDriver.sleep(getRandom());
  await btnClick(selfDriver, arrImtcMenu[rdNum]); // 이모티콘 메뉴
  await selfDriver.sleep(getRandom());
  const imoticon = rdNum * 5 + imoticonUnit;
  await btnClick(selfDriver, arrImtc[imoticon]); // 이모티콘 선택
  await selfDriver.sleep(getRandom());
}
/**
 * 이모티콘 복사 V2
 */
async function setImoticon_V2(selfDriver: WebDriver, reviewCnt: number) {
  const nextSearchBtn = `//*[@id="se2_tool"]/div[2]/ul[6]/li[5]/div/div/div/div[1]/p/button[1]`;
  const closeSearchBtn = `//*[@id="se2_tool"]/div[2]/ul[6]/li[5]/div/div/div/button[2]`;

  const arrBase = [0, 1, 2, 3, 4, 5];

  for (let i = 0; i < reviewCnt; i++) {
    const rd = Math.floor(Math.random() * 10) % arrBase.length;
    const imoticonUnit = Math.floor(Math.random() * 5);
    const rdNum = arrBase.splice(rd, 1)[0];

    await write(`$review${i}$`);
    await selfDriver.sleep(getRandom());
    await setControlKey(selfDriver, "f");
    await setControlKey(selfDriver, "v");
    // 다음찾기 버튼 클릭
    await btnClick(selfDriver, nextSearchBtn);

    await keyMove(selfDriver, Key.ENTER);
    await keyMove(selfDriver, Key.ENTER);
    await keyMove(selfDriver, Key.ARROW_UP);
    // 검색창 닫기 버튼 클릭
    await btnClick(selfDriver, closeSearchBtn);

    await selectImoticon(selfDriver, rdNum, imoticonUnit);
  }
}

/**
 * 이모티콘 복사 V3
 */
async function setImoticon_V3(selfDriver: WebDriver, target: string) {
  const nextSearchBtn = `//*[@id="se2_tool"]/div[2]/ul[6]/li[5]/div/div/div/div[1]/p/button[1]`;
  const closeSearchBtn = `//*[@id="se2_tool"]/div[2]/ul[6]/li[5]/div/div/div/button[2]`;

  const arrBase = [0, 1, 2, 3, 4, 5];

  const rd = Math.floor(Math.random() * 10) % arrBase.length;
  const imoticonUnit = Math.floor(Math.random() * 5);
  const rdNum = arrBase.splice(rd, 1)[0];

  await write(target);
  await selfDriver.sleep(getRandom());
  await setControlKey(selfDriver, "f");
  await setControlKey(selfDriver, "v");
  // 다음찾기 버튼 클릭
  await btnClick(selfDriver, nextSearchBtn);

  await keyMove(selfDriver, Key.ENTER);
  await keyMove(selfDriver, Key.ENTER);
  await keyMove(selfDriver, Key.ARROW_UP);
  // 검색창 닫기 버튼 클릭
  await btnClick(selfDriver, closeSearchBtn);

  await selectImoticon(selfDriver, rdNum, imoticonUnit);
}

/**
 * 내용 속성
 */
interface contentProps {
  ctnt1: string;
  ctnt2: string;
  ctnt3: string;
  reviewCnt: number;
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
/**
 * 네이버 자동 블로그 포스팅
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
  const eleEditorBtn = `//*[@id="smart_editor2_content"]/div[5]/ul/li[1]/button`; // editor 입력버튼
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

  const { mainFrame2, arrImgTags } = await addMultiImages(mainFrame, imgUrl, {
    eleHtmlBtn,
    eleEditorBtn,
    eleTextarea,
    eleMainFrame,
  });
  // // 사진첨부버튼 클릭
  // const pictureDriver = await clickPictureButton(mainFrame, imgUrl[0]);

  // // chrome탭화면 전환
  // const lastWindowDriver2 = await moveLastTab(pictureDriver);
  // // iframe 전환
  // const mainFrame2 = await moveMainFrame(lastWindowDriver2, eleMainFrame);

  // html 입력창으로 이동
  await btnClick(mainFrame2, eleHtmlBtn);

  // // html 이미지등록 태그 복사
  // await btnClick(mainFrame2, eleTextarea);
  // const txtValue = await (
  //   await mainFrame2.findElement(By.xpath(eleTextarea))
  // ).getAttribute("value");

  const [mainImg, ...othersImg] = arrImgTags;
  // html 내용 입력(이미지등록태그 + 내용)
  await copyClipBoard(
    mainFrame2,
    eleTextarea,
    `${mainImg} ${
      content.ctnt1 + content.ctnt2 + othersImg.join("") + content.ctnt3
    }`
  );

  // Editor 입력창으로 이동
  await btnClick(mainFrame2, eleEditorBtn);

  // // 이모티콘
  // await setImoticon(
  //   mainFrame2,
  //   content.reviews,
  //   eleHtmlBtn,
  //   eleEditorBtn,
  //   eleTextarea
  // );

  // 이모티콘
  await setImoticon_V3(mainFrame2, `$rocket_delivery$`);
  // 이모티콘
  await setImoticon_V2(mainFrame2, content.reviewCnt);

  // html 입력창으로 이동
  // await btnClick(mainFrame2, eleHtmlBtn);

  // await copyClipBoardNOClear(mainFrame2, eleTextarea, `${content.ctnt4}`);

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
  mainFrame.findElement(By.xpath(pictureBtn)).sendKeys(imgUrl[0]);
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
