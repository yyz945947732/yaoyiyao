// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = wx.cloud.database()

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
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
      userName
    }
  }).then(res => {
    console.log(res)
  })
}