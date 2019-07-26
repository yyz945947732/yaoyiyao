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
        over: false,
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
                }
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
            console.log(res)
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
            // this.routeBell();
        this.beginCount();
    },
    routeBell() {
        let animation = wx.createAnimation({
            duration: 100
        });
        animation.rotate(45).step().rotate(-45).step().rotate(0).step()
        this.setData({
            animationData: animation.export()
        })
    },
    beginCount() {
        let runId = setInterval(() => {
                if (this.data.num == 0) {
                    clearInterval(runId)
                    this.writeRecord()
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
                    this.routeBell();
                    this.setData({
                        answerRunId,
                        answer: this.getRandom()
                    })
                }
            }, 200)

    },

    writeRecord() {
        wx.showLoading({
            title: '生成记录中',
            mask: true
        })
        db.collection('yyy_record').add({
            data: {
                answer: this.data.options[this.data.answer],
                options: this.data.options,
                create_date: this.formatTime(new Date),
                total: this.data.options.length,
                userName: app.globalData.userInfo.nickName
            }
        }).then(() => {
            this.setData({
                runMode: false,
                over: true
            })
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
        if (this.data.runId && this.data.answerRunId && this.data.num < 5) {
            this.clean()
        } else {
            return
        }
    },
    formatTime(date) {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
    },
    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
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
    },
    navToAdd() {
        wx.switchTab({
            url: '/pages/option/option'
        });
    },
    onShareAppMessage() {
        if (this.data.over) {
            return {
                title: '我抽中了' + this.data.options[this.data.answer] + ',你也来试试吧',
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