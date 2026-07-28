/* ==========================================================
   Easy Notes — Animated Sticky Side Widget
   Host on GitHub, then add ONE line in Blogger before </body>:

   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/easy-notes.js"></script>

   Flow:
   1) Small green dot pulses on the right edge for the first 5s
   2) Dot morphs into a vertical "Easy Notes" sticky bar
   3) Clicking the bar opens a flyout panel — items reveal with a
      skeleton-loading shimmer, one after another
   4) X closes the panel back down to just the sticky bar
   ========================================================== */
(function(){

  /* ---------- EDIT YOUR NOTES + LINKS HERE ---------- */
  var NOTES = [
    { title: "Liver Function Tests",                    link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "Culture Media",                            link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "Colorimeter (Beer's & Lambert's Law)",     link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "Morphology of Bacteria",                   link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "Lipid Profile Tests",                      link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "Fat Soluble Vitamins",                     link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "PT/INR Test",                              link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" },
    { title: "Urine Examination",                        link: "https://dmltquestionsodisha.blogspot.com/2026/05/blog-post_27.html?m=1" }
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

  /* ---- green dot (first 5s) ---- */
  #enDot{
    width:16px;height:16px;
    margin:4px 6px 0 0;
    border-radius:50%;
    background:radial-gradient(circle at 35% 35%,#5CFF7A,#1FA83C);
    box-shadow:0 0 0 rgba(31,168,60,.6);
    animation:enDotPulse 1.4s ease-in-out infinite;
    opacity:1;
    transition:opacity .4s ease, transform .4s ease;
  }
  #enDot.hide{
    opacity:0;
    transform:scale(.3);
    pointer-events:none;
  }
  @keyframes enDotPulse{
    0%{box-shadow:0 0 0 0 rgba(31,168,60,.55);}
    70%{box-shadow:0 0 0 12px rgba(31,168,60,0);}
    100%{box-shadow:0 0 0 0 rgba(31,168,60,0);}
  }

  /* ---- sticky vertical bar ---- */
  #enBar{
    width:34px;
    padding:22px 6px;
    background:linear-gradient(180deg,#7b2ff7,#5f0fdc);
    color:#fff;
    border-radius:16px 0 0 16px;
    box-shadow:-6px 10px 26px rgba(0,0,0,.35);
    text-align:center;
    cursor:pointer;
    user-select:none;
    opacity:0;
    transform:scale(.4);
    transition:transform .45s cubic-bezier(.34,1.4,.64,1), opacity .4s ease, box-shadow .3s ease;
  }
  #enBar.show{
    opacity:1;
    transform:scale(1);
  }
  #enBar:hover{
    box-shadow:-8px 14px 32px rgba(0,0,0,.45);
    transform:scale(1.04) translateX(-2px);
  }
  #enBar .enBarText{
    writing-mode:vertical-rl;
    transform:rotate(180deg);
    font-size:13px;
    font-weight:600;
    letter-spacing:1px;
    white-space:nowrap;
  }

  /* ---- flyout panel ---- */
  #enPanel{
    width:0;
    max-height:420px;
    overflow:hidden;
    background:#fff;
    border-radius:16px 0 0 16px;
    box-shadow:-6px 10px 26px rgba(0,0,0,.3);
    opacity:0;
    transition:width .45s cubic-bezier(.4,0,.2,1), opacity .35s ease;
  }
  #enPanel.open{
    width:250px;
    opacity:1;
  }
  #enPanelInner{
    width:250px;
    padding:14px 14px 16px;
  }

  #enPanelHead{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:10px;
    padding-bottom:8px;
    border-bottom:1px solid #eee;
  }
  #enPanelHead h4{
    margin:0;
    font-size:14px;
    font-weight:700;
    color:#5f0fdc;
    letter-spacing:.3px;
  }
  #enClose{
    width:22px;height:22px;
    border-radius:50%;
    background:#f2effc;
    color:#5f0fdc;
    border:none;
    font-size:14px;
    line-height:1;
    cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:background .2s ease, transform .2s ease;
  }
  #enClose:hover{
    background:#e4dcfb;
    transform:rotate(90deg);
  }

  #enList{
    list-style:none;
    margin:0;padding:0;
    display:flex;
    flex-direction:column;
    gap:8px;
  }
  .enItem{
    position:relative;
    height:32px;
    border-radius:8px;
    overflow:hidden;
  }
  .enSkeleton{
    position:absolute;
    inset:0;
    border-radius:8px;
    background:linear-gradient(90deg,#eee 25%,#f6f6f6 37%,#eee 63%);
    background-size:400% 100%;
    animation:enShimmer 1.2s ease-in-out infinite;
    opacity:1;
  }
  @keyframes enShimmer{
    0%{background-position:100% 50%;}
    100%{background-position:0 50%;}
  }
  .enText{
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    padding:0 10px;
    font-size:12.5px;
    font-weight:500;
    color:#333;
    text-decoration:none;
    border-radius:8px;
    opacity:0;
    background:#f7f4ff;
    transition:background .2s ease;
  }
  .enText:hover{ background:#efe7ff; color:#5f0fdc; }

  /* staggered reveal — only fires while panel has .open */
  #enPanel.open .enItem:nth-child(1) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards .55s; }
  #enPanel.open .enItem:nth-child(2) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards .65s; }
  #enPanel.open .enItem:nth-child(3) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards .75s; }
  #enPanel.open .enItem:nth-child(4) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards .85s; }
  #enPanel.open .enItem:nth-child(5) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards .95s; }
  #enPanel.open .enItem:nth-child(6) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards 1.05s; }
  #enPanel.open .enItem:nth-child(7) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards 1.15s; }
  #enPanel.open .enItem:nth-child(8) .enSkeleton{ animation:enShimmer 1.2s ease-in-out, enSkelOut .01s linear forwards 1.25s; }
  @keyframes enSkelOut{ to{ opacity:0; } }

  #enPanel.open .enItem:nth-child(1) .enText{ animation:enTextIn .4s ease forwards .6s; }
  #enPanel.open .enItem:nth-child(2) .enText{ animation:enTextIn .4s ease forwards .7s; }
  #enPanel.open .enItem:nth-child(3) .enText{ animation:enTextIn .4s ease forwards .8s; }
  #enPanel.open .enItem:nth-child(4) .enText{ animation:enTextIn .4s ease forwards .9s; }
  #enPanel.open .enItem:nth-child(5) .enText{ animation:enTextIn .4s ease forwards 1.0s; }
  #enPanel.open .enItem:nth-child(6) .enText{ animation:enTextIn .4s ease forwards 1.1s; }
  #enPanel.open .enItem:nth-child(7) .enText{ animation:enTextIn .4s ease forwards 1.2s; }
  #enPanel.open .enItem:nth-child(8) .enText{ animation:enTextIn .4s ease forwards 1.3s; }
  @keyframes enTextIn{
    0%{opacity:0; transform:translateX(6px);}
    100%{opacity:1; transform:translateX(0);}
  }
  `;
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. BUILD LIST ITEMS HTML ---------- */
  var itemsHtml = NOTES.map(function(n){
    return (
      '<li class="enItem">' +
        '<div class="enSkeleton"></div>' +
        '<a class="enText" href="' + n.link + '" target="_blank" rel="noopener">' + n.title + '</a>' +
      '</li>'
    );
  }).join('');

  /* ---------- 3. INJECT HTML ---------- */
  var wrap = document.createElement('div');
  wrap.id = 'enWidget';
  wrap.innerHTML =
    '<div id="enBar">' +
      '<div class="enBarText">Easy Notes</div>' +
    '</div>' +
    '<div id="enPanel">' +
      '<div id="enPanelInner">' +
        '<div id="enPanelHead">' +
          '<h4>Easy Notes</h4>' +
          '<button id="enClose" aria-label="Close">&times;</button>' +
        '</div>' +
        '<ul id="enList">' + itemsHtml + '</ul>' +
      '</div>' +
    '</div>' +
    '<div id="enDot"></div>';

  document.body.appendChild(wrap);

  /* ---------- 4. BEHAVIOUR ---------- */
  var dot   = document.getElementById('enDot');
  var bar   = document.getElementById('enBar');
  var panel = document.getElementById('enPanel');
  var closeBtn = document.getElementById('enClose');

  // Stage 1 -> 2 : green dot pulses for 5s, then morphs into the bar
  setTimeout(function(){
    dot.classList.add('hide');
    bar.classList.add('show');
  }, 5000);

  function openPanel(){
    panel.classList.remove('open');
    void panel.offsetWidth; // force reflow so the reveal animation replays every time
    panel.classList.add('open');
  }
  function closePanel(){
    panel.classList.remove('open');
  }

  bar.addEventListener('click', function(){
    if (panel.classList.contains('open')) closePanel();
    else openPanel();
  });
  closeBtn.addEventListener('click', function(e){
    e.stopPropagation();
    closePanel();
  });
})();

