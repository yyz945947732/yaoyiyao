const app = getApp();
const db = wx.cloud.database();
const {
  formatTime
} = require("../../../../utils/index");
Page({

  data: {
    code: '',
    options: [],
    hideName: false
  },


  onLoad() {
    this.getMyOption();
  },
  ifName(e) {
    let hideName;
    if (e.detail.value) {
      hideName = true
    } else {
      hideName = false
    }
    this.setData({
      hideName
    })
  },
  getMyOption() {
    wx.showLoading({
      title: '正在加载'
    })
    db.collection('yyy_options').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        options: res.data[0].options
      })
      wx.hideLoading()
    }).catch(() => {
      wx.hideLoading()
    })
  },
  confirm() {
    wx.showModal({
      title: '提示',
      content: '确定导出选项吗?',
      cancelText: '等等',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          if (!this.exportCheck()) {
            return false
          }
          wx.showLoading({
            title: '请稍后'
          })
          db.collection('yyy_exports').where({
            code: this.data.code
          }).get().then(res => {
            if (!res.data.length) {
              this.exportAction()
            } else {
              wx.showToast({
                title: '该选项码已被占用',
                icon: 'none'
              });
            }
          })
        }
      }
    })
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  exportAction() {
    wx.showLoading({
      title: '正在导出'
    })
    db.collection('yyy_exports').add({
      data: {
        options: this.data.options,
        create_date: formatTime(new Date),
        creater: this.data.hideName ? '匿名' : app.globalData.userInfo.nickName,
        total: this.data.options.length,
        importTime: 0,
        code: this.data.code
      }
    }).then(() => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/me/myOption/export/success/success'
      });
    }).catch(() => {
      wx.showToast({
        title: '导出失败',
        icon: 'none'
      })
    })
  },
  exportCheck() {
    if (!this.data.code) {
      wx.showToast({
        title: '选项码不能为空',
        icon: 'none'
      });
      return false
    } else if (this.data.options.length < 2) {
      wx.showToast({
        title: '至少要有两个选项才能导出',
        icon: 'none'
      });
      return false
    } else {
      return true
    }
  },
  onShareAppMessage() {
    return {
      title: '选择困难症?试试这个吧',
      path: '/pages/index/index',
      imageUrl: '../../../../images/xx.png'
    }
  }
})