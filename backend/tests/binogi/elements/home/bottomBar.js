module.exports = {
    home: {
        path: '//android.widget.TextView[@text="Home"]',
        uiauto : 'new UiSelector().text("Home")',
    },
    scan: {
        path: '//android.widget.TextView[@text="Scan"]',
        uiauto : 'new UiSelector().text("Scan")',
    },
    bookmarks: {
        path: '//android.widget.TextView[@text="Bookmarks"]',
        uiauto : 'new UiSelector().text("Bookmarks")',
    },
    search: {
        path: '//android.widget.TextView[@text="Search"]',
        uiauto : 'new UiSelector().text("Search")',
    },
    assignments: {
        path: '//android.widget.TextView[@text="Assignments"]',
        uiauto : 'new UiSelector().text("Assignments")',
    }
};