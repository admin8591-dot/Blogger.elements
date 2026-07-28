/* ==========================================================
   Easy Notes — Sticky Side Widget (v7)
   Click anywhere → redirect to link
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
  var WEDGE_WIDTH = "200px";

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
    flex-shrink:0;
    transition:box-shadow .3s ease;
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
    pointer-events:none;
  }

  /* ---- WEDGE - Smooth popup animation (small to normal) ---- */
  #enPanel{
    width:0;
    overflow:hidden;
    background:linear-gradient(160deg,${COLORS.wedgeTop},${COLORS.wedgeMid} 60%,${COLORS.wedgeBottom});
    border-radius:22px 22px 22px 22px;
    box-shadow:-6px 10px 28px rgba(196,30,30,.45), 0 3px 10px rgba(0,0,0,.25);
    opacity:0;
    position:relative;
    transform: scale(0.5) translateX(20px);
    transform-origin: right center;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor:pointer;
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
    transform: scale(1) translateX(0);
  }
  #enPanelInner{
    width: ${WEDGE_WIDTH};
    padding:12px 12px 10px;
    position:relative;
    pointer-events:none;
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
    pointer-events:none;
  }
  #enPanelHead a{
    color:${COLORS.textLight};
    text-decoration:none;
    display:block;
    pointer-events:none;
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
    pointer-events:none;
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
    pointer-events:none;
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
    '<div id="enBar">' +
      '<span class="enBarText">Easy Notes</span>' +
    '</div>' +
    '<div id="enPanel">' +
      '<div id="enPanelInner">' +
        '<div id="enPanelHead">📋 Easy Notes</div>' +
        '<ul id="enList">' + itemsHtml + '</ul>' +
      '</div>' +
    '</div>';

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

  /* ---------- 5. REDIRECT FUNCTION ---------- */
  function redirectToLink(e) {
    e.preventDefault();
    window.location.href = REDIRECT_LINK;
  }

  /* ---------- 6. AUTO SEQUENCE: After 6s popup, scroll, auto-close ---------- */
  var panel = document.getElementById('enPanel');
  var list = document.getElementById('enList');
  var bar = document.getElementById('enBar');

  // After 6 seconds, open with smooth popup animation
  setTimeout(function(){
    panel.classList.add('open');
  }, 6000);

  // After popup, scroll through notes
  setTimeout(function(){
    var maxScroll = list.scrollHeight - list.clientHeight;
    if (maxScroll > 0) {
      smoothScrollTo(list, maxScroll, 2500);
    }
  }, 7000);

  // Auto-close after scroll completes
  setTimeout(function(){
    panel.classList.remove('open');
  }, 10000);

  // Reset scroll position after closing
  setTimeout(function(){
    list.scrollTop = 0;
  }, 10500);

  /* ---------- 7. CLICK ANYWHERE → REDIRECT ---------- */
  // Click on bar redirects
  bar.addEventListener('click', redirectToLink);

  // Click on panel (wedge) redirects
  panel.addEventListener('click', redirectToLink);

  // Click on individual note items also redirect (if any direct clicks)
  document.querySelectorAll('.enItem a').forEach(function(el) {
    el.addEventListener('click', redirectToLink);
  });

})();
