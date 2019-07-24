//index.js
const app = getApp()
const db = wx.cloud.database();
Page({
    data: {
        userInfo: {},
        logged: false,
        options: [],
        num: 5,
        answer: 0,
        runMode: false,
        over: false
    },
    onShow() {
        this.getOptions();
    },
    onLoad() {
        if (!wx.cloud) {
            return
        }
        this.onGetOpenid();
        this.getOptions();
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                            app.globalData.userInfo = res.userInfo
                        }
                    })
                }
            }
        })
    },

    getOptions() {
        wx.showLoading({
            title: '正在加载'
        })
        db.collection('yyy_options').where({
            _openid: app.globalData.openid
        }).get().then(res => {
            console.log(res)
            this.setData({
                options: res.data[0].options,
                optionId: res.data[0]._id
            })
            wx.hideLoading()
        }).catch(() => {
            wx.showToast({
                title: '系统繁忙',
                icon: 'none'
            })
        })
    },

    onGetUserInfo(e) {
        if (!this.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo
            })
        }
    },

    onGetOpenid() {
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                app.globalData.openid = res.result.openid
            },
            fail: err => {}
        })
    },

    run() {
        this.setData({
            runMode: true,
            over: false,
            answer: 0,
            num: 5
        })
        this.beginCount();
    },

    beginCount() {
        let runId = setInterval(() => {
                if (this.data.num == 0) {
                    clearInterval(runId)
                    this.setData({
                        runMode: false,
                        over: true
                    })
                } else {
                    this.setData({
                        runId,
                        num: this.data.num - 1
                    })
                }
            }, 1000),
            answerRunId = setInterval(() => {
                if (this.data.num == 0) {
                    setTimeout(() => {
                        clearInterval(answerRunId)
                    }, 1000)
                } else {
                    this.setData({
                        answerRunId,
                        answer: this.getRandom()
                    })
                }
            }, 200)

    },

    getRandom() {
        let answer = Math.floor(Math.random() * this.data.options.length)
        answer == this.data.answer ? this.getRandom() : ''
        return answer
    },

    back() {
        if (this.data.runId && this.data.answerRunId && this.data.num < 5) {
            this.clean()
        } else {
            return
        }
    },
    clean() {
        clearInterval(this.data.runId);
        clearInterval(this.data.answerRunId);
        this.setData({
            runMode: false,
            over: false,
            answer: 0,
            num: 5
        })
    },
    onHide() {
        this.clean()
    },
    onUnload() {
        this.clean()
    }

})