const app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        options: [],
        ifAdd: false,
        newOption: ''
    },

    onLoad() {
        this.getOptions()
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
            wx.hideLoading()
        })
    },
    addOption() {
        this.setData({
            ifAdd: true
        })
    },
    confirm() {
        let options = this.data.options;
        options.push(this.data.newOption)
        this.setData({
            ifAdd: false,
            options,
            newOption: ''
        })
    },
    setNewOption(e) {
        this.setData({
            newOption: e.detail.value
        })
    },
    remove(e) {
        let {
            i
        } = e.currentTarget.dataset,
            options = this.data.options;
        options.splice(i, 1);
        this.setData({
            options
        })
    },
    save() {
        wx.showLoading({
            title: '正在提交'
        })
        this.ifAddBefore();
    },
    // add() {
    //     wx.cloud.callFunction({
    //         name: 'addOptions',
    //         data: {
    //             options: this.data.options,
    //             create_date: this.formatTime(new Date),
    //             total: this.data.options.length,
    //             userName: app.globalData.userInfo.nickName
    //         }
    //     }).then(() => {
    //         this.success()
    //     }).catch(() => {
    //         wx.showToast({
    //             title: '系统繁忙',
    //             icon: 'none'
    //         });
    //     })
    // },
    add() {
        db.collection('yyy_options').add({
            data: {
                options: this.data.options,
                create_date: this.formatTime(new Date),
                total: this.data.options.length,
                userName: app.globalData.userInfo.nickName
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
                create_date: this.formatTime(new Date),
                total: this.data.options.length,
                userName: app.globalData.userInfo.nickName
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
        wx.hideLoading();
        wx.switchTab({
            url: '/pages/index/index',
            success: () => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                });
            }
        });
    },
    ifAddBefore() {
        db.collection('yyy_options').where({
            _openid: app.globalData.openid
        }).get().then(res => {
            !res.data.length ? this.add() : this.update()
        }).catch(() => {
            wx.showToast({
                title: '系统繁忙',
                icon: 'none'
            })
        })
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
    }
})