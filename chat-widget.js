// ============================================================
// CHAT WIDGET - Standalone JavaScript
// For Blogger / Any Website
// ============================================================

(function() {
    'use strict';

    // ==================== CONFIG ====================
    var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwRRoALYWJ5wD0Sv2JotoXNsn5AR6oHYEYhdbcejV8OX8m5njNsuANcHEKurM_ZlHxj/exec';
    var PAGE_SIZE = 30;
    var POLL_MS = 4000;
    var colorPalette = ['#FF6B6B','#4ECDC4','#FFD93D','#6C5CE7','#A8E6CF','#FF8A5C','#74B9FF','#FD79A8','#00B894','#E17055','#0984E3','#FDCB6E','#E84393','#00CEC9','#D63031','#6AB04C','#EB4D4B','#F0932B','#4834D4','#22A6B3'];

    // ==================== HELPERS ====================
    function getColorIndex(name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash) % colorPalette.length;
    }

    function getUserId() {
        var id = localStorage.getItem('cw_userId');
        if (!id) {
            id = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem('cw_userId', id);
        }
        return id;
    }

    function getUserName() {
        return localStorage.getItem('cw_userName');
    }

    function setUserName(n) {
        localStorage.setItem('cw_userName', n);
    }

    function esc(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function formatDate(dateStr) {
        var parts = dateStr.split('-');
        if (parts.length === 3) {
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var day = parseInt(parts[2]);
            var month = months[parseInt(parts[1]) - 1];
            var year = parts[0];
            return day + ' ' + month + ' ' + year;
        }
        return dateStr;
    }

    function formatTime(timestamp) {
        var d = new Date(timestamp);
        var h = d.getHours(),
            m = d.getMinutes();
        var ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    function getMessageColor(name) {
        var index = getColorIndex(name);
        return colorPalette[index];
    }

    // ==================== CREATE HTML ====================
    function buildWidget() {
        var container = document.createElement('div');
        container.id = 'cw-root';
        container.innerHTML = `
            <div id="cw-box">
                <div id="cw-header">
                    <span id="cw-dot"></span>
                    <span>Live Chat</span>
                </div>
                <div id="cw-messages">
                    <div id="cw-loadOlder">Load older messages</div>
                    <div id="cw-list"></div>
                </div>
                <div id="cw-inputRow">
                    <input id="cw-input" type="text" placeholder="Type your message" maxlength="1000" autocomplete="off"/>
                    <button id="cw-send">Send</button>
                </div>
            </div>
            <div id="cw-nameOverlay">
                <div id="cw-nameCard">
                    <h3>Your name?</h3>
                    <p>We'll remember it on this browser.</p>
                    <input id="cw-nameInput" type="text" placeholder="Your name" maxlength="40"/>
                    <button id="cw-nameOk">Continue</button>
                </div>
            </div>
        `;

        // ==================== STYLES ====================
        var styles = document.createElement('style');
        styles.textContent = `
            #cw-root *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
            #cw-box{max-width:480px;margin:20px auto;border-radius:20px;overflow:hidden;background:rgba(255,255,255,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.3);box-shadow:0 20px 60px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.6);display:flex;flex-direction:column;height:600px}
            #cw-header{background:linear-gradient(135deg,rgba(106,90,205,0.9),rgba(75,108,183,0.9));backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,0.2);color:#fff;padding:14px 18px;font-weight:700;font-size:15px;display:flex;align-items:center;gap:10px}
            #cw-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block;box-shadow:0 0 12px rgba(74,222,128,0.6);animation:pulse 2s infinite}
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
            #cw-messages{flex:1;overflow-y:auto;padding:10px 14px;background:rgba(240,242,247,0.3);display:flex;flex-direction:column;gap:2px}
            #cw-messages::-webkit-scrollbar{display:none}
            #cw-messages{scrollbar-width:none;-ms-overflow-style:none}
            #cw-loadOlder{text-align:center;color:#6a5acd;font-size:11px;font-weight:600;cursor:pointer;padding:5px;display:none;background:rgba(106,90,205,0.08);border-radius:10px;margin-bottom:4px;backdrop-filter:blur(4px);border:1px solid rgba(106,90,205,0.08);transition:all 0.3s}
            #cw-loadOlder:hover{background:rgba(106,90,205,0.15);transform:scale(1.02)}
            .cw-date-divider{text-align:center;margin:8px 0 6px}
            .cw-date-divider span{background:rgba(223,228,242,0.7);backdrop-filter:blur(8px);color:#444;font-size:11px;font-weight:600;padding:3px 14px;border-radius:16px;display:inline-block;border:1px solid rgba(255,255,255,0.5);box-shadow:0 2px 6px rgba(0,0,0,0.04)}
            .cw-row{display:flex;margin:2px 0;animation:fadeIn 0.2s ease;justify-content:flex-start}
            @keyframes fadeIn{from{opacity:0;transform:translateY(4px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
            .cw-row.me{justify-content:flex-end}
            .cw-row.them{justify-content:flex-start}
            .cw-bubble{max-width:78%;padding:5px 12px;border-radius:14px;font-size:13px;line-height:1.3;word-wrap:break-word;box-shadow:0 2px 12px rgba(0,0,0,0.05);position:relative;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.2);transition:all 0.3s}
            .cw-row.me .cw-bubble{background:rgba(106,90,205,0.15);color:#4a3a8a;border-bottom-right-radius:3px}
            .cw-row.them .cw-bubble{background:rgba(255,255,255,0.2);color:#333;border-bottom-left-radius:3px}
            .cw-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;gap:10px}
            .cw-name{font-size:10px;font-weight:700;opacity:0.8;letter-spacing:0.1px}
            .cw-row.me .cw-name{color:#4a3a8a}
            .cw-row.them .cw-name{color:#6a5acd}
            .cw-time{font-size:8.5px;opacity:0.5;white-space:nowrap;font-weight:500}
            .cw-row.me .cw-time{color:#4a3a8a}
            .cw-row.them .cw-time{color:#666}
            .cw-msg-text{word-break:break-word;margin-top:1px;font-weight:400;font-size:12.5px}
            .cw-row.me .cw-msg-text{color:#2d1f6e}
            .cw-row.them .cw-msg-text{color:#222}
            #cw-inputRow{display:flex;gap:8px;padding:10px 14px;background:rgba(255,255,255,0.8);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.3)}
            #cw-input{flex:1;border:1px solid rgba(224,228,238,0.6);border-radius:20px;padding:10px 16px;font-size:12.5px;outline:none;background:rgba(255,255,255,0.4);backdrop-filter:blur(4px);transition:all 0.3s}
            #cw-input:focus{border-color:#6a5acd;background:rgba(255,255,255,0.7);box-shadow:0 0 0 3px rgba(106,90,205,0.08)}
            #cw-send{background:linear-gradient(135deg,#6a5acd,#5a4abd);color:#fff;border:none;border-radius:20px;padding:0 20px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.3s;box-shadow:0 3px 12px rgba(106,90,205,0.2)}
            #cw-send:hover{transform:scale(1.04);box-shadow:0 4px 18px rgba(106,90,205,0.3)}
            #cw-send:active{transform:scale(0.95)}
            #cw-send:disabled{opacity:0.5;cursor:default;transform:none}
            #cw-nameOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);align-items:center;justify-content:center;z-index:9999}
            #cw-nameCard{background:rgba(255,255,255,0.9);backdrop-filter:blur(20px);padding:28px 24px;border-radius:22px;max-width:320px;width:92%;text-align:center;border:1px solid rgba(255,255,255,0.3);box-shadow:0 30px 80px rgba(0,0,0,0.2)}
            #cw-nameCard h3{margin:0 0 4px;font-size:18px;color:#222;font-weight:700}
            #cw-nameCard p{margin:0 0 14px;font-size:13px;color:#666}
            #cw-nameInput{width:100%;padding:10px 14px;border-radius:12px;border:1px solid rgba(221,221,221,0.5);font-size:14px;margin-bottom:12px;outline:none;background:rgba(255,255,255,0.6);backdrop-filter:blur(4px);transition:all 0.3s}
            #cw-nameInput:focus{border-color:#6a5acd;box-shadow:0 0 0 3px rgba(106,90,205,0.1)}
            #cw-nameOk{width:100%;background:linear-gradient(135deg,#6a5acd,#5a4abd);color:#fff;border:none;border-radius:12px;padding:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 3px 12px rgba(106,90,205,0.3);transition:all 0.3s}
            #cw-nameOk:hover{transform:scale(1.02);box-shadow:0 4px 18px rgba(106,90,205,0.4)}
        `;

        // Add everything to the page
        var target = document.currentScript ? document.currentScript.parentNode : document.body;
        target.appendChild(styles);
        target.appendChild(container);

        // ==================== INIT CHAT ====================
        initChat();
    }

    // ==================== CHAT LOGIC ====================
    function initChat() {
        var L = document.getElementById('cw-list');
        var M = document.getElementById('cw-messages');
        var O = document.getElementById('cw-loadOlder');
        var I = document.getElementById('cw-input');
        var S = document.getElementById('cw-send');
        var N = document.getElementById('cw-nameOverlay');
        var NI = document.getElementById('cw-nameInput');
        var NO = document.getElementById('cw-nameOk');

        var offset = 0,
            hasMore = false,
            loadedIds = {},
            newestTimestamp = 0,
            pendingText = null;

        // ==================== RENDER ====================
        function renderBatch(messages, mode) {
            var ordered = messages.slice().reverse();
            var frag = document.createDocumentFragment();
            var lastDate = null;

            ordered.forEach(function(m) {
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
                    bubble.style.background = msgColor + '22';
                    bubble.style.borderColor = msgColor + '44';
                    bubble.querySelector('.cw-name').style.color = msgColor;
                } else {
                    bubble.style.background = 'rgba(106,90,205,0.12)';
                    bubble.style.borderColor = 'rgba(106,90,205,0.25)';
                    bubble.querySelector('.cw-name').style.color = '#6a5acd';
                }

                row.appendChild(bubble);
                frag.appendChild(row);

                if (m.timestamp > newestTimestamp) newestTimestamp = m.timestamp;
            });

            if (mode === 'prepend') {
                var oldScrollHeight = M.scrollHeight;
                L.insertBefore(frag, L.firstChild);
                mergeAdjacentDateDividers();
                M.scrollTop = M.scrollHeight - oldScrollHeight;
            } else {
                L.appendChild(frag);
                mergeAdjacentDateDividers();
                M.scrollTop = M.scrollHeight;
            }
        }

        function mergeAdjacentDateDividers() {
            var dividers = L.querySelectorAll('.cw-date-divider');
            for (var i = 0; i < dividers.length - 1; i++) {
                var a = dividers[i],
                    b = dividers[i + 1];
                if (a.nextElementSibling === b && a.textContent === b.textContent) {
                    b.remove();
                }
            }
        }

        // ==================== API CALLS ====================
        function loadInitial() {
            fetch(SCRIPT_URL + '?action=getMessages&offset=0&limit=' + PAGE_SIZE)
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (!res.ok) return;
                    offset = res.messages.length;
                    hasMore = res.hasMore;
                    O.style.display = hasMore ? 'block' : 'none';
                    renderBatch(res.messages, 'append');
                    setTimeout(pollNew, 1000);
                    setInterval(pollNew, POLL_MS);
                })
                .catch(function(e) { console.error('Load error:', e); });
        }

        function loadOlder() {
            if (!hasMore) return;
            O.textContent = 'Loading...';
            fetch(SCRIPT_URL + '?action=getMessages&offset=' + offset + '&limit=' + PAGE_SIZE)
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (!res.ok) return;
                    offset += res.messages.length;
                    hasMore = res.hasMore;
                    O.textContent = 'Load older messages';
                    O.style.display = hasMore ? 'block' : 'none';
                    renderBatch(res.messages, 'prepend');
                })
                .catch(function(e) { console.error('Load older error:', e); });
        }

        function pollNew() {
            fetch(SCRIPT_URL + '?action=getMessages&since=' + newestTimestamp)
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    if (!res.ok || !res.messages.length) return;
                    var fresh = res.messages.filter(function(m) { return !loadedIds[m.id]; });
                    if (!fresh.length) return;
                    var wasAtBottom = M.scrollTop + M.clientHeight >= M.scrollHeight - 30;
                    renderBatch(fresh, 'append');
                    offset += fresh.length;
                    if (wasAtBottom) M.scrollTop = M.scrollHeight;
                })
                .catch(function(e) { console.error('Poll error:', e); });
        }

        // ==================== SEND ====================
        function doSend(text) {
            var name = getUserName(),
                userId = getUserId();
            S.disabled = true;
            var body = new URLSearchParams();
            body.set('action', 'send');
            body.set('name', name);
            body.set('message', text);
            body.set('userId', userId);

            fetch(SCRIPT_URL, { method: 'POST', body: body })
                .then(function(r) { return r.json(); })
                .then(function(res) {
                    S.disabled = false;
                    if (res.ok) {
                        renderBatch([res.data], 'append');
                        offset += 1;
                        M.scrollTop = M.scrollHeight;
                    }
                })
                .catch(function(e) {
                    S.disabled = false;
                    console.error('Send error:', e);
                });
        }

        function handleSendClick() {
            var text = I.value.trim();
            if (!text) return;
            if (!getUserName()) {
                pendingText = text;
                N.style.display = 'flex';
                NI.focus();
                return;
            }
            I.value = '';
            doSend(text);
        }

        // ==================== EVENT LISTENERS ====================
        NO.addEventListener('click', function() {
            var n = NI.value.trim();
            if (!n) return;
            setUserName(n);
            N.style.display = 'none';
            if (pendingText) {
                I.value = '';
                doSend(pendingText);
                pendingText = null;
            }
        });

        NI.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') NO.click();
        });

        S.addEventListener('click', handleSendClick);
        I.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') handleSendClick();
        });
        O.addEventListener('click', loadOlder);

        // ==================== START ====================
        loadInitial();
    }

    // ==================== AUTO-START ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }

})();
