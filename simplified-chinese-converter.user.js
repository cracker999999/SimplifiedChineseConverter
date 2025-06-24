// ==UserScript==
// @name         繁→简
// @namespace    https://zhconvert.org/
// @version      0.1
// @description  一键把网页繁体字转成简体字，调用 https://api.zhconvert.org/convert
// @author       Leen
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.zhconvert.org
// ==/UserScript==

(function () {
  'use strict';

  const BTN_ID = '__zh_to_simplified_btn__';
  const SEP = '\n—\n';        // 用极小概率出现的分隔符保持段落顺序

  /* 添加悬浮按钮 */
  function addBtn() {
    if (document.getElementById(BTN_ID)) return;
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.textContent = '简';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 99999,
      padding: '8px 12px',
      borderRadius: '4px',
      background: '#ff5722',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      userSelect: 'none'
    });
    btn.onclick = convertPage;
    document.body.appendChild(btn);
  }

  /* 遍历可见文本节点 */
  function getTextNodes() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.parentNode) return NodeFilter.FILTER_REJECT;
          const tag = node.parentNode.nodeName;
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  /* 向 ZhConvert 发送整页文本并替换 */
  function convertPage() {
    const nodes = getTextNodes();
    const original = nodes.map(n => n.nodeValue);
    const payload = `text=${encodeURIComponent(original.join(SEP))}&converter=Simplified`;

    GM.xmlHttpRequest({
      method: 'POST',
      url: 'https://api.zhconvert.org/convert',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: payload,
      onload: res => {
        try {
          const json = JSON.parse(res.responseText);
          const converted = json.data.text.split(SEP);
          nodes.forEach((n, i) => (n.nodeValue = converted[i] ?? n.nodeValue));
          console.log('✅ 已全部转换为简体');
        } catch {
          alert('❌ 转换失败：解析返回值错误');
        }
      },
      onerror: () => alert('❌ 转换失败：API 请求错误')
    });
  }

  //addBtn();
  GM_registerMenuCommand('简', convertPage);
})();
