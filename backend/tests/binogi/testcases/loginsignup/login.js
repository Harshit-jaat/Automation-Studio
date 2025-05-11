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
} = require("../../../utils/elementUtils");

const appiumConfig = require(path.resolve(__dirname, "../../../../config/appium.config"));
const onboardingIntro = require(path.resolve(__dirname, "../../elements/onboarding/onboardingintro"));
const onboardingRole = require(path.resolve(__dirname, "../../elements/onboarding/onboardingrole"));
const onboardingGrade = require(path.resolve(__dirname, "../../elements/onboarding/onboardinggrade/india"));
const onboardingSubject = require(path.resolve(__dirname, "../../elements/onboarding/onboardingsubject"));
const onboardingSchool = require(path.resolve(__dirname, "../../elements/onboarding/onboardingschool"));
const loginpage = require("../../elements/LoginSignup/login");
const onboardingintro = require("../../elements/onboarding/onboardingintro");
const signuppage = require("../../elements/LoginSignup/signup");
const homepagebar = require("../../elements/home/bottomBar");
const onbaordingname = require("../../elements/LoginSignup/signupname");

let locationPopupShown = false;

async function signupflow(driver){
    await waitForElement(driver, loginpage.signupLink.path);
    await clickElement(driver, loginpage.signupLink.path);

    await waitForElement(driver, signuppage.signupWithGoogle.path);
    await clickElement(driver, signuppage.signupWithGoogle.path);

    try {
        const consentPopup = await waitForElement(driver, signuppage.ageWarning.path, 10000); // Shorter timeout
        if (consentPopup) {
          await clickElement(driver, signuppage.ageCheckbox.path);
          
    
          await clickElement(driver, signuppage.signupWithGoogle.path);
          
        }
      } catch (error) {
        console.log("⚠️ No age-consent warning found");
      }

    await waitForElement(driver, loginpage.firstgmail.path);
    await clickElement(driver, loginpage.firstgmail.path);

    await waitForElement(driver, onbaordingname.nameinput.path);
    await enterText(driver, onbaordingname.nameinput.path , text = "Test");

    await clickElement(driver, onbaordingname.save.path);

    
        let locationPopupShown = false;
       
           try{
           
       
           
           await clickElement(driver,onboardingRole.student.path);
       
           await clickElement(driver,onboardingRole.continue.path);
       
           // const locationPopup = await waitForElement(driver,onboardingSchool.whileUsingApp.path);
           const locationPopup = await driver.$(
               onboardingSchool.locationPrompt.path,
             );
       
             
                     if (locationPopup) {
                       if (!locationPopupShown) {
                        //  console.log("✅ found popup");
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

    
        await driver.pause(13000);
        console.log("🏠 Reached Home Screen");




    // await driver.pause(15000);


};

async function runNormalLoginTest() {
  const driver = await remote({
    ...appiumConfig.server,
    capabilities: {
      alwaysMatch: appiumConfig.capabilities,
      firstMatch: [{}],
    },
  });

  try {
    console.log("TestCase- Starting  Login Flow");


    // Step 1: Allow pop-up and press Let's Go
    let allowPopup;
        if ( allowPopup = await waitForElement(driver, onboardingIntro.allow.path)) {
        // console.log("✅ found popup");
        await clickElement(driver, onboardingIntro.allow.path);

        }
        else{
        console.log("⚠️ no popup found");
        }

        await waitForElement(driver,onboardingIntro.login.path);
        await clickElement(driver, onboardingIntro.login.path);



        await waitForElement(driver, loginpage.loginGoogleButton.path);
        await clickElement(driver, loginpage.loginGoogleButton.path);


        await waitForElement(driver, loginpage.firstgmail.path);
        await clickElement(driver, loginpage.firstgmail.path);

        await driver.pause(15000);

        let loginSuccess = false;
        let noAccount = false;

        try {
        const homeEl = await waitForElement(driver, homepagebar.home.path, 5000);
        if (await homeEl.isExisting()) {
            console.log("✅ Login completed");
            loginSuccess = true;
        }
        } catch (_) {
        console.log("❌ Home element not found");
        }

        if (!loginSuccess) {
        try {
            const noAccountEl = await waitForElement(driver, loginpage.noaccount.path, 3000);
            if (await noAccountEl.isExisting()) {
            console.log("⚠️ No account found, proceeding to signup");
            noAccount = true;
            }
        } catch (_) {
            console.log("❌ No-account element not found either");
        }
        }
        await signupflow(driver);



        console.log("✅ Test passed");

    } catch (error) {
    handleTestError(error, "Normal login Test");
  } finally {
    await driver.deleteSession();
    console.log("✅ Session Closed");
  }
}


async function runNormalSignupTest() {
    const driver = await remote({
        ...appiumConfig.server,
        capabilities: {
          alwaysMatch: appiumConfig.capabilities,
          firstMatch: [{}],
        },
      });
    
      try {
        console.log("TestCase- Starting  signup Flow");


    // Step 1: Allow pop-up and press Let's Go
    let allowPopup;
        if ( allowPopup = await waitForElement(driver, onboardingIntro.allow.path)) {
        // console.log("✅ found popup");
        await clickElement(driver, onboardingIntro.allow.path);

        }
        else{
        console.log("⚠️ no popup found");
        }

        await waitForElement(driver,onboardingIntro.login.path);
        await clickElement(driver, onboardingIntro.login.path);

        await signupflow(driver);
        console.log("✅ Test passed");


      } catch (error) {
        handleTestError(error, "Normal signup Test");
      } finally {
        await driver.deleteSession();
        console.log("✅ Session Closed");
      }

}

async function offlinelogin() {
    const driver = await remote({
        ...appiumConfig.server,
        capabilities: {
          alwaysMatch: appiumConfig.capabilities,
          firstMatch: [{}],
        },
      });
    
      try {
        console.log("TestCase- Starting offline Login Flow");

    // Step 1: Allow pop-up and press Let's Go
    let allowPopup;
        if ( allowPopup = await waitForElement(driver, onboardingIntro.allow.path)) {
        // console.log("✅ found popup");
        await clickElement(driver, onboardingIntro.allow.path);

        }
        else{
        console.log("⚠️ no popup found");
        }

        await waitForElement(driver,onboardingIntro.login.path);
        await clickElement(driver, onboardingIntro.login.path);

        await waitForElement(driver, loginpage.loginGoogleButton.path);
        await clickElement(driver, loginpage.loginGoogleButton.path);

        const nointernetpopup = await waitForElement(driver, loginpage.nointernetpopup.path);
        if(nointernetpopup){
            console.log("✅ No internet popup came - Test passed")
        }

        

      } catch (error) {
        handleTestError(error, "Normal signup Test");
      } finally {
        await driver.deleteSession();
        console.log("✅ Session Closed");
      }
    
}


if (require.main === module) {
    (async () => {
        await runNormalSignupTest();
      await runNormalLoginTest();
      await offlinelogin();
    })();
  }

module.exports = {runNormalLoginTest,runNormalSignupTest,offlinelogin};


        