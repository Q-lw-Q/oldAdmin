const gulp = require('gulp');               // gulp基础库
const notify = require('gulp-notify');      // 提示
const uglify = require('gulp-uglify');       // js压缩
const babel = require('gulp-babel');  // babel
// cleancss = require('gulp-clean-css')    // css压缩
const s2p = require('stream-to-promise');  //s2p
const Promise = require('bluebird');  //
const less = require('gulp-less');
const minifycss = require('gulp-minify-css');
const htmlmin = require('gulp-htmlmin')

let jsArray = [
  {
    dirname: './public/commom/js/**.js',
    distname: './dist/public/commom/js'
  },
  {
    dirname: './public/commom/deskJs/**.js',
    distname: './dist/public/commom/deskJs'
  },
  {
    dirname: './routes/admin/**.js',
    distname: './dist/routes/admin'
  },
  {
    dirname: './routes/android/**.js',
    distname: './dist/routes/android'
  },
  {
    dirname: './routes/deskadmin/**.js',
    distname: './dist/routes/deskadmin'
  },
  {
    dirname: './routes/manage/**.js',
    distname: './dist/routes/manage'
  },
  {
    dirname: './routes/terminal/**.js',
    distname: './dist/routes/terminal'
  },
  {
    dirname: './routes/**.js',
    distname: './dist/routes'
  },
  // {
  //   dirname: './common/**.js',
  //   distname: './dist/common'
  // }
]

let copyArray = [
  {
    dirname: './bower_components/**',
    distname: './dist/bower_components'
  },
  {
    dirname: './bin/**',
    distname: './dist/bin'
  },
  {
    dirname: './public/bootstrap/**',
    distname: './dist/public/bootstrap'
  },
  {
    dirname: './public/checkstand/**',
    distname: './dist/public/checkstand'
  },
  {
    dirname: './public/dashBoard/**',
    distname: './dist/public/dashBoard'
  },
  {
    dirname: './public/element/**',
    distname: './dist/public/element'
  },
  {
    dirname: './public/fileUpload/**',
    distname: './dist/public/fileUpload'
  },
  {
    dirname: './public/javascripts/**',
    distname: './dist/public/javascripts'
  },
  {
    dirname: './public/servicepictures/**',
    distname: './dist/public/servicepictures'
  },
  {
    dirname: './public/skin_N3/**',
    distname: './dist/public/skin_N3'
  },
  {
    dirname: './public/static/**',
    distname: './dist/public/static'
  },
  {
    dirname: './public/stylesheets/**',
    distname: './dist/public/stylesheets'
  },
  {
    dirname: './public/vender/**',
    distname: './dist/public/vender'
  },
  {
    dirname: './public/vue-common/**',
    distname: './dist/public/vue-common'
  },
  {
    dirname: './public/deskCommom/**',
    distname: './dist/public/deskCommom'
  },
  {
    dirname: './redisConfig.json',
    distname: './dist/'
  },
  {
    dirname: './log4jsConfig.json',
    distname: './dist/'
  },
  {
    dirname: './public/favicon.ico',
    distname: './dist/public'
  },
  {
    dirname: './public/commom/img/**',
    distname: './dist/public/commom/img'
  },
  // {
  //   dirname: './node_modules',
  //   distname: './dist/node_modules'
  // },
  {
    dirname: './app.js',
    distname: './dist'
  },
  {
    dirname: './public/advertisement/**',
    distname: './dist/public/advertisement'
  },
  {
    dirname: './public/advertisementManage/**',
    distname: './dist/public/advertisementManage'
  },
  {
    dirname: './public/commom/vendors/yuyinshibie/**.js',
    distname: './dist/public/commom/vendors/yuyinshibie'
  },
  {
    dirname: './public/commom/vendors/yuyinzhuangxie/**.js',
    distname: './dist/public/commom/vendors/yuyinzhuangxie'
  },
]

let lessArray = [
  {
    dirname: './public/commom/css/**.less',
    distname: './dist/public/commom/css'
  },
]

let htmlArray = [
  {
    dirname: './views/admin/**.html',
    distname: './dist/views/admin'
  },
  {
    dirname: './views/deskadmin/**.html',
    distname: './dist/views/deskadmin'
  },
  {
    dirname: './views/android/**.html',
    distname: './dist/views/android'
  },
  {
    dirname: './views/**.html',
    distname: './dist/views'
  },
]

// css处理
// gulp.task('minifycss', function () {
//   return gulp
//     .src([
//       './css/style-1.css',
//     ])
//     .pipe(gulp.dest('./dist')) //设置输出路径
//     .pipe(cleancss()) //压缩文件
//     .pipe(gulp.dest('./dist')) //输出文件目录
//     .pipe(notify({ message: 'minifycss task ok' })) //提示成功
// })

// js处理

gulp.task('jsArray', function () {
  // don't forget your `var`s!
  var buildIt = function (i) {
    return gulp.src(i.dirname)
      // .pipe(babel({
      //   presets: ['es2015']
      // }))
      // .pipe(uglify()) //压缩
      .pipe(gulp.dest(i.distname)) //输出
      .on('end', function () { console.log(i.distname + ' -- done') });
  }

  // // sequence them
  jsArray.reduce(function (p, index) {
    return p.then(function () {
      return s2p(buildIt(index));
    });
  }, Promise.resolve());

});

gulp.task('copyArray', function () {
  // don't forget your `var`s!
  var buildIt = function (i) {
    return gulp.src(i.dirname)
      .pipe(gulp.dest(i.distname))
      .on('end', function () { console.log(i.distname + ' -- done') });
  }

  // // sequence them
  copyArray.reduce(function (p, index) {
    return p.then(function () {
      return s2p(buildIt(index));
    });
  }, Promise.resolve());

});


gulp.task('lessArray', function () {
  // don't forget your `var`s!
  var buildIt = function (i) {
    console.log(i)
    return gulp.src(i.dirname)
      .pipe(less())
      .pipe(minifycss())
      .pipe(gulp.dest(i.distname))
      .on('end', function () { console.log(i.distname + ' -- done') });
  }

  // // sequence them
  lessArray.reduce(function (p, index) {
    return p.then(function () {
      return s2p(buildIt(index));
    });
  }, Promise.resolve());

});

gulp.task('htmlArray', function () {
  // don't forget your `var`s!
  const options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    // minfyJS: true,//压缩JS
    // minfyCss: true,//压缩CSS
  }
  var buildIt = function (i) {
    console.log(i)
    return gulp.src(i.dirname)
      .pipe(htmlmin(options))
      .pipe(gulp.dest(i.distname))
      .on('end', function () { console.log(i.distname + ' -- done') });
  }

  // // sequence them
  htmlArray.reduce(function (p, index) {
    return p.then(function () {
      return s2p(buildIt(index));
    });
  }, Promise.resolve());

});


// 先创建Task，后使用
gulp.task('default',
  gulp.series(gulp.parallel(
    'lessArray',
    'jsArray',
    'copyArray',
    'htmlArray'
  )
  )
)