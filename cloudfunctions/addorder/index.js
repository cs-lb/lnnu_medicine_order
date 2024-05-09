// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //检测用户的openid是否正确获取
  if(!wxContext.OPENID){
    let result={}
    result.errCode = 1
    result.errMsg = '未能正确获取到用户的openid，请退出小程序重试'
    let data = {}
    result.data = data
    return result
  }
  //校验必要参数
  if(!event.num || !event.nickName){
    let result = {}
    result.errCode = 2
    result.errMsg = '未传必要参数，请重试'
    let data = {}
    result.data = data
    return result
  }
  //根据openid获取用户信息
  const db = cloud.database()
  let user //保存用户信息
  let add_result_id = {} //新增结果的系统定义的_id,用来判断最后是新增了用户还是更新原有用户信息
  await db.collection('order')
  .where({
    openid:wxContext.OPENID
  })
  .get()
  .then(res=>{
    console.log('获取用户信息操作完成',res)
    user = res.data[0]
  })
  //如果没有获取到，则新增用户
  if(!user){
    //构造要添加的数据
    to_add_data = {
      nickName:event.nickName || '', //昵称
      num:event.num, //职工号
      chooseTime:event.chooseTime, //所约定的时间
      openid:wxContext.OPENID, //openid
      orderTime:new Date() //完成预约时间
    }
    await db.collection('order')
    .add({
      data:to_add_data
    })
    .then(res=>{
      console.log('新增用户操作完成',res)
      add_result_id = res._id
    })

  }
  //如果获取到了，则给用户更新最新的数据
  else{
    await db.collection('order')
    .where({
      openid:wxContext.OPENID
    })
    .update({
      data:{
        nickName:event.nickName || '', //昵称
        num:event.num, //职工号
        chooseTime:event.chooseTime, //时间
        openid:wxContext.OPENID, //openid
        orderTime:new Date() //注册时间
      }
    })
    .then(res=>{
      console.log('更新操作完成',res)
    })
  }

  //此时再从数据库中读取用户信息返回前端
  await db.collection('order')
  .where({
    openid:wxContext.OPENID
  })
  .field({//表示查询结果只需要返回配置项里的字段
    nickName:true,
    num:true,
    chooseTime:true
  })
  .get()
  .then(res=>{
    console.log('获取用户最新信息操作完成',res)
    user = res.data[0]
  })
  let result = {}
  if(!add_result_id){
    result.errCode = 0
    result.errMsg = '新增用户成功'
  }
  else{
    result.errCode = 0
    result.errMsg = '该用户已经微信注册过，信息已更新'
  }
  let data = {}
  data.user = user
  result.data = data
  return result
}