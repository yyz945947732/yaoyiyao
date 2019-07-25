const app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        options: [],
        ifAdd: false,
        newOption: ''
    },

    onShow() {
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
    clearAllOptions() {
        wx.showModal({
            title: '清空提示',
            content: '确定清空所有的选项吗',
            cancelText: '算了',
            confirmText: '确定!',
            confirmColor: '#3CC51F',
            success: result => {
                if (result.confirm) {
                    this.setData({
                        options: []
                    })
                }
            }
        });
    },
    confirm() {
        if (!this.data.newOption) {
            wx.showToast({
                title: '新选项不能为空',
                icon: 'none'
            })
            return
        }
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
    },
    onShareAppMessage() {
        return {
            title: '选择困难症?试试这个吧',
            path: '/pages/index/index',
            imageUrl: '../../images/xx.png'
        }
    }
})