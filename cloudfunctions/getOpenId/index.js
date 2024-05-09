// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = {}
  result.errCode = 0
  result.errMsg = '成功返回用户的openid'
  let data = {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
  result.data = data
  return result
}