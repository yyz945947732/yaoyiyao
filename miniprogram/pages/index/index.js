//index.js
const app = getApp()

Page({
    data: {
        userInfo: {},
        logged: false,
        options: ['黄焖鸡米饭啊啊', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭啊啊', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭啊啊', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭啊啊', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫', '黄焖鸡米饭', '张姐麻辣烫'],
        num: 5,
        answer: 0,
        runMode: false
    },

    onLoad() {
        if (!wx.cloud) {
            return
        }
        this.onGetOpenid();
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
            runMode: true
        })
        this.beginCount();
    },

    beginCount() {
        let runId = setInterval(() => {
            if (this.data.num == 0) {
                clearInterval(runId)
            } else {
                this.setData({
                    num: this.data.num - 1
                })
            }
        }, 1000)
    }

})