const { remote } = require("webdriverio");
const path = require("path");
const { execSync } = require("child_process");
const {
    waitForElement,
    clickElement,
    enterText,
    getText,
    retryAction,
    handleTestError,
    restartDriver,
} = require("../../../utils/elementUtils");
const {
  readExperimentVariantFromLog,
} = require("../../../utils/growthbookUtils");
const appiumConfig = require(path.resolve(__dirname, "../../../../config/appium.config"));
const onboardingIntro = require(path.resolve(__dirname, "../../elements/onboarding/onboardingintro"));
const onboardingRole = require(path.resolve(__dirname, "../../elements/onboarding/onboardingrole"));
const onboardingGrade = require(path.resolve(__dirname, "../../elements/onboarding/onboardinggrade/india"));
const onboardingSubject = require(path.resolve(__dirname, "../../elements/onboarding/onboardingsubject"));
const onboardingSchool = require(path.resolve(__dirname, "../../elements/onboarding/onboardingschool"));


process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      if (typeof string === 'string') string = string.replace(/\n$/, '') + '\n';
      return write.apply(process.stdout, [string, encoding, fd]);
    };
  })(process.stdout.write);

let locationPopupShown = false;

// async function baseStudentSkipSchool(driver, results = []) {
//   const testName = "Experiment Force Teacher to select school";
//   console.log(`\n🧪 Running test: ${testName}`);

//   try {
//     let variant = "";
//     let attempt = 0;

//     while (variant !== "base" && attempt < 5) {
//       attempt++;
//       console.log(`🔁 Attempt ${attempt}: Clearing logs and launching app...`);
//       execSync("adb logcat -c");

//       // Onboarding flow
//       const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
//       if (await allowPopup.isExisting()) {
//         await clickElement(driver, onboardingIntro.allow.path);
//       }

//       for (const option of onboardingIntro.letsgo) {
//         const letsGoEl = await driver.$(option.path);
//         if (await letsGoEl.isExisting()) {
//           await letsGoEl.click();
//           break;
//         }
//       }

//       await clickElement(driver, onboardingRole.teacher.path);
//       await clickElement(driver, onboardingRole.continue.path);

//       const locationPopup = await driver.$(onboardingSchool.locationPrompt.path);
//       if (await locationPopup.isExisting()) {
//         await clickElement(driver, onboardingSchool.whileUsingApp.path);
//       }

//       // Fetch variant from logs
//       variant = await readExperimentVariantFromLog();
//       console.log(`🧪 Detected variant: ${variant}`);

//       if (variant !== "base") {
//         console.log("⚠️ Variant is not 'base', restarting app...");
//         driver = await restartDriver(driver);
//       }
//     }

//     if (variant !== "base") {
//       throw new Error("❌ Failed to get 'base' variant after multiple attempts");
//     }

//     // On school page with 'base' variant
//     const skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//     if (!skipExists) {
//       throw new Error("❌ Expected 'Skip this question' to be visible for base-student");
//     }

//     await clickElement(driver, onboardingSchool.skipQuestionText.path);
//     console.log(`✅ Passed: ${testName}`);
//     results.push({ testName, status: "PASSED" });
//   } catch (error) {
//     console.error(`❌ Failed: ${testName} - ${error.message}`);
//     results.push({ testName, status: "FAILED", error: error.message });
//   }

//   return driver;
// }

// async function experimentTest(driver, results = []) {
//     let testName = "";
//     try {
        
//         execSync("adb logcat -c");

//         // Onboarding flow
//         const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
//         if (await allowPopup.isExisting()) {
//           await clickElement(driver, onboardingIntro.allow.path);
//         }
  
//         for (const option of onboardingIntro.letsgo) {
//           const letsGoEl = await driver.$(option.path);
//           if (await letsGoEl.isExisting()) {
//             await letsGoEl.click();
//             break;
//           }
//         }
  
//         await clickElement(driver, onboardingRole.teacher.path);
//         await clickElement(driver, onboardingRole.continue.path);
  
//         const locationPopup = await driver.$(onboardingSchool.locationPrompt.path);
//         if (await locationPopup.isExisting()) {
//           await clickElement(driver, onboardingSchool.whileUsingApp.path);
//         }
  
//         // Fetch variant from logs
//         variant = await readExperimentVariantFromLog();
//         console.log(`🧪 Detected variant: ${variant}`);
  
//         if (variant === "base"){
//             testName = "Base-experiment-skipthisquestion-visibile"
//             let skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//             if (!skipExists) {
//                 throw new Error("TestCase- 'Skip this question' to be visible for base-teacher - ❌ Failed" );
//               }
//             else{
//                 console.log("TestCase- 'Skip this question' to be visible for base-teacher - ✅ Passed")

//                 await clickElement(driver, onboardingSchool.backbutton.path);

//                 await clickElement(driver, onboardingRole.student.path);
//                 await clickElement(driver, onboardingRole.continue.path);

//                 skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();

//                 if (!skipExists) {
//                     throw new Error("TestCase- 'Skip this question' to be visible for student - ❌ Failed" );
//                   }
//                 else{
//                     console.log("TestCase- 'Skip this question' to be visible for student - ✅ Passed")
//                 }

//                 await clickElement(driver, onboardingSchool.backbutton.path);

//                 await clickElement(driver, onboardingRole.guardian.path);
//                 await clickElement(driver, onboardingRole.continue.path);

//                 skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();

//                 if (!skipExists) {
//                     throw new Error("TestCase- 'Skip this question' to be visible for Guardian - ❌ Failed" );
//                   }
//                 else{
//                     console.log("TestCase- 'Skip this question' to be visible for Guardian - ✅ Passed")
//                 }


//             }
//         }
//         if (variant === "a"){
//             testName = "a-experiment-skipthisquestion-visibile"
//             let skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//             if (skipExists) {
//                 throw new Error("TestCase- 'Skip this question' to be not visible for teacher - ❌ Failed" );
//               }
//             else{
//                 console.log("TestCase- 'Skip this question' to be not visible for teacher - ✅ Passed")

//                 await clickElement(driver, onboardingSchool.backbutton.path);

//                 await clickElement(driver, onboardingRole.student.path);
//                 await clickElement(driver, onboardingRole.continue.path);

//                 skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();

//                 if (!skipExists) {
//                     throw new Error("TestCase- 'Skip this question' to be visible for student - ❌ Failed" );
//                   }
//                 else{
//                     console.log("TestCase- 'Skip this question' to be visible for student - ✅ Passed")
//                 }

//                 await clickElement(driver, onboardingSchool.backbutton.path);

//                 await clickElement(driver, onboardingRole.guardian.path);
//                 await clickElement(driver, onboardingRole.continue.path);

//                 skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();

//                 if (!skipExists) {
//                     throw new Error("TestCase- 'Skip this question' to be visible for Guardian - ❌ Failed" );
//                   }
//                 else{
//                     console.log("TestCase- 'Skip this question' to be visible for Guardian - ✅ Passed")
//                 }
//             }
//         }
      
        
//     } catch (error) {
//         console.error(`❌ Failed: ${testName} - ${error.message}`);
//         results.push({ testName, status: "FAILED", error: error.message });
        
//     }

//     return driver;
// }

// async function experimentTest(driver, results = []) {
//     let testName = "";
//     try {
//       const { execSync } = require("child_process");
//       execSync("adb logcat -c");
  
//       // Onboarding flow
//       const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
//       if (await allowPopup.isExisting()) {
//         await clickElement(driver, onboardingIntro.allow.path);
//       }
  
//       for (const option of onboardingIntro.letsgo) {
//         const letsGoEl = await driver.$(option.path);
//         if (await letsGoEl.isExisting()) {
//           await letsGoEl.click();
//           break;
//         }
//       }
  
//       await clickElement(driver, onboardingRole.teacher.path);
//       await clickElement(driver, onboardingRole.continue.path);
  
//       const locationPopup = await driver.$(onboardingSchool.locationPrompt.path);
//       if (await locationPopup.isExisting()) {
//         await clickElement(driver, onboardingSchool.whileUsingApp.path);
//       }
  
//       // Fetch variant from logs
//       let variant = await readExperimentVariantFromLog();
//       console.log(`🧪 Detected variant: ${variant}`);
  
//       if (variant === "base") {
//         testName = "Base-experiment-skipthisquestion-visible";
//         let skipExists = false;
//         try {
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//         } catch (e) {
//           console.warn("⚠️ Element check failed, possibly stale. Retrying...");
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//         }
  
//         if (!skipExists) {
//           throw new Error("TestCase- 'Skip this question' to be visible for base-teacher - ❌ Failed");
//         } else {
//           console.log("TestCase- 'Skip this question' to be visible for base-teacher - ✅ Passed");
  
//           await clickElement(driver, onboardingSchool.backbutton.path);
//           await clickElement(driver, onboardingRole.student.path);
//           await clickElement(driver, onboardingRole.continue.path);
  
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//           if (!skipExists) {
//             throw new Error("TestCase- 'Skip this question' to be visible for student - ❌ Failed");
//           } else {
//             console.log("TestCase- 'Skip this question' to be visible for student - ✅ Passed");
//           }
  
//           await clickElement(driver, onboardingSchool.backbutton.path);
//           await clickElement(driver, onboardingRole.guardian.path);
//           await clickElement(driver, onboardingRole.continue.path);
  
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//           if (!skipExists) {
//             throw new Error("TestCase- 'Skip this question' to be visible for Guardian - ❌ Failed");
//           } else {
//             console.log("TestCase- 'Skip this question' to be visible for Guardian - ✅ Passed");
//           }

//           await clickElement(driver, onboardingSchool.backbutton.path);
//           await clickElement(driver, onboardingRole.teacher.path);
//           await clickElement(driver, onboardingRole.continue.path);

//           const schoolname = 'Kendriya Vidyalaya No. 3, Ambala';
//           const input = await driver.$(onboardingSchool.schoolSearchInput.path);
//           await input.click();
//           await enterText(driver, onboardingSchool.schoolSearchInput.path, schoolname);
//           await driver.pressKeyCode(84);
//           console.log(`🏫 Entered school name: ${schoolname}`);

//           await driver.pause(5000); // Wait for suggestions to load

//           // Try selecting the first suggestion
//           const firstSuggestion = await driver.$('//android.widget.TextView[@text="Kendriya Vidyalaya No. 3, Ambala, Haryana, India"]');
//           if (await firstSuggestion.isExisting()) {
//             await firstSuggestion.click();
//             console.log("✅ Selected school from suggestions");
//           } else {
//             throw new Error("❌ No matching school suggestions found after typing");
//           }

//           await clickElement(driver, onboardingSchool.continueButton.path);
//           console.log("✅ Clicked Continue on school page");

//           const schoolnamebox = await driver.$(onboardingGrade.schoolname.path);
//           if(schoolnamebox){
//             console.log('TestCase- School name present on grade screen ✅ Passed ')
//           }
//           else{
//             throw new Error('TestCase- School name present on grade screen ❌ Failed ')
//           }

//           await driver
//                 .$(onboardingGrade.lowersecondaryschool.path)
//                 .then((el) => el.click());
//             //   console.log("✅ Clicked Lower Secondary School");
          
//               const grade9 = await driver.$(
//                 onboardingGrade.lowersecondaryschool.grades[9].path,
//               );
//               if (await grade9.isExisting()) {
//                 await grade9.click();
//                 // console.log("✅ Selected Grade 9");
//               } else {
//                 console.error("❌ Grade 9 not found!");
//               }

//               await driver.$(onboardingGrade.continue.path).then((el) => el.click());


//               const subject = onboardingSubject.subjectlist.biology;
//                   await driver.$(subject.path).then((el) => el.click());
//                 //   console.log("✅ Selected Subject: Biology");
              
//                   await driver.$(onboardingSubject.continue.path).then((el) => el.click());
//                 //   console.log("✅ Clicked Continue after subject selection");
              
//                   await driver.pause(5000);
//                   console.log("TestCase- Onboarding succesful ✅ Passed");

//         }
//         results.push({ testName, status: "PASSED" });
//       }
  
//       if (variant === "a") {
//         testName = "A-experiment-skipthisquestion-hidden";
//         let skipExists = false;
//         try {
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//         } catch (e) {
//           console.warn("⚠️ Element check failed, possibly stale. Retrying...");
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//         }
  
//         if (skipExists) {
//           throw new Error("TestCase- 'Skip this question' to be not visible for teacher - ❌ Failed");
//         } else {
//           console.log("TestCase- 'Skip this question' to be not visible for teacher - ✅ Passed");
  
//           await clickElement(driver, onboardingSchool.backbutton.path);
//           await clickElement(driver, onboardingRole.student.path);
//           await clickElement(driver, onboardingRole.continue.path);
  
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//           if (!skipExists) {
//             throw new Error("TestCase- 'Skip this question' to be visible for student - ❌ Failed");
//           } else {
//             console.log("TestCase- 'Skip this question' to be visible for student - ✅ Passed");
//           }
  
//           await clickElement(driver, onboardingSchool.backbutton.path);
//           await clickElement(driver, onboardingRole.guardian.path);
//           await clickElement(driver, onboardingRole.continue.path);
  
//           skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
//           if (!skipExists) {
//             throw new Error("TestCase- 'Skip this question' to be visible for Guardian - ❌ Failed");
//           } else {
//             console.log("TestCase- 'Skip this question' to be visible for Guardian - ✅ Passed");
//           }

//           await clickElement(driver, onboardingSchool.backbutton.path);
//           await clickElement(driver, onboardingRole.teacher.path);
//           await clickElement(driver, onboardingRole.continue.path);

//           const schoolname = 'Kendriya Vidyalaya No. 3, Ambala';
//           const input = await driver.$(onboardingSchool.schoolSearchInput.path);
//           await input.click();
//           await enterText(driver, onboardingSchool.schoolSearchInput.path, schoolname);
//           console.log(`🏫 Entered school name: ${schoolname}`);
//           await driver.pressKeyCode(84);

//           await driver.pause(5000); 

//           // Try selecting the first suggestion
//           const firstSuggestion = await driver.$('//android.widget.TextView[@text="Kendriya Vidyalaya No. 3, Ambala, Haryana, India"]');
//           if (await firstSuggestion.isExisting()) {
//             await firstSuggestion.click();
//             console.log("✅ Selected school from suggestions");
//           } else {
//             throw new Error("❌ No matching school suggestions found after typing");
//           }

//           await clickElement(driver, onboardingSchool.continueButton.path);
//           console.log("✅ Clicked Continue on school page");

//           const schoolnamebox = await driver.$(onboardingGrade.schoolname.path);
//           if(schoolnamebox){
//             console.log('TestCase- School name present on grade screen ✅ Passed ')
//           }
//           else{
//             throw new Error('TestCase- School name present on grade screen ❌ Failed ')
//           }

//           await driver
//                 .$(onboardingGrade.lowersecondaryschool.path)
//                 .then((el) => el.click());
//             //   console.log("✅ Clicked Lower Secondary School");
          
//               const grade9 = await driver.$(
//                 onboardingGrade.lowersecondaryschool.grades[9].path,
//               );
//               if (await grade9.isExisting()) {
//                 await grade9.click();
//                 // console.log("✅ Selected Grade 9");
//               } else {
//                 console.error("❌ Grade 9 not found!");
//               }

//               await driver.$(onboardingGrade.continue.path).then((el) => el.click());


//               const subject = onboardingSubject.subjectlist.biology;
//                   await driver.$(subject.path).then((el) => el.click());
//                 //   console.log("✅ Selected Subject: Biology");
              
//                   await driver.$(onboardingSubject.continue.path).then((el) => el.click());
//                 //   console.log("✅ Clicked Continue after subject selection");
              
//                   await driver.pause(5000);
//                   console.log("TestCase- Onboarding succesful ✅ Passed");

            


//         }
//         results.push({ testName, status: "PASSED" });
//       }
  
//     } catch (error) {
//       console.error(`❌ Failed: ${testName} - ${error.message}`);
//       results.push({ testName, status: "FAILED", error: error.message });
//     }
  
//     return driver;
//   }

async function experimentTest(driver, results = []) {
    let testName = "";
    try {
      const { execSync } = require("child_process");
      execSync("adb logcat -c");
  
      const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
      if (await allowPopup.isExisting()) {
        await clickElement(driver, onboardingIntro.allow.path);
        
      }
  
      for (const option of onboardingIntro.letsgo) {
        const letsGoEl = await driver.$(option.path);
        if (await letsGoEl.isExisting()) {
          await letsGoEl.click();
          break;
        }
      }
  
      await clickElement(driver, onboardingRole.teacher.path);
      await clickElement(driver, onboardingRole.continue.path);
    //   await driver.pause(200);
  
      const locationPopup = await driver.$(onboardingSchool.locationPrompt.path);
      if (await locationPopup.isExisting()) {
        await clickElement(driver, onboardingSchool.whileUsingApp.path);
      }
  
      let variant = await readExperimentVariantFromLog();
      console.log(`🧪 Detected variant: ${variant}`);
  
      if (variant === "base" || variant === "a") {
        testName = variant === "base" ? "Base-experiment-skipthisquestion-visible" : "A-experiment-skipthisquestion-hidden";
  
        const rolesToCheck = ["teacher", "student", "guardian"];
        const shouldSkipBeVisible = (role) => {
          if (variant === "base") return true;
          return role !== "teacher";
        };
  
        for (const role of rolesToCheck) {
          if (role !== "teacher") {
            await clickElement(driver, onboardingSchool.backbutton.path);
            await clickElement(driver, onboardingRole[role].path);
            await clickElement(driver, onboardingRole.continue.path);
          }
  
          let skipExists = false;
          try {
            skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
          } catch (e) {
            console.warn("⚠️ Element check failed, possibly stale. Retrying...");
            skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
          }
  
          const expected = shouldSkipBeVisible(role);
          const result = skipExists === expected;
  
          console.log(`TestCase- 'Skip this question' ${expected ? "to be visible" : "to be not visible"} for ${role} - ${result ? "✅ Passed" : "❌ Failed"}`);
  
          if (!result) {
            throw new Error(`TestCase- 'Skip this question' ${expected ? "should" : "should not"} be visible for ${role} - ❌ Failed`);
          }
        }
  
        // Proceed with school search
        await clickElement(driver, onboardingSchool.backbutton.path);
        await clickElement(driver, onboardingRole.teacher.path);
        await clickElement(driver, onboardingRole.continue.path);
  
        const schoolname = 'Kendriya Vidyalaya No. 3, Ambala';
        const input = await driver.$(onboardingSchool.schoolSearchInput.path);
        await input.click();
        await enterText(driver, onboardingSchool.schoolSearchInput.path, schoolname);
        await driver.pressKeyCode(84);
        console.log(`🏫 Entered school name: ${schoolname}`);
  
        await driver.pause(5000);
        const firstSuggestion = await driver.$('//android.widget.TextView[@text="Kendriya Vidyalaya No. 3, Ambala, Haryana, India"]');
        if (await firstSuggestion.isExisting()) {
          await firstSuggestion.click();
          console.log("✅ Selected school from suggestions");
        } else {
          throw new Error("❌ No matching school suggestions found after typing");
        }
  
        await clickElement(driver, onboardingSchool.continueButton.path);
        
  
        const schoolnamebox = await driver.$(onboardingGrade.schoolname.path);
        if (schoolnamebox) {
          console.log('TestCase- School name present on grade screen ✅ Passed ');
        } else {
          throw new Error('TestCase- School name present on grade screen ❌ Failed ');
        }
  
        await driver.$(onboardingGrade.lowersecondaryschool.path).then((el) => el.click());
        const grade9 = await driver.$(onboardingGrade.lowersecondaryschool.grades[9].path);
        if (await grade9.isExisting()) {
          await grade9.click();
        } else {
          console.error("❌ Grade 9 not found!");
        }
  
        await driver.$(onboardingGrade.continue.path).then((el) => el.click());
        const subject = onboardingSubject.subjectlist.biology;
        await driver.$(subject.path).then((el) => el.click());
        await driver.$(onboardingSubject.continue.path).then((el) => el.click());
        await driver.pause(5000);
  
        console.log("TestCase- Home-screen reached ✅ Passed");
      }
  
      results.push({ testName, status: "PASSED" });
    } catch (error) {
      console.error(`❌ Failed: ${testName} - ${error.message}`);
      results.push({ testName, status: "FAILED", error: error.message });
    }
  
    return driver;
  }
  

  async function backexperimentTest(driver, results = []) {
    let testName = "";
    try {
      const { execSync } = require("child_process");
      execSync("adb logcat -c");
  
      const performOnboardingUntilSubjectScreen = async () => {
        const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
        if (await allowPopup.isExisting()) {
          await clickElement(driver, onboardingIntro.allow.path);
        }
  
        for (const option of onboardingIntro.letsgo) {
          const letsGoEl = await driver.$(option.path);
          if (await letsGoEl.isExisting()) {
            await letsGoEl.click();
            break;
          }
        }
  
        await clickElement(driver, onboardingRole.teacher.path);
        await clickElement(driver, onboardingRole.continue.path);

        await driver.pause(2000);
  
        const locationPopup = await driver.$(onboardingSchool.locationPrompt.path);
        if (await locationPopup.isExisting()) {
          await clickElement(driver, onboardingSchool.whileUsingApp.path);
        }
  
        const variant = await readExperimentVariantFromLog();
        console.log(`🧪 Detected variant: ${variant}`);
        testName = variant === "base" ? "Base-experiment-repeat" : "A-experiment-repeat";
  
        const schoolname = 'Kendriya Vidyalaya No. 3, Ambala';
        const input = await driver.$(onboardingSchool.schoolSearchInput.path);
        await input.click();
        await enterText(driver, onboardingSchool.schoolSearchInput.path, schoolname);
        await driver.pressKeyCode(84);
        console.log(`🏫 Entered school name: ${schoolname}`);
  
        await driver.pause(5000);
        const firstSuggestion = await driver.$('//android.widget.TextView[@text="Kendriya Vidyalaya No. 3, Ambala, Haryana, India"]');
        if (await firstSuggestion.isExisting()) {
          await firstSuggestion.click();
          console.log("✅ Selected school from suggestions");
        } else {
          throw new Error("❌ No matching school suggestions found after typing");
        }
  
        await clickElement(driver, onboardingSchool.continueButton.path);
  
        const schoolnamebox = await driver.$(onboardingGrade.schoolname.path);
        if (schoolnamebox) {
          console.log('✅ School name present on grade screen');
        } else {
          throw new Error('❌ School name not present on grade screen');
        }
  
        await driver.$(onboardingGrade.lowersecondaryschool.path).then((el) => el.click());
        const grade9 = await driver.$(onboardingGrade.lowersecondaryschool.grades[9].path);
        if (await grade9.isExisting()) {
          await grade9.click();
        } else {
          throw new Error("❌ Grade 9 not found");
        }
  
        
  
        console.log("🧪 Stopped at Subject screen before reaching Home screen.");
      };
  
      const completeFromSubjectScreenToHome = async () => {
        const subject = onboardingSubject.subjectlist.biology;
        await driver.$(subject.path).then((el) => el.click());
        await driver.$(onboardingSubject.continue.path).then((el) => el.click());
        await driver.pause(2000);
        console.log("✅ Reached Home screen");
      };
  
      // First onboarding flow till subject screen
      await performOnboardingUntilSubjectScreen();
  
      // Navigate back to intro screen
      console.log("🔁 Going back to Let's Go screen...");
      for (let i = 0; i < 3; i++) {
        await driver.back();
        await driver.pause(500);
      }
  
      // Run full flow again till Home
      await performOnboardingUntilSubjectScreen();
      await completeFromSubjectScreenToHome();
  
      results.push({ testName, status: "PASSED" });
  
    } catch (error) {
      console.error(`❌ Failed: ${testName} - ${error.message}`);
      results.push({ testName, status: "FAILED", error: error.message });
    }
  
    return driver;
  }
  

  async function OfflineexperimentTest(driver, results = []) {
    let testName = "";
    try {
      const { execSync } = require("child_process");
      execSync("adb logcat -c");
  
      const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
      if (await allowPopup.isExisting()) {
        await clickElement(driver, onboardingIntro.allow.path);
      }
  
      for (const option of onboardingIntro.letsgo) {
        const letsGoEl = await driver.$(option.path);
        if (await letsGoEl.isExisting()) {
          await letsGoEl.click();
          break;
        }
      }
  
      await clickElement(driver, onboardingRole.teacher.path);
      await clickElement(driver, onboardingRole.continue.path);

      await driver.pause(2000);
  
      const locationPopup = await driver.$(onboardingSchool.locationPrompt.path);
      if (await locationPopup.isExisting()) {
        await clickElement(driver, onboardingSchool.whileUsingApp.path);
      }
  
      const variant = await readExperimentVariantFromLog();
      console.log(`🧚t Detected variant: ${variant}`);
  
      if (variant === "base" || variant === "a") {
        testName = variant === "base"
          ? "Base-experiment-skipthisquestion-visible"
          : "A-experiment-skipthisquestion-hidden";
  
        const rolesToCheck = ["teacher", "student", "guardian"];
        const shouldSkipBeVisible = (role) => variant === "base" || role !== "teacher";
  
        for (const role of rolesToCheck) {
          if (role !== "teacher") {
            await clickElement(driver, onboardingSchool.backbutton.path);
            await clickElement(driver, onboardingRole[role].path);
            await clickElement(driver, onboardingRole.continue.path);
          }
  
          let skipExists = false;
          try {
            skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
          } catch (e) {
            console.warn("⚠️ Element check failed, retrying...");
            skipExists = await driver.$(onboardingSchool.skipQuestionText.path).isExisting();
          }
  
          const expected = shouldSkipBeVisible(role);
          const result = skipExists === expected;
  
          console.log(`TestCase- 'Skip this question' ${expected ? "to be visible" : "to be not visible"} for ${role} - ${result ? "✅ Passed" : "❌ Failed"}`);
  
          if (!result) {
            throw new Error(`TestCase- 'Skip this question' ${expected ? "should" : "should not"} be visible for ${role} - ❌ Failed`);
          }
        }
  
        // 🚴 Turn off internet after test
        try {
          console.log("📴 Turning off internet for offline test verification...");
          execSync("adb shell svc wifi disable");
          execSync("adb shell svc data disable");
          console.log("✅ Internet turned off successfully.");
        } catch (e) {
          console.warn("⚠️ Failed to disable internet via ADB:", e.message);
        }
  
        // 🕐 Wait for popup
        await driver.pause(10000);
  
        const connectButton = await driver.$('//android.widget.TextView[@text="CONNECT"]');
        if (await connectButton.isExisting()) {
          console.log("✅ Offline popup appeared with 'Connect' button");
        } else {
          throw new Error("❌ Offline popup with 'Connect' button did not appear after internet off");
        }
        execSync("adb shell svc wifi enable");
        execSync("adb shell svc data enable");
  
        results.push({ testName, status: "PASSED" });
  
        execSync("adb shell svc wifi enable");
        execSync("adb shell svc data enable");
      }
    } catch (error) {
      console.error(`❌ Failed: ${testName} - ${error.message}`);
      results.push({ testName, status: "FAILED", error: error.message });
    }
  }
  
  
  

//   if (require.main === module) {
//     (async () => {
//       const driver = await remote({
//         ...appiumConfig.server,
//         capabilities: {
//           alwaysMatch: appiumConfig.capabilities,
//           firstMatch: [{}],
//         },
//       });
  
//       const results = [];
  
//       try {
//         const updatedDriver = await experimentTest(driver, results);
  
//         // Safely delete session only if still active
//         if (updatedDriver && updatedDriver.deleteSession) {
//           await updatedDriver.deleteSession();
//           console.log("✅ Session Closed");
//         } else {
//           console.log("⚠️ Driver session already terminated or undefined");
//         }
  
//       } catch (err) {
//         console.error("❌ Script Error Output:\n", err);
//       } finally {
//         console.log("\n📋 Test Summary:");
//         results.forEach((r) =>
//           console.log(`${r.status} - ${r.testName}${r.error ? ` - ${r.error}` : ""}`)
//         );
//       }
//     })();
//   }
  

// if (require.main === module) {
//     (async () => {
//       const results = [];
//       const variantCounts = { a: 0, base: 0 };
  
//       // Run experimentTest until both variants are seen 3 times each
//       while (variantCounts.a < 3 || variantCounts.base < 3) {
//         const driver = await remote({
//           ...appiumConfig.server,
//           capabilities: {
//             alwaysMatch: appiumConfig.capabilities,
//             firstMatch: [{}],
//           },
//         });
  
//         try {
//           const updatedDriver = await experimentTest(driver, results);
  
//           // Count the variant based on the test name
//           const lastTest = results[results.length - 1];
//             if (lastTest?.testName && lastTest.status === "PASSED") {
//             const name = lastTest.testName.toLowerCase();
//             if (name.startsWith("a-experiment") && variantCounts.a < 3) {
//                 variantCounts.a += 1;
//             } else if (name.startsWith("base-experiment") && variantCounts.base < 3) {
//                 variantCounts.base += 1;
//             }
//             }

  
//           if (updatedDriver?.deleteSession) {
//             await updatedDriver.deleteSession();
//             console.log("✅ Session Closed");
//           }
//         } catch (err) {
//           console.error("❌ Script Error Output:\n", err);
//         } finally {
//           console.log("\n📋 Progress Summary:");
//           console.log(`🔁 Variant A: ${variantCounts.a} / 3`);
//           console.log(`🔁 Variant BASE: ${variantCounts.base} / 3`);
//           console.log("🧪 Retrying...\n");
//         }
//       }
  
//       // ✅ Run Offline test once after experiment variants are done
//       const driver = await remote({
//         ...appiumConfig.server,
//         capabilities: {
//           alwaysMatch: appiumConfig.capabilities,
//           firstMatch: [{}],
//         },
//       });
  
//       try {
//         await OfflineexperimentTest(driver, results);
//       } catch (err) {
//         console.error("❌ Offline Test Error:\n", err);
//       } finally {
//         if (driver?.deleteSession) {
//           await driver.deleteSession();
//           console.log("✅ Offline Test Session Closed");
//         }
//       }
  
//       // ✅ Final result summary
//       console.log("✅ All experiments completed.");
//       console.log("\n📋 Final Test Summary:");
//       results.forEach((r) =>
//         console.log(`${r.status} - ${r.testName}${r.error ? ` - ${r.error}` : ""}`)
//       );
//     })();
//   }
  

if (require.main === module) {
    (async () => {
      const results = [];
      const variantCounts = { a: 0, base: 0 };
  
      // 🔁 Run experimentTest until both variants are seen 3 times
      while (variantCounts.a < 3 || variantCounts.base < 3) {
        const driver = await remote({
          ...appiumConfig.server,
          capabilities: {
            alwaysMatch: appiumConfig.capabilities,
            firstMatch: [{}],
          },
        });
  
        try {
          const updatedDriver = await experimentTest(driver, results);
  
          const lastTest = results[results.length - 1];
          if (lastTest?.testName && lastTest.status === "PASSED") {
            const name = lastTest.testName.toLowerCase();
            if (name.startsWith("a-experiment") && variantCounts.a < 3) {
              variantCounts.a += 1;
            } else if (name.startsWith("base-experiment") && variantCounts.base < 3) {
              variantCounts.base += 1;
            }
          }
  
          if (updatedDriver?.deleteSession) {
            await updatedDriver.deleteSession();
            console.log("✅ Session Closed");
          }
        } catch (err) {
          console.error("❌ Script Error Output:\n", err);
        } finally {
          console.log("\n📋 Progress Summary:");
          console.log(`🔁 Variant A: ${variantCounts.a} / 3`);
          console.log(`🔁 Variant BASE: ${variantCounts.base} / 3`);
          console.log("🧪 Retrying...\n");
        }
      }
  
      // 🧪 Run backExperimentTest once
      {
        const driver = await remote({
          ...appiumConfig.server,
          capabilities: {
            alwaysMatch: appiumConfig.capabilities,
            firstMatch: [{}],
          },
        });
  
        try {
          await backexperimentTest(driver, results);
        } catch (err) {
          console.error("❌ Back Navigation Test Error:\n", err);
        } finally {
          if (driver?.deleteSession) {
            await driver.deleteSession();
            console.log("✅ Back Navigation Test Session Closed");
          }
        }
      }
  
      // 📴 Run Offline test once
      {
        const driver = await remote({
          ...appiumConfig.server,
          capabilities: {
            alwaysMatch: appiumConfig.capabilities,
            firstMatch: [{}],
          },
        });
  
        try {
          await OfflineexperimentTest(driver, results);
        } catch (err) {
          console.error("❌ Offline Test Error:\n", err);
        } finally {
          if (driver?.deleteSession) {
            await driver.deleteSession();
            console.log("✅ Offline Test Session Closed");
          }
        }
      }
  
      // ✅ Final result summary
      console.log("✅ All experiments completed.");
      console.log("\n📋 Final Test Summary:");
      results.forEach((r) =>
        console.log(`${r.status} - ${r.testName}${r.error ? ` - ${r.error}` : ""}`)
      );
    })();
  }
  
  

module.exports = experimentTest;
