// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext() //获取微信小程序的上下文信息
  //在数据库中查找时间是否被预约
  const db = cloud.database()
  let userInfo = {}
  await db.collection('order')
  .where({
    chooseTime:event.chooseTime 
  })
  .get()
  .then(res => {
    console.log('查找完毕',res)
    userInfo = res.data[0] //找到的第一条数据
  })
  let result = {}
  if(!userInfo){ //没找到
    data = {}
    data.flag = true
    result.data = data
    return result
  }
  data = {}
  data.flag = false
  result.data = data
  console.log(result)
  return result
}