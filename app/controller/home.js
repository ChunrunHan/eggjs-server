'use strict';

const Controller = require('egg').Controller;
const qiniu = require('qiniu');
var accessKey = '5Qza7UbD7htSw6eJuCP119LowmMRSG8uRG8lbP4e';
var secretKey = 'cbez_SNxUCeRwNHOPIM5x2n4mgFVB23vfH7TT4fC';

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async info() {
    const { app, ctx } = this;
    ctx.body = {
      name: `hello ${ctx.params.id}`,
      id: ctx.helper.formatUser(ctx.params.id)
    };
  }
  // 获取七牛上传的token
  async qiniuToken() {
    const { ctx } = this;
    // var accessKey = '5Qza7UbD7htSw6eJuCP119LowmMRSG8uRG8lbP4e';
    // var secretKey = 'cbez_SNxUCeRwNHOPIM5x2n4mgFVB23vfH7TT4fC';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    console.log("mac",mac)
    var options = {
      scope: 'blog',
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    console.log("uploadToken",uploadToken)
    ctx.body = {
      token: uploadToken
    }
  }

  // 删除七牛云文件
  async qiniuDelete(){
    const { ctx } = this;
    console.log(ctx.request.body.key)
    let key = ctx.request.body.key;
    let result = await this.deleteOss(key)
    ctx.body = result
  }

  // 七牛云删除操作
  deleteOss(key){
    var bucket = "blog";
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    var bucketManager = new qiniu.rs.BucketManager(mac, config);
    let p = new Promise((resolve,reject)=>{
      bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
        if (err) {
          console.log(err);
          //throw err;
          reject({
            code: -1,
            msg:'删除失败',
            data: {
            }
          })
        } else {
          console.log(respInfo.statusCode);
          resolve({
            code: 0,
            msg:'删除成功',
            data: {
            }
          })
        }
      });
    })
    return p;

  }
}

module.exports = HomeController;
