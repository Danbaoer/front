// pages/my/integral/integral.js
const app = getApp()
let baseApiUrl = require('../../../config.js')
let url = baseApiUrl.config().baseApiUrl

Page({
	data: {
	    modalFlag: true,
	    integralFlag: true,
	    loading:1,
	    page:1,
	    logs:[]
	},
	rule () {
	  this.setData({ modalFlag: false })
	},
	closeRule () {
	  this.setData({ modalFlag: true })
	},
	//去赚积分
	profit () {
	 this.setData({ integralFlag: false })
	},
	closeIntegral () {
	 this.setData({ integralFlag: true })
	},
	sign () {
    wx.switchTab({
      url: '../../index/index'
    })
	},
	onShareAppMessage (res) {
	  return app.shareMessage()
	},
	share() {
    	return app.shareMessage()
	},
	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		this.getIntegration();
		this.getIntegrationLog();
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

	getIntegration: function() {
		var that = this;
		var token = wx.getStorageSync('token');
		wx.request({
			url: url + '/member/integration',
			data:{token:token},
			method: 'post',
			success(res) {
				that.setData({integration:res.data.message.integration,total_integration:res.data.message.total_integration,cost_integration:res.data.message.cost_integration})
			}
		})
	},

	getIntegrationLog: function() {
	    var that = this;
		if(that.data.loading == 0) {
			return false;
		}
		that.setData({loading:0});
		wx.showToast({title:"加载中",icon:'loading'});
		var token = wx.getStorageSync('token');
	    wx.request({
	      url: url + '/member/integration_log',
	      data:{token:token,page:that.data.page},
	      method: 'post',
	      success(res) {
	      	wx.hideToast();
	      	if(res.data.code == 0) {
	      		var logs = that.data.logs;
	      		if(res.data.message.length > 0) {
	      			logs = logs.concat(res.data.message);
	      			that.setData({
	      				logs:logs,
	      				page:that.data.page + 1,
	      				loading:1
	      			})
	      		}

	      	} else {
	      		wx.showToast({title:res.data.message});
	      	}
	      }
	    })
	}
})