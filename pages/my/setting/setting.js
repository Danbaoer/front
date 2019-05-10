// pages/index/detail/detail.js
const app = getApp()
let config = require('../../../config.js')
let url = config.config().baseApiUrl
var address = require('../../../utils/city.js')
Page({
  data: {
    uploadUrl: config.config().uploadUrl,
    detail: {},
    uploadImages: [],
    productInfo: {},
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    sex: config.config().sex,
    education: config.config().education,
    marry_status: config.config().marry_status,
    house_status: config.config().house_status,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,   
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    flag:true,
    element:'',
  },
  //删除照片
  deleteImage: function(e) {
    var element = e.currentTarget.dataset.element;
      this.setData({
        [element]: null,
        flag:false
      })
  },
  //上传图片
  uploadImage: function(e) {
    var that = this
    var token = wx.getStorageSync('token');
    var element = e.currentTarget.dataset.element;
    that.setData({flag:false});
    wx.chooseImage({
      count: 1,    //最多可以选择的图片总数    
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有    
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function (res) {
        //启动上传等待中...    
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 2000
        })
        wx.uploadFile({
            url: url + '/common/upload',
            filePath: (res.tempFilePaths).join(),
            name: 'upload_photos',
            formData: {
                'imgIndex': 0,
                'token': token
            },
            header: {
                "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              var data = JSON.parse(res.data);
              if(data.code == 0) {
                  that.setData({
                      [element]: data.message,
                  });
              } else {
                  wx.showToast({title:data.message});
              }
            },
            fail: function (res) {
              wx.hideToast()
              wx.showModal({
                  title: '错误提示',
                  content: '上传图片失败',
                  showCancel: false,
                  success: function (res) { }
              })
            }
          })
        } 
      })
  },
  radioSexChange: function(e) {
    var that = this;
    var element = e.currentTarget.dataset.element;
    this.setData({
      [element]: e.detail.value
    })
  },
  //出生年月控件
  bindDateChange: function (e) {
    var that = this;
    var element = e.currentTarget.dataset.element;
    this.setData({
      [element]: e.detail.value
    })
  },
  bindEducationChange:function(e) {
    var that = this;
    var element = e.currentTarget.dataset.element;
    this.setData({
      [element]: e.detail.value
    })
  },

  bindMarryStatusChange:function(e) {
    var that = this;
    var element = e.currentTarget.dataset.element;
    this.setData({
      [element]: e.detail.value
    })
  },
  bindhouseStatusChange:function(e) {
    var that = this;
    var element = e.currentTarget.dataset.element;
    this.setData({
      [element]: e.detail.value
    })
  },
  //提交信息
  formSubmit (e) {
    let token = wx.getStorageSync('token')
    e.detail.value.thumbs = [this.data.uploadOne, this.data.uploadTwo, this.data.uploadThree]
    e.detail.value.token = token
    e.detail.value.fromid = e.detail.fromId
    if(this.data.detail.sex) {
      e.detail.value.sex = this.data.detail.sex;
    }
    let sex = e.detail.value.sex
    let native_place = e.detail.value.native_place
    let birthday = e.detail.value.birthday || "1990-01-01"
    let height = e.detail.value.height
    let weight = e.detail.value.weight
    let education = e.detail.value.education || "0"
    let marry_status = e.detail.value.marry_status || "0"
    let profession = e.detail.value.profession
    let salary = e.detail.value.salary
    let wechat = e.detail.value.wechat
    if (sex == "" || native_place == "" || birthday == "" || height == "" || weight == "" || education == "" || profession == "" || salary == "" || wechat == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写必填信息！'
      })
      return false
    }
    wx.request({
      url: url + '/member/do_setting',
      data:e.detail.value,
      method: 'post',
      success(res) {
        if(res.data.code == 0) {
          wx.showToast({title:res.data.message})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    });
    var token = wx.getStorageSync('token');
      if(!token) {
      wx.switchTab({
        url: '../my/my'
      });
      return false;
    }
    this.token = token;
  },

  onShow:function() {
    if(this.data.flag == true) {
      let that = this;
        wx.request({
          url: url + "/member/setting",
          method: 'post',
          data:{token:that.token},
          header: {
            "Content-Type": "application/json"
          },
          success (res) {
            if(res.data.code == 0) {
              var uploadOne = null;
              var uploadTwo = null;
              var uploadThree = null;
              if(res.data.message.thumbs[0]) {
                  uploadOne = res.data.message.thumbs[0];
              }
              if(res.data.message.thumbs[1]) {
                  uploadTwo = res.data.message.thumbs[1];
              }
              if(res.data.message.thumbs[2]) {
                  uploadThree = res.data.message.thumbs[2];
              }
              that.setData({
                  detail: res.data.message,
                  uploadOne: uploadOne,
                  uploadTwo: uploadTwo,
                  uploadThree: uploadThree
              })
            } else {
              wx.showToast({title:res.data.message});
            }
          }
        })
    }
  },
  onShareAppMessage () {
    return app.shareMessage();
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
  }
})