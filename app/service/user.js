const Service = require('egg').Service;
const jwt = require('jsonwebtoken')
const svgCaptcha = require('svg-captcha');

class UserService extends Service {
  // 获取验证码
  getCaptcha() {
    return svgCaptcha.create({
      width: 85,
      height: 38
    })
  }
  // 检查验证码是否正确
  checkCaptcha(code) {
    const { ctx } = this;
    code = code.toLowerCase()
    console.log("sessionCode", ctx.session.code)
    let sessCode = ctx.session.code ? ctx.session.code.toLowerCase() : null
    console.log("sesscode", sessCode)
    //验证
    if (code === sessCode) {
      // 成功之后验证码作废
      ctx.session.code = null
    }
    return code === sessCode;
  }
  // 用户登录操作
  async login({username,password}){
    const {ctx,app} = this;
    const userData = await app.mysql.get('user', { username,password});
    console.log("userData",userData)
    // 找不到则返回false
    if (userData === null) {
      return false
    }
    // 找到则以用户id生成token
    const token = jwt.sign({
      id: userData.id
    }, app.config.jwt.cert, {
      expiresIn: '10h' // token过期时间
    })
    return {
      user: userData,
      token: token
    }
  }
}

module.exports = UserService;
