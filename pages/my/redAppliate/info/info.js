// pages/my/redAppliate/info/info.js
const app = getApp()
let config = require('../../../../config.js')
let url = config.config().baseApiUrl
let address = require('../../../../utils/city.js')
Page({
  data: {
    sex:config.config().sex,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: "请选择地区",
    detail: {},
    value: [0, 0, 0],
    element: 1
  },
  radioSexChange: function (e) {
    var that = this;
    var element = e.currentTarget.dataset.element;
    that.setData({
      [element]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userImg: options.userImg,
      userName: options.userName,
      // examine: options.examine
    })
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },
  onShow: function (options) {
    let token = wx.getStorageSync('token')
    let that = this
    wx.request({
      url: url + "/match_maker/index",
      method: 'post',
      data: { token: token },
      success(res) {
        if (res.data.message) {
          that.setData({
            detail: res.data.message
          });
        } 
      }
    });
    /*var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })*/
  },
  //用户点击右上角分享
  onShareAppMessage: function () {
    return app.shareMessage();
  },
  formSubmit (e) {
    let token = wx.getStorageSync('token')
    e.detail.value.token = token
    let username = e.detail.value.username
    let mobile = e.detail.value.mobile
    let wechat = e.detail.value.wechat
    e.detail.value.formid = e.detail.formId
    if(this.data.detail.sex) {
      e.detail.value.sex = this.data.detail.sex;
    } else {
      wx.showToast({
        icon: 'none',
        title: '请填写性别！'
      })
      return false
    }

    if(!username) {
        wx.showToast({
          icon: 'none',
          title: '请填写姓名！'
        })
        return false
      }
      if(!wechat) {
        wx.showToast({
          icon: 'none',
          title: '请填写微信号！'
        })
        return false
      }
      if(!mobile) {
        wx.showToast({
          icon: 'none',
          title: '请填写手机号！'
        })
        return false
      }
      wx.request({
          url: url + '/match_maker/do_setting',
          data:e.detail.value,
          method: 'post',
          success(res) {
            wx.showToast({
                icon: 'none',
                title:res.data.message
            })
          }
      })
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
      var that = this
      if (that.data.addressMenuIsShow) {
          return
      }
      that.startAddressAnimation(true);
      that.setData({element:e.currentTarget.dataset.element});
  },
    // 执行动画
  startAddressAnimation: function (isShow) {
      var that = this
      if (isShow) {
          that.animation.translateY(0 + 'vh').step()
      } else {
          that.animation.translateY(40 + 'vh').step()
      }
      that.setData({
          animationAddressMenu: that.animation.export(),
          addressMenuIsShow: isShow,
      })
  },
    // 点击地区选择取消按钮
  cityCancel: function (e) {
      this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
      var that = this
      var city = that.data.city
      var value = that.data.value
      that.startAddressAnimation(false)
      // 将选择的城市信息显示到输入框
      var areaInfo = that.data.provinces[value[0]].name + that.data.citys[value[1]].name + that.data.areas[value[2]].name
      that.setData({
          [that.data.element]: areaInfo,
      })
  },
  hideCitySelected: function (e) {
      this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
      var value = e.detail.value
      var provinces = this.data.provinces
      var citys = this.data.citys
      var areas = this.data.areas
      var provinceNum = value[0]
      var cityNum = value[1]
      var countyNum = value[2]
      if (this.data.value[0] != provinceNum) {
          var id = provinces[provinceNum].id
          this.setData({
              value: [provinceNum, 0, 0],
              citys: address.citys[id],
              areas: address.areas[address.citys[id][0].id],
          })
      } else if (this.data.value[1] != cityNum) {
          var id = citys[cityNum].id
          this.setData({
              value: [provinceNum, cityNum, 0],
              areas: address.areas[citys[cityNum].id],
          })
      } else {
          this.setData({
              value: [provinceNum, cityNum, countyNum]
          })
      }
  },
})