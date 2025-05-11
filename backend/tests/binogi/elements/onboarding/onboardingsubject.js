module.exports = {
  backbutton: {
    class: "com.horcrux.svg.CircleView",
    path: "//com.horcrux.svg.CircleView",
    uiauto: 'new UiSelector().className("com.horcrux.svg.CircleView")',
  },
  subjectlist: {
    chemistry: {
      id: "CHEMISTRY",
      uiauto: 'new UiSelector().description("CHEMISTRY")',
      path: '//android.view.ViewGroup[@content-desc="CHEMISTRY"]',
    },
    biology: {
      id: "BIOLOGY",
      uiauto: 'new UiSelector().description("BIOLOGY")',
      path: '//android.view.ViewGroup[@content-desc="BIOLOGY"]',
    },
    physics: {
      id: "PHYSICS",
      uiauto: 'new UiSelector().description("PHYSICS")',
      path: '//android.view.ViewGroup[@content-desc="PHYSICS"]',
    },
    mathematics: {
      id: "MATHEMATICS",
      uiauto: 'new UiSelector().text("MATHEMATICS")',
      path: '//android.widget.TextView[@text="MATHEMATICS"]',
    },
  },
  continue: {
    path: '//android.view.ViewGroup[@content-desc="Continue button"]',
    uiauto: 'new UiSelector().description("Continue button")',
  },
};
