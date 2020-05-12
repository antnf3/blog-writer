// import "chromedriver";
// import "dotenv/config";
import {
  Builder,
  By,
  Key,
  WebDriver,
  WebElementPromise,
  WebElement,
} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { write } from "clipboardy";
import { getRandom } from "../utils";
import { IKey } from "selenium-webdriver/lib/input";

/**
 * Chrome 옵션 설정
 */
function getChromeOptions(site: string) {
  /**
   * Set chrome command line options/switches
   */
  const chromeOptions = new chrome.Options();
  // chromeOptions.addArguments("test-type");
  // chromeOptions.addArguments("start-maximized");
  // chromeOptions.addArguments("--js-flags=--expose-gc");
  // chromeOptions.addArguments("--enable-precise-memory-info");
  // chromeOptions.addArguments("--disable-popup-blocking");
  // chromeOptions.addArguments("--disable-default-apps");
  // chromeOptions.addArguments("--disable-infobars");
  // chromeOptions.addArguments("headless");

  // chromeOptions.addArguments("--disable-dev-shm-usage");
  // chromeOptions.addArguments("--no-sandbox");

  chromeOptions.addArguments("disable-gpu"); // applicable to windows os only
  chromeOptions.addArguments("window-size=1920x1080");
  chromeOptions.addArguments("lang=ko_KR");
  chromeOptions.addArguments(
    `user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36`
  );
  chromeOptions.addArguments(`user-data-dir=\\user-data\\${site}\\`);

  return chromeOptions;
}

/**
 * driver 생성
 */
async function getDrive(site: string) {
  try {
    return await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(getChromeOptions(site))
      .build();
  } catch (err) {
    console.log(err);
    throw "getDrive error";
  }
}

/**
 * 로그인 페이지 호출
 */
async function getLoginPage(selfDriver: WebDriver, url: string) {
  try {
    await selfDriver.get(url);
    await selfDriver.sleep(getRandom());
  } catch (err) {
    await logOut(selfDriver);
    throw "getLoginPage error";
  }
}

/**
 * 입력창에 문자열을 클립보드에 복사하여 붙여넣는다.
 */
async function copyClipBoard(
  selfDriver: WebDriver,
  element: string,
  val: string
) {
  //클립보드 복사
  await write(val);
  await btnClick(selfDriver, element);
  await (await selfDriver.findElement(By.xpath(element))).clear();
  await btnClick(selfDriver, element);
  const actionId = await selfDriver.actions();
  await actionId
    .keyDown(Key.CONTROL)
    .sendKeys("v")
    .keyUp(Key.CONTROL)
    .perform();

  await selfDriver.sleep(getRandom());
}

/**
 * key 코드 입력
 */
async function keyMove(selfDriver: WebDriver, keyValue: string) {
  const actionId = await selfDriver.actions();
  await actionId.keyDown(keyValue).keyUp(keyValue).perform();

  await selfDriver.sleep(getRandom());
}
/**
 * 클립보드 복사  beta 편집기
 */
async function copyClipBoardBeta(
  selfDriver: WebDriver,
  val: string,
  keyValue?: string
) {
  //클립보드 복사
  await write(val);
  if (keyValue) {
    // key 이동
    await keyMove(selfDriver, keyValue);
  }
  const actionId = await selfDriver.actions();
  await actionId
    .keyDown(Key.CONTROL)
    .sendKeys("v")
    .keyUp(Key.CONTROL)
    .perform();

  await selfDriver.sleep(getRandom());
}

/**
 * 클릭이벤트 발생
 */
async function btnClick(selfDriver: WebDriver, element: string) {
  try {
    await (await selfDriver.findElement(By.xpath(element))).click(); // 버튼 클릭
    await selfDriver.sleep(getRandom());
  } catch (err) {
    console.log(err);
    // await logOut(selfDriver);
    throw "btnClick err";
  }
}

/**
 * iframe로 전환
 */
async function moveMainFrame(selfDriver: WebDriver, element: string) {
  let mainFrame: WebElement;
  try {
    mainFrame = await selfDriver.findElement(By.xpath(element));
  } catch (err) {
    await logOut(selfDriver);
    throw "moveMainFrame err";
  }
  await selfDriver.switchTo().frame(mainFrame);
  await selfDriver.sleep(getRandom());

  return selfDriver;
}

/**
 * select box  값 선택
 */
async function selectBox(
  selfDriver: WebDriver,
  element: string,
  value: string
) {
  const options = await (
    await selfDriver.findElement(By.xpath(element))
  ).findElements(By.tagName("option"));
  await options.map(async (option) => {
    const txt = await option.getAttribute("value");
    if (txt == value) {
      await option.click();
    }
  });
  await selfDriver.sleep(getRandom());
}

/**
 * 로그아웃
 */
async function logOut(selfDriver: WebDriver) {
  // const myMenuBtn = `//*[@id="gnb_my_namebox"]/a[1]`; // 아이디버튼
  // const logoutBtn = `//*[@id="gnb_logout_button"]/span[3]`;
  // await btnClick(selfDriver, myMenuBtn);
  // await btnClick(selfDriver, logoutBtn);
  // await selfDriver.close();
  await selfDriver.quit();
}

/**
 * 내용 입력(미사용)
 */
async function regContent(selfDriver: WebDriver, elemet: string, val: string) {
  // element 클릭
  await (await selfDriver.findElement(By.xpath(elemet))).click();
  await selfDriver.sleep(getRandom());

  // 내용 입력
  await (await selfDriver.findElement(By.xpath(elemet))).clear();
  await selfDriver.findElement(By.xpath(elemet)).sendKeys(val);
  await selfDriver.sleep(getRandom());
}

export {
  getDrive,
  getLoginPage,
  copyClipBoard,
  btnClick,
  moveMainFrame,
  selectBox,
  logOut,
  copyClipBoardBeta,
  keyMove,
};
