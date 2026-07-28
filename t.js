/* ==========================================================
   Easy Notes — Sticky Side Widget (v5)
   Fixed: Wedge fully rounded, fixed position, 45° open
   Easy color & text customization
   ========================================================== */
(function(){

  /* ==========================================================
     🎨 EASY CUSTOMIZATION ZONE
     Change colors and text here
     ========================================================== */
  
  // ---- COLORS (change these hex codes) ----
  var COLORS = {
    barTop: "#7b2ff7",        // Bar gradient top
    barBottom: "#5f0fdc",     // Bar gradient bottom
    wedgeTop: "#ff5b5b",      // Wedge gradient top
    wedgeMid: "#c41e1e",      // Wedge gradient middle
    wedgeBottom: "#a30f0f",   // Wedge gradient bottom
    textLight: "#fff",        // White text color
    noteBg: "rgba(255,255,255,.92)",  // Note background
    noteText: "#a30f0f"       // Note text color
  };

  // ---- NOTES (add/remove/edit titles here) ----
  var NOTES = [
    "Liver Function Tests",
    "Culture Media",
    "Colorimeter (Beer's & Lambert's Law)",
    "Morphology of Bacteria",
    "Lipid Profile Tests",
    "Fat Soluble Vitamins",
    "PT/INR Test",
    "Urine Examination"
  ];

  // ---- REDIRECT LINK ----
  var REDIRECT_LINK = "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1";

  // ---- WEDGE WIDTH ----
  var WEDGE_WIDTH = "200px"; // Make this smaller for shorter wedge

  /* ==========================================================
     END OF CUSTOMIZATION ZONE
     ========================================================== */

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

  /* ---- sticky vertical bar (NEVER MOVES) ---- */
  #enBar{
    width:32px;
    padding:14px 6px;
    background:linear-gradient(180deg,${COLORS.barTop},${COLORS.barBottom});
    color:${COLORS.textLight};
    border-radius:14px 0 0 14px;
    box-shadow:-5px 8px 20px rgba(0,0,0,.32);
    text-align:center;
    cursor:pointer;
    user-select:none;
    text-decoration:none;
    display:block;
    position:relative;
    overflow:hidden;
    transition:box-shadow .3s ease;
    flex-shrink:0;
  }
  #enBar:hover{
    box-shadow:-7px 12px 26px rgba(0,0,0,.4);
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

  /* ---- pointer ---- */
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

  /* ---- WEDGE - FULLY ROUNDED, NO SHARP EDGES ---- */
  #enPanel{
    width:0;
    overflow:hidden;
    background:linear-gradient(160deg,${COLORS.wedgeTop},${COLORS.wedgeMid} 60%,${COLORS.wedgeBottom});
    border-radius:22px 22px 22px 22px; /* FULLY ROUNDED all corners */
    box-shadow:-6px 10px 28px rgba(196,30,30,.45), 0 3px 10px rgba(0,0,0,.25);
    opacity:0;
    position:relative;
    transition:width .55s cubic-bezier(.4,0,.2,1), opacity .35s ease, transform .35s ease;
    transform-origin: right center;
    /* Position: opens upward at 45° */
    transform: translateY(0) scale(0.95);
  }
  /* glossy top-light sheen */
  #enPanel::before{
    content:"";
    position:absolute;
    top:0;left:0;right:0;
    height:45%;
    background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0));
    pointer-events:none;
    border-radius:22px 22px 0 0;
  }
  #enPanel.open{
    width: ${WEDGE_WIDTH};
    opacity:1;
    transform: translateY(-45%) scale(1); /* Opens upward at 45° angle */
  }
  #enPanelInner{
    width: ${WEDGE_WIDTH};
    padding:12px 12px 10px;
    position:relative;
  }
  #enPanelHead{
    font-size:12px;
    font-weight:700;
    color:${COLORS.textLight};
    letter-spacing:.4px;
    margin-bottom:8px;
    padding-bottom:6px;
    border-bottom:1px solid rgba(255,255,255,.3);
    text-shadow:0 1px 2px rgba(0,0,0,.25);
    cursor:pointer;
  }
  #enPanelHead a{
    color:${COLORS.textLight};
    text-decoration:none;
    display:block;
  }

  /* list container - scrollable */
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
    color:${COLORS.noteText};
    text-decoration:none;
    background:${COLORS.noteBg};
    border-radius:8px;
    box-shadow:0 2px 5px rgba(0,0,0,.15);
    transition:background .2s ease, box-shadow .2s ease, transform .15s ease;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    cursor:pointer;
  }
  .enItem a:hover{
    background:#fff;
    box-shadow:0 4px 10px rgba(0,0,0,.22);
    transform:translateX(-2px);
  }

  /* Click indicator */
  .enItem a::after {
    content: " →";
    font-size: 12px;
    opacity: 0.5;
    margin-left: 4px;
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
        '<div id="enPanelHead"><a href="' + REDIRECT_LINK + '">📋 Easy Notes</a></div>' +
        '<ul id="enList">' + itemsHtml + '</ul>' +
      '</div>' +
    '</div>' +
    '<div id="enPointer">👆</div>' +
    '<div class="enRipple" id="enRipple"></div>';

  document.body.appendChild(wrap);

  /* ---------- 4. SMOOTH SCROLL ---------- */
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

  /* ---------- 5. DEMO SEQUENCE ---------- */
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
      if (maxScroll > 0) {
        smoothScrollTo(list, maxScroll, 2200);
      }
    }, 1700);

    setTimeout(function(){
      panel.classList.remove('open');
    }, 4400);

    setTimeout(function(){
      list.scrollTop = 0;
    }, 5000);

  }, 5000);

  /* ---------- 6. CLICK HANDLING: WEDGE OPENS AT 45° ---------- */
  // Click on "Easy Notes" bar toggles wedge at 45° angle
  document.getElementById('enBar').addEventListener('click', function(e) {
    e.preventDefault();
    panel.classList.toggle('open');
    
    // If opening, reset scroll to top
    if (panel.classList.contains('open')) {
      list.scrollTop = 0;
    }
  });

  // Click on panel header also toggles
  document.querySelector('#enPanelHead a').addEventListener('click', function(e) {
    e.preventDefault();
    panel.classList.toggle('open');
    
    if (panel.classList.contains('open')) {
      list.scrollTop = 0;
    }
  });

})();
