// pages/message/leave-message/leave-message.js
const app = getApp()
let baseApiUrl = require('../../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
     return app.shareMessage()
  },

  formSubmit(e) {
    if (!e.detail.value.suggest) {
      wx.showToast({
        icon: 'none',
        title: '请填写意见',
      })
      return
    }
    let that = this
    wx.request({
      url: url + '/suggest/index',
      method: 'post',
      data: e.detail.value,
      header: {
        'content-type': 'application/json' 
      },
      success(res) {
        if(res.data.code == 0) {
          wx.showToast({title: res.data.message})
        }
        that.setData({
          form_info: '',
          mobile: ''
        })
      }
    })
  }
})