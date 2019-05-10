 //app.js
let baseApiUrl = require('./config')
let url = baseApiUrl.config().baseApiUrl
App({
	onLaunch() {
		/*if(options.shareuid) {
			this.globalData.shareuid = options.shareuid;
		}*/
		var token = wx.getStorageSync('token');
		var effect_time = wx.getStorageSync('effect_time');
		var timestamp = Date.parse(new Date());

		if(!token || timestamp - effect_time > 7200) {
    		this.login();
		}
	},
  globalData: {
    userInfo: null,
    shareuid: 0
  },
	// 登录
	login:function(shareuid = 0) {
		var that = this;
		wx.login({
			success (res) {
				if (res.code) {
					wx.getUserInfo({
						success: function (msg) {
							that.globalData.userInfo = msg.userInfo;
							wx.request({
								url: url + '/login/index',
								method: 'POST',
								header: {
									'content-type': 'application/json'
								},
								data: {
									code:res.code,
									encryptedData: msg.encryptedData,
									iv: msg.iv,
									signature: msg.signature,
									rawData: msg.rawData,
									referee_id:shareuid,
								},
								success: function (res) {
									if(res.data.code == 0) {
				     					var message = res.data.message;
				        				message = message.split('|')
										wx.setStorageSync('token', message[0]);
										wx.setStorageSync('shareuid',message[1]);
									} else {
										wx.showToast({title:res.data.message});
									}
								}
							})
						}
					})
				} else {
					wx.showToast({title:'获取用户登录态失败：' + res.errMsg});
				}
			}
		})
	},
  //分享
  shareMessage: function(res) {
    var that = this;
    var token = wx.getStorageSync('token');
    var path = '/pages/index/index';
    if(token) {
      var shareuid = wx.getStorageSync('shareuid');
      path = path + '?shareuid=' + shareuid;
    }
    return {
      title: '洪洞上万名单身收获幸福的地方，我在这里等你！',
      path: path,
      imageUrl:"/images/icons/share.png"
      // success (res) {
      // 	console.log(res);
      //   //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
      //   //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
      //   //获取用户设备信息
      //   wx.getSystemInfo({
      //     success: function (d) {
      //       console.log(d);
      //       //判断用户手机是IOS还是Android
      //       if (d.platform == 'android') {
      //         wx.getShareInfo({//获取群详细信息
      //           shareTicket: res.shareTickets,
      //           success: function (res) {
      //             wx.request({	
      //               url: url + '/member/share',
      //               method: 'post',
      //               data: {position: 1},
      //               header: {
      //                 "Content-Type": "application/json"
      //               },
      //               success(res) {
      //                 console.log(res.data.message)
      //                 console.log('分享的安卓群')
      //               }
      //             })
      //           },
      //           fail: function (res) {//这个方法就是分享到的是好友，给一个提示
      //             wx.showModal({
      //               title: '提示',
      //               content: '分享好友无效，请分享群',
      //               success: function (res) {
      //                 wx.request({
      //                   url: url + '/member/share',
      //                   method: 'post',
      //                   data: {position:2},
      //                   header: {
      //                     "Content-Type": "application/json"
      //                   },
      //                   success(res) {
      //                     console.log(res.data.message)
      //                     console.log('分享的安卓个人')
      //                   }
      //                 })
      //               }
      //             })
      //           }
      //         })
      //       }
      //       if (d.platform == 'ios') {//如果用户的设备是IOS
      //         if (res.shareTickets != undefined) {
      //           console.log("分享的是群");
      //           wx.getShareInfo({
      //             shareTicket: res.shareTickets,
      //             success: function (res) {
      //               //分享到群之后你要做的事情
      //               wx.request({
      //                 url: url + '/member/share',
      //                 method: 'post',
      //                 data: {position:1},
      //                 header: {
      //                   "Content-Type": "application/json"
      //                 },
      //                 success(res) {
      //                   console.log(res.data.message)
      //                   console.log("分享的ios群")
      //                 }
      //               })
      //             }
      //           })
      //         } else {//分享到个人要做的事情，我给的是一个提示
      //           console.log("分享的是个人");
      //           wx.showModal({
      //             title: '提示',
      //             content: '分享好友无效，请分享群',
      //             success: function (res) {
      //               wx.request({
      //                 url: url + '/member/share',
      //                 method: 'post',
      //                 data: {position:2},
      //                 header: {
      //                   "Content-Type": "application/json"
      //                 },
      //                 success(res) {
      //                   console.log(res.data.message)
      //                   console.log('分享的ios个人')
      //                 }
      //               })
      //             }
      //           })
      //         }
      //       }
      //     }
      //   })
      // }
    }
  }
})

