@ECHO off

@REM	Author:			立秋枫林晚
@REM	Version:		1.0.1（测试版）
@REM	Description:	批量创建文件符号链接
@REM	Running:		Terminal Exec
@REM	CharCode:		GBK/GB2312
@REM	lastUpdate:		2024年9月11日17点33分
@REM	Gitee:			https://gitee.com/nextall/lks
@REM	Github:			https://github.com/thisNames/lks
@REM	Email:			2226531799@qq.com

@REM 源目录
set SOURCE_PATH=%1

@REM 文件拓展名
set EXTNAME=%2

@REM 源目录\*.文件拓展名
set SP=%SOURCE_PATH%\*.%EXTNAME%

echo # %0 批处理脚本
echo 描述：	在当前的工作路径（目录）中，批量创建文件符号链接
echo 格式：	%0 "源目录路径（参数1）" 拓展名（参数2）
echo 示例：	%0 "C:\AAA\BBB\CCC" vpk
echo -_-


@REM 获取指定目录下的所有指定类型的文件
IF EXIST %SOURCE_PATH% (
	echo # 创建符号链接源目录：%SOURCE_PATH%

	echo # 开始创建：
	echo -------------------------------------------
	
	@REM 生成符号链接
	FOR %%f IN (%SP%) DO (

		echo # 创建符号链接文件 "%%~nxf" 来自 "%%f"
		
		mklink "%%~nxf" "%%f"
		
		echo -------------------------------------------
	)
	
	echo -o-
	echo 执行完毕：
	
	FOR %%f IN (%SP%) DO (
		echo # 链接文件：%%~nxf
	)
	
) ELSE (
	echo -A-
	echo 错误：	没有这样的目录 %SOURCE_PATH%
	echo -------------------------------------------
)

