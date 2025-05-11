const { initDriver,getDriver, quitDriver } = require("../../../utils/helpers");
const { click,typeInInput} = require("../../../utils/mainfunction"); 
const {clickContinue,clickBack} = require("../../../utils/commonfunction");
const {enablePlayStore,disablePlayStore} = require("../../../utils/ChangeCountry"); 



const intro = require("../../elements/onboarding/intro");
const role = require("../../elements/onboarding/role");
const school = require("../../elements/onboarding/school");


async function home_bottom_bar_clicks() {
    const driver = await initDriver();
    // await disablePlayStore();

  try {
    await click(intro.letsgo,{ print : true});
    await click(role.student,{print:true});
    clickContinue();
    await click(school.skip,{delay: 5000});
    await click("LOWER PRIMARY SCHOOL");
    await click("4");
    clickContinue();
    await click("MATHEMATICS");
    clickContinue();
    await enablePlayStore();
  } catch (error) {
    console.error(error);
  } finally {
    await quitDriver();
    // await enablePlayStore();
  }
}

if (require.main === module) {
  (async () => {
    await home_bottom_bar_clicks();
  })();
}

module.exports = {
  home_bottom_bar_clicks,
};