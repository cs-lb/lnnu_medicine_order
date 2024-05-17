// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    let orderData = await cloud.database().collection('order').get();

    userdata = orderData.data
    console.log(userdata)
    //1,定义excel表格名
    let dataCVS = '辽师校医院体检预约表.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['姓名', '职工号', '预约时间', '电话号码','所在学院','性别']; //表属性
    alldata.push(row);
    let phone;
    let department;
    let sex;
    for (let key in userdata) {
      await cloud.database().collection('healthInfo')
      .where({
        nickName:userdata[key].nickName
      })
      .get()
      .then(res=>{
        phone = res.data[0].phone
      })

      await cloud.database().collection('teacher')
      .where({
        name:userdata[key].nickName
      })
      .get()
      .then(res=>{
        console.log(userdata[key].nickName)
        console.log('获取用户信息操作完成',res)
        console.log(res)
        department = res.data[0].department
        sex = res.data[0].gender
      })
      let arr = [];
      arr.push(userdata[key].nickName);
      arr.push(userdata[key].num);
      arr.push(userdata[key].chooseTime);
      arr.push(phone);
      arr.push(department);
      arr.push(sex);
      alldata.push(arr)
    }
    console.log(alldata)
    //3，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "ordersheet",
      data: alldata
    }]);
    //4，把excel文件保存到云存储里
    return await cloud.uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })

  } catch (e) {
    console.error(e)
    return e
  }
}
