'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  session: true,
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  mysql:{
    enable: true,
    package: 'egg-mysql',
  }
}
