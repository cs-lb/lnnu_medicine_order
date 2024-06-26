// app.js
import { promisifyAll, promisify } from 'miniprogram-api-promise';
const wxp = wx.p ={}
promisifyAll(wx,wxp)
App({
  onLaunch: function () {
    var nowTime  = Date.parse(new Date())
    console.log(nowTime)
    
    var delineTime = Date.parse('2024-5-30 12:00:00'.replace(/-/g,'/'))
    // console.log(nowTime > delineTime)
    console.log(delineTime)
    if(nowTime > delineTime) {
      this.globalData.isExamine = false
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud-8gq3cgt46ba3c1d5',
        traceUser: true,
      });
    }
   //调用云函数
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res => {
        //获取用户openid
        console.log(res)
        console.log(res.result.data.openid)
        this.globalData.user_id = res.result.data.openid
      }
    })
    //判断该用户是否已经注册过
    wx.cloud.callFunction({
      name:'isLogin',
      success:res=>{
        if(res.result.errCode === 0){
          this.globalData.userInfo = res.result.data.userInfo
        }
        else{
          console.log(res.result.errMsg)
        }
      }
    })
    //判断该用户是否已经注册过健康状况
    wx.cloud.callFunction({
      name:'isHealth',
      success:res=>{
        if(res.result.errCode === 0){
          this.globalData.healthInfo = res.result.data.healthInfo
          console.log(res)
        }
        else{
          console.log(res.result.errMsg)
        }
      }
    })
    wx.cloud.callFunction({
      name:'haveorder',
      success:res=>{
        if(res.result.errCode === 0){
          this.globalData.orderInfo = res.result.data.orderInfo
          console.log(res)
        }
        else{
          wx.showModal({
            title: '',
            content: '初次使用请您绑定本人信息',
            showCancel: true,
            cancelText: '不同意',
            confirmText: '同意',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击了同意');
                wx.navigateTo({
                  url: '/pages/event/event', // 请将此路径替换为你实际的绑定信息页面路径
                });
              } else if (res.cancel) {
                console.log('用户点击了不同意');
                // 提示信息后退出小程序
                wx.showModal({
                  title: '提示',
                  content: '您已选择不同意用户协议，将无法继续使用本小程序。',
                  showCancel: false,
                  confirmText: '确定',
                  success: function (resConfirm) {
                    if (resConfirm.confirm) {
                      wx.exitMiniProgram(); // 退出小程序
                    }
                  }
                });
              }
            }
          });
          console.log(res.result.errMsg)
        }
      }
    })
  },
  globalData: {
      user_id:'',
      userInfo:null,
      healthInfo:{
        num:'',
        phone:'',
        nickName:'',
        admin:0
      },
      orderInfo:{
        chooseTime:'',
        nickName:'',
        num:'',
        index:0
      },
      isExamine: true,
  },
});
