const { remote } = require("webdriverio");
const path = require("path");

// Load configs and selectors
const appiumConfig = require(
  path.resolve(__dirname, "../../../../config/appium.config"),
);
const onboardingIntro = require(
  path.resolve(__dirname, "../../elements/onboarding/onboardingintro"),
);
const onboardingRole = require(
  path.resolve(__dirname, "../../elements/onboarding/onboardingrole"),
);
const onboardingGrade = require(
  path.resolve(__dirname, "../../elements/onboarding/onboardinggrade/india"),
);
const onboardingSubject = require(
  path.resolve(__dirname, "../../elements/onboarding/onboardingsubject"),
);

async function runTestForGrade(schoolKey, gradeKey) {
  const school = onboardingGrade[schoolKey];
  const grade = school?.grades[gradeKey];

  if (!school || !grade) {
    console.error(`❌ Invalid school (${schoolKey}) or grade (${gradeKey})`);
    return;
  }

  console.log(
    `\n🚀 Starting onboarding for ${school.text} → Grade ${gradeKey}`,
  );

  const driver = await remote({
    ...appiumConfig.server,
    capabilities: {
      alwaysMatch: appiumConfig.capabilities,
      firstMatch: [{}],
    },
  });

  try {
    // Step 1: Handle allow + let's go
    const allowPopup = await driver.$(onboardingIntro.allowpopup.path);
    if (await allowPopup.isExisting()) {
      await driver.$(onboardingIntro.allow.path).then((el) => el.click());
      console.log("✅ Clicked Allow");
    }

    await driver.$(onboardingIntro.letsgo.path).then((el) => el.click());
    console.log("✅ Clicked Let's Go");

    // Step 2: Role
    await driver.$(onboardingRole.teacher.path).then((el) => el.click());
    await driver.$(onboardingRole.continue.path).then((el) => el.click());
    console.log("✅ Selected Role: Teacher");

    // Step 3: Select School + Grade
    await driver.$(school.path).then((el) => el.click());
    console.log(`✅ Clicked ${school.text}`);
    await driver.$(grade.path).then((el) => el.click());
    console.log(`✅ Selected Grade ${gradeKey}`);
    await driver.$(onboardingGrade.continue.path).then((el) => el.click());
    console.log("✅ Clicked Continue after grade");

    // Step 4: Select subject (e.g., Biology as default)
    const subject = onboardingSubject.subjectlist.biology;
    await driver.$(subject.path).then((el) => el.click());
    await driver.$(onboardingSubject.continue.path).then((el) => el.click());
    console.log("✅ Selected Subject: Biology");

    await driver.pause(2000);
    console.log(`✅ Finished onboarding for Grade ${gradeKey}`);
  } catch (err) {
    console.error(`❌ Error for ${school.text} - Grade ${gradeKey}`, err);
  } finally {
    await driver.deleteSession();
    console.log(`✅ Session closed for Grade ${gradeKey}`);
  }
}

if (require.main === module) {
  (async () => {
    const passed = [];
    const failed = [];

    const schools = Object.entries(onboardingGrade).filter(
      ([_, value]) => value.grades,
    );

    for (const [schoolKey, school] of schools) {
      const grades = Object.keys(school.grades);

      for (const gradeKey of grades) {
        try {
          await runTestForGrade(schoolKey, gradeKey);
          passed.push(`${school.text} - Grade ${gradeKey}`);
        } catch (err) {
          console.error(`❌ FAILED: ${school.text} - Grade ${gradeKey}`);
          failed.push(`${school.text} - Grade ${gradeKey}`);
        }

        console.log("------------------------------");
      }
    }

    // 🔚 Final Summary
    console.log("🎯 Test Summary:");
    if (passed.length) {
      console.log(`✅ Passed: ${passed.join(", ")}`);
    }
    if (failed.length) {
      console.log(`❌ Failed: ${failed.join(", ")}`);
    }

    console.log("\n📢 ✅ All grade onboarding tests completed!");
  })();
}

module.exports = runTestForGrade;
