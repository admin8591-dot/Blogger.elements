/* ==========================================================
   Static WhatsApp Button — fixed bottom-right, no animation
   Host on GitHub, then add ONE line in Blogger before </body>:

   <script src="https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/wp-static.js"></script>

   ========================================================== */
(function(){

  /* ---------- EDIT YOUR LINK HERE ---------- */
  var WP_LINK = "https://wa.me/7608053740?text=Hi%20Qiscus";

  /* ---------- 1. INJECT CSS ---------- */
  var css = `
  #wpStatic{
    position:fixed;
    bottom:20px;
    right:16px;
    z-index:9990;
    width:52px;
    height:52px;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(135deg,#25D366,#128C7E);
    box-shadow:0 6px 16px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.25);
    text-decoration:none;
  }
  #wpStatic svg{width:27px;height:27px;}
  `;
  var styleTag = document.createElement('style');
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  /* ---------- 2. INJECT HTML ---------- */
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<a id="wpStatic" href="' + WP_LINK + '" target="_blank" rel="noopener" aria-label="WhatsApp">' +
      '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M16 3C8.82 3 3 8.82 3 16c0 2.38.66 4.6 1.8 6.52L3 29l6.66-1.74A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="#fff"/>' +
        '<path d="M21.9 19.1c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.19-.24-.58-.48-.5-.67-.51H12c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.85 1.2 3.05c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84-.12.56-.34.61-1.13.43-1.32-.07-.06-.27-.1-.57-.25" fill="#25D366"/>' +
      '</svg>' +
    '</a>';
  document.body.appendChild(wrap);

})();
