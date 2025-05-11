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
} = require("../../utils/elementUtils");
const onboardingrole = require("../elements/onboarding/onboardingrole");
const { click } = require("appium-uiautomator2-driver/build/lib/commands/element");
const { log } = require("console");

const appiumConfig = require(path.resolve(__dirname, "../../../config/appium.config"));
const onboardingIntro = require(path.resolve(__dirname, "../elements/onboarding/onboardingintro"));
const onboardingRole = require(path.resolve(__dirname, "../elements/onboarding/onboardingrole"));
const onboardingGrade = require(path.resolve(__dirname, "../elements/onboarding/onboardinggrade/india"));
const onboardingSubject = require(path.resolve(__dirname, "../elements/onboarding/onboardingsubject"));
const onboardingSchool = require(path.resolve(__dirname, "../elements/onboarding/onboardingschool"));



async function normalonbaording(driver){
    let locationPopupShown = false;

    try{
    let allowPopup;
            if ( allowPopup = await waitForElement(driver, onboardingIntro.allow.path)) {
            // console.log("✅ found popup");
            await clickElement(driver, onboardingIntro.allow.path);
    
            }
            else{
            console.log("⚠️ no popup found");
            }

    await clickFirstAvailableElement(driver, onboardingIntro.letsgo, "Let's Go");

    
    await clickElement(driver,onboardingrole.student.path);

    await clickElement(driver,onboardingrole.continue.path);

    // const locationPopup = await waitForElement(driver,onboardingSchool.whileUsingApp.path);
    const locationPopup = await driver.$(
        onboardingSchool.locationPrompt.path,
      );

      
              if (locationPopup) {
                if (!locationPopupShown) {
                  console.log("✅ found popup");
                  await clickElement(driver, onboardingSchool.whileUsingApp.path);
                  locationPopupShown = true;
                } else {
                  throw new Error(
                    "❌ Location permission popup appeared again! It should only appear once.",
                  );
                }
              }

      await clickElement(driver, onboardingSchool.skipQuestionText.path);

      await clickElement(driver,onboardingGrade.lowersecondaryschool.path);

      await clickElement(driver,onboardingGrade.lowersecondaryschool.grades[9].path);

      await clickElement(driver,onboardingGrade.continue.path);

      await clickElement(driver,onboardingSubject.subjectlist.mathematics.path);

      await clickElement(driver,onboardingSubject.continue.path);
    }
    catch(error){
        handleTestError(error);
    }
};


module.exports = {
    normalonbaording,
}