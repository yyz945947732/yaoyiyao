// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async() => {
    const wxContext = cloud.getWXContext()
    let contentList = ['收到', '嗯', '=￣ω￣=', '(*^_^*)', 'o(*￣▽￣*)ブ'],
        content;
    content = contentList[Math.floor(Math.random() * contentList.length)]
    await cloud.openapi.customerServiceMessage.send({
        touser: wxContext.OPENID,
        msgtype: 'text',
        text: {
            content
        }
    })

    return 'success'
}