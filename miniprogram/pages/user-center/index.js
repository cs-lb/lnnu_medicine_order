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
    btnText:'信息绑定',
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
    wx.navigateTo({
      url: '/pages/health/health'
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
    console.log(app.globalData.headlthInfo)
    if(!app.globalData.headlthInfo){
      return
    }
    this.setData({
      btnText:'更新信息'
    })
  },
  // 跳转到个人信息界面
  redirectToinfo() {
    wx.navigateTo({
      url: '/pages/health/health'
    })
  },
    // 跳转到后台界面
  redirectToadmin() {
    if(app.globalData.healthInfo.is_admin != 1){
      wx.showToast({
        title: '无权限',
        icon:'error'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/admin/admin',
    })
  }
});
