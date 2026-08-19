// ============================================================
// CHAT WIDGET - Complete JavaScript File
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
        var h = d.getHours();
        var m = d.getMinutes();
        var ampm = h >= 12 ? 'pm' : 'am';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    function getMessageColor(name) {
        var index = getColorIndex(name);
        return colorPalette[index];
    }

    // ==================== BUILD WIDGET ====================
    function buildWidget() {
        // Create container
        var container = document.createElement('div');
        container.id = 'cw-root';

        // ===== HTML =====
        container.innerHTML = `
            <div id="cw-box">
                <div id="cw-header">
                    <span id="cw-dot"></span>
                    <span id="cw-title">Get in Touch</span>
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
        `;

        // ===== STYLES =====
        var styles = document.createElement('style');
        styles.textContent = `
            #cw-root *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
            #cw-box{max-width:440px;margin:12px auto;border-radius:16px;overflow:hidden;background:#ffffff;border:2px solid rgba(0,0,0,0.12);box-shadow:0 6px 20px rgba(0,0,0,0.12);display:flex;flex-direction:column;position:relative;transition:all 0.3s ease}
            #cw-header{background:#1a1a1a;color:#fff;padding:8px 14px;font-weight:600;font-size:14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0}
            #cw-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;box-shadow:0 0 8px rgba(74,222,128,0.4);animation:pulse 2s infinite}
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
            #cw-title{flex:1;font-size:13px}
            #cw-toggle-container{display:flex;align-items:center;margin-left:auto}
            #cw-toggle{display:none}
            #cw-toggle-label{width:32px;height:18px;background:#555;border-radius:10px;cursor:pointer;position:relative;transition:background 0.3s ease;flex-shrink:0;border:1px solid rgba(255,255,255,0.15)}
            #cw-toggle-label::after{content:'';position:absolute;top:1.5px;left:1.5px;width:13px;height:13px;background:#fff;border-radius:50%;transition:transform 0.3s ease;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
            #cw-toggle:checked + #cw-toggle-label{background:#4ade80}
            #cw-toggle:checked + #cw-toggle-label::after{transform:translateX(14px)}
            #cw-body{display:flex;flex-direction:column;overflow:hidden;transition:all 0.3s ease}
            #cw-body.cw-hidden{display:none !important}
            #cw-messages{flex:1;overflow-y:auto;padding:8px 12px;background:#f0f2f5;display:flex;flex-direction:column;max-height:400px}
            #cw-messages::-webkit-scrollbar{display:none}
            #cw-messages{scrollbar-width:none;-ms-overflow-style:none}
            #cw-loadOlder{text-align:center;color:#2d2d2d;font-size:10px;font-weight:600;cursor:pointer;padding:4px;display:none;background:rgba(0,0,0,0.03);border-radius:8px;margin-bottom:4px;border:1px solid rgba(0,0,0,0.04);transition:all 0.2s}
            #cw-loadOlder:hover{background:rgba(0,0,0,0.06)}
            .cw-date-divider{text-align:center;margin:6px 0 8px}
            .cw-date-divider span{background:rgba(255,255,255,0.8);color:#666;font-size:10px;font-weight:600;padding:2px 14px;border-radius:12px;display:inline-block;border:1px solid rgba(0,0,0,0.04)}
            .cw-row{display:flex;animation:fadeIn 0.15s ease}
            .cw-row.me{justify-content:flex-end}
            .cw-row.them{justify-content:flex-start}
            @keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
            .cw-bubble{max-width:78%;padding:4px 12px;border-radius:12px;font-size:12.5px;line-height:1.3;word-wrap:break-word;box-shadow:0 1px 4px rgba(0,0,0,0.02);position:relative;transition:all 0.2s}
            .cw-row.me .cw-bubble{color:#fff;border-bottom-right-radius:2px}
            .cw-row.them .cw-bubble{color:#333;border-bottom-left-radius:2px;border:1px solid rgba(0,0,0,0.06)}
            .cw-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1px;gap:8px}
            .cw-name{font-size:9.5px;font-weight:700;letter-spacing:0.1px}
            .cw-row.me .cw-name{color:rgba(255,255,255,0.8)}
            .cw-row.them .cw-name{color:#2d2d2d}
            .cw-time{font-size:8px;opacity:0.4;white-space:nowrap}
            .cw-row.me .cw-time{color:rgba(255,255,255,0.5)}
            .cw-row.them .cw-time{color:#999}
            .cw-msg-text{word-break:break-word;margin-top:0px;font-weight:400;font-size:12px}
            .cw-row.me .cw-msg-text{color:#fff}
            .cw-row.them .cw-msg-text{color:#333}
            #cw-inputRow{display:flex;gap:6px;padding:8px 12px;background:#ffffff;border-top:2px solid rgba(0,0,0,0.06);flex-shrink:0}
            #cw-input{flex:1;border:1px solid rgba(0,0,0,0.08);border-radius:16px;padding:8px 14px;font-size:12px;outline:none;background:#f8f9fc;transition:all 0.2s;color:#333}
            #cw-input:focus{border-color:#2d2d2d;background:#ffffff;box-shadow:0 0 0 2px rgba(0,0,0,0.04)}
            #cw-input::placeholder{color:#aaa;font-size:11.5px}
            #cw-send{background:#2d2d2d;color:#fff;border:none;border-radius:16px;padding:0 16px;font-size:11.5px;font-weight:600;cursor:pointer;transition:all 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
            #cw-send:hover{transform:scale(1.03);background:#1a1a1a;box-shadow:0 3px 12px rgba(0,0,0,0.12)}
            #cw-send:active{transform:scale(0.95)}
            #cw-send:disabled{opacity:0.4;cursor:default;transform:none}
            #cw-nameOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center;z-index:9999}
            #cw-nameCard{background:#ffffff;padding:24px 20px;border-radius:18px;max-width:300px;width:90%;text-align:center;border:2px solid rgba(0,0,0,0.06);box-shadow:0 20px 60px rgba(0,0,0,0.12)}
            #cw-nameCard h3{margin:0 0 2px;font-size:17px;color:#222;font-weight:700}
            #cw-nameCard p{margin:0 0 12px;font-size:12.5px;color:#888}
            #cw-nameInput{width:100%;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.08);font-size:13px;margin-bottom:10px;outline:none;background:#f8f9fc;transition:all 0.2s;color:#333}
            #cw-nameInput:focus{border-color:#2d2d2d;box-shadow:0 0 0 2px rgba(0,0,0,0.04)}
            #cw-nameOk{width:100%;background:#2d2d2d;color:#fff;border:none;border-radius:10px;padding:9px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.08);transition:all 0.2s}
            #cw-nameOk:hover{transform:scale(1.02);background:#1a1a1a;box-shadow:0 3px 16px rgba(0,0,0,0.12)}
        `;

        // Add to page
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
        var toggle = document.getElementById('cw-toggle');
        var body = document.getElementById('cw-body');

        var offset = 0;
        var hasMore = false;
        var loadedIds = {};
        var newestTimestamp = 0;
        var pendingText = null;

        // ===== TOGGLE =====
        toggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.remove('cw-hidden');
            } else {
                body.classList.add('cw-hidden');
            }
        });

        // ===== RENDER =====
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
                    bubble.style.background = 'linear-gradient(135deg,#4a6cf7,#6a3de8)';
                    bubble.style.borderColor = 'none';
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
                var current = rows[i];
                var prev = i > 0 ? rows[i - 1] : null;
                if (prev) {
                    var currentUser = current.classList.contains('me') ? 'me' : 'them';
                    var prevUser = prev.classList.contains('me') ? 'me' : 'them';
                    if (currentUser === prevUser) {
                        current.style.marginTop = '3px';
                    } else {
                        current.style.marginTop = '5px';
                    }
                } else {
                    current.style.marginTop = '0';
                }
            }
        }

        // ===== API =====
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

        // ===== SEND =====
        function doSend(text) {
            var name = getUserName();
            var userId = getUserId();
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

        // ===== EVENTS =====
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

        loadInitial();
    }

    // ==================== AUTO-START ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }

})();
