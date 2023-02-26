// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

  // TODO: This code is in need of a refactor (along with the rest)
  var storage           = new LocalStorageManager;
  var cookieNotice      = document.querySelector(".cookie-notice");
  var cookieNoticeClose = document.querySelector(".cookie-notice-dismiss-button");

  if (storage.getCookieNoticeClosed() || navigator.language !== "ja") {
    cookieNotice.parentNode.removeChild(cookieNotice);
  } else {
    cookieNoticeClose.addEventListener("click", function () {
      cookieNotice.parentNode.removeChild(cookieNotice);
      storage.setCookieNoticeClosed(true);
      if (typeof gtag !== undefined){
        gtag("event", "closed", {
          event_category: "cookie-notice",
        });
      }
    })
  }
});
