const { envList } = require("../../envList");
const { QuickStartPoints, QuickStartSteps } = require("./constants");

Page({
   
        onLoad: function () {
          // this.showUserAgreement();
        },
    showUserAgreement: function () {
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
      },
  data: {
    knowledgePoints: QuickStartPoints,
    steps: QuickStartSteps,
  },

  copyCode(e) {
    const code = e.target?.dataset?.code || '';
    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({
          title: '已复制',
        })
      },
      fail: (err) => {
        console.error('复制失败-----', err);
      }
    })
  },
  tobooking(){
    wx.switchTab({
      url: '/pages/booking/index',
    })
  },
  nav: function () {  
    wx.openLocation({
      latitude:38.91977597465996,	//维度
      longitude: 121.56472016785429, //经度
      name: "辽宁师范大学校医院",	//目的地定位名称
      scale: 15,	//缩放比例
      address: "辽宁师范大学-黄河路校区北院（第一学生食堂前/黄河路856号）"	//导航详细地址
    })
  },
  discoverCloud() {
    wx.switchTab({
      url: '/pages/examples/index',
    })
  },

  gotoGoodsListPage() {
    wx.navigateTo({
      url: '/pages/goods-list/index',
    })
  },
  login:function(){
    wx.navigateTo({
      url:'../event/event',
    })
  },
});
