const Service = require('egg').Service;
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
  checkCaptcha(code){
    const {ctx} = this;
    code = code.toLowerCase()
    console.log("sessionCode",ctx.session.code)
    let sessCode = ctx.session.code? ctx.session.code.toLowerCase():null
    console.log("sesscode",sessCode)
    //验证
    if(code === sessCode){
      // 成功之后验证码作废
      ctx.session.code = null
    }
    return code === sessCode;
  }
}

module.exports = UserService;
