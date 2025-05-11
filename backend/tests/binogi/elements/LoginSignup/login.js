const path = require("path");

module.exports = {
    binogiLogo: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/binogi_logo")',
      path: '//android.widget.ImageView[@resource-id="com.binogi:id/binogi_logo"]',
    },
    backButton: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/backButton")',
      path: '//android.widget.ImageView[@resource-id="com.binogi:id/backButton"]',
    },
    loginTitle: {
      uiauto: 'new UiSelector().text("Log in to Binogi")',
      path: '//android.widget.TextView[@text="Log in to Binogi"]',
    },
    loginGoogleButton: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/text_view").text("LOG IN WITH GOOGLE")',
      path: '//android.widget.TextView[@resource-id="com.binogi:id/text_view" and @text="LOG IN WITH GOOGLE"]',
    },
    loginAppleButton: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/text_view").text("LOG IN WITH APPLE")',
      path: '//android.widget.TextView[@resource-id="com.binogi:id/text_view" and @text="LOG IN WITH APPLE"]',
    },
    loginAzureButton: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/text_view").text("LOG IN WITH AZURE")',
      path: '//android.widget.TextView[@resource-id="com.binogi:id/text_view" and @text="LOG IN WITH AZURE"]',
    },
    signupLink: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/signUp")',
      path: '//android.widget.TextView[@resource-id="com.binogi:id/signUp"]',
    },
    privacyPolicyText: {
      uiauto: 'new UiSelector().resourceId("com.binogi:id/privacy_policy")',
      path: '//android.widget.TextView[@resource-id="com.binogi:id/privacy_policy"]',
    },
    firstgmail: {
        path: '(//android.view.View[contains(@content-desc, ".com")])[1]'
    },
    noaccount: {
        path: '//android.widget.TextView[@resource-id="com.binogi:id/accountAlert"]'
    },
    nointernetpopup: {
        path: '//android.widget.TextView[@resource-id="android:id/alertTitle"]'
    },
    nointernetpopupyes: {
        path: '//android.widget.Button[@resource-id="android:id/button1"]'
    },
    nointernetpopupno: {
        path: '//android.widget.Button[@resource-id="android:id/button2"]'
    },
  };
  