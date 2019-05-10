// pages/message/leave-message/leave-message.js
const app = getApp()
let baseApiUrl = require('../../../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareMessage();
  },
  send:function(e) {
    let that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: url + '/message/add',
      method: 'post',
      data: {touid:that.options.id,token:token,message:that.data.form_info,formid:e.detail.formId},
      success (res) {
        if (res.data.message) {
          wx.showToast({ title: res.data.message })
        }
        that.setData({
          form_info: ''
        })
      }
    })
  },

  messageInput: function(e) {
      this.setData({
        form_info:e.detail.value
      })
  },
  reset:function() {
    wx.navigateBack({changed: true});
  }
})