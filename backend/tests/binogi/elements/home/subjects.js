module.exports = {
    
    chemistry:
    {
        uiauto: 'new UiSelector().text("Chemistry")',
        path: '//android.widget.TextView[@text="Chemistry"]',
    },
    maths: {
        uiauto: 'new UiSelector().text("Mathematics")',
        path: '//android.widget.TextView[@text="Mathematics"]',
       
    },
    physics : {
        uiauto : 'new UiSelector().text("Physics")',
        path : '//android.widget.TextView[@text="Physics"]'

    },
    biology: {
        uiauto: 'new UiSelector().text("Biology")',
        path: '//android.widget.TextView[@text="Biology"]'
    }
};