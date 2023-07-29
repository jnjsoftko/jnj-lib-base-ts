REM [syntax] publish patch|minor|major
REM default: patch

IF "%~1"=="" (
  SET mode=patch
) ELSE (
  SET mode=%1
)
@echo off
@echo npm version %mode%