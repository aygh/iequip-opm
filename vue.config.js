const path = require('path')
// const CompressionPlugin = require('compression-webpack-plugin')

const devProxy = ['/pc'];  // 代理
var proEnv = require('./config/pro.env');  // 生产环境
var uatEnv = require('./config/uat.env');  // 测试环境
var devEnv = require('./config/dev.env');  // 开发环境
const env = process.env.NODE_ENV;
let target = '';
// 默认是开发环境
if (env === 'production') {  // 生产环境
    target = proEnv.hosturl;
} else if (env === 'test') { // 测试环境
    target = uatEnv.hosturl;
} else {  // 开发环境
    target = devEnv.hosturl;
}


module.exports = {
    chainWebpack: (config) => {
        config.module
            .rule('js')
            .exclude
            .add(path.resolve(__dirname, './src/pjf'))
            .add(path.resolve(__dirname, './src/proto'))
            .end()
    },
    //   configureWebpack: config => {
    //     if(env === 'production') {
    //         return {
    //             plugins: [new CompressionPlugin({
    //                 test:/\.js$|\.html$|\.css/,
    //                 threshold: 10240,   
    //                 deleteOriginalAssets: false
    //             })]
    //         }
    //     }
    //   },
    devServer: {
        // disableHostCheck: true,
        // host: '0.0.0.0',
        // port: 8081,
        proxy: {
            '/iequip': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/iequip': '/iequip'
                }
            },
            '/product': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/product': '/product'
                }
            },
            '/login': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/login': '/login'
                }
            },
            '/upload': {
                target,
                changeOrigin: true,
                pathRewrite: {
                    '^/upload': '/upload'
                }
            }
        }
    }
}