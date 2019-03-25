'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  // 获取验证码
  async getCaptcha(){
    const {ctx} = this;
    var captcha = ctx.service.user.getCaptcha();
    ctx.session.code = captcha.text; // session 存储
    console.log('session 存储',ctx.session.code)
    ctx.body = captcha.data;
  }

  // 登录
  async userLogin(){
    const {ctx} = this;
    console.log(ctx.request.body)
    let body = ctx.request.body;
    const { username, password, code } = ctx.request.body
    let resMsg = {
      code: 0,
      data: {},
      msg: '登录成功'
    }
    let isCaptchaVali = ctx.service.user.checkCaptcha(code)
    if (!isCaptchaVali) {
      resMsg.code = 1
      resMsg.msg = '验证码错误'
      ctx.body = resMsg
      return
    }
    // 验证码正确则继续登录操作
    const userData = await ctx.service.user.login({ username, password })
    if (!userData) {
      resMsg.code = 2
      resMsg.msg = '用户名或密码错误'
      ctx.body = resMsg
      return
    }
    resMsg.data = {
      username: userData.user.username,
      uid: userData.user.id,
      token: userData.token
    }
    console.log(resMsg)
    ctx.body = resMsg
  }


}


module.exports = UserController;
