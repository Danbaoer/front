// pages/my/redAppliate/spread/spread.js
const app = getApp()
let config = require('../../../../config.js')
let url = config.config().baseApiUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    code: "",
    title: "",
    imgs: "",
    imgUrl: ""
  },
  //点击保存图片
  save () {
    var that = this
    wx.showToast({
      icon: 'loading',
      title: '正在保存图片',
      duration: 1000
    })
    wx.getSetting({
      success (res) {
        //没有权限，发起授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {//允许
              that.savePhoto();
            },
            fail () {//拒绝授权
              wx.openSetting({
                success () {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                      that.savePhoto();
                    }
                  })
                }
              })
            }
          })
        } else {
          that.savePhoto()
        }
      }
    })
  },
  savePhoto() {
    var that = this
    wx.downloadFile({
      url: that.data.imgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: "success",
              duration: 1000
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: url + '/match_maker/getQrcode',
      data: { token: token },
      method: 'post',
      success(res) {
        var imgUrl = config.config().uploadUrl + '/images/' + res.data.message;
        that.setData({
          imgUrl: imgUrl
        })
      }
    })
  },

  //用户点击右上角分享
  onShareAppMessage: function () {
    return app.shareMessage();
  }
})