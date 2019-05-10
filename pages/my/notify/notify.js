// pages/my/notify/notify.js
const app = getApp()
let baseApiUrl = require('../../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  data: {
    notices: [],
    message:[],
    tab:'selected',
    token: '',
    selectedLoading:1,
    selected1Loading:1,
    selectedPage:1,
    selected1Page:1,
  },
  selected: function (e) {
    this.setData({
      tab:'selected'
    })
  },
  selected1: function (e) {
    this.setData({
      tab:'selected1'
    })
  },
  messagePersonDetail (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/detail/detail?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    if(!token) {
        wx.switchTab({
          url: '../my/my'
        });
        return false;
    }
    this.token = token;
    this.getNotices();
    this.getMessages();
  },

  getNotices: function() {
    let that = this;
    if(that.data.selectedLoading == 0) {
      return false;
    }
    that.setData({selectedLoading:1});
    wx.showToast({title:"加载中",icon:'loading'});
    // 通知列表展示
    wx.request({
      url: url + '/member/notice',
      method: 'post',
      data: {token: that.token,page:that.data.selectedPage},
      success(res) {
        wx.hideToast();
        if (res.data.code == 0) {
            if(res.data.message.length > 0) {
              var notices = that.data.notices;
              notices = notices.concat(res.data.message);
              that.setData({
                notices:notices,
                selectedPage:that.data.selectedPage + 1,
                selectedLoading:1
              });
            }
        } else {
          wx.showToast({title:res.data.message})
        }
      }
    })
  },

  getMessages:function() {
    var that = this;
    if(that.data.selected1Loading == 0) {
      return false;
    }
    that.setData({selected1Loading:1});
    wx.showToast({title:"加载中",icon:'loading'});
    wx.request({
      url: url + '/message/index',
      method: 'post',
      data: {token:that.token,page:that.data.selected1Page},
      success(res) {
        wx.hideToast();
        if (res.data.code == 0) {
          if(res.data.message.length > 0) {
            var messages = that.data.messages;
            messages = messages.concat(res.data.message);
            that.setData({
              messages:messages,
              selected1Page:that.data.selected1Page + 1,
              selected1Loading:1
            });
          }
        } else {
          wx.showToast({title:res.data.message});
        }
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var tab = this.data.tab;

    if(tab == 'selected') {
      this.getNotices();
    } else if(tab == 'selected1') {
      this.getMessages();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareMessage();
  },
})



