// SpaceBaton 導線計測：どのボタン・リンクから問い合わせや査定に進んだかを GA4 に送る
(function () {
  function send(name, params) {
    try { if (window.gtag) window.gtag('event', name, params); } catch (e) {}
  }

  function kindOf(href) {
    if (/\/contact/.test(href)) {
      if (/role=buy/.test(href)) return 'contact_buy';
      if (/role=other/.test(href)) return 'contact_other';
      return 'contact_sell';
    }
    if (/\/simulator/.test(href)) return 'simulator';
    if (/\/checklist/.test(href)) return 'checklist';
    if (/\/listings|\/listing-detail/.test(href)) return 'listings';
    if (/timerex\.net/.test(href)) return 'meeting_booking';
    if (/note\.com\//.test(href)) return 'note';
    if (/(^|\/\/)(www\.)?x\.com\//.test(href)) return 'x';
    return '';
  }

  // ボタン・リンクのクリック
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('a,button') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    var cta = el.getAttribute('data-cta') || '';
    var kind = kindOf(href);
    if (!kind && !cta) return;
    send('cta_click', {
      cta_type: kind || 'other',
      cta_id: cta || '(none)',
      link_url: href.slice(0, 200),
      page_path: location.pathname
    });
  }, true);

  // 問い合わせフォームの入力開始（離脱の把握用・1回だけ）
  var form = document.getElementById('inquiryForm');
  if (form) {
    var started = false;
    form.addEventListener('focusin', function () {
      if (started) return;
      started = true;
      var role = (document.getElementById('roleField') || {}).value || 'unknown';
      send('lead_form_start', { form_role: role });
    });
  }
})();
