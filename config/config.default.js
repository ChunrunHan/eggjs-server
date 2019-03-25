/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551689093906_1133';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['http://localhost:8080']
  };

  // config.cluster = {
  //   listen: {
  //     path: '',
  //     port: 63342,
  //     hostname: '0.0.0.0'
  //   }
  // }
  // 允许跨域
  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.jwt = {
    cert: 'hanchunrun' // jwt秘钥
  }
  // 七牛秘钥
  config.qiniu = {
    accessKey: '5Qza7UbD7htSw6eJuCP119LowmMRSG8uRG8lbP4e',
    secretKey: 'cbez_SNxUCeRwNHOPIM5x2n4mgFVB23vfH7TT4fC'
  }
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '7773712',
      database: 'mydb',
    }
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };



  return {
    ...config,
    ...userConfig,
  };
};
