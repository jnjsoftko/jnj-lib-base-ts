REM [syntax] publish patch|minor|major
REM default: patch

IF "%~1"=="" (
  SET mode=patch
) ELSE (
  SET mode=%1
)
@REM yarn clean && yarn build && git add . && git commit -m "source edit" && git push origin main && npm version %mode% && npm publish
@REM yarn clean && yarn build
@REM git add . && git commit -m "source edit" && git push origin
yarn clean && yarn build && npm version %mode% && npm publish



