const app = getApp()
let baseApiUrl = require('../../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let token = wx.getStorageSync('token');
    let that = this;
    wx.request({
      url: url + '/index/activity',
      data: { token: token },
      method: 'post',
      success(res) {
        that.setData({
          resultData: res.data
        })
      }
    })
  },
  onShareAppMessage: function () {
    return app.shareMessage();
  }
})