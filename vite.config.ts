import { defineConfig, loadEnv, createServer } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { createHtmlPlugin } from 'vite-plugin-html';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import { viteVConsole } from 'vite-plugin-vconsole';
import { readFileSync } from 'fs';
import legacy from '@vitejs/plugin-legacy';
import { babel } from '@rollup/plugin-babel';

const pathResolve = (dir: string) => resolve(__dirname, dir);

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  // 获取环境变量
  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());

  return defineConfig({
    define: {
      'process.env': env,
    },
    resolve: {
      // 这里的alias是路径别名，是运行阶段的替换路径，而tsconfig.json中的paths是编码阶段的提示，
      alias: {
        '@': pathResolve('src'), // path.resolve中，'./src' 等于 'src'
        // '@router': pathResolve('src/router'),
      },
    },
    plugins: [
      vue(),
      // 默认会向 index.html 注入 .env 文件的内容，类似 vite 的 loadEnv函数
      // 还可配置entry入口文件， inject自定义注入数据等
      createHtmlPlugin(),
      // 自动导入src/compoents下的组件和配置的ui库组件
      // 只能在template中使用，js中需要手动导入
      // vant组件需要带上van前缀
      // 自定义组件没有类型提示问题：在tsconfig的include中加入"./components.d.ts"即可解决
      // Vant 中有个别组件是以函数的形式提供的，包括 Toast，Dialog，Notify 和 ImagePreview 组件。
      // 在使用函数组件时，unplugin-vue-components 无法自动引入对应的样式，因此需要手动引入样式。
      // importStyle: false，关闭自动导入样式
      // 目前无法指定"src/compoents"下部分组件生产类型声明，可能需要自己实现一个resolvers
      Components({
        resolvers: [VantResolver({ importStyle: false })],
        // globs: ['src/components/**/index.vue'], // 会导致index.vue生成的类型声明为Undefined
      }),

      // 自动导入api
      AutoImport({
        imports: ['vue', 'vue-router'],
        // 设置为在'src/'目录下生成解决ts报错，默认是当前目录('./'，即根目录)
        dts: 'src/auto-import.d.ts',
        // 自动生成'eslintrc-auto-import.json'文件，在'.eslintrc.cjs'的'extends'中引入解决报错
        // 'vue-global-api'这个插件仅仅解决vue3 hook报错
        eslintrc: {
          enabled: true,
        },
      }),
      // viteVConsole({
      //   entry: pathResolve('src/main.ts'),
      //   localEnabled: true,
      //   enabled: env.VITE_BUILD_VCONSOLE === 'true',
      //   config: {
      //     maxLogNumber: 1000,
      //     theme: 'dark',
      //   },
      // }),
      // 在 serve 环境时，如果需要解决低版本chrome可选链报错问题，就打开 babel 配置；如果需要 debug ，则注释掉 babel 配置
      // build 时 vite 会对文件进行转译以支持低版本浏览器，不影响
      /* babel({
        babelHelpers: 'bundled',
        plugins: ['@babel/plugin-proposal-optional-chaining'],
        include: [/\.vue$/, /\.ts$/],
        extensions: ['.vue', '.ts'],
      }), */
    ],
    server: {
      // port: 3000, // 默认 // vite3已改为默认5173
      host: true, // 支持从ip启动
      https: {
        key: readFileSync('server.key'),
        cert: readFileSync('server.crt'),
      },
      open: true,
      proxy: {
        '/api': {
          target: 'http://172.16.88.74:8080', // 后台服务地址
          changeOrigin: true, // 是否允许不同源
          secure: false, // 支持https
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist', // 指定打包路径，默认为项目根目录下的 dist 目录
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'js/[name].[hash].js',
          // 用于命名代码拆分时创建的共享块的输出命名
          // 　　chunkFileNames: 'js/[name].[hash].js',
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            console.log(assetInfo.name);
            if (assetInfo.name.endsWith('.css')) {
              return `css/[name].[hash].[ext]`; // 将 CSS 文件存放在 css 文件夹中
            }
            return `images/[name].[hash].[ext]`; // 将 PNG 文件存放在 images 文件夹中
          },
          // 拆分js到模块文件夹
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/')
              : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
            return `js/${fileName}/[name].[hash].js`;
          },
        },
      },
      // minify默认esbuild，esbuild模式下terserOptions将失效
      // vite3变化：Terser 现在是一个可选依赖，如果你使用的是 build.minify: 'terser'，你需要手动安装它 `npm add -D terser`
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true, // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: env.VITE_BUILD_DROP_CONSOLE === 'true', // 去除 console
          drop_debugger: true, // 去除 debugger
        },
      },
      chunkSizeWarningLimit: 1500, // chunk 大小警告的限制（以 kbs 为单位）
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import "${pathResolve('src/styles/index.less')}";`,
        },
      },
    },
  });
};
