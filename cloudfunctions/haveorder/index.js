// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //在数据库中查找用户是否已经预约过了
  const db = cloud.database()
  let userInfo = {}
  await db.collection('order')
  .where({
    openid: wxContext.OPENID
  })
  .get()
  .then(res => {
    console.log('查找完毕',res)
    userInfo = res.data[0]
  })
  if(!userInfo){
    let result = {}
    result.errCode = 1
    result.errMsg = '该用户还未预约过'
    let data = {}
    result.data = data
    return result
  }
  let result = {}
  result.errCode = 0
  result.errMsg = '该用户已经预约过了'
  let data = {}
  data.orderInfo = userInfo
  result.data = data
  return result
}