// pages/option/option.js
Page({


    data: {
        options: ['黄焖鸡米饭', '张姐麻辣烫'],
        ifAdd: false,
        newOption: ''
    },

    onLoad() {

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
        let { i } = e.currentTarget.dataset,
            options = this.data.options;
        options.splice(i, 1);
        this.setData({
            options
        })
    }
})