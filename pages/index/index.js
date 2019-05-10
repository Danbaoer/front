//index.js
//获取应用实例
const app = getApp()
let date = require('../../utils/util.js')
let baseApiUrl = require('../../config.js')
let url = baseApiUrl.config().baseApiUrl
let address = require('../../utils/city.js')
let list = []
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.sign'),
      uploadUrl: baseApiUrl.config().uploadUrl,
      recommends:[],
      vipInfos: [],
      ladyLoads: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      modalFlag: true,
      animateFlag: true,
      radioCheckVal: -1,
      signDays: 1,
      signIn:null,
      checkCheckVal: [
        { name: '初中', value: '0', checked: false},
        { name: '中专', value: '1', checked: false},
        { name: '高中', value: '2', checked: false},
        { name: '大专', value: '3', checked: false},
        { name: '本科', value: '4', checked: false},
        { name: '研究生', value: '5', checked: false}
      ],
      age: '请选择年龄',
      isVisible: false,
      animationData: {},
      animationAddressMenu: {},
      addressMenuIsShow: false,
      value: [0, 0, 0],
      provinces: [],
      citys: [],
      areas: [],
      areaInfo:"请选择地区",
      page:1,
      loading:1,
      vipInfos:[],
      req:{},
      scrollTop: null
    },
  onLoad: function (options) {
    if (options.shareuid) {
      app.globalData.shareuid = options.shareuid;
    }
    if (options.scene) {
      app.globalData.shareuid = decodeURIComponent(options.scene);
    }
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
          that.setData({audit:0,modalFlag:true});
           // 轮播图
          wx.request({
            url: url + '/index/recommend',
            method: 'post',
            success: function (res) {
              that.setData({recommends: res.data})
            }
          })
          that.getMembers();
        }
      }
    })
  },
  //滚动条监听
  scroll: function (e) {
    this.setData({ scrollTop: e.detail.scrollTop })
  },

  getMembers:function (data = {},isclear = 0) {
      var that = this;
      // 所有会员信息
      if(that.data.loading == 0) {
          return false;
      }
      that.setData({loading:0});
      data.page = that.data.page;
      wx.showToast({title:"加载中",icon:'loading'})
      wx.request({
          url: url + '/index/index',
          data:data,
          method: 'post',
          success: function (res) {
            wx.hideToast();
            var vipInfos = that.data.vipInfos;
            if(isclear == 1) {
                vipInfos = res.data;
            } else {
                vipInfos = vipInfos.concat(res.data);
            }
            that.setData({
                page:that.data.page + 1,
                loading:1,
                vipInfos: vipInfos
            })
          }
      })
  },
  //转发
  onShareAppMessage:function(res) {
    return app.shareMessage();
  },
  //签到
  sign:function(e) {
    var token = wx.getStorageSync('token');
    let that = this
    if (!token) {
      wx.switchTab({
        url: '../my/my',
      })
      wx.showToast({
        icon: 'none',
        title: '请先授权登录!'
      })
    } else {
      var formid = e.detail.formId;
      wx.request({
          url: url + '/member/sign',
          method:'post',
          data: {token:token,formid:formid},
          success (res) {
            if (res.data.code == 0) {
                that.setData({signDays: res.data.data.signDays, signIn: res.data.data.signIn,animateFlag: false})
                setTimeout(() => {
                    that.setData({ animateFlag: true })
                  }, 3000)
              } else {
                wx.showToast({
                  icon: 'none',
                  title: res.data.message
                });
              }
          }
      })
    }
  },
  //个人信息详情
  showDetail (e) {
      let that = this
      let id = e.target.id
      let token = wx.getStorageSync('token');
      if(!token){
        wx.switchTab({
          url: '../my/my',
        })
        wx.showToast({
          icon: 'none',
          title: '请先授权登录!'
        })
      } else {
        wx.navigateTo({
          url: 'detail/detail?id=' + id,
        })
      }
  },
  //显示筛选条件
  searchDetail () {
      this.setData({ 
        modalFlag: false
      })
  },
  //点击性别样式
  radioCheckedChange (e) {
      this.setData({
          radioCheckVal: e.detail.value
      })
  },
  //点击学历
  checkChange (e) {
      let checkCheckVal = this.data.checkCheckVal
      let checkArr = e.detail.value
      for (var i = 0; i < checkCheckVal.length; i++) {
          if (checkArr.indexOf(i + '') != -1) {
              checkCheckVal[i].checked = true
          } else {
              checkCheckVal[i].checked = false
          }
      }
      this.setData({
          checkCheckVal: checkCheckVal
      })
  },
  // 点击年龄组件确定事件    
  bindAgeChange (e) {
      let value = e.detail.value
      let start = value.substr(0, 2)
      let end = value.substr(3, 2)
      let result = start + '-' + end
      this.setData({
          age: result
      })
  },
  //筛选提交表单
  formSubmit:function(e) {
    let that = this
    let req = e.detail.value
    req.age = e.detail.value.agestart + ',' + e.detail.value.ageend
      that.setData({page:1,req:req});
      this.getMembers(req,1)
      this.setData({
        modalFlag: true,
        sex: '-1',
        age: '',
        area: [],
        education: []
      })
  },
  //取消提交表单
  formReset() {
      this.setData({ modalFlag: true })
  },

  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
      var that = this
      if (that.data.addressMenuIsShow) {
          return
      }
      that.startAddressAnimation(true)
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
          areaInfo: areaInfo,
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
  //上拉加载
  onReachBottom:function () {
      var req = this.data.req;
      this.getMembers(req);
  }
})
