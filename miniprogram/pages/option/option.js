const app = getApp();
const db = wx.cloud.database();
Page({
    data: {
        options: [],
        ifAdd: false,
        focus: false,
        newOption: {},
        bigImg: '../../images/images.svg'
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
            ifAdd: true,
            focus: true
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
        if (!this.checkOption()) {
            return
        }
        let options = this.data.options;
        options.push(this.data.newOption);
        this.setData({
            ifAdd: false,
            options,
            newOption: {}
        })
        wx.pageScrollTo({
            scrollTop: 1000
        })
    },
    checkOption() {
        if (!this.data.newOption) {
            wx.showToast({
                title: '新选项不能为空',
                icon: 'none'
            })
            return
        } else if (this.data.options.some(item => item.name == this.data.newOption.name)) {
            wx.showToast({
                title: '选项已存在,不能重复添加',
                icon: 'none'
            })
            return
        } else {
            return true
        }
    },
    setNewOption(e) {
        let newOption = {
            name: e.detail.value,
            imgSrc: '../../images/xx.png'
        }
        this.setData({
            newOption
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
        wx.navigateTo({
            url: '/pages/option/success/success'
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
    close() {
        this.setData({
            ifAdd: false,
            focus: false,
            newOption: {}
        })
    },
    changeBigImg() {
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                wx.showLoading({
                    title: '上传中',
                });
                let filePath = res.tempFilePaths[0],
                    name = Math.random() * 1000000,
                    cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {
                        this.data.newOption.imgSrc = res.fileID
                        this.setData({
                            bigImg: res.fileID,
                            newOption: this.data.newOption
                        });
                        wx.showToast({
                            title: '上传成功',
                            icon: 'success'
                        })
                    },
                    fail: () => {
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none'
                        })
                    }
                });
            }
        })
    },
    onShareAppMessage() {
        return {
            title: '选择困难症?试试这个吧',
            path: '/pages/index/index',
            imageUrl: '../../images/xx.png'
        }
    }
})