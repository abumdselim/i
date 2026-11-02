import pathlib
p = pathlib.Path('_build/icons.svg')
s = p.read_text(encoding='utf-8')
new = '''  <symbol id="i-doc" viewBox="0 0 24 24">
    <path d="M6.4 2.6h7.6l4 4v14.8H6.4z"/>
    <path d="M14 2.6v4h4"/>
    <path d="M9.4 12h6M9.4 16h6"/>
  </symbol>
  <symbol id="i-ledger" viewBox="0 0 24 24">
    <path d="M4.6 3.6h14.8v16.8H4.6z"/>
    <path d="M9.4 3.6v16.8"/>
    <path d="M12.4 8.6h4.4M12.4 12.6h4.4"/>
  </symbol>
  <symbol id="i-payout" viewBox="0 0 24 24">
    <path d="M3.6 4.6h6.8v6.8H3.6z"/>
    <path d="M13.6 12.6h6.8v6.8h-6.8z"/>
    <path d="M10.4 8h3.2v4.6"/>
    <path d="m12.4 11.4 1.2 1.2 1.2-1.2"/>
  </symbol>
  <symbol id="i-cube" viewBox="0 0 24 24">
    <path d="M12 2.8 20.4 7v10L12 21.2 3.6 17V7z"/>
    <path d="M3.6 7 12 11.2 20.4 7"/>
    <path d="M12 11.2v10"/>
  </symbol>
  <symbol id="i-search" viewBox="0 0 24 24">
    <circle cx="10.8" cy="10.8" r="6.2"/>
    <path d="m15.4 15.4 4.6 4.6"/>
  </symbol>
  <symbol id="i-shield" viewBox="0 0 24 24">
    <path d="M12 2.8 20.4 5.8v6.4c0 4.6-3.4 7.8-8.4 9.4-5-1.6-8.4-4.8-8.4-9.4V5.8z"/>
    <path d="m8.4 11.6 2.6 2.6 4.6-5"/>
  </symbol>
  <symbol id="i-sync" viewBox="0 0 24 24">
    <path d="M4.2 11.4a7.8 7.8 0 0 1 13.2-5.2l2.4 2.4"/>
    <path d="M20 3.8v5h-5"/>
    <path d="M19.8 12.6a7.8 7.8 0 0 1-13.2 5.2l-2.4-2.4"/>
    <path d="M4 20.2v-5h5"/>
  </symbol>
  <symbol id="i-plug" viewBox="0 0 24 24">
    <path d="M9 3.6v5M15 3.6v5"/>
    <path d="M6.4 8.6h11.2v3.8a5.6 5.6 0 0 1-11.2 0z"/>
    <path d="M12 18v3"/>
  </symbol>
  <symbol id="i-approval" viewBox="0 0 24 24">
    <path d="M3.6 3.6h16.8v16.8H3.6z"/>
    <path d="m7.4 12.2 3.2 3.2 6.2-6.6"/>
  </symbol>
  <symbol id="i-chart" viewBox="0 0 24 24">
    <path d="M3.6 20.4h16.8"/>
    <path d="M7 20.4v-6.8M12 20.4V7.4M17 20.4v-9.4"/>
  </symbol>
  <symbol id="i-gauge" viewBox="0 0 24 24">
    <path d="M3.8 17.6a8.2 8.2 0 1 1 16.4 0"/>
    <path d="M12 17.6 15.8 11"/>
    <circle cx="12" cy="17.6" r="1" fill="currentColor" stroke="none"/>
  </symbol>
  <symbol id="i-clock" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8.4"/>
    <path d="M12 7.2V12l3.4 2"/>
  </symbol>
  <symbol id="i-users" viewBox="0 0 24 24">
    <path d="M8.4 10.6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    <path d="M3.4 20.4v-1.6a4.8 4.8 0 0 1 4.8-4.8h.4a4.8 4.8 0 0 1 4.8 4.8v1.6"/>
    <path d="M16 4.9a3 3 0 0 1 0 5.6"/>
    <path d="M17.4 14.2a4.8 4.8 0 0 1 3.2 4.5v1.7"/>
  </symbol>
  <symbol id="i-link" viewBox="0 0 24 24">
    <path d="M10 14 14 10"/>
    <path d="M9.2 7.6 7.6 9.2a4 4 0 0 0 5.6 5.6l1.6-1.6"/>
    <path d="M14.8 16.4l1.6-1.6a4 4 0 0 0-5.6-5.6l-1.6 1.6"/>
  </symbol>
  <symbol id="i-pulse" viewBox="0 0 24 24">
    <path d="M3.4 12h4.2l2.4-6.4 4 12.8 2.4-6.4h4.2"/>
  </symbol>
  <symbol id="i-upload" viewBox="0 0 24 24">
    <path d="M12 16.4V3.8"/>
    <path d="m7.4 8.4 4.6-4.6 4.6 4.6"/>
    <path d="M4 16.4v4h16v-4"/>
  </symbol>
  <symbol id="i-card" viewBox="0 0 24 24">
    <path d="M2.8 5.6h18.4v12.8H2.8z"/>
    <path d="M2.8 9.8h18.4M6.4 15h4"/>
  </symbol>
  <symbol id="i-target" viewBox="0 0 24 24">
    <path d="M12 3 21 12l-9 9-9-9z"/>
    <path d="M12 7.4 16.6 12 12 16.6 7.4 12z"/>
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
  </symbol>
  <symbol id="i-workflow" viewBox="0 0 24 24">
    <path d="M3.6 3.6h5v5h-5zM15.4 15.4h5v5h-5zM15.4 3.6h5v5h-5z"/>
    <path d="M8.6 6.1h6.8M18 8.6v6.8M8.6 17.9h6.8"/>
  </symbol>
  <symbol id="i-database" viewBox="0 0 24 24">
    <path d="M4.6 6.2c0-1.6 3.3-2.9 7.4-2.9s7.4 1.3 7.4 2.9-3.3 2.9-7.4 2.9-7.4-1.3-7.4-2.9z"/>
    <path d="M4.6 6.2v11.6c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V6.2"/>
    <path d="M4.6 12c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9"/>
  </symbol>
  <symbol id="i-flag" viewBox="0 0 24 24">
    <path d="M5.6 20.4V3.6"/>
    <path d="M5.6 4.6h11.2l-2.6 4 2.6 4H5.6"/>
  </symbol>
  <symbol id="i-key" viewBox="0 0 24 24">
    <circle cx="8" cy="8" r="4.2"/>
    <path d="m11 11 8.4 8.4M16.4 16.4l2-2M14.4 14.4l2-2"/>
  </symbol>
'''
s = s.replace('</svg>', new + '</svg>')
p.write_text(s, encoding='utf-8')
print('icons total:', s.count('<symbol'))
