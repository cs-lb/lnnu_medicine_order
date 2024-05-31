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
        index:0
      },
      days:["2024-06-05", "2024-06-06", "2024-06-07", "2024-06-08", "2024-06-09",
      "2024-06-10", "2024-06-11", "2024-06-12", "2024-06-13", "2024-06-14",
      "2024-06-15", "2024-06-16", "2024-06-17", "2024-06-18", "2024-06-19",
      "2024-06-20", "2024-06-21", "2024-06-22", "2024-06-23", "2024-06-24",
      "2024-06-25", "2024-06-26", "2024-06-27", "2024-06-28", "2024-06-29",
      "2024-06-30", "2024-07-01", "2024-07-02", "2024-07-03"],
      choosedTimeArray:[],
      datetimeArray:[[],[]],
      times:['7:30-7:34','7:35-7:39','7:40-7:44','7:45-7:49','7:50-7:54','7:55-7:59','8:00-8:04','8:05-8:09','8:10-8:14','8:15-8:19','8:20-8:24','8:25-8:29','8:30-8:34','8:35-8:39','8:40-8:44','8:45-8:49','8:50-8:54','8:55-8:59','9:00-9:04',
      '9:05-9:09','9:10-9:14','9:15-9:19','9:20-9:24',
      '9:25-9:29','9:30-9:34','9:35-9:39','9:40-9:44',
      '9:45-9:49','9:50-9:54','9:55-9:59','10:00-10:04',
      '10:05-10:09','10:10-10:14','10:15-10:19','10:20-10:24','10:25-10:29','10:30-10:34','10:35-10:39','10:40-10:44',
      '10:45-10:49','10:50-10:54','10:55-10:59'
    ],
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
  submitAppointment: async function(e){
    let that = this
    console.log(this.data.orderInfo.index)
    if(this.data.orderInfo.index >= 2){
      wx.showToast({
        title: '预约次数已达上限',
        icon:'none'
      })
      return
    }
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
    console.log(e),
    wx.cloud.callFunction({
      name:'addorder',
      data:{
        chooseTime:this.data.chooseTime,
        nickName:app.globalData.healthInfo.nickName,
        num:app.globalData.healthInfo.num,
        index:app.globalData.orderInfo.index+1
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
          if(!app.globalData.orderInfo){

            app.globalData.orderInfo.chooseTime = res.result.data.user.chooseTime
            app.globalData.orderInfo.nickName  = res.result.data.user.nickName
            app.globalData.orderInfo.num  = res.result.data.user.num
            app.globalData.orderInfo.index  = res.result.data.user.index
            console.log(app.globalData.orderInfo)
            this.setData({
              ['orderInfo.nickName']:app.globalData.orderInfo.nickName,
              ['orderInfo.chooseTime']:app.globalData.orderInfo.chooseTime,
              ['orderInfo.num']:app.globalData.orderInfo.num,
              ['orderInfo.index']:app.globalData.orderInfo.index
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
            app.globalData.orderInfo.index  = res.result.data.user.index
            this.setData({
              ['orderInfo.nickName']:app.globalData.orderInfo.nickName,
              ['orderInfo.chooseTime']:app.globalData.orderInfo.chooseTime,
              ['orderInfo.num']:app.globalData.orderInfo.num,
              ['orderInfo.index']:app.globalData.orderInfo.index
            })
            wx.showToast({
              title: '更新预约信息成功',
              icon:'success'
            })
          }
          wx.cloud.callFunction({
            name: "getData",
            success(res) {
              console.log("获取成功", res.result.data)
              let choosedTimeArray = res.result.data.map(object => object.chooseTime);
              that.setData({
                choosedTimeArray:choosedTimeArray
              })
              let datas = that.data.days
              let newtimedata = app.globalData.orderInfo.chooseTime
              let targetDate = newtimedata.split(' ')[0];
              console.log(targetDate)
              // 使用 filter 方法筛选出特定日期的元素
              let filteredDateTimeSlots = choosedTimeArray.filter(slot => {
                let datePart = slot.split(' ')[0]; // 提取日期部分
                return datePart === targetDate; // 检查是否是目标日期
              });
      
              // 使用 map 方法提取时间
              let timesArray = filteredDateTimeSlots.map(slot => {
                let timePart = slot.split(' ')[1]; // 提取时间部分
                return timePart; // 返回时间
              });
              let updatedTimes = that.data.times.filter(time => {
                // 检查当前时间是否不在 timesArray 中
                return !timesArray.includes(time);
              });
              that.setData({
                datetimeArray:[datas,updatedTimes]
              })
            },
            fail(res) {
              console.log("获取失败", res)
            }
          })

        }
      }
    })
  },
  dayChange(e){
    console.log(e.detail)
    let col = e.detail.column; // 获取选择的日期
    let v = e.detail.value;
    let datas = this.data.days
    if(col == 0){
      // 目标日期
      let targetDate = datas[v];

      // 使用 filter 方法筛选出特定日期的元素
      let filteredDateTimeSlots = this.data.choosedTimeArray.filter(slot => {
        let datePart = slot.split(' ')[0]; // 提取日期部分
        return datePart === targetDate; // 检查是否是目标日期
      });

      // 使用 map 方法提取时间
      let timesArray = filteredDateTimeSlots.map(slot => {
        let timePart = slot.split(' ')[1]; // 提取时间部分
        return timePart; // 返回时间
      });
      let updatedTimes = this.data.times.filter(time => {
        // 检查当前时间是否不在 timesArray 中
        return !timesArray.includes(time);
      });
      console.log(timesArray); // 输出: ["7:30-7:34"]
      this.setData({
        datetimeArray:[datas,updatedTimes]
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) { 
    let that = this
    await wx.cloud.callFunction({
      name: "getData",
      success(res) {
        console.log("获取成功", res.result.data)
        let choosedTimeArray = res.result.data.map(object => object.chooseTime);
        that.setData({
          choosedTimeArray:choosedTimeArray
        })
        let datas = that.data.days
        let targetDate = datas[0];
        console.log(choosedTimeArray)
        // 使用 filter 方法筛选出特定日期的元素
        let filteredDateTimeSlots = choosedTimeArray.filter(slot => {
          let datePart = slot.split(' ')[0]; // 提取日期部分
          return datePart === targetDate; // 检查是否是目标日期
        });

        // 使用 map 方法提取时间
        let timesArray = filteredDateTimeSlots.map(slot => {
          let timePart = slot.split(' ')[1]; // 提取时间部分
          return timePart; // 返回时间
        });
        let updatedTimes = that.data.times.filter(time => {
          // 检查当前时间是否不在 timesArray 中
          return !timesArray.includes(time);
        });
        that.setData({
          datetimeArray:[datas,updatedTimes]
        })
      },
      fail(res) {
        console.log("获取失败", res)
      }
    })
    console.log(1)

  
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
      ['orderInfo.index']:app.globalData.orderInfo.index,
      btnText:'更新信息'
    })
  },

})