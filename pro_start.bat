@echo off
title 环境启动
color 03
mode con cols=115 lines=35
SET SourceFile=\node_modules
:START
ECHO.
Echo                  ==========================================================================
ECHO.                                        嘿，小帅哥长得贼帅
ECHO.
Echo                                         生产环境启动中..
ECHO.
Echo                  ==========================================================================
echo.
echo 查询依赖中
echo.
if exist %cd%%SourceFile% (
    echo 依赖已存在，启动中
) else (
    echo 依赖不存在，开始下载依赖
    echo.
    npm i
    echo 依赖下载完成，环境启动中    
)
npm run build-pro