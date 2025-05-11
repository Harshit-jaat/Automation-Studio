module.exports = {
  backbutton: {
    class: "com.horcrux.svg.CircleView",
    path: "//com.horcrux.svg.CircleView",
    uiauto: 'new UiSelector().className("com.horcrux.svg.CircleView")',
  },
  schoolname:{
    path: '//android.widget.TextView[@text="Kendriya Vidyalaya No. 3, Ambala, Haryana, India"]'
  },
  
  lowerprimaryschool: {
    text: "LOWER PRIMARY SCHOOL",
    uiauto: 'new UiSelector().description("LOWER PRIMARY SCHOOL")',
    path: '//android.view.ViewGroup[@content-desc="LOWER PRIMARY SCHOOL"]',
    grades: {
      4: {
        uiauto:
          'new UiSelector().className("android.view.ViewGroup").instance(19)',
        path: '(//android.view.ViewGroup[@content-desc="renderSectionBodyButton"])[1]/android.view.ViewGroup',
      },
      5: {
        uiauto:
          'new UiSelector().className("android.view.ViewGroup").instance(23)',
        path: '(//android.view.ViewGroup[@content-desc="renderSectionBodyButton"])[2]/android.view.ViewGroup',
      },
    },
  },
  upperprimaryschool: {
    text: "UPPER PRIMARY SCHOOL",
    uiauto: 'new UiSelector().description("UPPER PRIMARY SCHOOL")',
    path: '//android.view.ViewGroup[@content-desc="UPPER PRIMARY SCHOOL"]',
    grades: {
      6: {
        uiauto:
          'new UiSelector().className("android.view.ViewGroup").instance(21)',
        path: '(//android.view.ViewGroup[@content-desc="renderSectionBodyButton"])[1]/android.view.ViewGroup',
      },
      7: {
        uiauto:
          'new UiSelector().className("android.view.ViewGroup").instance(25)',
        path: '(//android.view.ViewGroup[@content-desc="renderSectionBodyButton"])[2]/android.view.ViewGroup',
      },
      8: {
        uiauto:
          'new UiSelector().className("android.view.ViewGroup").instance(29)',
        path: '(//android.view.ViewGroup[@content-desc="renderSectionBodyButton"])[3]/android.view.ViewGroup',
      },
    },
  },
  lowersecondaryschool: {
    text: "LOWER SECONDARY SCHOOL",
    uiauto: 'new UiSelector().description("LOWER SECONDARY SCHOOL")',
    path: '//android.view.ViewGroup[@content-desc="LOWER SECONDARY SCHOOL"]',
    grades: {
      9: {
        uiauto:
          'new UiSelector().className("android.view.ViewGroup").instance(23)',
        path: '//android.view.ViewGroup[@content-desc="renderSectionBodyButton"]/android.view.ViewGroup',
      },
    },
  },
  continue: {
    uiauto: 'new UiSelector().className("android.view.ViewGroup").instance(12)',
    path: '//android.view.ViewGroup[@content-desc="GradeListonBoardButton"]/android.view.ViewGroup',
  },
};
