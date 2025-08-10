# 批量创建符号链接

## 支持的系统
1. Windows

## 开发规范
### 目录
- `index.js` 主执行文件（入口）
- `/src` 源码目录
- `/src/index.js` src 入口文件
- `/src/command.js` 自动注册参数命令模块
- `/src/class` 所有公共类的存放目录
- `/src/command/<功能模块名称>` 实现功能的模块目录（目录的名称就是功能的名称）

### 功能模块定义：
- 模块里必须要有一个 command.js 文件
- command.js 并且返回一个数组，数组项是参数命令映射表配置类 `（class/ParamsMapping）`
- `command.js`:
```js
const ParamsMapping = require("../../class/ParamsMapping");

// 显示当前版本
const version = new ParamsMapping("v", {
    key: "version",
    count: 0,
    defaults: [],
    description: "显示当前版本"
});

// 注册任务，使用动态导入模块（推荐）
version.addTask("version", (...args) => require("./index")(...args));

module.exports = [version];
```
- `index.js`:
```js
const Params = require("../../class/Params");
const MainRunningMeta = require("../../class/MainRunningMeta");

/**
 *  @description 任务函数
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
module.exports = function (param, meta, __this, taskName)
{
   // ...you code
};

```

### 引用
- 只能外面的引用里面的 js（或者同级目录），里面的不能跳出来引用外面的 js。（class 除外）

### 调试
- 调试代码附上注释：`TODO: debug line comment` 字样：

## 命令

### `lks`
`lks`命令用于批量创建符号链接。

#### 用法
```bash
lks [源目录] [目标目录]
```

#### 参数
- `[源目录]`: 需要创建符号链接的源目录。
- `[目标目录]`: 符号链接的目标目录。

### `lk`
- Windows Bat Script
- 批量为目录内的指定后缀的文件，创建符号链接
- 可修改命令的名称，只需要将项目中的 `lk.xxx` 修改为：`自定义名称.xxx` 即可

## 备注
- `[2025年7月20日]`
    * 包含旧版 lk 命令
    * 新增 lks 命令

- `[2025年7月21日]` 完成基础的命令行参数功能
    * 识别命令行中的参数命令：（参数命令，布尔命令）
    * 新增，参数命令对象（Params.js）的 `key` 属性 可为通配符命令 `*`。任意字符串都表示此命令（须放在末尾）。

- `[2025年7月22日]`
    * 新增打印帮助、版本号
    * 新增全局配置类 GlobalConfig.js
    * 新增布尔命令：-R、-L（递归、日志）
    * 完成批量为文件创建符号链接功能

- `[2025年7月23日]`
    * 打印全局配置
    * 设置全局配置 recursionDeep、collectFileMaxCount 命令
    * 符号链接统计功能（成功、失败）
    * 显示收集的文件

- `[2025年7月28日]`
    * 修复布尔命令参数化的二义性问题
    * 为每个指令新增帮助文档
    * 完成 Steam 创意工坊免费文件下载功能

- `[2025年7月29日]`
    * 重构日志收集
    * 实现参数命令自动注册

- `[2025年7月30日]`
    * 实现参数命令模自动注册
    * 优化入口文件代码逻辑

- `[2025年7月31日]`
    * 优化网络请求
