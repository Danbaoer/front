// pages/my/redAppliate/fans/fans.js
const app = getApp()
let config = require('../../../../config.js')
let url = config.config().baseApiUrl
Page({
  data: {
    registered:[],
    appointment:[],
    join: [],
    tab: 'selected',
    selectedLoading:1,
    selected1Loading:1,
    selected2Loading:1,
    selectedPage:1,
    selected1Page:1,
    selected2Page:1,
    uploadUrl:config.config().uploadUrl
  },
  selected: function (e) {
    this.setData({
      tab: 'selected',
    })
  },
  selected1: function (e) {
    this.setData({
      tab: 'selected1',
    })
  },
  selected2: function (e) {
    this.setData({
      tab: 'selected2',
    })
  },
  //跳转到登录
  toLogin() {
    wx.switchTab({
      url: '../../my',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.token = wx.getStorageSync('token');
    this.getRegistered();
    this.getAppointment();
    this.getJoin();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.tab == 'selected') {
      this.getRegistered();
    } else if(this.data.tab == 'selected1') {
      this.getAppointment();
    } else if(this.data.tab == 'selected2') {
      this.getJoin();
    }
  },

  //查看个人信息详情
  showDetail(e) {
    let that = this
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../../../index/detail/detail?id=' + id,
    })
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    return app.shareMessage();
  },
  getRegistered: function() {
    var that = this;
    // 所有会员信息
    if(that.data.selectedLoading == 0) {
        return false;
    }
    that.setData({selectedLoading:0});
    var selectedPage = that.data.selectedPage;
    var token = that.token;
    wx.showToast({title:"加载中",icon:'loading'})
    wx.request({
        url: url + '/match_maker/fans',
        data:{page:selectedPage,manage_status:1,token:token},
        method: 'post',
        success: function (res) {
            wx.hideToast();
            var registered = that.data.registered;
            if(res.data.message.length > 0) {
                registered = registered.concat(res.data.message);
                console.log(registered);
                that.setData({
                    selectedPage:selectedPage + 1,
                    selectedLoading:1,
                    registered: registered
                })
            }
        }
    })
  },
  getAppointment: function() {
    var that = this;
    // 所有会员信息
    if(that.data.selected1Loading == 0) {
        return false;
    }
    that.setData({selected1Loading:0});
    var selected1Page = that.data.selected1Page;
    var token = that.token;
    wx.showToast({title:"加载中",icon:'loading'})
    wx.request({
        url: url + '/match_maker/fans',
        data:{page:selected1Page,manage_status:2,token:token},
        method: 'post',
        success: function (res) {
            wx.hideToast();
            var appointment = that.data.appointment;
            if(res.data.message.length > 0) {
                appointment = appointment.concat(res.data.message);
                that.setData({
                    selected1Page:selected1Page + 1,
                    selected1Loading:1,
                    appointment: appointment
                })
            }
        }
    })
  },
  getJoin: function() {
    var that = this;
    // 所有会员信息
    if(that.data.selected2Loading == 0) {
        return false;
    }
    that.setData({selected2Loading:0});
    var selected2Page = that.data.selected2Page;
    var token = that.token;
    wx.showToast({title:"加载中",icon:'loading'})
    wx.request({
        url: url + '/match_maker/fans',
        data:{page:selected2Page,manage_status:3,token:token},
        method: 'post',
        success: function (res) {
            wx.hideToast();
            var join = that.data.join;
            if(res.data.message.length > 0) {
                join = join.concat(res.data.message);
                that.setData({
                    selected2Page:selected2Page + 1,
                    selected2Loading:1,
                    join: join
                })
            }
        }
    })
  }
})