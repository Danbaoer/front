// pages/enroll/enroll.js
const app = getApp()
let baseApiUrl = require('../../config.js')
let url = baseApiUrl.config().baseApiUrl
Page({
  data: {
    uploadUrl: baseApiUrl.config().uploadUrl,
    attentionMe: [],
    attentionMeCount:0,
    myAttention: [],
    myAttentionCount: 0,
    selectedPage: 1,
    selected1Page: 1,
    tab:'selected',
    token: '',
    loading:1,
    username: ''
  },
  selected: function (e) {
    this.setData({
      tab:'selected',
    })
  },
  selected1: function (e) {
    this.setData({
      tab:'selected1',
    })
  },
  //转发
  onShareAppMessage(res) {
    return app.shareMessage()
  },
  //跳转到登录
  toLogin () {
    wx.switchTab({
      url: '../my/my',
    })
  },
  //查看个人信息详情
  showDetail(e) {
    let that = this
    let id = e.currentTarget.id;
    wx.navigateTo({
      url: '../index/detail/detail?id=' + id,
    })
  },
  //取消喜欢
  toggleFollow: function (event) {
    let that = this
    var token = wx.getStorageSync('token');
    wx.showModal({
      content: '确定取消喜欢吗？',
      success (res) {
        if (res.confirm) {
          let id = event.target.id
          wx.request({
            url: url + '/member/attention',
            data: {touid: id,token:token,status:0},
            method: "POST",
            header: {
              "Content-Type": "application/json"
            },
            success(res) {
              that.setData({
                myAttention: res.data.message
              })
              // 我喜欢的
              wx.request({
                url: url + "/member/attention_members",
                method: 'post',
                data: { token: that.data.token },
                header: {
                  "Content-Type": "application/json"
                },
                success(res) {
                  that.setData({
                    myAttention: res.data.message
                  })
                }
              })
            }
          })
        }
      }
    })  
  },
  //报名
  formSubmit (e) {
    if (!e.detail.value.username) {
      wx.showToast({
        icon: 'none',
        title: '请填写姓名',
      })
      return
    } else if (!e.detail.value.age) {
      wx.showToast({
        icon: 'none',
        title: '请填写年龄',
      })
      return
    } else {
      wx.showToast({
        icon: 'success',
        title: '报名成功',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },
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
          var token = wx.getStorageSync('token')
          if (token) {
            that.setData({
              token: token
            })
          }
          that.getAttentionMembers();
          that.getAttentionedMembers();
        }
      }
    })
  },
  getAttentionedMembers:function() {
  	var that = this;
  	if(that.data.selectedLoading == 0) {
  		return false;
  	}
  	// 喜欢我的
  	wx.showToast({title:"加载中",icon:'loading'});
  	that.setData({selectedLoading:0});
    wx.request({
      url: url + "/member/attentioned_members",
      method: 'post',
      data: {token: that.data.token,page:that.data.selectedPage},
      header: {
        "Content-Type": "application/json"
      },
      success (res) {
      	wx.hideToast();
        if(res.data.code == 0) {
      		var attentionMe = that.data.attentionMe;
      		if(res.data.message.length > 0) {
      			attentionMe = attentionMe.concat(res.data.message);
      			that.setData({
		          attentionMe:attentionMe,
              attentionMeCount:res.data.count,
		          selectedLoading:1,
		          selectedPage: that.data.selectedPage + 1
		        })
      		}
      	}
      }
    })
  },

  getAttentionMembers:function() {
  	var that = this;
  	if(that.data.selected1Loading == 0) {
  		return false;
  	}
  	// 喜欢我的
  	wx.showToast({title:"加载中",icon:'loading'});
  	that.setData({selected1Loading:0});
  	// 我喜欢的
    wx.request({
      url: url + "/member/attention_members",
      method: 'post',
      data: {token: that.data.token,page:that.data.selected1Page},
      header: {
        "Content-Type": "application/json"
      },
      success(res) {
      	wx.hideToast();
        if(res.data.code == 0) {
      		var myAttention = that.data.myAttention;
      		if(res.data.message.length > 0) {
      			myAttention = myAttention.concat(res.data.message);
      			that.setData({
      				myAttention:myAttention,
              myAttentionCount:res.data.count,
      				selected1Loading:1,
      				selected1Page: that.data.selected1Page + 1
      			})
      		}
        } 
      }
    })
  }
})