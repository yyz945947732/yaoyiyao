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
    export(){
        wx.navigateTo({
            url: '/pages/me/myOption/export/export',
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