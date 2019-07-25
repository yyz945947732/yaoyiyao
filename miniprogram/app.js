const updateManager = wx.getUpdateManager()
App({
    onLaunch() {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }
        this.getUpdate()
        this.globalData = {}
    },
    getUpdate() {
        if (wx.canIUse('getUpdateManager')) {
            updateManager.onCheckForUpdate(res => {
                if (res.hasUpdate) {
                    updateManager.onUpdateReady(() => {
                        wx.showModal({
                            title: '更新提示',
                            content: '新版本已经准备好，是否重启应用？',
                            success: res => {
                                if (res.confirm) {
                                    updateManager.applyUpdate()
                                }
                            }
                        })
                    })
                    updateManager.onUpdateFailed(() => {
                        wx.showModal({
                            title: '已经有新版本了哟~',
                            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
                        })
                    })
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    }
})