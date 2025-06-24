# 繁→简（Simplified Chinese Converter）

一键将网页上的繁体字转换为简体字，基于 [https://api.zhconvert.org/convert](https://api.zhconvert.org/convert) 实现。

## 功能简介
- 遍历网页所有可见文本节点，将繁体字批量转换为简体字。
- 支持通过用户脚本菜单一键触发转换。
- 保持网页原有结构，仅替换文本内容。

## 安装方法
1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/) 等用户脚本管理器。
2. 下载本仓库中的 `simplified-chinese-converter.user.js` 文件。
3. 在脚本管理器中新建脚本，将内容粘贴进去并保存。

## 使用方法
- 安装脚本后，点击浏览器右上角脚本菜单，选择“简”即可一键将当前网页全部繁体字转换为简体字。
- （可选）如需悬浮按钮，取消 `addBtn();` 的注释即可。

## 主要原理
- 使用 `TreeWalker` 遍历网页所有可见文本节点，过滤掉 `<script>`、`<style>`、`<code>` 等标签内的内容。
- 将所有文本拼接后发送到 [ZhConvert API](https://api.zhconvert.org/convert) 进行转换。
- 将转换后的简体文本按原顺序替换回页面。

## 注意事项
- 仅对当前页面内容生效，不会修改网页源文件。
- 依赖第三方 API，若接口不可用则无法转换。

## License
MIT
