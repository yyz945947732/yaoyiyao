const app = getApp();
const db = wx.cloud.database();
Page({


    data: {
        options: []
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
            this.setData({
                options: res.data[0].options
            })
            wx.hideLoading()
        }).catch(() => {
            wx.hideLoading()
        })
    },
    export () {
        if (this.data.options.length < 2) {
            wx.showToast({
                title: '至少要有两个选项才能导出',
                icon: 'none'
            })
            return
        }
        wx.navigateTo({
            url: '/pages/me/myOption/export/export',
        });
    },
    import() {
        wx.navigateTo({
            url: '/pages/me/myOption/import/import',
        });
    },
    onShareAppMessage() {
        return {
            title: '选择困难症?试试这个吧',
            path: '/pages/index/index',
            imageUrl: '../../../images/xx.png'
        }
    }
})