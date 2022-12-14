/*
 * @Description: webpack 打包配置
 */
const vueDefaultConfig = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: true,
  production: process.env.NODE_ENV === "production", // 环境配置
  transpileDependencies: ["vue-echarts", "resize-detector"],
  //webpack 配置的项目名称
  title: "PURE ADMIN", // 标题
  // pwa 渐进式网页应用
  pwa: {
    name: "PURE ADMIN",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
    },
    themeColor: "#ffffff00",
    manifestOptions: {
      background_color: "#335eea",
    },
  },
  titleSeparator: " - ",
  titleReverse: false,
  devPort: "9999",
  abbreviation: "vt2at",
  providePlugin: {},
  build7z: false,
  startMessage: "",
  devServer: {
    // 是否自动打开浏览器.
    open: false,
    // 局域网和本地访问.
    host: "0.0.0.0",
    // 端口.
    port: process.env.VUE_APP_PORT || 9585,
    // 代理.
    proxy:
      process.env.VUE_APP_PROXY === "false"
        ? null
        : {
            "/proxy": {
              // 目标代理服务器地址.
              target: "http://localhost:8888",
              // 是否允许跨域.
              changeOrigin: true,
              secure: true,
              pathRewrite: {
                "^/proxy": "/",
              },
            },
          },
  },
  cdn: {
    // https://unpkg.com/browse/vue@2.6.10/
    css: [
      // "https://cdn.jsdelivr.net/npm/vant@2.12/lib/index.css"
    ],
    js: [
      //"https://cdn.jsdelivr.net/npm/vue", // Vue
      //"https://unpkg.com/@element-plus/icons-vue", // ElementPlusIconsVue
    ],
  },
  /*
   * webpack 打包忽略项
   */
  externals: {
    //vue: "Vue",
  },
  performance: {
    // 提示类型
    hints: "warning",
    // 入口起点的最大体积
    maxEntrypointSize: 1000 * 500,
    // 生成文件的最大体积
    maxAssetSize: 1024 * 2000,
    // 只给出 js 文件性能提示
    assetFilter: (FileName) => {
      return FileName.endsWith(".js");
    },
  },
};

module.exports = vueDefaultConfig;
