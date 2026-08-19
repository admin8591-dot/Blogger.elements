/* ===== MLT PATHSHALA CHAT WIDGET — floating fixed bubble version =====
   Position no longer depends on where the <script> tag sits in the DOM.
   It always floats bottom-right, above everything, with a proper shadow.

   Blogger usage — paste ANYWHERE (Page HTML, Post HTML, or a Layout Gadget):
   <script src='https://cdn.jsdelivr.net/gh/admin8591-dot/Blogger.elements@main/chat-widget.js'></script>
*/
(function () {
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRRoALYWJ5wD0Sv2JotoXNsn5AR6oHYEYhdbcejV8OX8m5njNsuANcHEKurM_ZlHxj/exec';
  var PAGE_SIZE = 30, POLL_MS = 4000;

  // ---------- 1. Inject CSS ----------
  var css = `
#cw-root *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}

/* Floating fixed panel — always bottom-right, always visible regardless of
   where this script/div physically sits in the page's HTML. */
#cw-box{
  position:fixed;
  bottom:16px;
  right:16px;
  width:340px;
  max-width:calc(100vw - 24px);
  margin:0;
  border-radius:16px;
  overflow:hidden;
  background:#ffffff;
  border:1px solid rgba(0,0,0,0.08);
  box-shadow:0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10);
  display:flex;
  flex-direction:column;
  z-index:999999;
  transition:all 0.25s ease;
}

#cw-header{background:#1a1a1a;color:#fff;padding:10px 14px;font-weight:600;font-size:14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;cursor:default}
#cw-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;box-shadow:0 0 8px rgba(74,222,128,0.5);animation:cwPulse 2s infinite}
@keyframes cwPulse{0%,100%{opacity:1}50%{opacity:0.5}}
#cw-title{flex:1;font-size:13px}
#cw-toggle-container{display:flex;align-items:center;margin-left:auto}
#cw-toggle{display:none}
#cw-toggle-label{width:32px;height:18px;background:#555;border-radius:10px;cursor:pointer;position:relative;transition:background 0.3s ease;flex-shrink:0;border:1px solid rgba(255,255,255,0.15)}
#cw-toggle-label::after{content:'';position:absolute;top:1.5px;left:1.5px;width:13px;height:13px;background:#fff;border-radius:50%;transition:transform 0.3s ease;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
#cw-toggle:checked + #cw-toggle-label{background:#4ade80}
#cw-toggle:checked + #cw-toggle-label::after{transform:translateX(14px)}

#cw-body{display:flex;flex-direction:column;overflow:hidden;transition:all 0.25s ease}
#cw-body.cw-hidden{display:none !important}

#cw-messages{flex:1;overflow-y:auto;padding:10px 12px;background:#f0f2f5;display:flex;flex-direction:column;max-height:360px;min-height:220px}
#cw-messages::-webkit-scrollbar{width:4px}
#cw-messages::-webkit-scrollbar-thumb{background:#d0d0d8;border-radius:3px}
#cw-messages{scrollbar-width:thin}

#cw-loadOlder{text-align:center;color:#2d2d2d;font-size:10px;font-weight:600;cursor:pointer;padding:4px;display:none;background:rgba(0,0,0,0.03);border-radius:8px;margin-bottom:4px;border:1px solid rgba(0,0,0,0.04);transition:all 0.2s}
#cw-loadOlder:hover{background:rgba(0,0,0,0.06)}
.cw-date-divider{text-align:center;margin:8px 0 8px}
.cw-date-divider span{background:rgba(255,255,255,0.9);color:#666;font-size:10px;font-weight:600;padding:3px 14px;border-radius:12px;display:inline-block;border:1px solid rgba(0,0,0,0.05);box-shadow:0 1px 3px rgba(0,0,0,0.04)}
.cw-row{display:flex;animation:cwFadeIn 0.15s ease}
.cw-row.me{justify-content:flex-end}
.cw-row.them{justify-content:flex-start}
@keyframes cwFadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
.cw-bubble{max-width:78%;padding:6px 12px;border-radius:12px;font-size:12.5px;line-height:1.35;word-wrap:break-word;box-shadow:0 1px 3px rgba(0,0,0,0.06);position:relative;transition:all 0.2s}
.cw-row.me .cw-bubble{color:#fff;border-bottom-right-radius:3px}
.cw-row.them .cw-bubble{color:#333;border-bottom-left-radius:3px;border:1px solid rgba(0,0,0,0.06);background:#fff}
.cw-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;gap:8px}
.cw-name{font-size:9.5px;font-weight:700;letter-spacing:0.1px}
.cw-row.me .cw-name{color:rgba(255,255,255,0.8)}
.cw-row.them .cw-name{color:#2d2d2d}
.cw-time{font-size:8px;opacity:0.45;white-space:nowrap}
.cw-row.me .cw-time{color:rgba(255,255,255,0.55)}
.cw-row.them .cw-time{color:#999}
.cw-msg-text{word-break:break-word;font-weight:400;font-size:12px}

#cw-inputRow{display:flex;gap:6px;padding:9px 12px;background:#ffffff;border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0}
#cw-input{flex:1;border:1px solid rgba(0,0,0,0.09);border-radius:16px;padding:8px 14px;font-size:12.5px;outline:none;background:#f8f9fc;transition:all 0.2s;color:#333}
#cw-input:focus{border-color:#2d2d2d;background:#ffffff;box-shadow:0 0 0 2px rgba(0,0,0,0.05)}
#cw-input::placeholder{color:#aaa;font-size:11.5px}
#cw-send{background:#2d2d2d;color:#fff;border:none;border-radius:16px;padding:0 16px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
#cw-send:hover{background:#000}
#cw-send:active{transform:scale(0.95)}
#cw-send:disabled{opacity:0.4;cursor:default;transform:none}

#cw-nameOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);align-items:center;justify-content:center;z-index:1000000;padding:16px}
#cw-nameCard{background:#ffffff;padding:24px 20px;border-radius:18px;max-width:300px;width:100%;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.25)}
#cw-nameCard h3{margin:0 0 2px;font-size:17px;color:#222;font-weight:700}
#cw-nameCard p{margin:0 0 12px;font-size:12.5px;color:#888}
#cw-nameInput{width:100%;padding:9px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.09);font-size:13px;margin-bottom:10px;outline:none;background:#f8f9fc;color:#333}
#cw-nameInput:focus{border-color:#2d2d2d}
#cw-nameOk{width:100%;background:#2d2d2d;color:#fff;border:none;border-radius:10px;padding:10px;font-size:13px;font-weight:700;cursor:pointer}
#cw-nameOk:hover{background:#000}

/* Small phones: keep panel comfortably sized, slightly closer to edges */
@media (max-width:400px){
  #cw-box{right:8px;bottom:8px;width:calc(100vw - 16px)}
  #cw-messages{max-height:52vh}
}
`;
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  // ---------- 2. Inject HTML (always appended to <body>, so fixed positioning is reliable) ----------
  var html = `
<div id="cw-root">
  <div id="cw-box">
    <div id="cw-header">
      <span id="cw-dot"></span>
      <span id="cw-title">Doubt Solving Chat</span>
      <div id="cw-toggle-container">
        <input type="checkbox" id="cw-toggle" checked/>
        <label for="cw-toggle" id="cw-toggle-label"></label>
      </div>
    </div>
    <div id="cw-body">
      <div id="cw-messages">
        <div id="cw-loadOlder">Load older messages</div>
        <div id="cw-list"></div>
      </div>
      <div id="cw-inputRow">
        <input id="cw-input" placeholder="Type your message" maxlength="1000"/>
        <button id="cw-send">Send</button>
      </div>
    </div>
  </div>
  <div id="cw-nameOverlay">
    <div id="cw-nameCard">
      <h3>Your name?</h3>
      <p>We'll remember it on this browser.</p>
      <input id="cw-nameInput" placeholder="Your name" maxlength="40"/>
      <button id="cw-nameOk">Continue</button>
    </div>
  </div>
</div>`;

  var mount = document.createElement('div');
  document.body.appendChild(mount);
  mount.innerHTML = html;

  // ---------- 3. Chat logic ----------
  var L = document.getElementById('cw-list'), M = document.getElementById('cw-messages');
  var O = document.getElementById('cw-loadOlder'), I = document.getElementById('cw-input');
  var S = document.getElementById('cw-send'), N = document.getElementById('cw-nameOverlay');
  var NI = document.getElementById('cw-nameInput'), NO = document.getElementById('cw-nameOk');
  var toggle = document.getElementById('cw-toggle'), body = document.getElementById('cw-body');
  var offset = 0, hasMore = false, loadedIds = {}, newestTimestamp = 0, pendingText = null;
  var colorPalette = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF', '#FF8A5C', '#74B9FF', '#FD79A8', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9', '#D63031', '#6AB04C', '#EB4D4B', '#F0932B', '#4834D4', '#22A6B3'];

  toggle.addEventListener('change', function () {
    if (this.checked) body.classList.remove('cw-hidden');
    else body.classList.add('cw-hidden');
  });

  function getColorIndex(name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    return Math.abs(hash) % colorPalette.length;
  }
  function getUserId() {
    var id = localStorage.getItem('cw_userId');
    if (!id) { id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10); localStorage.setItem('cw_userId', id); }
    return id;
  }
  function getUserName() { return localStorage.getItem('cw_userName'); }
  function setUserName(n) { localStorage.setItem('cw_userName', n); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    if (parts.length === 3) {
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return parseInt(parts[2]) + ' ' + months[parseInt(parts[1]) - 1] + ' ' + parts[0];
    }
    return dateStr;
  }
  function formatTime(timestamp) {
    var d = new Date(timestamp), h = d.getHours(), m = d.getMinutes();
    var ampm = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }
  function getMessageColor(name) { return colorPalette[getColorIndex(name)]; }

  function renderBatch(messages, mode) {
    var ordered = messages.slice().reverse();
    var frag = document.createDocumentFragment();
    var lastDate = null;
    ordered.forEach(function (m) {
      if (loadedIds[m.id]) return;
      loadedIds[m.id] = true;
      var msgDate = formatDate(m.date);
      if (msgDate !== lastDate) {
        var div = document.createElement('div');
        div.className = 'cw-date-divider';
        div.innerHTML = '<span>' + esc(msgDate) + '</span>';
        frag.appendChild(div);
        lastDate = msgDate;
      }
      var row = document.createElement('div');
      var isMe = m.userId === getUserId();
      row.className = 'cw-row ' + (isMe ? 'me' : 'them');
      var bubble = document.createElement('div');
      bubble.className = 'cw-bubble';
      var headerRow = document.createElement('div');
      headerRow.className = 'cw-header-row';
      var nameSpan = document.createElement('span');
      nameSpan.className = 'cw-name';
      nameSpan.textContent = isMe ? 'You' : (m.name || 'Unknown');
      var timeSpan = document.createElement('span');
      timeSpan.className = 'cw-time';
      timeSpan.textContent = formatTime(m.timestamp);
      headerRow.appendChild(nameSpan);
      headerRow.appendChild(timeSpan);
      bubble.appendChild(headerRow);
      var msgSpan = document.createElement('div');
      msgSpan.className = 'cw-msg-text';
      msgSpan.textContent = m.message;
      bubble.appendChild(msgSpan);
      if (!isMe) {
        var msgColor = getMessageColor(m.name || 'Unknown');
        bubble.style.borderColor = msgColor + '55';
        bubble.querySelector('.cw-name').style.color = msgColor;
      } else {
        bubble.style.background = 'linear-gradient(135deg,#4a6cf7,#6a3de8)';
        bubble.querySelector('.cw-name').style.color = 'rgba(255,255,255,0.85)';
      }
      row.appendChild(bubble);
      frag.appendChild(row);
      if (m.timestamp > newestTimestamp) newestTimestamp = m.timestamp;
    });
    if (mode === 'prepend') {
      var oldScrollHeight = M.scrollHeight;
      L.insertBefore(frag, L.firstChild);
      M.scrollTop = M.scrollHeight - oldScrollHeight;
    } else {
      L.appendChild(frag);
      M.scrollTop = M.scrollHeight;
    }
    applyMessageGaps();
  }

  function applyMessageGaps() {
    var rows = L.querySelectorAll('.cw-row');
    for (var i = 0; i < rows.length; i++) {
      var current = rows[i], prev = i > 0 ? rows[i - 1] : null;
      if (prev) {
        var currentUser = current.classList.contains('me') ? 'me' : 'them';
        var prevUser = prev.classList.contains('me') ? 'me' : 'them';
        current.style.marginTop = (currentUser === prevUser) ? '3px' : '6px';
      } else {
        current.style.marginTop = '0';
      }
    }
  }

  function loadInitial() {
    fetch(SCRIPT_URL + '?action=getMessages&offset=0&limit=' + PAGE_SIZE)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) return;
        offset = res.messages.length; hasMore = res.hasMore;
        O.style.display = hasMore ? 'block' : 'none';
        renderBatch(res.messages, 'append');
        setTimeout(pollNew, 1000);
        setInterval(pollNew, POLL_MS);
      }).catch(function (e) { console.error('Load error:', e); });
  }

  function loadOlder() {
    if (!hasMore) return;
    O.textContent = 'Loading...';
    fetch(SCRIPT_URL + '?action=getMessages&offset=' + offset + '&limit=' + PAGE_SIZE)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) return;
        offset += res.messages.length; hasMore = res.hasMore;
        O.textContent = 'Load older messages';
        O.style.display = hasMore ? 'block' : 'none';
        renderBatch(res.messages, 'prepend');
      }).catch(function (e) { console.error('Load older error:', e); });
  }

  function pollNew() {
    fetch(SCRIPT_URL + '?action=getMessages&since=' + newestTimestamp)
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok || !res.messages.length) return;
        var fresh = res.messages.filter(function (m) { return !loadedIds[m.id]; });
        if (!fresh.length) return;
        var wasAtBottom = M.scrollTop + M.clientHeight >= M.scrollHeight - 30;
        renderBatch(fresh, 'append');
        offset += fresh.length;
        if (wasAtBottom) M.scrollTop = M.scrollHeight;
      }).catch(function (e) { console.error('Poll error:', e); });
  }

  function doSend(text) {
    var name = getUserName(), userId = getUserId();
    S.disabled = true;
    var reqBody = new URLSearchParams();
    reqBody.set('action', 'send'); reqBody.set('name', name); reqBody.set('message', text); reqBody.set('userId', userId);
    fetch(SCRIPT_URL, { method: 'POST', body: reqBody })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        S.disabled = false;
        if (res.ok) { renderBatch([res.data], 'append'); offset += 1; M.scrollTop = M.scrollHeight; }
      }).catch(function (e) { S.disabled = false; console.error('Send error:', e); });
  }

  function handleSendClick() {
    var text = I.value.trim();
    if (!text) return;
    if (!getUserName()) { pendingText = text; N.style.display = 'flex'; NI.focus(); return; }
    I.value = ''; doSend(text);
  }

  NO.addEventListener('click', function () {
    var n = NI.value.trim();
    if (!n) return;
    setUserName(n); N.style.display = 'none';
    if (pendingText) { I.value = ''; doSend(pendingText); pendingText = null; }
  });
  NI.addEventListener('keydown', function (e) { if (e.key === 'Enter') NO.click(); });
  S.addEventListener('click', handleSendClick);
  I.addEventListener('keydown', function (e) { if (e.key === 'Enter') handleSendClick(); });
  O.addEventListener('click', loadOlder);

  loadInitial();
})();

