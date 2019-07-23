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
            userName: app.globalData.userInfo.nickName
        })
    }
})