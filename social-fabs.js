/* ==========================================================
   Floating Action Buttons — YouTube + WhatsApp
   Host on GitHub, then add ONE line in Blogger before </body>:

   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/social-fabs.js"></script>

   ========================================================== */
(function(){

  /* ---------- EDIT YOUR LINKS HERE ---------- */
  var YT_LINK = "https://youtube.com/@mlt_pathshala";
  var WP_LINK = "https://wa.me/7608053740?text=Hi%20Qiscus";

  /* ---------- 1. INJECT CSS ---------- */
  var css = `
  .fab-wrap *{margin:0;padding:0;box-sizing:border-box;}

  .yt-fab,.wp-fab{
    position:fixed;
    bottom:24px;
    z-index:9990;
    width:52px;height:52px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    text-decoration:none;
    box-shadow:0 6px 14px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.25);
    opacity:0;
    transition:box-shadow .3s ease, transform .3s ease;
  }
  .yt-fab:hover,.wp-fab:hover{
    box-shadow:0 10px 22px rgba(0,0,0,.45), 0 3px 8px rgba(0,0,0,.3);
    transform:translateY(-3px) scale(1.06);
  }

  .yt-fab{
    left:16px;
    background:linear-gradient(135deg,#ff0000,#cc0000);
    transform:translateX(-120px);
  }
  .wp-fab{
    right:16px;
    background:linear-gradient(135deg,#25D366,#128C7E);
    transform:translateX(120px);
  }

  .yt-fab svg{width:26px;height:20px;}
  .wp-fab svg{width:27px;height:27px;}

  /* entrance: slide in from respective side */
  .fab-wrap.enter .yt-fab{
    animation:ytSlideIn .7s cubic-bezier(.34,1.56,.64,1) forwards;
  }
  .fab-wrap.enter .wp-fab{
    animation:wpSlideIn .7s cubic-bezier(.34,1.56,.64,1) forwards .15s;
  }
  @keyframes ytSlideIn{
    0%{transform:translateX(-120px);opacity:0;}
    60%{opacity:1;}
    100%{transform:translateX(0);opacity:1;}
  }
  @keyframes wpSlideIn{
    0%{transform:translateX(120px);opacity:0;}
    60%{opacity:1;}
    100%{transform:translateX(0);opacity:1;}
  }

  /* oscillate once after landing */
  .fab-wrap.oscillate .yt-fab,
  .fab-wrap.oscillate .wp-fab{
    animation:fabOscillate .6s ease-in-out 1;
  }
  @keyframes fabOscillate{
    0%,100%{transform:scale(1);}
    25%{transform:scale(1.1,.9);}
    50%{transform:scale(.92,1.08);}
    75%{transform:scale(1.04,.96);}
  }
  `;
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. INJECT HTML ---------- */
  var wrap = document.createElement('div');
  wrap.className = 'fab-wrap';
  wrap.innerHTML = `
    <a class="yt-fab" href="${YT_LINK}" target="_blank" rel="noopener" aria-label="YouTube">
      <svg viewBox="0 0 24 17.5" xmlns="http://www.w3.org/2000/svg">
        <path d="M23.5 2.7c-.3-1-1-1.8-2-2C19.6 0 12 0 12 0S4.4 0 2.5.7c-1 .3-1.7 1-2 2C0 4.6 0 8.75 0 8.75s0 4.15.5 6.05c.3 1 1 1.8 2 2 1.9.7 9.5.7 9.5.7s7.6 0 9.5-.7c1-.3 1.7-1 2-2 .5-1.9.5-6.05.5-6.05s0-4.15-.5-6.05z" fill="#fff"/>
        <path d="M9.5 12.5v-7.5l6.5 3.75z" fill="#cc0000"/>
      </svg>
    </a>
    <a class="wp-fab" href="${WP_LINK}" target="_blank" rel="noopener" aria-label="WhatsApp">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C8.82 3 3 8.82 3 16c0 2.38.66 4.6 1.8 6.52L3 29l6.66-1.74A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="#fff"/>
        <path d="M21.9 19.1c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.19-.24-.58-.48-.5-.67-.51H12c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.18 5.04 4.46.7 1.25.48 1.68.62.7.22 1.34.19 1.84-.12 2.56-.08.72-1.42 1.03-1.42.07-.13.27-.2.57-.35" fill="#25D366"/>
      </svg>
    </a>
  `;
  document.body.appendChild(wrap);

  /* ---------- 3. RUN ANIMATION SEQUENCE ---------- */
  function run(){
    wrap.classList.add('enter');
    setTimeout(function(){
      wrap.classList.add('oscillate');
    }, 900);
  }

  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run);
})();

