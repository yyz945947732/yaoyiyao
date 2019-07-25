const app = getApp()
const db = wx.cloud.database();
Page({
    data: {
        records: [],
        loadOver: false,
        skip: 0
    },
    onLoad() {
        this.getRecord();
    },
    getRecord() {
        wx.showLoading({
            title: '正在加载',
            mask: true
        })
        db.collection('yyy_record').where({
            _openid: app.globalData.openid
        }).orderBy('create_date', 'desc').skip(this.data.skip).limit(6).get().then(res => {
            wx.hideLoading();
            this.setData({
                records: this.data.records.concat(res.data),
                loadOver: this.data.records.length ? true : false
            })
        }).catch(() => {
            wx.hideLoading();
        })
    },
    clearAllRecords() {
        wx.showModal({
            title: '清空提示',
            content: '确定清空所有的选项吗',
            cancelText: '算了',
            confirmText: '确定!',
            confirmColor: '#3CC51F',
            success: result => {
                if (result.confirm) {
                    this.clearAllRecordsAction()
                }
            }
        });
    },
    clearAllRecordsAction() {
        wx.showLoading({
            title: '正在清理',
            mask: true
        })
        wx.cloud.callFunction({
            name: 'removeRecord',
            data: { openid: app.globalData.openid }
        }).then(() => {
            wx.hideLoading()
            this.getRecord()
        }).catch(() => {
            wx.hideLoading()
        })
    },
    onReachBottom() {
        this.setData({
            skip: this.data.skip + 6,
            loadOver: false
        })
        this.getRecord()
    }
})