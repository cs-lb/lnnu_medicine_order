const { envList } = require('../../envList');
const app = getApp()
// pages/me/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      avatarUrl:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      nickName:''
    },
    btnText:'注册',
    openId: '',
    showUploadTip: false,
  },

  getOpenId() {
    wx.showLoading({
      title: '',
    });
    wx.cloud
      .callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getOpenId',
        },
      })
      .then((resp) => {
        this.setData({
          haveGetOpenId: true,
          openId: resp.result.openid,
        });
        wx.hideLoading();
      })
      .catch((e) => {
        this.setData({
          showUploadTip: true,
        });
        wx.hideLoading();
      });
  },

  gotoWxCodePage() {
    wx.navigateTo({
      url: `/pages/exampleDetail/index?envId=${envList?.[0]?.envId}&type=getMiniProgramCode`,
    });
  },
  //输入框双向绑定
  inputChange(e){
    this.setData({
      ['userInfo.nickName']:e.detail.value
    })
  },
  //头像选择事件
  onChooseAvatar(e){
    const { avatarUrl } = e.detail 
    this.setData({
      ['userInfo.avatarUrl']:avatarUrl
    })
  },
  //提交表单事件
  submitForm(){
    console.log(99)
    wx.cloud.callFunction({
      name:'wechat_sign',
      data:{
        avatarUrl:this.data.userInfo.avatarUrl,
        nickName:this.data.userInfo.nickName
      },
      success:res => {  
        console.log(res)
        if(res.result.errCode === 0){
          //用户注册
          if(!app.globalData.userInfo){
            app.globalData.userInfo = res.result.data.user
            console.log(app.globalData.userInfo)
            this.setData({
              btnText:'更新信息'
            })
            wx.showToast({
              title: '注册成功',
              icon:'success'
            })
          }
          //用户更新信息
          else{
            app.globalData.userInfo.avatarUrl = res.result.data.user.avatarUrl
            app.globalData.userInfo.nickName  = res.result.data.user.nickName
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
    console.log(app.globalData.userInfo)
    if(!app.globalData.userInfo){
      return
    }
    this.setData({
      ['userInfo.avatarUrl']:app.globalData.userInfo.avatarUrl,
      ['userInfo.nickName']:app.globalData.userInfo.nickName,
      btnText:'更新信息'
    })
  },
  // 跳转到绑定信息页面
  redirectToinfo() {
    wx.navigateTo({
      url: '/pages/health/health',
      success: function(res) {
        console.log('成功跳转到海外就医页面')
      },
      fail: function(res) {
        console.log('跳转到海外就医页面失败')
      }
    })
  }
});
