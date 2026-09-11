import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '神力科莎开发文档',

  // 自定义域名 docs.assetto.cn → base 为 '/'
  // GitHub Pages 默认域名时改为 '/<repo-name>/'
  base: '/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'Assetto Corsa 模组开发与 CSP 配置中文文档',
      themeConfig: {
        nav: [
          {
            text: 'CSP',
            items: [
              { text: '入门指南', link: '/guide/' },
              { text: 'INIpp 配置', link: '/inipp/' },
              { text: 'Ext 配置模板', link: '/ext-templates/' },
              { text: '车辆配置', link: '/car/visual/general-options' },
              { text: '赛道配置', link: '/track/general-options' },
              { text: '通用参考', link: '/general/' },
              { text: '后处理', link: '/post-processing/extra-options' },
              { text: 'Python', link: '/python/new-functions' },
              { text: '服务器', link: '/server/options' },
              { text: '自定义 AI', link: '/custom-ai/' },
            ],
          },
          {
            text: '网络与遥测',
            link: '/networking/',
          },
          {
            text: '官方车辆管线',
            link: '/pipeline/',
          },
          {
            text: 'AC EVO',
            items: [
              { text: '车辆模组', link: '/evo/car/' },
              { text: '物理系统', link: '/evo/car/physics/' },
              { text: '音频系统', link: '/evo/car/audio/' },
              { text: '驾驶员动画', link: '/evo/driver/' },
            ],
          },
          {
            text: 'GitHub',
            link: 'https://github.com/AssettoCN/ac-docs',
          },
        ],

        sidebar: {
          '/evo/': [
            {
              text: 'AC EVO 模组开发',
              collapsed: false,
              items: [
                { text: '简介', link: '/evo/' },
              ],
            },
            {
              text: '车辆模组',
              collapsed: false,
              items: [
                { text: '编辑器与 FBX', link: '/evo/car/' },
                { text: '物理系统', link: '/evo/car/physics/' },
                { text: '音频系统', link: '/evo/car/audio/' },
              ],
            },
            {
              text: '驾驶员动画',
              collapsed: false,
              items: [
                { text: '动画管线', link: '/evo/driver/' },
              ],
            },
          ],

          '/guide/': [
            {
              text: '开始',
              collapsed: false,
              items: [
                { text: '简介', link: '/guide/' },
                { text: 'INIpp 语法基础', link: '/inipp/basic-syntax' },
                { text: '变量与表达式', link: '/inipp/variables' },
                { text: '模板与混入', link: '/inipp/templates' },
              ],
            },
            {
              text: '车辆配置实操',
              collapsed: false,
              items: [
                { text: '基础选项', link: '/car/visual/general-options' },
                { text: '灯光系统', link: '/car/visual/lights' },
                { text: '轮胎效果', link: '/car/visual/tyres-fx' },
              ],
            },
            {
              text: '赛道配置实操',
              collapsed: false,
              items: [
                { text: '基础选项', link: '/track/general-options' },
                { text: 'GrassFX 草地', link: '/track/grass-fx' },
                { text: 'RainFX 雨天', link: '/track/rain-fx' },
                { text: '条件系统', link: '/track/conditions' },
              ],
            },
            {
              text: '技巧与排错',
              collapsed: false,
              items: [
                { text: '过滤系统', link: '/general/filtering' },
                { text: 'Shader 替换', link: '/general/shader-replacements' },
                { text: '故障排除', link: '/general/troubleshooting' },
              ],
            },
          ],

          '/inipp/': [
            {
              text: 'INIpp 配置格式',
              collapsed: false,
              items: [
                { text: '概述', link: '/inipp/' },
                { text: '基础语法', link: '/inipp/basic-syntax' },
                { text: '变量与替换', link: '/inipp/variables' },
                { text: '包含文件 (INCLUDE)', link: '/inipp/include' },
                { text: 'Lua 表达式', link: '/inipp/expressions' },
                { text: '函数 (FUNCTION)', link: '/inipp/functions' },
                { text: '模板 (Templates)', link: '/inipp/templates' },
                { text: '混入与生成器', link: '/inipp/mixins-generators' },
              ],
            },
          ],

          '/general/': [
            {
              text: '通用参考',
              collapsed: false,
              items: [
                { text: '概述', link: '/general/' },
                { text: '故障排除', link: '/general/troubleshooting' },
                { text: '过滤系统', link: '/general/filtering' },
                { text: '线性色彩空间', link: '/general/linear-color-space' },
                { text: 'Shader 替换', link: '/general/shader-replacements' },
                { text: '模型替换', link: '/general/model-replacements' },
                { text: '场景查询', link: '/general/scene-queries' },
                { text: 'Extra FX 标志', link: '/general/extra-fx-flags' },
                { text: 'Extra FX 自发光', link: '/general/extra-fx-emissive' },
                { text: 'UV2 贴图', link: '/general/uv2' },
                { text: '网格调整', link: '/general/mesh-adjustment' },
                { text: '截图命名格式', link: '/general/screenshots-name-format' },
              ],
            },
          ],

          '/car/physics/': [
            {
              text: '车辆物理',
              collapsed: false,
              items: [
                { text: '启用扩展物理', link: '/car/physics/enabling' },
                { text: '动力系统', link: '/car/physics/powertrain' },
                { text: '悬挂系统', link: '/car/physics/suspension' },
                { text: '转向', link: '/car/physics/steering' },
                { text: '轮胎物理', link: '/car/physics/tyre-physics' },
                { text: '牵引力控制', link: '/car/physics/traction-control' },
                { text: '物理脚本', link: '/car/physics/physics-scripts' },
              ],
            },
          ],

          '/car/visual/': [
            {
              text: '车辆视觉配置',
              collapsed: false,
              items: [
                { text: '基础选项', link: '/car/visual/general-options' },
                { text: '灯光系统', link: '/car/visual/lights' },
                { text: '轮胎效果', link: '/car/visual/tyres-fx' },
                { text: '车轮', link: '/car/visual/wheels' },
                { text: '排气管火焰', link: '/car/visual/exhaust-flames' },
                { text: '排气管烟雾', link: '/car/visual/exhaust-smoke' },
                { text: '火花', link: '/car/visual/sparks' },
                { text: '颈部效果', link: '/car/visual/neck-fx' },
              ],
            },
          ],

          '/car/instruments/': [
            {
              text: '车辆仪表盘',
              collapsed: false,
              items: [
                { text: '仪表选项', link: '/car/instruments/options' },
                { text: '模拟仪表', link: '/car/instruments/analog-instruments' },
                { text: '数字仪表', link: '/car/instruments/digital-instruments' },
                { text: 'LED 面板', link: '/car/instruments/led-panels' },
                { text: '仪表输入', link: '/car/instruments/inputs' },
              ],
            },
          ],

          '/track/': [
            {
              text: '赛道配置',
              collapsed: false,
              items: [
                { text: '基础选项', link: '/track/general-options' },
                { text: '草地效果 (GrassFX)', link: '/track/grass-fx' },
                { text: '雨天效果 (RainFX)', link: '/track/rain-fx' },
                { text: '树木系统', link: '/track/trees' },
                { text: '水面着色器', link: '/track/water-shader' },
                { text: '动画对象', link: '/track/animated-objects' },
                { text: '环境光照', link: '/track/bounced-light' },
                { text: '显示屏', link: '/track/displays' },
                { text: '条件系统', link: '/track/conditions' },
                { text: '音频事件', link: '/track/audio' },
              ],
            },
          ],

          '/track/physics/': [
            {
              text: '赛道物理',
              collapsed: false,
              items: [
                { text: '扩展物理选项', link: '/track/physics/general-options' },
                { text: '自定义射线检测', link: '/track/physics/custom-raycasting' },
                { text: '碰撞参数', link: '/track/physics/collision-parameters' },
                { text: '动态物理对象', link: '/track/physics/dynamic-physics-objects' },
                { text: '几何碰撞体', link: '/track/physics/geometric-colliders' },
                { text: '表面调整', link: '/track/physics/surface-tweaks' },
              ],
            },
          ],

          '/post-processing/': [
            {
              text: '后处理',
              collapsed: false,
              items: [
                { text: '额外选项', link: '/post-processing/extra-options' },
                { text: '色彩校正', link: '/post-processing/color-grading' },
              ],
            },
          ],

          '/python/': [
            {
              text: 'Python 应用',
              collapsed: false,
              items: [
                { text: '新增 API', link: '/python/new-functions' },
                { text: '应用图标', link: '/python/app-icons' },
                { text: '热重载', link: '/python/live-reload' },
                { text: '严格模式', link: '/python/strict-mode' },
              ],
            },
          ],

          '/server/': [
            {
              text: '服务器配置',
              collapsed: false,
              items: [
                { text: '服务器选项', link: '/server/options' },
              ],
            },
          ],

          '/custom-ai/': [
            {
              text: '自定义 AI',
              collapsed: false,
              items: [
                { text: '自定义 AI 系统', link: '/custom-ai/' },
              ],
            },
          ],

          '/ext-templates/': [
            {
              text: '常用 Ext 配置模板',
              collapsed: false,
              items: [
                { text: '概述', link: '/ext-templates/' },
                { text: '01. Ext 基础', link: '/ext-templates/01-Ext基础' },
                { text: '02. 材质类', link: '/ext-templates/02-材质类' },
                { text: '03. 灯光类', link: '/ext-templates/03-灯光类' },
                { text: '04. 模拟仪表类', link: '/ext-templates/04-模拟仪表类' },
                { text: '05. 动画类', link: '/ext-templates/05-动画类' },
                { text: '06. 特效类', link: '/ext-templates/06-特效类' },
                { text: '07. 赛道和地图类', link: '/ext-templates/07-赛道和地图类' },
                { text: '08. 交互与逻辑类', link: '/ext-templates/08-交互与逻辑类' },
              ],
            },
          ],

          '/pipeline/': [
            {
              text: 'AC 官方车辆管线 R2.0',
              collapsed: false,
              items: [
                { text: '概述', link: '/pipeline/' },
                { text: '1. Requirements', link: '/pipeline/01-requirements' },
                { text: '2. Basic Guidelines', link: '/pipeline/02-basic-guidelines' },
                { text: '3. Scene Structure', link: '/pipeline/03-scene-structure' },
                { text: '4. Functional Mesh Elements', link: '/pipeline/04-functional-mesh-elements' },
                { text: '5. Functional Textures', link: '/pipeline/05-functional-textures' },
                { text: '6. Texturing Guidelines', link: '/pipeline/06-texturing-guidelines' },
                { text: '7. Animations', link: '/pipeline/07-animations' },
                { text: '8. Materials and AC Editor', link: '/pipeline/08-materials-ac-editor' },
                { text: '9. In-game Console Commands', link: '/pipeline/09-console-commands' },
              ],
            },
          ],

          '/networking/': [
            {
              text: '网络与遥测',
              collapsed: false,
              items: [
                { text: '概述', link: '/networking/' },
                { text: 'UDP 远程遥测', link: '/networking/udp-remote-telemetry' },
              ],
            },
          ],
        },

        footer: {
          message: '基于 <a href="https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki" target="_blank">CSP 官方 Wiki</a> 构建',
          copyright: 'MIT License',
        },

        docFooter: {
          prev: '上一页',
          next: '下一页',
        },

        outline: {
          label: '页面导航',
        },

        lastUpdated: {
          text: '最后更新于',
        },

        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',

        editLink: {
          pattern: 'https://github.com/AssettoCN/ac-docs/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },
      },
    },

    en: {
      label: 'English',
      title: 'Assetto Corsa Dev Docs',
      lang: 'en-US',
      link: '/en/',
      description: 'Assetto Corsa modding and CSP development documentation',
      themeConfig: {
        nav: [
          {
            text: 'AC EVO',
            items: [
              { text: 'Car Modding', link: '/en/evo/car/' },
              { text: 'Physics', link: '/en/evo/car/physics/' },
              { text: 'Audio', link: '/en/evo/car/audio/' },
              { text: 'Driver Animation', link: '/en/evo/driver/' },
            ],
          },
          {
            text: 'Networking & Telemetry',
            link: '/en/networking/',
          },
          {
            text: 'GitHub',
            link: 'https://github.com/AssettoCN/ac-docs',
          },
        ],

        sidebar: {
          '/en/evo/': [
            {
              text: 'AC EVO Modding',
              collapsed: false,
              items: [
                { text: 'Introduction', link: '/en/evo/' },
              ],
            },
            {
              text: 'Car Modding',
              collapsed: false,
              items: [
                { text: 'Editor & FBX', link: '/en/evo/car/' },
                { text: 'Physics', link: '/en/evo/car/physics/' },
                { text: 'Audio', link: '/en/evo/car/audio/' },
              ],
            },
            {
              text: 'Driver Animation',
              collapsed: false,
              items: [
                { text: 'Animation Pipeline', link: '/en/evo/driver/' },
              ],
            },
          ],

          '/en/networking/': [
            {
              text: 'Networking & Telemetry',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/en/networking/' },
                { text: 'UDP Remote Telemetry', link: '/en/networking/udp-remote-telemetry' },
              ],
            },
          ],
        },

        footer: {
          message: 'Built on <a href="https://github.com/ac-custom-shaders-patch/acc-extension-config/wiki" target="_blank">CSP Official Wiki</a>',
          copyright: 'MIT License',
        },

        docFooter: {
          prev: 'Previous',
          next: 'Next',
        },

        outline: {
          label: 'On This Page',
        },

        lastUpdated: {
          text: 'Last updated',
        },

        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',

        editLink: {
          pattern: 'https://github.com/AssettoCN/ac-docs/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
      },
    },
  },

  themeConfig: {
    logo: '/favicon.svg',

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/AssettoCN/ac-docs',
      },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                  closeText: 'Close',
                },
              },
            },
          },
        },
      },
    },
  },
})
