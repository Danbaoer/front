 
var Config = {
    "baseApiUrl": "https://www.hdxqb.vip/api",
    "uploadUrl": "https://www.hdxqb.vip/uploads",
    "appDebug" : false,
    "token" : "",
    "error_text" : {
        0: "服务器可能中暑了，请稍后再试",
        1: "您还没有填写收货信息哦~",
        2: "Oops! 这个团已经不在地球上了，快去首页火拼吧！",
        3: "您还没有参加过任何团哦，赶快去首页火拼吧！",
        4: "商品已下架或不存在，赶快去首页看看吧！",
        5: "您的地址信息不完整，请先完善地址信息吧~",
        6: "订单信息错误~",
        7: "暂时没有物流信息",
        8: "获取快递信息失败, 请稍后再试",
        9: "获取订单失败，请稍后再试！",
        10: "您还没有优惠券哦~",
        11: "您还没有填写联系人信息哦~~"
    },
    "page_offset" : 0,
    "page_size" : 5,
    "userInfo" : {
          "nickName" : "游客",
          "avatarUrl":　"http://www.8jiajia.com/pintuan/images/green/logo.jpg"
    },
     pullload_text: {
        load_text: "正在玩命的加载...",
        no_orders: "没有更多的订单了...",
        no_tuan_orders: "没有更多的团订单了...",
        no_goods: "更多新品正在陆续推出..."
    },
    pullload_last_text: {
      bottom_text: "↑ 继续向上滑将切换到下一个频道",
      bottom_text_ready_to_next_channel: "↓ 松开按键切换到下一个频道",
      change_channel_tip: "正在加载下一个频道"
     },
    sex: {
       1: "男",
       2: "女"
    },
    education:['初中','中专','高中','大专','本科','硕士'],
    house_status:['老宅','自建婚房','已购房（有贷款）','已购房（无贷款）'],
    marry_status:['未婚','离异（无孩子）','离异（带女孩）','离异（带男孩）','丧偶'],
    status: {
       0: "禁用",
       1: "正常",
       2: "待审核"
     }
};

function config() {
    return Config;
}
module.exports = {
  config : config
}

