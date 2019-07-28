// pages/option/success/success.js
Page({


  data: {

  },

  toIndex() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },
  toList() {
    wx.switchTab({
      url: '/pages/option/option'
    });
  },
  onShareAppMessage() {
    return {
      title: '选择困难症?试试这个吧',
      path: '/pages/index/index',
      imageUrl: '../../../../../images/xx.png'
    }
  }
})