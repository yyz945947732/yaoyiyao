const app = getApp();

Page({


    data: {

    },


    onLoad() {
        this.getUserHead()
    },
    getUserHead() {
        this.setData({
            userHead: app.globalData.userInfo.avatarUrl,
            userName: app.globalData.userInfo.nickName,
            gender: app.globalData.userInfo.gender
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