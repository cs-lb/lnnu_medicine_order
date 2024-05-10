// pages/booking/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      orderInfo:{
        nickName:'',
        num:'',
        chooseTime:'',
      },
      datetimeArray:[[],[]],
      times:['8:00-9:50','10:00-11:50','12:00-13:50','14:00-15:50','16:00-17:50','18:00-19:50','20:00-21:50'],
      multiIndex:[0,0],
      teacherId:0,
      teacherInfo:{},
      flag:true,
      show:false,
      chooseTime:"",
      address:{},
  },
  //获取未来某天的方法
  getDate(day) {
    var dd = new Date()
    dd.setDate(dd.getDate() + day);//获取AddDayCount天后的日期 
    var y = dd.getFullYear()
    var m = dd.getMonth() + 1//获取当前月份的日期 
    m = m < 10 ? '0' + m : m
    var d = dd.getDate()
    d = d < 10 ? '0' + d : d
    return y + "-" + m + "-" + d
  },
  
  //获取未来几天的数组
  getDates(days){
    let datas =this.data.datetimeArray[0]
    // datas.push('---')
    for(var i = 1;i <= days;i++){
      datas.push(this.getDate(i))
    }
    return datas;
  },

   bindMultiPickerChange(e) {
    this.setData({
      flag:true
    })
    var arr = e.detail.value;
    console.log(arr);  
		var one = this.data.datetimeArray[0][arr[0]];
    var two = this.data.datetimeArray[1][arr[1]];
    let chooseTime = one + " " + two
    this.setData({
			multiIndex: e.detail.value,
      chooseTime: chooseTime,
      show:true
    })
    wx.cloud.callFunction({
      name:'isorder',
      data:{
        chooseTime:this.data.chooseTime,
      },
      success:res => { 
        console.log(res.result.data.flag)
        this.setData({
          flag:res.result.data.flag
        })
      }
    })
    
    // console.log(this.data.chooseTime);
		// this.getflag(this.data.teacherId,this.data.chooseTime);
  },
  submitAppointment(e){
    if(this.data.show == false){
      wx.showToast({
        title: '还没选择时间',
        icon:'error'
      })
      return
    }
    if(!this.data.flag){
      wx.showToast({
        title: '该时间不可约',
        icon:'error'
      })
      return
    }
    console.log("app",app.globalData.healthInfo)
    if(app.globalData.healthInfo === null){
      wx.showToast({
        title: '请填写个人信息',
        icon:'error'
      })
      return
    }
    console.log(e),
    wx.cloud.callFunction({
      name:'addorder',
      data:{
        chooseTime:this.data.chooseTime,
        nickName:app.globalData.healthInfo.nickName,
        num:app.globalData.healthInfo.num
      },
      success:res => {  
        console.log(res)
        if(res.result.errCode == 2){
          wx.showToast({
            title: '请填写个人信息',
            icon:'error'
          })
        }
        if(res.result.errCode === 0){
          //用户注册
          if(!app.globalData.orderInfo.chooseTime){

            app.globalData.orderInfo.chooseTime = res.result.data.user.chooseTime
            app.globalData.orderInfo.nickName  = res.result.data.user.nickName
            app.globalData.orderInfo.num  = res.result.data.user.num
            console.log(app.globalData.orderInfo)
            this.setData({
              ['orderInfo.nickName']:app.globalData.orderInfo.nickName,
              ['orderInfo.chooseTime']:app.globalData.orderInfo.chooseTime,
              ['orderInfo.num']:app.globalData.orderInfo.num,
            })
            wx.showToast({
              title: '预约成功',
              icon:'success'
            })
          }
          //用户更新信息
          else{
            app.globalData.orderInfo.chooseTime = res.result.data.user.chooseTime
            app.globalData.orderInfo.nickName  = res.result.data.user.nickName
            app.globalData.orderInfo.num  = res.result.data.user.num
            this.setData({
              ['orderInfo.nickName']:app.globalData.orderInfo.nickName,
              ['orderInfo.chooseTime']:app.globalData.orderInfo.chooseTime,
              ['orderInfo.num']:app.globalData.orderInfo.num,
            })
            wx.showToast({
              title: '更新预约信息成功',
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
  onLoad: function (options) { 
    const address = wx.getStorageSync("address")
    var datas = this.getDates(7)
    this.setData({
      datetimeArray:[datas,this.data.times],
      address
    })
    console.log(this.data.datetimeArray);
    // let chooseTime = this.data.datetimeArray[0][0]+" "+this.data.datetimeArray[1][0]
    // this.setData({
    //   chooseTime
    // })
    // this.getflag(this.data.teacherId,this.data.chooseTime);
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
    console.log(app.globalData.orderInfo)
    if(!app.globalData.orderInfo){
      return
    }
    this.setData({
      ['orderInfo.nickName']:app.globalData.orderInfo.nickName,
      ['orderInfo.chooseTime']:app.globalData.orderInfo.chooseTime,
      ['orderInfo.num']:app.globalData.orderInfo.num,
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