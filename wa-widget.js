/* ==========================================================
   WhatsApp Group Floating Widget
   Host this file on GitHub (raw / jsDelivr) and add ONE line
   in Blogger theme, just before </body>:

   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/wa-widget.js"></script>

   (replace USERNAME/REPO with your actual GitHub repo path)
   ========================================================== */
(function(){
  var WA_LINK = "https://chat.whatsapp.com/LD6zYjDYjj2Kuw5C9sMOyD?s=cl&p=a&ilr=4";

  /* ---------- 1. INJECT CSS ---------- */
  var css = `
  .wa-widget{position:fixed;left:20px;bottom:20px;z-index:99999;transform:translateY(220%);opacity:0;}
  .wa-widget.enter{animation:waRiseUp .8s cubic-bezier(.34,1.56,.64,1) forwards;}
  @keyframes waRiseUp{0%{transform:translateY(220%);opacity:0;}60%{opacity:1;}100%{transform:translateY(0);opacity:1;}}
  .wa-widget.oscillate .wa-btn{animation:waOscillate .6s ease-in-out 1;}
  @keyframes waOscillate{0%,100%{transform:scale(1);}25%{transform:scale(1.12,.88);}50%{transform:scale(.92,1.08);}75%{transform:scale(1.05,.95);}}

  .wa-btn{position:relative;height:56px;width:56px;border-radius:50%;
    background:linear-gradient(145deg,#8b5cf6,#6d28d9);
    box-shadow:0 6px 18px rgba(109,40,217,.45);
    display:flex;align-items:center;justify-content:flex-start;overflow:hidden;
    cursor:pointer;user-select:none;font-family:'Segoe UI',Arial,sans-serif;
    transition:width .6s cubic-bezier(.4,0,.2,1),border-radius .6s cubic-bezier(.4,0,.2,1),box-shadow .6s cubic-bezier(.4,0,.2,1);}
  .wa-btn.expand{width:230px;border-radius:28px;box-shadow:0 10px 28px rgba(109,40,217,.55);}
  .wa-btn.squared{width:52px;border-radius:14px;box-shadow:0 6px 16px rgba(109,40,217,.5);}
  .wa-btn.final-pulse{animation:waPulseGlow 2.4s ease-in-out infinite;}
  @keyframes waPulseGlow{0%,100%{box-shadow:0 6px 16px rgba(139,92,246,.4);}50%{box-shadow:0 6px 24px rgba(139,92,246,.85);}}

  .wa-shine{position:absolute;top:0;left:-60%;width:40%;height:100%;
    background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.35) 50%,rgba(255,255,255,0) 100%);
    transform:skewX(-20deg);opacity:0;pointer-events:none;}
  .wa-btn.expand .wa-shine{animation:waSweep 1s ease-in-out .2s;}
  @keyframes waSweep{0%{left:-60%;opacity:0;}15%{opacity:1;}85%{opacity:1;}100%{left:120%;opacity:0;}}

  .wa-icon{flex:0 0 56px;height:56px;width:56px;display:flex;align-items:center;justify-content:center;font-size:24px;line-height:1;transition:opacity .3s ease;}
  .wa-btn.squared .wa-icon{opacity:0;width:0;flex-basis:0;}

  .wa-bell{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;font-size:22px;line-height:1;opacity:0;transform:scale(.4) rotate(-20deg);transition:opacity .35s ease,transform .35s ease;}
  .wa-bell.show{opacity:1;transform:scale(1) rotate(0deg);}
  .wa-bell.ring{animation:waRingBell .8s ease-in-out;}
  @keyframes waRingBell{0%,100%{transform:rotate(0);}20%{transform:rotate(18deg);}40%{transform:rotate(-15deg);}60%{transform:rotate(10deg);}80%{transform:rotate(-6deg);}}

  .wa-text{white-space:nowrap;color:#fff;font-size:14px;font-weight:600;padding-right:16px;opacity:0;transform:translateX(10px);transition:opacity .35s ease .15s,transform .35s ease .15s;}
  .wa-btn.expand .wa-text{opacity:1;transform:translateX(0);}

  .wa-spin{position:absolute;top:50%;left:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;border:3px solid transparent;border-top-color:#fff;border-right-color:rgba(255,255,255,.6);opacity:0;pointer-events:none;}
  .wa-btn.shrink .wa-spin{opacity:1;animation:waSpinRing .7s linear;}
  @keyframes waSpinRing{0%{transform:rotate(0deg);opacity:1;}100%{transform:rotate(720deg);opacity:0;}}

  .wa-cursor{position:fixed;left:120px;bottom:120px;width:26px;height:26px;z-index:100000;opacity:0;pointer-events:none;}
  .wa-cursor svg{width:100%;height:100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5));}
  .wa-cursor.move{animation:waCursorMove 1.1s ease-in-out forwards;}
  @keyframes waCursorMove{0%{opacity:0;left:140px;bottom:170px;}15%{opacity:1;}60%{left:46px;bottom:46px;opacity:1;transform:scale(1);}75%{left:46px;bottom:46px;transform:scale(.72);}90%{left:46px;bottom:46px;transform:scale(1);}100%{left:46px;bottom:46px;opacity:0;transform:scale(1);}}

  .wa-ripple{position:fixed;left:46px;bottom:46px;width:10px;height:10px;border-radius:50%;border:2px solid #fff;z-index:99998;opacity:0;pointer-events:none;}
  .wa-ripple.play{animation:waRippleOut .5s ease-out;}
  @keyframes waRippleOut{0%{opacity:.9;width:10px;height:10px;margin:0 0 0 0;}100%{opacity:0;width:70px;height:70px;margin:-30px 0 0 -30px;}}
  `;
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. INJECT HTML ---------- */
  var wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="wa-widget" id="waWidget">
      <div class="wa-btn" id="waBtn">
        <div class="wa-shine"></div>
        <div class="wa-icon">💬</div>
        <div class="wa-text">Join WhatsApp Group</div>
        <div class="wa-bell" id="waBell">🔔</div>
        <div class="wa-spin"></div>
      </div>
    </div>
    <div class="wa-cursor" id="waCursor">
      <svg viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="0.5" d="M4 2l14 8-6 2-2 6z"/></svg>
    </div>
    <div class="wa-ripple" id="waRipple"></div>
  `;
  document.body.appendChild(wrap);

  /* ---------- 3. WIRE UP BEHAVIOUR ---------- */
  var widget = document.getElementById('waWidget');
  var btn    = document.getElementById('waBtn');
  var cursor = document.getElementById('waCursor');
  var ripple = document.getElementById('waRipple');
  var bell   = document.getElementById('waBell');

  btn.addEventListener('click', function(){
    window.open(WA_LINK, '_blank');
  });

  function run(){
    widget.classList.add('enter');
    setTimeout(function(){ widget.classList.add('oscillate'); }, 800);
    setTimeout(function(){ cursor.classList.add('move'); }, 1500);
    setTimeout(function(){ ripple.classList.add('play'); }, 2200);
    setTimeout(function(){ btn.classList.add('expand'); }, 2350);
    setTimeout(function(){
      btn.classList.remove('expand');
      btn.classList.add('shrink','squared');
    }, 3550);
    setTimeout(function(){
      btn.classList.remove('shrink');
      bell.classList.add('show','ring');
      btn.classList.add('final-pulse');
    }, 4300);
    setTimeout(function(){
      cursor.classList.remove('move');
      ripple.classList.remove('play');
      bell.classList.remove('ring');
    }, 5200);
  }

  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run);
})();
