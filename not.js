/* ==========================================================
   Easy Notes — Sticky Side Widget (v4)
   Host on GitHub, then add ONE line in Blogger before </body>:

   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/easy-notes.js"></script>

   Flow:
   1) Bar sits fixed on the right edge, static, no looping animation.
   2) After 5s, a pointer fades in and "taps" the bar (one-time demo).
   3) A red glossy chat-bubble wedge pops up from the bar's top-left
      corner (messenger-style, with a connecting tail) — 3 notes
      visible up front, fully rounded corners, no sharp edges.
   4) It smoothly auto-scrolls all the way through the list.
   5) The wedge then auto-closes back to just the bar.
   6) Everything (bar + every note) redirects to the link below.
   ========================================================== */
(function(){

  /* ---------- EDIT HERE ---------- */
  var REDIRECT_LINK = "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1";

  var NOTES = [
    "Liver Function Tests",
    "Culture Media",
    "Colorimeter (Beer's & Lambert's Law)",
    "Morphology of Bacteria",
    "Lipid Profile Tests",
    "Fat Soluble Vitamins",
    "PT/INR Test",
    "Urine Examination"
    // 👆 add / remove / rename note titles here — all of them
    // link to REDIRECT_LINK above automatically.
  ];

  /* ---------- 1. INJECT CSS ---------- */
  var css = `
  #enWidget *{box-sizing:border-box;}
  #enWidget{
    position:fixed;
    top:calc(40% - 38px);
    right:0;
    transform:translateY(-50%);
    z-index:99999;
    font-family:'Poppins',Arial,sans-serif;
  }

  /* ---- sticky vertical bar ---- */
  #enBar{
    position:relative;
    width:32px;
    padding:14px 6px;
    background:linear-gradient(180deg,#7b2ff7,#5f0fdc);
    color:#fff;
    border-radius:14px 0 0 14px;
    box-shadow:-5px 8px 20px rgba(0,0,0,.32);
    text-align:center;
    cursor:pointer;
    user-select:none;
    text-decoration:none;
    display:block;
    overflow:hidden;
    transition:box-shadow .3s ease, transform .3s ease;
  }
  #enBar:hover{
    box-shadow:-7px 12px 26px rgba(0,0,0,.4);
    transform:translateX(-2px);
  }
  #enBar .enBarText{
    writing-mode:vertical-rl;
    transform:rotate(180deg);
    font-size:12.5px;
    font-weight:600;
    letter-spacing:1px;
    white-space:nowrap;
  }
  #enBar .enShine{
    position:absolute;top:0;left:-70%;width:50%;height:100%;
    background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.4) 50%,rgba(255,255,255,0) 100%);
    transform:skewX(-15deg);
    opacity:0;
    pointer-events:none;
  }
  #enBar.demoTap .enShine{
    animation:enSweep .8s ease-in-out;
  }
  @keyframes enSweep{
    0%{left:-70%;opacity:0;}
    20%{opacity:1;}
    80%{opacity:1;}
    100%{left:130%;opacity:0;}
  }

  /* ---- pointer / tap indicator, anchored near bar's top-left ---- */
  #enPointer{
    position:absolute;
    top:2px;
    right:40px;
    transform:translateX(14px) scale(.6);
    font-size:20px;
    opacity:0;
    pointer-events:none;
    filter:drop-shadow(0 3px 5px rgba(0,0,0,.35));
    transition:opacity .35s ease, transform .35s ease;
  }
  #enPointer.show{
    opacity:1;
    transform:translateX(0) scale(1);
  }
  #enPointer.tap{
    animation:enTap .35s ease-in-out;
  }
  @keyframes enTap{
    0%{transform:translateX(0) scale(1);}
    50%{transform:translateX(-4px) scale(.82);}
    100%{transform:translateX(0) scale(1);}
  }
  .enRipple{
    position:absolute;
    top:2px;left:4px;
    width:10px;height:10px;
    margin:-5px 0 0 -5px;
    border-radius:50%;
    border:2px solid #fff;
    opacity:0;
    pointer-events:none;
  }
  .enRipple.play{
    animation:enRippleOut .55s ease-out;
  }
  @keyframes enRippleOut{
    0%{opacity:.85;width:10px;height:10px;margin:-5px 0 0 -5px;}
    100%{opacity:0;width:60px;height:60px;margin:-30px 0 0 -30px;}
  }

  /* ---- messenger-style chat bubble, popping from bar's top-left ---- */
  #enPanel{
    position:absolute;
    right:26px;                 /* just left of the bar */
    bottom:calc(100% + 14px);   /* pops up ABOVE the bar's top edge */
    width:0;
    overflow:hidden;
    background:linear-gradient(160deg,#ff5b5b,#c41e1e 60%,#a30f0f);
    border-radius:18px;         /* fully rounded — no sharp edges anywhere */
    box-shadow:0 10px 26px rgba(196,30,30,.4), 0 3px 10px rgba(0,0,0,.22);
    opacity:0;
    transition:width .55s cubic-bezier(.4,0,.2,1), opacity .35s ease;
  }
  /* glossy top-light sheen */
  #enPanel::before{
    content:"";
    position:absolute;
    top:0;left:0;right:0;
    height:45%;
    border-radius:18px 18px 0 0;
    background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0));
    pointer-events:none;
  }
  /* connecting tail pointing down toward the bar's top-left corner */
  #enPanel::after{
    content:"";
    position:absolute;
    bottom:-6px;
    right:16px;
    width:14px;height:14px;
    background:#a30f0f;
    transform:rotate(45deg);
    border-radius:3px;
    box-shadow:2px 2px 4px rgba(0,0,0,.12);
  }
  #enPanel.open{
    width:230px;
    opacity:1;
  }
  #enPanelInner{
    width:230px;
    padding:12px 12px 10px;
    position:relative;
  }
  #enPanelHead{
    font-size:12px;
    font-weight:700;
    color:#fff;
    letter-spacing:.4px;
    margin-bottom:8px;
    padding-bottom:6px;
    border-bottom:1px solid rgba(255,255,255,.3);
    text-shadow:0 1px 2px rgba(0,0,0,.25);
  }

  #enList{
    list-style:none;
    margin:0;padding:0;
    display:flex;
    flex-direction:column;
    gap:6px;
    height:84px;
    overflow-y:hidden;
  }

  .enItem{
    flex:0 0 24px;
    height:24px;
  }
  .enItem a{
    display:flex;
    align-items:center;
    height:100%;
    padding:0 10px;
    font-size:11.5px;
    font-weight:600;
    color:#a30f0f;
    text-decoration:none;
    background:rgba(255,255,255,.92);
    border-radius:9px;
    box-shadow:0 2px 5px rgba(0,0,0,.15);
    transition:background .2s ease, box-shadow .2s ease, transform .15s ease;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .enItem a:hover{
    background:#fff;
    box-shadow:0 4px 10px rgba(0,0,0,.22);
    transform:translateX(-2px);
  }
  `;
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. BUILD LIST HTML ---------- */
  var itemsHtml = NOTES.map(function(title){
    return (
      '<li class="enItem">' +
        '<a href="' + REDIRECT_LINK + '">' + title + '</a>' +
      '</li>'
    );
  }).join('');

  /* ---------- 3. INJECT HTML ---------- */
  var wrap = document.createElement('div');
  wrap.id = 'enWidget';
  wrap.innerHTML =
    '<a id="enBar" href="' + REDIRECT_LINK + '">' +
      '<span class="enShine"></span>' +
      '<span class="enBarText">Easy Notes</span>' +
      '<div id="enPointer">👉</div>' +
      '<div class="enRipple" id="enRipple"></div>' +
    '</a>' +
    '<div id="enPanel">' +
      '<div id="enPanelInner">' +
        '<div id="enPanelHead">Easy Notes</div>' +
        '<ul id="enList">' + itemsHtml + '</ul>' +
      '</div>' +
    '</div>';

  document.body.appendChild(wrap);

  /* ---------- 4. SMOOTH MANUAL SCROLL ---------- */
  function smoothScrollTo(el, target, duration){
    var start = el.scrollTop;
    var change = target - start;
    var startTime = null;
    function easeInOutCubic(t){
      return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    }
    function step(ts){
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      el.scrollTop = start + change * easeInOutCubic(progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 5. ONE-TIME DEMO SEQUENCE (after 5s) ---------- */
  var bar     = document.getElementById('enBar');
  var panel   = document.getElementById('enPanel');
  var list    = document.getElementById('enList');
  var pointer = document.getElementById('enPointer');
  var ripple  = document.getElementById('enRipple');

  setTimeout(function(){
    pointer.classList.add('show');

    setTimeout(function(){
      pointer.classList.add('tap');
      ripple.classList.add('play');
      bar.classList.add('demoTap');
    }, 500);

    setTimeout(function(){
      panel.classList.add('open');
    }, 850);

    setTimeout(function(){
      pointer.classList.remove('show');
    }, 1300);

    setTimeout(function(){
      var maxScroll = list.scrollHeight - list.clientHeight;
      smoothScrollTo(list, maxScroll, 2200);
    }, 1700);

    setTimeout(function(){
      panel.classList.remove('open');
    }, 4400);

    setTimeout(function(){
      list.scrollTop = 0;
    }, 5000);

  }, 5000);
})();

