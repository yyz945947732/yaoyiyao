const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                let userInfo = res.userInfo;
                app.globalData.userInfo = userInfo;
              }
            })
          }
        }
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权,将无法进入小程序,请授权之后再进入!',
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  }
})