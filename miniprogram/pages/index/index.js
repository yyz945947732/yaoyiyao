//index.js
const {
    formatTime
} = require("../../utils/index");
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
        over: false,
        textColor: ['#fd400a', '#fe5323', '#fa6338', '#fe734b', '#fa7f5c', '#fd8f70'],
        animationData: {}
    },
    onShow() {
        app.globalData.openid ? this.getOptions() : ''
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
                                userInfo: res.userInfo,
                                logged: true
                            })
                            app.globalData.userInfo = res.userInfo
                        }
                    })
                } else {
                    this.toLogin();
                }
            },
            fail: () => {
                this.toLogin();
            }
        })
    },
    toLogin() {
        wx.showModal({
            title: '警告',
            content: '尚未进行授权,请点击确定跳转到授权页面进行授权',
            success: res => {
                res.confirm ? wx.navigateTo({
                    url: '/pages/index/login/login'
                }) : ''
            }
        })
    },
    getOptions() {
        if (!app.globalData.openid) {
            return
        }
        wx.showLoading({
            title: '正在加载'
        })
        db.collection('yyy_options').where({
            _openid: app.globalData.openid
        }).get().then(res => {
            this.setData({
                options: res.data[0].options,
                optionId: res.data[0]._id
            })
            wx.hideLoading()
        }).catch(() => {
            wx.hideLoading()
        })
    },

    onGetUserInfo(e) {
        if (!this.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
                avatarUrl: e.detail.userInfo.avatarUrl,
                userInfo: e.detail.userInfo
            })
            app.globalData.userInfo = e.detail.userInfo
        }
    },

    onGetOpenid() {
        // 调用云函数
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                app.globalData.openid = res.result.openid
                this.getOptions();
            },
            fail: () => {}
        })
    },

    run() {
        if (this.data.options.length < 2) {
            wx.showModal({
                title: '选项不足',
                content: '至少要有两个选项才可以噢,去添加选项吗?',
                cancelText: '不用了',
                confirmText: '好的',
                success: res => {
                    if (res.confirm) {
                        wx.switchTab({
                            url: '/pages/option/option'
                        })
                    }
                }
            })
            return
        }
        this.setData({
            runMode: true,
            over: false,
            answer: 0,
            num: 5
        })
        this.routeBell();
        this.beginCount();
    },
    routeBell() {
        let animation = wx.createAnimation({
                duration: 100
            }),
            rotateBell = setInterval(() => {
                if (this.data.num == 0) {
                    clearInterval(rotateBell)
                }
                animation.rotate(45).step().rotate(-45).step().rotate(0).step()
                this.setData({
                    animationData: animation.export(),
                    rotateBell
                })
            }, 100)
    },
    beginCount() {
        wx.setNavigationBarTitle({
            title: this.data.num.toString()
        })
        let answerRunId = setInterval(() => {
                if (this.data.num) {
                    this.setData({
                        answerRunId,
                        answer: this.getRandom()
                    })
                }
            }, 200),
            runId = setInterval(() => {
                if (this.data.num == 0) {
                    clearInterval(runId)
                    clearInterval(answerRunId)
                    wx.setNavigationBarTitle({
                        title: '摇一摇'
                    })
                    this.writeRecord()
                } else {
                    this.setData({
                        runId,
                        num: this.data.num - 1
                    })
                    wx.setNavigationBarTitle({
                        title: this.data.num.toString()
                    })
                }
            }, 1000)

    },

    writeRecord() {
        wx.showLoading({
            title: '生成记录中',
            mask: true
        })
        db.collection('yyy_record').add({
            data: {
                answer: this.data.options[this.data.answer].name,
                answerImg: this.data.options[this.data.answer].imgSrc,
                options: this.data.options,
                create_date: formatTime(new Date),
                total: this.data.options.length,
                userName: app.globalData.userInfo.nickName
            }
        }).then(() => {
            this.setData({
                runMode: false,
                over: true
            })
            wx.vibrateLong()
            wx.hideLoading()
        }).catch(() => {
            wx.hideLoading()
        })
    },

    getRandom() {
        let answer = Math.floor(Math.random() * this.data.options.length)
        answer == this.data.answer ? this.getRandom() : ''
        return answer
    },

    back() {
        if (this.data.runId && this.data.answerRunId && this.data.rotateBell && this.data.num < 5) {
            wx.setNavigationBarTitle({
                title: '摇一摇'
            })
            this.clean()
        } else {
            return
        }
    },
    clean() {
        clearInterval(this.data.runId);
        clearInterval(this.data.answerRunId);
        clearInterval(this.data.rotateBell);
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
    },
    navToAdd() {
        wx.switchTab({
            url: '/pages/option/option'
        });
    },
    onShareAppMessage() {
        if (this.data.over) {
            return {
                title: '我摇中了' + this.data.options[this.data.answer].name + ',你也来试试吧',
                path: '/pages/index/index'
            }
        } else {
            return {
                title: '选择困难症?试试这个吧',
                path: '/pages/index/index',
                imageUrl: '../../images/xx.png'
            }
        }
    }

})