@ECHO off

@REM	Author:			���������
@REM	Version:		1.0.1�����԰棩
@REM	Description:	���������ļ���������
@REM	Running:		Terminal Exec
@REM	CharCode:		GBK/GB2312
@REM	lastUpdate:		2024��9��11��17��33��
@REM	Gitee:			https://gitee.com/nextall/lks
@REM	Github:			https://github.com/thisNames/lks
@REM	Email:			2226531799@qq.com

@REM ԴĿ¼
set SOURCE_PATH=%1

@REM �ļ���չ��
set EXTNAME=%2

@REM ԴĿ¼\*.�ļ���չ��
set SP=%SOURCE_PATH%\*.%EXTNAME%

echo # %0 ������ű�
echo ������	�ڵ�ǰ�Ĺ���·����Ŀ¼���У����������ļ���������
echo ��ʽ��	%0 "ԴĿ¼·��������1��" ��չ��������2��
echo ʾ����	%0 "C:\AAA\BBB\CCC" vpk
echo -_-


@REM ��ȡָ��Ŀ¼�µ�����ָ�����͵��ļ�
IF EXIST %SOURCE_PATH% (
	echo # ������������ԴĿ¼��%SOURCE_PATH%

	echo # ��ʼ������
	echo -------------------------------------------
	
	@REM ���ɷ�������
	FOR %%f IN (%SP%) DO (

		echo # �������������ļ� "%%~nxf" ���� "%%f"
		
		mklink "%%~nxf" "%%f"
		
		echo -------------------------------------------
	)
	
	echo -o-
	echo ִ����ϣ�
	
	FOR %%f IN (%SP%) DO (
		echo # �����ļ���%%~nxf
	)
	
) ELSE (
	echo -A-
	echo ����	û��������Ŀ¼ %SOURCE_PATH%
	echo -------------------------------------------
)

