module.exports = {
  backbutton: {
    class: "com.horcrux.svg.CircleView",
    path: "//com.horcrux.svg.CircleView",
    uiauto: 'new UiSelector().className("com.horcrux.svg.CircleView")',
  },
  student: {
    uiauto: 'new UiSelector().className("android.view.ViewGroup").instance(12)',
    path: '//android.view.ViewGroup[@content-desc="Student, I will use Binogi for studying"]/android.view.ViewGroup/android.view.ViewGroup',
  },
  guardian: {
    uiauto: 'new UiSelector().className("android.view.ViewGroup").instance(18)',
    path: '//android.view.ViewGroup[@content-desc="Guardian, I will help my child to study"]/android.view.ViewGroup/android.view.ViewGroup',
  },
  teacher: {
    uiauto: 'new UiSelector().className("android.view.ViewGroup").instance(24)',
    path: '//android.view.ViewGroup[@content-desc="Teacher, I will use Binogi with my students"]/android.view.ViewGroup/android.view.ViewGroup',
  },
  continue: {
    uiauto: 'new UiSelector().className("android.view.ViewGroup").instance(28)',
    path: '//android.view.ViewGroup[@content-desc="CONTINUE"]/android.view.ViewGroup',
  },
};
