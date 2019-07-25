const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event) => {
    let { openid } = event
    try {
        return await db.collection('yyy_record').where({
            _openid: openid
        }).remove()
    } catch (e) {
        console.error(e)
    }
    return {
        openid
    }
}