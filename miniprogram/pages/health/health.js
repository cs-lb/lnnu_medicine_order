const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    healthInfo:{
      nickName:' ',
      num:' ',
      phone:' '
    },
    btnText:'绑定信息',
    isExamine:"false"
  },

  //输入框双向绑定
  inputChange(e){
    this.setData({
      ['healthInfo.nickName']:e.detail.value
    })
  },
  inputChangenum(e){
    this.setData({
      ['healthInfo.num']:e.detail.value
    })
  },
  inputChangephone(e){
    this.setData({
      ['healthInfo.phone']:e.detail.value
    })
  },
  toyinsi(){
    wx.navigateTo({
      url: '/pages/yinsi/yinsi',
    })
  },
  //提交表单事件
  submitForm(){
    // 假设 this.data.healthInfo.phone 是你要验证的电话号码
let phone = parseInt(this.data.healthInfo.phone);
console.log(phone)
// 正则表达式规则，用于匹配常见的电话号码格式，例如：123-456-7890 或 1234567890
// 你可以根据需要调整正则表达式以匹配特定格式的电话号码

// 测试电话号码是否符合正则表达式规则
if (/^1[3|4|5|7|8][0-9]\d{8}$/.test(phone)) {
  // 电话号码格式正确
  console.log('电话号码格式正确');
} else {
  // 电话号码格式不正确，弹出提示
  wx.showToast({
    title: '电话号码格式不正确',
    icon: 'none'
  });
  return 
}
    wx.cloud.callFunction({
      name:'getHealth',
      data:{
        nickName:this.data.healthInfo.nickName.replace(/\s+/g, ''),
        num: Number(this.data.healthInfo.num),
        phone: this.data.healthInfo.phone
      },
      success:res => {  
        console.log(res)
        if(res.result.errCode === 3){
          wx.showToast({
            title: '信息有误',
            icon:'error'
          })
        }
        if(res.result.errCode === 0){
          //用户注册
          if(!app.globalData.healthInfo){
            app.globalData.healthInfo = res.result.data.user
            console.log(app.globalData.healthInfo)
            this.setData({
              btnText:'更新信息'
            })
            wx.showToast({
              title: '绑定成功',
              icon:'success'
            })
          }
          //用户更新信息
          else{
            app.globalData.healthInfo.nickName  = res.result.data.user.nickName
            app.globalData.healthInfo.phonr  = res.result.data.user.phone
            app.globalData.healthInfo.num  = res.result.data.user.num
            wx.showToast({
              title: '更新信息成功',
              icon:'success'
            })
            wx.switchTab({
              url: '/pages/booking/index',
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      isExamine: app.globalData.isExamine,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(app.globalData.healthInfo)
    if(!app.globalData.healthInfo.num){
      return
    }
    this.setData({
      ['healthInfo.nickName']:app.globalData.healthInfo.nickName,
      ['healthInfo.phone']:app.globalData.healthInfo.phone,
      ['healthInfo.num']:app.globalData.healthInfo.num,
      btnText:'更新信息'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})