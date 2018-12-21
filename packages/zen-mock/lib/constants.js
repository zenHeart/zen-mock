'use strict'
const path = require('path');

exports.DEFAULT_CONFIG = {
  hotReload:true, //是否热更新默认开启   
  namespace:'/',//命名空间,添加命令后所有 path 均会加上此前缀
  extPattern:"*.js?(on)", //设定合法的文件后缀,
  root:path.join(process.cwd(), 'mock'), //默认读取配置文件的根目录
  staticDir:'static', //静态资源目录,相对 root 而言
  ignoreDir:[] //忽略目录,相对 root 而言

} 