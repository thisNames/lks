# 批量创建符号链接

## 支持的系统
1. windows

## 开发规范
### 目录
- `index.js` 整个程序的入口文件
- `/src` 源码目录
- `/src/class` 所有公共类的存放目录
- `/src/command/<功能名称>` 实现功能的模块目录（目录的名称就是功能的名称）
- `/src/command.js` 所有命令配置统一代码
- `/src/index.js` 所有命令任务注册统一代码

### 引用
- 只能外面的引用里面的 js（或者同级目录），里面的不能跳出来引用外面的 js。（class 除外）

### 调试
- 调试代码附上注释：`TODO: debug line comment` 字样：

## 命令

### `lks`
- Node JavaScript（node@18x）
    * [所有 Node 发行版](https://nodejs.org/download/release/)
    * [Node 1.18x lts 版直达链接](https://nodejs.org/download/release/v18.20.5/node-v18.20.5-win-x64.zip)
    
- 批量递归为目录内（包括子目录）的指定后缀的文件，创建符号链接
- 可修改命令的名称，只需要将项目中的 `lks.xxx` 修改为：`自定义名称.xxx` 即可

### `lk`
- Windows Bat Script
- 批量为目录内的指定后缀的文件，创建符号链接
- 可修改命令的名称，只需要将项目中的 `lk.xxx` 修改为：`自定义名称.xxx` 即可

## 备注
- `[2025年7月20日]`
    * 包含旧版 lk 命令

- `[2025年7月20日]`
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

- TODO: 其他任务
