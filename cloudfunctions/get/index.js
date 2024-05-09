// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let orderData = await cloud.database().collection('order').get();
    userdata = orderData.data
    console.log(userdata)
    //1,定义excel表格名
    let dataCVS = '辽师校医院体检预约表.xlsx'
    //2，定义存储数据的
    let alldata = [];
    let row = ['姓名', '职工号', '预约时间']; //表属性
    alldata.push(row);

    for (let key in userdata) {
      console.log(key)
      let arr = [];
      arr.push(userdata[key].nickName);
      arr.push(userdata[key].num);
      arr.push(userdata[key].chooseTime);
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
