# LKS（批量创建符号链接）

## 简介
### 本项目简介
- 本项目是 2025 年 7 月创建，实现自动化注册命令。通过解析命令行参数，执行对应的任务
- 本项目不依赖任何第三方库，基于 NodeJS 开发，采用 CommonJS 规范
### 支持的系统
1. Windows

## 项目结构
- `/src` 源码目录
- `/src/class` 所有公共类的存放目录
- `/src/command` 所有功能模块（命令）的存放目录
- `/src/config` 全局配置模块目录
- `/src/command.js` 自动注册参数命令模块
- `/src/index.js` src 入口文件
- `index.js` 主执行文件（入口）
- `lks.bat` 项目的启动脚本

## 功能模块定义
### 创建
- `/src/command/<功能模块名称>` 实现功能的模块目录（目录的名称就是功能的名称）

### 结构
- 模块里必须要有一个 `command.js` 文件
- `command.js` 并且返回一个数组，数组项是参数命令映射表配置类 [class/ParamsMapping](./src/class/ParamsMapping.js)

### 示例
- `command.js`:
- 更多配置可查看：[class/Params](./src/class/Params.js)（核心类） `extends` [class/Single](./src/class/Single.js)
- 示例 2：[addition/command.js](./src/command/addition/command.js)
```js
// 导入配置类
const ParamsMapping = require("../../class/ParamsMapping");

// 显示当前版本（命令的功能：-v -version）
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
## 开发规范
### 引用
- 功能模块只能引用自己里面的 js（或者同级目录），里面的不能跳出来引用外面的 js。（class, config 除外）
- 确保每个命令对应一个功能模块`command/<功能模块名称>`，互不干扰

### 调试
- 调试代码附上注释：`TODO: debug line comment` 字样

## 脚本命令
- 可将项目配置环境变量

### `lks`
#### 说明
- 项目的启动脚本
- 可自行修改此脚本文件的名称

#### 使用
```bash
lks -h
```

### `lk`
#### 说明
- Windows Bat Script
- 批量为目录内的指定后缀的文件，创建符号链接

#### 使用
```bash
lk <目录路径> <后缀名>
```

## command
### 以包含的功能模块
1. [addition](./src/command/addition): 累加法功能（用于测试的命令）
2. [download_vpk](./src/command/download_vpk): 下载 Steam 创意工坊免费内容文件
3. [file_symlink](./src/command/file_symlink): 批量为文件创建符号链接
4. [global_config](./src/command/global_config): 显示全局配置信息
5. [print_help](./src/command/print_help): 命令帮助、命令帮助文档（用于查看最终生成的命令名称，如：add => -add）
6. [print_version](./src/command/print_version): 打印版本号

### 说明
- 如果不想要哪个命令模块直接删除对应的目录即可

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

- `[2025年8月11日]`
    * 新增子命令配置
