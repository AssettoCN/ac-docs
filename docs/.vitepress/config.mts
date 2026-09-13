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
                { text: '通用选项', link: '/car/visual/general-options' },
                { text: '灯光', link: '/car/visual/lights' },
                { text: '轮胎 FX', link: '/car/visual/tyres-fx' },
              ],
            },
            {
              text: '赛道配置实操',
              collapsed: false,
              items: [
                { text: '通用选项', link: '/track/general-options' },
                { text: '草地 FX', link: '/track/grass-fx' },
                { text: '雨 FX', link: '/track/rain-fx' },
                { text: '条件', link: '/track/conditions' },
              ],
            },
            {
              text: '技巧与排错',
              collapsed: false,
              items: [
                { text: '过滤', link: '/general/filtering' },
                { text: '着色器替换', link: '/general/shader-replacements' },
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
              text: '通用信息',
              collapsed: false,
              items: [
                { text: '概述', link: '/general/' },
                { text: '故障排除', link: '/general/troubleshooting' },
                { text: '截图名称格式', link: '/general/screenshots-name-format' },
                { text: '配置格式（INIpp）', link: '/inipp/' },
                { text: '过滤', link: '/general/filtering' },
                { text: '线性色彩空间', link: '/general/linear-color-space' },
              ],
            },
            {
              text: '车辆与赛道配置',
              collapsed: false,
              items: [
                { text: 'Extra FX 标志', link: '/general/extra-fx-flags' },
                { text: '额外 FX 自发光', link: '/general/extra-fx-emissive' },
                { text: '网格调整', link: '/general/mesh-adjustment' },
                { text: '模型替换', link: '/general/model-replacements' },
                { text: '着色器替换', link: '/general/shader-replacements' },
                { text: '场景查询', link: '/general/scene-queries' },
                { text: 'UV2', link: '/general/uv2' },
              ],
            },
          ],

          '/car/': [
            {
              text: '车辆物理',
              collapsed: false,
              items: [
                { text: '启用扩展物理', link: '/car/physics/enabling' },
                { text: '空气动力学', link: '/car/physics/aerodynamics' },
                { text: '车身扭转', link: '/car/physics/body-flex' },
                { text: '制动系统', link: '/car/physics/brakes' },
                { text: '驾驶者重量偏移', link: '/car/physics/driver-weight-shift' },
                { text: '动态控制器新输入', link: '/car/physics/dynamic-controller-inputs' },
                { text: '物理脚本', link: '/car/physics/physics-scripts' },
                { text: '动力系统', link: '/car/physics/powertrain' },
                { text: '设置 – 控制器', link: '/car/physics/setup-controllers' },
                { text: '转向', link: '/car/physics/steering' },
                { text: '悬挂', link: '/car/physics/suspension' },
                { text: 'COSMIC 悬挂系统', link: '/car/physics/cosmic-suspension' },
                { text: '牵引力控制', link: '/car/physics/traction-control' },
                { text: '轮胎物理', link: '/car/physics/tyre-physics' },
                { text: '轮胎热模型', link: '/car/physics/tyre-thermal-models' },
                { text: '轮胎类型', link: '/car/physics/tyre-types' },
                { text: '辅助工具', link: '/car/physics/helper-tools' },
              ],
            },
            {
              text: '车辆配置',
              collapsed: false,
              items: [
                { text: '通用选项', link: '/car/visual/general-options' },
                { text: '关于猜测配置', link: '/car/guessed-configs' },
                { text: '技巧和提示', link: '/car/tips-and-tricks' },
              ],
            },
            {
              text: '仪表',
              collapsed: false,
              items: [
                { text: '仪表选项', link: '/car/instruments/options' },
                { text: '模拟仪表', link: '/car/instruments/analog-instruments' },
                { text: '模拟里程表', link: '/car/instruments/analog-odometers' },
                { text: '动画', link: '/car/instruments/animations' },
                { text: '数字仪表', link: '/car/instruments/digital-instruments' },
                { text: '发光物体', link: '/car/instruments/emissive-objects' },
                { text: '额外开关', link: '/car/instruments/extra-switches' },
                { text: '仪表输入', link: '/car/instruments/inputs' },
                { text: 'LED 面板', link: '/car/instruments/led-panels' },
                { text: '多通道发光', link: '/car/instruments/multichannel-emissives' },
                { text: '复古转速表', link: '/car/instruments/vintage-tachometers' },
              ],
            },
            {
              text: '杂项',
              collapsed: false,
              items: [
                { text: '音频选项', link: '/car/visual/audio' },
                { text: '刹车盘 FX', link: '/car/visual/brake-disc-fx' },
                { text: '引擎盖变形', link: '/car/visual/deforming-bonnets' },
                { text: '驾驶员模型', link: '/car/visual/driver-model' },
                { text: '排气烟雾', link: '/car/visual/exhaust-smoke' },
                { text: '排气火焰', link: '/car/visual/exhaust-flames' },
                { text: '额外灯光', link: '/car/visual/extra-lights' },
                { text: '灯光', link: '/car/visual/lights' },
                { text: '额外回放数据', link: '/car/visual/extra-replay-data' },
                { text: '虚假阴影特效', link: '/car/visual/fake-shadows-fx' },
                { text: '局部立方体贴图', link: '/car/visual/local-cubemaps' },
                { text: '网格分割', link: '/car/visual/meshes-splitting' },
                { text: '杂项选项', link: '/car/visual/miscellaneous-options' },
                { text: '颈部 FX', link: '/car/visual/neck-fx' },
                { text: '节点调整', link: '/car/visual/node-adjustments' },
                { text: '可选部件', link: '/car/visual/optional-parts' },
                { text: '雨水遮挡调整', link: '/car/visual/rain-occlusion-tweaks' },
                { text: '折射大灯', link: '/car/visual/refracting-headlights' },
                { text: '智能后视镜', link: '/car/visual/smart-mirror' },
                { text: '火花', link: '/car/visual/sparks' },
                { text: '轮胎 FX', link: '/car/visual/tyres-fx' },
                { text: '视觉可调节翼片', link: '/car/visual/visually-adjustable-wings' },
                { text: '车轮', link: '/car/visual/wheels' },
                { text: '晃动部件', link: '/car/visual/wobbly-bits' },
                { text: '雨刷晃动', link: '/car/visual/wobbly-wipers' },
              ],
            },
          ],



          '/track/': [
            {
              text: '赛道物理',
              collapsed: false,
              items: [
                { text: '启用扩展物理', link: '/track/physics/enabling' },
                { text: '通用扩展物理选项', link: '/track/physics/general-options' },
                { text: '自定义射线检测', link: '/track/physics/custom-raycasting' },
                { text: '碰撞参数', link: '/track/physics/collision-parameters' },
                { text: '动态物理对象', link: '/track/physics/dynamic-physics-objects' },
                { text: '几何碰撞体', link: '/track/physics/geometric-colliders' },
                { text: '表面调整', link: '/track/physics/surface-tweaks' },
              ],
            },
            {
              text: '赛道配置',
              collapsed: false,
              items: [
                { text: '通用选项', link: '/track/general-options' },
                { text: '动画对象', link: '/track/animated-objects' },
                { text: '区域图', link: '/track/area-map' },
                { text: '音频', link: '/track/audio' },
                { text: '反射光', link: '/track/bounced-light' },
                { text: '条件', link: '/track/conditions' },
                { text: '变形墙', link: '/track/deforming-walls' },
                { text: '轮胎泥土', link: '/track/dirt-on-tyres' },
                { text: '显示', link: '/track/displays' },
                { text: '示例', link: '/track/examples' },
                { text: '草地 FX', link: '/track/grass-fx' },
                { text: '灯光', link: '/track/lights' },
                { text: '本地立方体贴图', link: '/track/local-cubemaps' },
                { text: '网格操作', link: '/track/meshes-manipulation' },
                { text: '杂项选项', link: '/track/miscellaneous-options' },
                { text: '雨 FX', link: '/track/rain-fx' },
                { text: '树木', link: '/track/trees' },
                { text: '水着色器', link: '/track/water-shader' },
              ],
            },
          ],


          '/post-processing/': [
            {
              text: '后处理滤镜',
              collapsed: false,
              items: [
                { text: '额外选项', link: '/post-processing/extra-options' },
                { text: '色彩分级详解', link: '/post-processing/color-grading' },
              ],
            },
          ],

          '/python/': [
            {
              text: 'Python 应用',
              collapsed: false,
              items: [
                { text: '新增函数', link: '/python/new-functions' },
                { text: '应用图标', link: '/python/app-icons' },
                { text: '实时重载', link: '/python/live-reload' },
                { text: '严格模式', link: '/python/strict-mode' },
              ],
            },
            {
              text: 'Lua 应用',
              collapsed: false,
              items: [
                { text: '关于 Lua 应用', link: 'https://github.com/ac-custom-shaders-patch/acc-lua-sdk/wiki/Lua-apps' },
              ],
            },
          ],

          '/server/': [
            {
              text: '服务器配置',
              collapsed: false,
              items: [
                { text: '服务器额外选项', link: '/server/options' },
              ],
            },
          ],

          '/custom-ai/': [
            {
              text: '其他',
              collapsed: false,
              items: [
                { text: '自定义 AI', link: '/custom-ai/' },
              ],
            },
          ],
          '/unrelated/': [
            {
              text: '与自定义着色器补丁无关',
              collapsed: false,
              items: [
                { text: '关于内容自动更新系统（CUP）', link: '/unrelated/cup' },
                { text: '自定义展厅油漆店默认名称', link: '/unrelated/paint-shop-default-names' },
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
                { text: '1. 需求', link: '/pipeline/01-requirements' },
                { text: '2. 基础准则', link: '/pipeline/02-basic-guidelines' },
                { text: '3. 场景结构', link: '/pipeline/03-scene-structure' },
                { text: '4. 功能网格元素', link: '/pipeline/04-functional-mesh-elements' },
                { text: '5. 功能纹理', link: '/pipeline/05-functional-textures' },
                { text: '6. 贴图准则', link: '/pipeline/06-texturing-guidelines' },
                { text: '7. 动画', link: '/pipeline/07-animations' },
                { text: '8. 材质与 AC 编辑器', link: '/pipeline/08-materials-ac-editor' },
                { text: '9. 游戏内控制台命令', link: '/pipeline/09-console-commands' },
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
            text: 'CSP',
            items: [
              { text: 'Car Configs', link: '/en/car/visual/general-options' },
              { text: 'Track Configs', link: '/en/track/general-options' },
              { text: 'General Reference', link: '/en/general/' },
              { text: 'Post-processing', link: '/en/post-processing/extra-options' },
              { text: 'Python', link: '/en/python/new-functions' },
              { text: 'Server', link: '/en/server/options' },
              { text: 'Custom AI', link: '/en/custom-ai/' },
            ],
          },
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
            text: 'Car Pipeline',
            link: '/en/pipeline/',
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
          '/en/pipeline/': [
            {
              text: 'AC Official Car Pipeline R2.0',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/en/pipeline/' },
                { text: '1. Requirements', link: '/en/pipeline/01-requirements' },
                { text: '2. Basic Guidelines', link: '/en/pipeline/02-basic-guidelines' },
                { text: '3. Scene Structure', link: '/en/pipeline/03-scene-structure' },
                { text: '4. Functional Mesh Elements', link: '/en/pipeline/04-functional-mesh-elements' },
                { text: '5. Functional Textures', link: '/en/pipeline/05-functional-textures' },
                { text: '6. Texturing Guidelines', link: '/en/pipeline/06-texturing-guidelines' },
                { text: '7. Animations', link: '/en/pipeline/07-animations' },
                { text: '8. Materials and AC Editor', link: '/en/pipeline/08-materials-ac-editor' },
                { text: '9. In-game Console Commands', link: '/en/pipeline/09-console-commands' },
              ],
            },
          ],


          '/en/car/': [
            {
              text: 'Car Physics',
              collapsed: false,
              items: [
                { text: 'Enabling extended physics', link: '/en/car/physics/enabling' },
                { text: 'Aerodynamics', link: '/en/car/physics/aerodynamics' },
                { text: 'Body flex', link: '/en/car/physics/body-flex' },
                { text: 'Brakes', link: '/en/car/physics/brakes' },
                { text: 'Driver weight shift', link: '/en/car/physics/driver-weight-shift' },
                { text: 'New inputs for dynamic controllers', link: '/en/car/physics/dynamic-controller-inputs' },
                { text: 'Physics scripts', link: '/en/car/physics/physics-scripts' },
                { text: 'Powertrain', link: '/en/car/physics/powertrain' },
                { text: 'Setup controllers', link: '/en/car/physics/setup-controllers' },
                { text: 'Steering', link: '/en/car/physics/steering' },
                { text: 'Suspension', link: '/en/car/physics/suspension' },
                { text: 'COSMIC Suspension', link: '/en/car/physics/cosmic-suspension' },
                { text: 'Traction Control', link: '/en/car/physics/traction-control' },
                { text: 'Tyre Physics', link: '/en/car/physics/tyre-physics' },
                { text: 'Tyre Thermal Models', link: '/en/car/physics/tyre-thermal-models' },
                { text: 'Tyre Types', link: '/en/car/physics/tyre-types' },
                { text: 'Helper Tools', link: '/en/car/physics/helper-tools' },
              ],
            },
            {
              text: 'Car Configs',
              collapsed: false,
              items: [
                { text: 'General options', link: '/en/car/visual/general-options' },
                { text: 'About guessed configs', link: '/en/car/guessed-configs' },
                { text: 'Tips and tricks', link: '/en/car/tips-and-tricks' },
              ],
            },
            {
              text: 'Instruments',
              collapsed: false,
              items: [
                { text: 'Instruments options', link: '/en/car/instruments/options' },
                { text: 'Analog instruments', link: '/en/car/instruments/analog-instruments' },
                { text: 'Analog odometers', link: '/en/car/instruments/analog-odometers' },
                { text: 'Animations', link: '/en/car/instruments/animations' },
                { text: 'Digital instruments', link: '/en/car/instruments/digital-instruments' },
                { text: 'Emissive objects', link: '/en/car/instruments/emissive-objects' },
                { text: 'Extra switches', link: '/en/car/instruments/extra-switches' },
                { text: 'Instruments inputs', link: '/en/car/instruments/inputs' },
                { text: 'LED panels', link: '/en/car/instruments/led-panels' },
                { text: 'Multichannel emissives', link: '/en/car/instruments/multichannel-emissives' },
                { text: 'Vintage tachometers', link: '/en/car/instruments/vintage-tachometers' },
              ],
            },
            {
              text: 'Miscellaneous',
              collapsed: false,
              items: [
                { text: 'Audio options', link: '/en/car/visual/audio' },
                { text: 'Brake Disc FX', link: '/en/car/visual/brake-disc-fx' },
                { text: 'Deforming bonnets', link: '/en/car/visual/deforming-bonnets' },
                { text: 'Driver model', link: '/en/car/visual/driver-model' },
                { text: 'Exhaust smoke', link: '/en/car/visual/exhaust-smoke' },
                { text: 'Exhaust flames', link: '/en/car/visual/exhaust-flames' },
                { text: 'Extra Lights', link: '/en/car/visual/extra-lights' },
                { text: 'Lights', link: '/en/car/visual/lights' },
                { text: 'Extra Replay Data', link: '/en/car/visual/extra-replay-data' },
                { text: 'Fake Shadows FX', link: '/en/car/visual/fake-shadows-fx' },
                { text: 'Local cubemaps', link: '/en/car/visual/local-cubemaps' },
                { text: 'Meshes splitting', link: '/en/car/visual/meshes-splitting' },
                { text: 'Miscellaneous options', link: '/en/car/visual/miscellaneous-options' },
                { text: 'Neck FX', link: '/en/car/visual/neck-fx' },
                { text: 'Node adjustments', link: '/en/car/visual/node-adjustments' },
                { text: 'Optional parts', link: '/en/car/visual/optional-parts' },
                { text: 'Rain occlusion tweaks', link: '/en/car/visual/rain-occlusion-tweaks' },
                { text: 'Refracting headlights', link: '/en/car/visual/refracting-headlights' },
                { text: 'Smart Mirror', link: '/en/car/visual/smart-mirror' },
                { text: 'Sparks', link: '/en/car/visual/sparks' },
                { text: 'Tyres FX', link: '/en/car/visual/tyres-fx' },
                { text: 'Visually adjustable wings', link: '/en/car/visual/visually-adjustable-wings' },
                { text: 'Wheels', link: '/en/car/visual/wheels' },
                { text: 'Wobbly bits', link: '/en/car/visual/wobbly-bits' },
                { text: 'Wobbly wipers', link: '/en/car/visual/wobbly-wipers' },
              ],
            },
          ],



          '/en/track/': [
            {
              text: 'Track Physics',
              collapsed: false,
              items: [
                { text: 'Enabling extended physics', link: '/en/track/physics/enabling' },
                { text: 'General extended physics options', link: '/en/track/physics/general-options' },
                { text: 'Custom raycasting', link: '/en/track/physics/custom-raycasting' },
                { text: 'Collision parameters', link: '/en/track/physics/collision-parameters' },
                { text: 'Dynamic physics objects', link: '/en/track/physics/dynamic-physics-objects' },
                { text: 'Geometric colliders', link: '/en/track/physics/geometric-colliders' },
                { text: 'Surface tweaks', link: '/en/track/physics/surface-tweaks' },
              ],
            },
            {
              text: 'Track Configs',
              collapsed: false,
              items: [
                { text: 'General options', link: '/en/track/general-options' },
                { text: 'Animated objects', link: '/en/track/animated-objects' },
                { text: 'Area map', link: '/en/track/area-map' },
                { text: 'Audio', link: '/en/track/audio' },
                { text: 'Bounced light', link: '/en/track/bounced-light' },
                { text: 'Conditions', link: '/en/track/conditions' },
                { text: 'Deforming walls', link: '/en/track/deforming-walls' },
                { text: 'Dirt on tyres', link: '/en/track/dirt-on-tyres' },
                { text: 'Displays', link: '/en/track/displays' },
                { text: 'Examples', link: '/en/track/examples' },
                { text: 'Grass FX', link: '/en/track/grass-fx' },
                { text: 'Lights', link: '/en/track/lights' },
                { text: 'Local cubemaps', link: '/en/track/local-cubemaps' },
                { text: 'Meshes manipulation', link: '/en/track/meshes-manipulation' },
                { text: 'Miscellaneous options', link: '/en/track/miscellaneous-options' },
                { text: 'RainFX', link: '/en/track/rain-fx' },
                { text: 'Trees', link: '/en/track/trees' },
                { text: 'Water shader', link: '/en/track/water-shader' },
              ],
            },
          ],


          '/en/general/': [
            {
              text: 'General Information',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/en/general/' },
                { text: 'Troubleshooting', link: '/en/general/troubleshooting' },
                { text: 'Screenshots name format', link: '/en/general/screenshots-name-format' },
                { text: 'Configs Format (INIpp)', link: 'https://github.com/ac-custom-shaders-patch/inipp' },
                { text: 'Filtering', link: '/en/general/filtering' },
                { text: 'Linear color space', link: '/en/general/linear-color-space' },
              ],
            },
            {
              text: 'Car & Track Configs',
              collapsed: false,
              items: [
                { text: 'Extra FX flags', link: '/en/general/extra-fx-flags' },
                { text: 'Extra FX emissive', link: '/en/general/extra-fx-emissive' },
                { text: 'Mesh adjustment', link: '/en/general/mesh-adjustment' },
                { text: 'Model replacements', link: '/en/general/model-replacements' },
                { text: 'Shader replacements', link: '/en/general/shader-replacements' },
                { text: 'Scene queries', link: '/en/general/scene-queries' },
                { text: 'UV2', link: '/en/general/uv2' },
              ],
            },
          ],

          '/en/post-processing/': [
            {
              text: 'Post-processing Filters',
              collapsed: false,
              items: [
                { text: 'Extra Options', link: '/en/post-processing/extra-options' },
                { text: 'Color Grading', link: '/en/post-processing/color-grading' },
              ],
            },
          ],

          '/en/python/': [
            {
              text: 'Python Apps',
              collapsed: false,
              items: [
                { text: 'New Functions', link: '/en/python/new-functions' },
                { text: 'App Icons', link: '/en/python/app-icons' },
                { text: 'Live Reload', link: '/en/python/live-reload' },
                { text: 'Strict Mode', link: '/en/python/strict-mode' },
              ],
            },
            {
              text: 'Lua Apps',
              collapsed: false,
              items: [
                { text: 'About Lua Apps', link: 'https://github.com/ac-custom-shaders-patch/acc-lua-sdk/wiki/Lua-apps' },
              ],
            },
          ],

          '/en/server/': [
            {
              text: 'Server Configs',
              collapsed: false,
              items: [
                { text: 'Server Options', link: '/en/server/options' },
              ],
            },
          ],

          '/en/custom-ai/': [
            {
              text: 'Other Things',
              collapsed: false,
              items: [
                { text: 'Custom AI', link: '/en/custom-ai/' },
              ],
            },
          ],
          '/en/unrelated/': [
            {
              text: 'Unrelated to Custom Shaders Patch',
              collapsed: false,
              items: [
                { text: 'About content auto updates system (CUP)', link: '/en/unrelated/cup' },
                { text: 'Default names for Paint Shop in Custom Showroom', link: '/en/unrelated/paint-shop-default-names' },
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
