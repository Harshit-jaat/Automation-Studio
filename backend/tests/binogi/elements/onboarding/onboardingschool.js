module.exports = {
  locationPrompt: {
    uiauto:
      'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_message")',
    path: '//android.widget.TextView[@resource-id="com.android.permissioncontroller:id/permission_message"]',
  },
  preciseLocation: {
    uiauto:
      'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_location_accuracy_radio_fine")',
    path: '//android.widget.RadioButton[@text="Precise"]',
  },
  approximateLocation: {
    uiauto:
      'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_location_accuracy_radio_coarse")',
    path: '//android.widget.RadioButton[@text="Approximate"]',
  },
  whileUsingApp: {
    uiauto:
      'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_foreground_only_button")',
    path: '//android.widget.Button[@text="While using the app"]',
  },
  onlyThisTime: {
    uiauto:
      'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_allow_one_time_button")',
    path: '//android.widget.Button[@text="Only this time"]',
  },
  dontAllow: {
    uiauto:
      'new UiSelector().resourceId("com.android.permissioncontroller:id/permission_deny_button")',
    path: '//android.widget.Button[@text="Don\'t allow"]',
  },
  backbutton: {
    class: "com.horcrux.svg.CircleView",
    path: "//com.horcrux.svg.CircleView",
    uiauto: 'new UiSelector().className("com.horcrux.svg.CircleView")',
  },
  titleText: {
    class: "android.widget.TextView",
    path: '//android.widget.TextView[@text="What school are you attending?"]',
    uiauto: 'new UiSelector().text("What school are you attending?")',
  },
  schoolSearchInput: {
    class: "android.widget.EditText",
    path: '//android.widget.EditText[@text="Search for your school by name"]',
    uiauto:
      'new UiSelector().className("android.widget.EditText").text("Search for your school by name")',
  },
  skipQuestionText: {
    class: "android.widget.TextView",
    path: '//android.widget.TextView[@text="Skip this question"]',
    uiauto: 'new UiSelector().text("Skip this question")',
  },
  continueButton: {
    class: "android.view.ViewGroup",
    path: '//android.view.ViewGroup[@content-desc="NextButton"]',
    uiauto: 'new UiSelector().description("NextButton")',
  },
};
