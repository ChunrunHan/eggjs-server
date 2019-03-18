'use strict';

const Controller = require('egg').Controller;
const userDB = [
  { username: 'admin', password: 'admin', uuid: 'admin-uuid', name: '管理员' },
  { username: 'editor', password: 'editor', uuid: 'editor-uuid', name: '编辑' },
  { username: 'user1', password: 'user1', uuid: 'user1-uuid', name: '用户1' }
]

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
    const user = userDB.find(e => e.username === body.username && e.password === body.password)
    ctx.body = {
      code: 0,
      msg: '登录成功',
      data: {
        ...user,
        // token: '8dfhassad0asdjwoeiruty'
      }
    }
  }


}


module.exports = UserController;
