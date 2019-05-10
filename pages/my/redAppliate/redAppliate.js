// pages/my/redAppliate/redAppliate.js
const app = getApp()
let config = require('../../../config.js')
let url = config.config().baseApiUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  spread() {
    wx.navigateTo({
      url: 'spread/spread',
    })
    setTimeout(function () {
      wx.showToast({
        icon: 'loading',
        title: '正在获取图片',
        duration: 1000
      })
    },500)
    
  },
  service: function () {
    wx.showActionSheet({
      itemList: ['微信联系：18636718507', '呼叫客服'],
      success: function (res) {
        if (res.tapIndex === 1) {
          wx.makePhoneCall({
            phoneNumber: '18636718507'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    let that = this;
    this.setData({
      userImg: options.userImg,
      userName: options.userName
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
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    return app.shareMessage();
  },
})