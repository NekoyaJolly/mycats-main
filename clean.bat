@echo off
echo Cleaning node_modules and build folders...

REM Clean node_modules
if exist node_modules rmdir /s /q node_modules
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist cat-ui-test\node_modules rmdir /s /q cat-ui-test\node_modules

REM Clean build outputs
if exist backend\dist rmdir /s /q backend\dist
if exist cat-ui-test\.next rmdir /s /q cat-ui-test\.next

echo Clean completed!
