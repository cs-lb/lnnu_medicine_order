const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    healthInfo:{
      nickName:' ',
      height:' ',
      age:' ',
      weight:' ',
      num:' '
    },
    btnText:'绑定信息'
  },

  //输入框双向绑定
  inputChange(e){
    this.setData({
      ['healthInfo.nickName']:e.detail.value
    })
  },
  inputChangeHeight(e){
    this.setData({
      ['healthInfo.height']:e.detail.value
    })
  },
  inputChangeWeight(e){
    this.setData({
      ['healthInfo.weight']:e.detail.value
    })
  },
  inputChangeAge(e){
    this.setData({
      ['healthInfo.age']:e.detail.value
    })
  },
  inputChangenum(e){
    this.setData({
      ['healthInfo.num']:e.detail.value
    })
  },
  //提交表单事件
  submitForm(){
    console.log(99)
    // if(!this.data.healthInfo.nickName && !this.data.healthInfo.num){
    //   wx.showToast({
    //     title: '请绑定个人信息',
    //     icon:'error'
    //   })
    // }
    wx.cloud.callFunction({
      name:'getHealth',
      data:{
        nickName:this.data.healthInfo.nickName,
        height:this.data.healthInfo.height,
        age: this.data.healthInfo.age,
        weight:this.data.healthInfo.weight,
        num: this.data.healthInfo.num
      },
      success:res => {  
        console.log(res)
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
            app.globalData.healthInfo.height = res.result.data.user.height
            app.globalData.healthInfo.nickName  = res.result.data.user.nickName
            app.globalData.healthInfo.age  = res.result.data.user.age
            app.globalData.healthInfo.num  = res.result.data.user.num
            app.globalData.healthInfo.weight  = res.result.data.user.weight
            wx.showToast({
              title: '更新信息成功',
              icon:'success'
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
    if(!app.globalData.healthInfo){
      return
    }
    this.setData({
      ['healthInfo.height']:app.globalData.healthInfo.height,
      ['healthInfo.nickName']:app.globalData.healthInfo.nickName,
      ['healthInfo.age']:app.globalData.healthInfo.age,
      ['healthInfo.weight']:app.globalData.healthInfo.weight,
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