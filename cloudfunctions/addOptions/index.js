// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init()
const db = cloud.database()
const wxContext = cloud.getWXContext()

// 云函数入口函数
exports.main = async (event) => {
  let {
    options,
    create_date,
    total,
    userName
  } = event;
  await db.collection('yyy_options').add({
    data: {
      options,
      create_date,
      total,
      userName,
      _openid:wxContext.OPENID
    }
  }).then(res => {
    console.log(res)
  })
  return{
    event
  }
}