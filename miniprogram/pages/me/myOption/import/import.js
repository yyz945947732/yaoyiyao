const db = wx.cloud.database();
const app = getApp();
const {
  formatTime
} = require("../../../../utils/index")
Page({
  data: {
    code: ''
  },
  onLoad(option) {
    if (option.key) {
      this.setData({
        code: '1'
      })
      this.confirm()
    }
  },
  confirm() {
    if (!this.importCheck()) {
      return false
    }
    this.getOptionByCode();
  },
  getOptionByCode() {
    wx.showLoading({
      title: '请稍等'
    })
    db.collection('yyy_exports').where({
      code: this.data.code
    }).get().then(res => {
      if (res.data.length) {
        this.setData({
          options: res.data[0].options,
          exportId: res.data[0]._id,
          importTime: res.data[0].importTime,
          name: res.data[0].name,
        })
        this.importAction()
      } else {
        wx.showToast({
          title: '无效选项码',
          icon: 'none'
        })
      }
    }).catch(() => {
      wx.hideLoading();
    })
  },
  importAction() {
    wx.showLoading({
      title: '正在导入'
    })
    this.ifAddBefore()
  },
  getCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  importCheck() {
    if (!this.data.code) {
      wx.showToast({
        title: '选项码不能为空',
        icon: 'none'
      });
      return false
    } else {
      return true
    }
  },
  add() {
    db.collection('yyy_options').add({
      data: {
        options: this.data.options,
        create_date: formatTime(new Date),
        total: this.data.options.length,
        userName: app.globalData.userInfo.nickName,
        name: this.data.name
      }
    }).then(() => {
      this.success()
    }).catch(() => {
      wx.showToast({
        title: '系统繁忙',
        icon: 'none'
      });
    })
  },
  update() {
    db.collection('yyy_options').doc(this.data.optionId).update({
      data: {
        options: this.data.options,
        create_date: formatTime(new Date),
        total: this.data.options.length,
        userName: app.globalData.userInfo.nickName,
        name: this.data.name
      }
    }).then(() => {
      this.success()
    }).catch(() => {
      wx.showToast({
        title: '系统繁忙',
        icon: 'none'
      });
    })
  },
  success() {
    db.collection('yyy_exports').doc(this.data.exportId).update({
      data: {
        importTime: this.data.importTime + 1
      }
    }).then(() => {
      this.goToSuccess()
    }).catch(() => {
      this.goToSuccess()
    })
  },
  goToSuccess() {
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/me/myOption/import/success/success'
    });
  },
  ifAddBefore() {
    db.collection('yyy_options').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      this.setData({
        optionId: res.data[0]._id
      });
      !res.data.length ? this.add() : this.update()
    }).catch(() => {
      wx.showToast({
        title: '系统繁忙',
        icon: 'none'
      })
    })
  },
  onShareAppMessage() {
    return {
      title: '选择困难症?试试这个吧',
      path: '/pages/index/index',
      imageUrl: '../../../../images/xx.png'
    }
  }
})