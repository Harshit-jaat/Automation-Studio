const path = require("path");

module.exports = {
    signupWithGoogle: {
      uiauto: 'new UiSelector().text("SIGN UP WITH GOOGLE")',
      path: '//android.widget.TextView[@text="SIGN UP WITH GOOGLE"]',
    },
  
    signupWithApple: {
      uiauto: 'new UiSelector().text("SIGN UP WITH APPLE")',
      path: '//android.widget.TextView[@text="SIGN UP WITH APPLE"]',
    },
  
    signupWithAzure: {
      uiauto: 'new UiSelector().text("SIGN UP WITH AZURE")',
      path: '//android.widget.TextView[@text="SIGN UP WITH AZURE"]',
    },
  
    alreadyHaveAccount: {
      uiauto: 'new UiSelector().text("Already have an account? Log in")',
      path: '//android.widget.TextView[@text="Already have an account? Log in"]',
    },
  
    backButton: {
      id: 'com.binogi:id/backButton',
    },
  
    ageCheckbox: {
      id: 'com.binogi:id/iAmOlder',
      text: 'I am 18 or older',
      path: '//android.widget.CheckBox[@resource-id="com.binogi:id/iAmOlder"]',
    },
  
    guardianConsentCheckbox: {
      id: 'com.binogi:id/parenConsent',
      text: 'I have my parent or guardian consent',
      path: '//android.widget.CheckBox[@resource-id="com.binogi:id/parenConsent"]',
    },
  
    ageWarning: {
      id: 'com.binogi:id/infoTextMessage',
      text: 'Sorry, you need to be older than 18.',
      path: '//android.widget.TextView[@resource-id="com.binogi:id/infoTextMessage"]',
    },
  
    guardianConsentInfo: {
      id: 'com.binogi:id/infoTextMessageSecond',
      text: 'Explicit consent of your parent or guardian is required to use Binogi.',
    },
  
    privacyPolicyText: {
      id: 'com.binogi:id/privacy_policy',
    },
  };
  