'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.once('server', server => {
    // websocket
    // console.log('server',server)
  });
  app.on('error', (err, ctx) => {
    // report error
    console.log('err',err)
  });
  app.on('request', ctx => {
    // log receive request
    // console.log('request',ctx)
  });
  app.on('response', ctx => {
    // ctx.starttime is set by framework
    const used = Date.now() - ctx.starttime;
    // console.log('response',used)
    // log total cost
  });
  router.get('/', controller.home.index);
  router.get('/user/:id', controller.home.info);
  router.get('/uploadToken',controller.home.qiniuToken);
  router.post('/qiniuDel',controller.home.qiniuDelete)
  router.post('/login',controller.user.userLogin)
  router.get('/captcha',controller.user.getCaptcha)
};
