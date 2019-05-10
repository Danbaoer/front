// pages/index/detail/detail.js
const app = getApp()
let baseApiUrl = require('../../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  data: {
    uploadUrl: baseApiUrl.config().uploadUrl,
    detail:{}
  },
  leaveMessage: function () {
    var id = this.options.id;
    wx.navigateTo({
        url: 'words/words?id=' + id
    })
  },
  formSubmit: function(e) {
    let that = this
    let id = that.options.id;
    var token = that.token;
    wx.request({
      url: url + '/member/attention',
      data: { touid: id, status: 1, token: token, formid: e.detail.formId },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code === -4) {
          wx.showModal({
            content: '你还没完善资料，在“我要脱单”中完善并通过后才可以使用所有功能哦',
            confirmText: '去完善',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../../my/my'
                })
              }
            }
          })
          return
        }
        if (res.data.code == 0) {
          // that.data.detail.isAttension === 1
          wx.showToast({
            title: res.data.message
          })
          var detail = that.data.detail;
          detail.isAttension = 1;
          that.setData({
            detail: detail
          })
        } else {
          wx.showToast({
            title: res.data.message
          })
        }
      }
    })
  },
  scan: function(e) {
    var that = this;
    wx.request({
      url: url + '/member/scan',
      method:'post',
      data: {touid:that.options.id,token:that.token,formid:e.detail.formId},
      success(res) {
        if (res.data.code === -4) {
          wx.showModal({
            content: '你还没完善资料，在“我要脱单”中完善并通过后才可以使用所有功能哦',
            confirmText: '去完善',
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../../my/my'
                })
              }
            }
          })
          return
        }
        if(res.data.code == 0) {
          var detail = that.data.detail;
          detail.isScan = 1;
          detail.wechat = res.data.message;
          that.setData({
              detail:detail
          });
        } else {
          wx.showToast({
            title: res.data.message
          })
        }
      }
    })
  },
  redLine: function (e) {
    let id = e.target.id
    var that = this;
    wx.request({
      url: url + '/member/contact',
      method:'post',
      data: {formid:e.detail.formId,token:that.token},
      success(res) {
        if (res.data.code == 0) {
          wx.showActionSheet({
            itemList: [res.data.message[id]['wechat'],res.data.message[id]['mobile']],
            success: function (result) {
              if (result.tapIndex === 1) {
                wx.makePhoneCall({
                  phoneNumber: res.data.message[id]['mobile']
                })
              }
            }
          })
        }
      }
    })
  },
  //图片点击事件
  imgYu: function(event) {
     var src = event.currentTarget.dataset.src;//获取data-src
    //图片预览
     wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: new Array(src) // 需要预览的图片http链接列表
    })
  },
  onLoad: function (options) {
    if(options.shareuid) {
        app.globalData.shareuid = options.shareuid;
    }
    this.options = options;
    var token = wx.getStorageSync('token')
    if(!token) {
      wx.switchTab({
          url: '../../my/my'
      });
      return false;
    }
    this.token = token;
  },
  onShow: function () {
    this.getDetail();
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    var path = '/pages/index/detail/detail?id=' + that.options.id;
    if (token) {
      var shareuid = wx.getStorageSync('shareuid');
      path = path + '&shareuid=' + shareuid;
    }
    return {
      title: '洪洞上万名单身收获幸福的地方，我在这里等你！',
      path: path
    }
  },
  getDetail: function() {
    let that=this
    wx.request({
      url: url + '/member/detail',
      method:'post',
      data: {uid:that.options.id,token:that.token},
      success (res) {
        if(res.data.code == 0) {
                that.setData({detail: res.data.message})
        } else {
            wx.showToast({title: res.data.message});
        }
      }
    })
  }
})