Page({
  data: {
    // 默认定义为false
    checkboxValue: false
  },
  
  // 复选框
  handleCheckboxChange(event) {
    console.log('this.data.checkboxValue ==> ' , this.data.checkboxValue);
    this.setData({
      // 点击之后进行取反
      checkboxValue : !this.data.checkboxValue
    })
 
  },
  
  // 登录按钮
  validateCheckbox() {
   
    
    if (this.data.checkboxValue) {
      // 复选框已勾选
      // 执行需要的操作
     wx.navigateTo({
       url: '/pages/health/health',
     })
    } else {
      // 复选框未勾选
      // 执行需要的操作
      wx.showToast({
        title: '请先勾选复选框！',
        icon: 'none'
      });
    }
  }

  


});