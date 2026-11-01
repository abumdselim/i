import pathlib, re

idx = pathlib.Path('_build/pages/index.html')
s = idx.read_text(encoding='utf-8')
for a, b in [('#custom','custom-software.html'),('#commerce','ecommerce.html'),('#erp','erp.html'),('#web','web-platforms.html'),('#mobile','mobile-apps.html'),('#ai','automation.html')]:
    s = s.replace('href="services.html' + a + '"', 'href="' + b + '"')
idx.write_text(s, encoding='utf-8')

b = pathlib.Path('_build/build.py')
t = b.read_text(encoding='utf-8')
for a, url in [('#custom','custom-software.html'),('#commerce','ecommerce.html'),('#erp','erp.html'),('#web','web-platforms.html'),('#mobile','mobile-apps.html'),('#ai','automation.html')]:
    t = t.replace('href="services.html' + a + '"', 'href="' + url + '"')
b.write_text(t, encoding='utf-8')

# contact FAQ
c = pathlib.Path('_build/pages/contact.html')
u = c.read_text(encoding='utf-8')
faq = '''
<section class="section section--tint" data-od-id="contact-faq">
  <div class="shell">
    <div class="faq">
      <div class="faq__aside">
        <p class="eyebrow" data-reveal>Before the call</p>
        <h2 class="h2" data-reveal style="--d:.05s">The three questions we always get.</h2>
        <p class="body" data-reveal style="--d:.1s">Longer answers live in the engagement notes. These are the short versions.</p>
      </div>
      <div class="faq__list" data-reveal>
        <details class="faq__item">
          <summary>How does a project start?<span class="pm" aria-hidden="true"></span></summary>
          <div class="faq__body">A 45-minute call about the system, the constraints and the deadline. If it looks like a fit, we scope a short discovery with a fixed fee and a written architecture at the end. There is no commitment to build with us afterwards.</div>
        </details>
        <details class="faq__item">
          <summary>Can you take over an unfinished build?<span class="pm" aria-hidden="true"></span></summary>
          <div class="faq__body">Often. We start with an audit: what is stable, what is load-bearing, what should be replaced and what should be left alone. Taking over someone else's work is normal here, not a rescue mission.</div>
        </details>
        <details class="faq__item">
          <summary>Who owns what at the end?<span class="pm" aria-hidden="true"></span></summary>
          <div class="faq__body">You own the code, the cloud accounts and the keys. Repositories are opened in your name from the first week, and the handover pack is written for the team that inherits the system.</div>
        </details>
      </div>
    </div>
  </div>
</section>
'''
u = u.replace('</section>\n', '</section>\n' + faq, 1) if False else u + faq
c.write_text(u, encoding='utf-8')
print('done')
