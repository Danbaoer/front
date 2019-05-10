// pages/my/my.js
//获取应用实例
const app = getApp()
let baseApiUrl = require('../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
    data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      modalFlag: true,
      notifyFlag: true,
      integralFlag: true,
      suggestFlag: true,
      loginFlag: true,
      redFlag: true,
      examine: ''
    },
    // 联系
    call() {
      wx.makePhoneCall({
        phoneNumber: '18636718507'
      })
    },
    //点击添加地址事件
    add_address_fun: function () {
        wx.navigateTo({
            url: 'info/info',
        })
    },
    //设置个人信息
    setting:function() {
      let token = wx.getStorageSync('token')
      if (!token){
          this.setData({ loginFlag: false })
      } else {
          wx.navigateTo({
              url: 'setting/setting',
          })
      }
    },
    //可用积分
    myIntegral () {
      let token = wx.getStorageSync('token')
      if (!token) {
        this.setData({ integralFlag: false })
        return
      } else {
        wx.navigateTo({
          url: 'integral/integral',
        })
      }
  },
  //通知
  myNotify() {
    let token = wx.getStorageSync('token')
    if (!token) {
      this.setData({ notifyFlag: false })
      return
    } else {
      wx.navigateTo({
        url: 'notify/notify',
      })
    }
  },
  //红娘申请
  redFlag () {
    let that = this
    let token = wx.getStorageSync('token')
    if (!token) {
      that.setData({ redFlag: false })
      return
    } else if (that.data.examine === 1){
      wx.navigateTo({
        url: `./redAppliate/redAppliate?userImg=${that.data.userInfo.avatarUrl}&userName=${that.data.userInfo.nickName}`
      })
      return
    } else {
      wx.navigateTo({
        url: `./redAppliate/info/info?userImg=${that.data.userInfo.avatarUrl}&userName=${that.data.userInfo.nickName}`
      })
    }
  },
  //意见
  suggest:function() {
      let token = wx.getStorageSync('token')
      if (!token) {
          this.setData({ suggestFlag: false })
          return
      } else {
          wx.navigateTo({
              url: 'suggest/suggest',
          })
      }
  },
  //模态提示框
  modalOk: function () {
    this.setData({ notifyFlag: true, suggestFlag: true, loginFlag: true, redFlag: true, integralFlag: true })
  },
  onLoad: function () {
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo){
      this.setData({
          userInfo: e.detail.userInfo,
      })
      console.log('授权通过');
      app.login(app.globalData.shareuid);
    }else{
      console.log('拒绝授权');
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    wx.request({
      url: url + '/index/version',
      method: 'post',
      success: function (res) {
        var version = res.data.version;
        var menus = res.data.menus;
        for (var i=0;i<menus.length;i++){
          wx.setTabBarItem({
            index: i,
            text: menus[i]
          })
        }
        if(version == 0) {
          that.setData({audit:1})
        } else {
          that.setData({audit:0});
          var token = wx.getStorageSync('token');
          var userInfo = null;
          if(token) {
              userInfo = app.globalData.userInfo;
          };
          that.setData({
            userInfo:userInfo,
          })
          wx.request({
            url: url + '/match_maker/status',
            data: { token: token },
            method: 'post',
            success(res) {
              that.setData({
                examine: res.data.message
              })
            }
          })
        }
      }
    })
  },

  //用户点击右上角分享
  onShareAppMessage: function () {
    return app.shareMessage();
  },
})