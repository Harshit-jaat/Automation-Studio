const { remote } = require("webdriverio");
const path = require("path");
const {
  waitForElement,
  clickElement,
  enterText,
  getText,
  retryAction,
  handleTestError,
  restartDriver,
  clickFirstAvailableElement,
  scrollInElement,
} = require("../../../utils/elementUtils");

const appiumConfig = require(path.resolve(__dirname, "../../../../config/appium.config"));

const homepagebar = require("../../elements/home/bottomBar");
const filter = require("../../elements/home/filter");
const subject = require("../../elements/home/subjects");
const search = require("../../elements/home/search");

const {normalonbaording} =  require("../../functions/onboarding");


async function home_bottom_bar_clicks() {
    const driver = await remote({
      ...appiumConfig.server,
      capabilities: {
        alwaysMatch: appiumConfig.capabilities,
        firstMatch: [{}],
      },
    });
  
    try {

        console.log("TestCase- Home BottomBar and filters");

      await normalonbaording(driver);
      await driver.pause(5000); 
  
      // ========== Bottom Bar Navigation ==========
      try {
        await clickElement(driver, homepagebar.home.path);
      } catch {
        throw new Error("❌ Home not clicked from bottom bar");
      }
  
      try {
        await clickElement(driver, homepagebar.scan.path);
      } catch {
        throw new Error("❌ Scan not clicked from bottom bar");
      }
  
      try {
        await clickElement(driver, homepagebar.assignments.path);
      } catch {
        throw new Error("❌ Assignments not clicked from bottom bar");
      }
  
      try {
        await clickElement(driver, homepagebar.search.path);
      } catch {
        throw new Error("❌ Search not clicked from bottom bar");
      }
  
      try {
        await clickElement(driver, homepagebar.bookmarks.path);
      } catch {
        throw new Error("❌ Bookmarks not clicked from bottom bar");
      }
  
      try {
        await clickElement(driver, homepagebar.home.path);
      } catch {
        throw new Error("❌ Home not clicked again from bottom bar");
      }
  
      // ========== Subject Clicks ==========
      try {
        await clickElement(driver, subject.biology.path);
      } catch {
        throw new Error("❌ Biology subject not clicked");
      }
  
      try {
        await clickElement(driver, subject.chemistry.path);
      } catch {
        throw new Error("❌ Chemistry subject not clicked");
      }
  
      try {
        await clickElement(driver, subject.physics.path);
      } catch {
        throw new Error("❌ Physics subject not clicked");
      }
  
      try {
        await clickElement(driver, subject.maths.path);
      } catch {
        throw new Error("❌ Maths subject not clicked");
      }
  
      // ========== Filter Grades ==========
      async function clickGrade(gradePath, label) {
        try {
          await clickElement(driver, filter.filter.path);
          await clickElement(driver, gradePath);
          await waitForElement(driver, homepagebar.home.path);
        } catch {
          throw new Error(`❌ ${label} not clicked`);
        }
      }

      async function clickGrade2(gradePath, label) {
        try {
          await clickElement(driver, filter.filter.path);
          await clickElement(driver, filter.upperprimaryschool.path);
          await clickElement(driver, gradePath);
          await waitForElement(driver, homepagebar.home.path);
        } catch {
          throw new Error(`❌ ${label} not clicked`);
        }
      }
  
      // Lower Primary Grades
      await clickGrade(filter.lowerprimaryschool.grades[4].path, "Grade 4 (Lower Primary)");
      await clickGrade(filter.lowerprimaryschool.grades[5].path, "Grade 5 (Lower Primary)");
  
      // Upper Primary Grades
      await clickGrade2(filter.upperprimaryschool.grades[6].path, "Grade 6 (Upper Primary)");
      await clickGrade2(filter.upperprimaryschool.grades[7].path, "Grade 7 (Upper Primary)");
      await clickGrade2(filter.upperprimaryschool.grades[8].path, "Grade 8 (Upper Primary)");

  
      await driver.pause(5000);
      console.log("✅ Home BottomBar and filters - Passed ");

    } catch (error) {
      handleTestError(error, "Normal signup Test");
    } 
  }

  async function searchtest() {
    const localConfig = {
        ...appiumConfig.server,
        capabilities: {
          ...appiumConfig.capabilities,
          "appium:noReset": true,       
          "appium:fullReset": false,    
        },
      };
    
      const driver = await remote({
        ...localConfig,
        capabilities: {
          alwaysMatch: localConfig.capabilities,
          firstMatch: [{}],
        },
      });
    try {
        console.log("TestCase- Searching");
        // await normalonbaording(driver);
        // await driver.pause(5000); 
        
        try {
            await clickElement(driver, homepagebar.search.path);
          } catch {
            throw new Error("❌ Search not clicked from bottom bar");
          }

        await clickElement(driver, search.searchbox.path);
        await enterText(driver,search.searchbox.path,"Plant");
        await driver.pause(5000);
        // await driver.pressKeyCode(84);
        await driver.execute('mobile: performEditorAction', { action: 'search' });

        const firstLesson = await driver.$(`android=new UiSelector().className("android.view.ViewGroup").clickable(true)`);
await firstLesson.waitForDisplayed({ timeout: 10000 });
        //   await waitForElement(driver,firstLesson,10000);
await driver.pause(5000);
// Fetch content-desc (lesson title)
const firstLessonTitle = await driver.$(`android=new UiSelector().className("android.widget.TextView").instance(0)`);
await firstLessonTitle.waitForDisplayed({ timeout: 10000 });

const lessonTitle = await firstLessonTitle.getText();
console.log(" ✅ First lesson title:", lessonTitle);


if (lessonTitle.toLowerCase().includes("plant")) {
  console.log("✅ Search result is accurate — first lesson contains 'Plant'");
} else {
  console.log("❌ Search result is NOT accurate — 'Plant' not in first lesson");
}



        await driver.pause(5000);



        

        
    } catch (error) {
      handleTestError(error, "Normal search Test");
    }
}
  

if (require.main === module) {
    (async () => {
      await home_bottom_bar_clicks();
      await searchtest();
    })();
  }
  
  module.exports = {
    home_bottom_bar_clicks,
    searchtest,
  };
  
