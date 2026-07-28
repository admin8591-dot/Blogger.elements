/* ==========================================================
   Easy Notes — Sticky Side Widget (v2)
   Host on GitHub, then add ONE line in Blogger before </body>:

   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/easy-notes.js"></script>

   Flow:
   1) Bar sits fixed on the right edge, visible immediately, no
      looping animation.
   2) After 5s, a small pointer fades in and "taps" the bar —
      one-time motion-graphic style demo.
   3) The wedge (panel) opens showing the notes list, but only
      3 items are visible at a time (scrollable). A short
      auto-scroll demo shows there's more, then settles back.
   4) EVERYTHING in the widget (bar + every note) redirects to
      the single link below.
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
    top:40%;
    right:0;
    transform:translateY(-50%);
    z-index:99999;
    display:flex;
    flex-direction:row-reverse;
    align-items:flex-start;
    font-family:'Poppins',Arial,sans-serif;
  }

  /* ---- sticky vertical bar (visible immediately, static) ---- */
  #enBar{
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
    position:relative;
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
  /* one-time shine sweep across the bar during the demo tap */
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

  /* ---- pointer / tap indicator (one-time demo, local to widget) ---- */
  #enPointer{
    position:absolute;
    top:50%;
    right:40px;
    transform:translateY(-50%) translateX(14px) scale(.6);
    font-size:22px;
    opacity:0;
    pointer-events:none;
    filter:drop-shadow(0 3px 5px rgba(0,0,0,.35));
    transition:opacity .35s ease, transform .35s ease;
  }
  #enPointer.show{
    opacity:1;
    transform:translateY(-50%) translateX(0) scale(1);
  }
  #enPointer.tap{
    animation:enTap .35s ease-in-out;
  }
  @keyframes enTap{
    0%{transform:translateY(-50%) translateX(0) scale(1);}
    50%{transform:translateY(-50%) translateX(-4px) scale(.82);}
    100%{transform:translateY(-50%) translateX(0) scale(1);}
  }
  .enRipple{
    position:absolute;
    top:50%;left:0;
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

  /* ---- flyout wedge panel ---- */
  #enPanel{
    width:0;
    overflow:hidden;
    background:#fff;
    border-radius:14px 0 0 14px;
    box-shadow:-5px 8px 20px rgba(0,0,0,.28);
    opacity:0;
    transition:width .5s cubic-bezier(.4,0,.2,1), opacity .35s ease;
  }
  #enPanel.open{
    width:230px;
    opacity:1;
  }
  #enPanelInner{
    width:230px;
    padding:10px 10px 8px;
  }
  #enPanelHead{
    font-size:12px;
    font-weight:700;
    color:#5f0fdc;
    letter-spacing:.3px;
    margin-bottom:6px;
    padding-bottom:6px;
    border-bottom:1px solid #eee;
  }

  /* only 3 items visible — fixed height, rest scrolls */
  #enList{
    list-style:none;
    margin:0;padding:0;
    display:flex;
    flex-direction:column;
    gap:6px;
    height:84px;        /* ~3 items (24px) + 2 gaps (6px) */
    overflow-y:auto;
    scroll-behavior:smooth;
    scrollbar-width:thin;
    scrollbar-color:#c9b6f7 #f4f0fc;
  }
  #enList::-webkit-scrollbar{width:4px;}
  #enList::-webkit-scrollbar-thumb{background:#c9b6f7;border-radius:4px;}

  .enItem{
    flex:0 0 24px;
    height:24px;
  }
  .enItem a{
    display:flex;
    align-items:center;
    height:100%;
    padding:0 8px;
    font-size:11.5px;
    font-weight:500;
    color:#333;
    text-decoration:none;
    background:#f7f4ff;
    border-radius:7px;
    box-shadow:0 1px 3px rgba(0,0,0,.06);
    transition:background .2s ease, box-shadow .2s ease, transform .15s ease;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .enItem a:hover{
    background:#efe4ff;
    color:#5f0fdc;
    box-shadow:0 3px 8px rgba(95,15,220,.18);
    transform:translateX(-2px);
  }

  /* bouncing scroll hint, shown briefly to indicate more items */
  #enScrollHint{
    display:flex;
    justify-content:center;
    margin-top:4px;
    font-size:11px;
    color:#a98af0;
    opacity:0;
    transition:opacity .3s ease;
  }
  #enScrollHint.show{
    opacity:1;
    animation:enBounce 1.1s ease-in-out 3;
  }
  @keyframes enBounce{
    0%,100%{transform:translateY(0);}
    50%{transform:translateY(3px);}
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
    '</a>' +
    '<div id="enPanel">' +
      '<div id="enPanelInner">' +
        '<div id="enPanelHead">Easy Notes</div>' +
        '<ul id="enList">' + itemsHtml + '</ul>' +
        '<div id="enScrollHint">▾ scroll for more</div>' +
      '</div>' +
    '</div>' +
    '<div id="enPointer">👉</div>' +
    '<div class="enRipple" id="enRipple"></div>';

  document.body.appendChild(wrap);

  /* ---------- 4. ONE-TIME DEMO SEQUENCE (after 5s) ---------- */
  var bar     = document.getElementById('enBar');
  var panel   = document.getElementById('enPanel');
  var list    = document.getElementById('enList');
  var pointer = document.getElementById('enPointer');
  var ripple  = document.getElementById('enRipple');
  var hint    = document.getElementById('enScrollHint');

  setTimeout(function(){
    // pointer fades in next to the bar
    pointer.classList.add('show');

    setTimeout(function(){
      // pointer "taps"
      pointer.classList.add('tap');
      ripple.classList.add('play');
      bar.classList.add('demoTap');
    }, 500);

    setTimeout(function(){
      // wedge opens
      panel.classList.add('open');
    }, 850);

    setTimeout(function(){
      // pointer fades away, no longer needed
      pointer.classList.remove('show');
    }, 1300);

    setTimeout(function(){
      // show scroll hint + gentle auto-scroll demo (down then back)
      hint.classList.add('show');
      list.scrollTop = 48; // reveal item 4 & 5 partially
    }, 1600);

    setTimeout(function(){
      list.scrollTop = 0; // settle back to top 3 items
      hint.classList.remove('show');
    }, 2600);

  }, 5000);
})();

