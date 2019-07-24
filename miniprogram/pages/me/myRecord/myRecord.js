const app = getApp()
const db = wx.cloud.database();
Page({
    data: {
        records: [],
        loadOver:false,
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
        }).orderBy('create_date','desc').skip(this.data.skip).limit(6).get().then(res => {
            wx.hideLoading();
            this.setData({
                records: this.data.records.concat(res.data),
                loadOver:true
            })
        }).catch(() => {
            wx.hideLoading();
        })
    },
    onReachBottom() {
        this.setData({
            skip: this.data.skip + 6,
            loadOver:false
        })
        this.getRecord()
    }
})