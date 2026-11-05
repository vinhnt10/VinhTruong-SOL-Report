// ===== Phân quyền theo mã user (hardcode) + ghi log thao tác — dùng chung cho mọi trang =====
// Cần nạp depts.js trước file này.
// depts: ['*'] = vào tất cả; hoặc liệt kê id phòng ban: 'van-hanh','mkt','hr','ke-toan','ck','pb6'..'pb9','vinh-truong'
// LƯU Ý: toàn bộ danh sách nằm trong file này nên ai mở source đều thấy. Đây là chặn thao tác thường, không phải bảo mật thật.
const USERS = [
  { code: '271209', name: 'Vinh Trương', depts: ['*'] },
  { code: '4887',   name: '',            depts: ['mkt'] },
  { code: '1234',   name: '',            depts: ['mkt'] },
  { code: '1562',   name: '',            depts: ['ke-toan'] }
  // Vận hành: chưa có user riêng (chỉ 271209 vào được). Thêm dòng mới để cấp quyền.
];

const SOLAuth = (() => {
  const SKEY = 'sol_user', LKEY = 'sol_log', LOG_MAX = 1000;
  const store = { get: (s, k) => { try { return s.getItem(k); } catch { return null; } },
                  set: (s, k, v) => { try { s.setItem(k, v); } catch {} },
                  del: (s, k) => { try { s.removeItem(k); } catch {} } };

  const find = code => USERS.find(u => u.code === String(code).trim());
  const current = () => { const c = store.get(sessionStorage, SKEY); return c ? find(c) || null : null; };
  const can = (u, dept) => !!u && (u.depts.includes('*') || u.depts.includes(dept));
  const deptName = id => (DEPTS.find(d => d.id === id) || {}).name || id;

  function log(action, target, who) {
    const u = who || current();
    let arr = [];
    try { arr = JSON.parse(store.get(localStorage, LKEY) || '[]'); } catch {}
    arr.push({ t: new Date().toISOString(), user: u ? u.code : '(chưa đăng nhập)', action, target: target || '' });
    store.set(localStorage, LKEY, JSON.stringify(arr.slice(-LOG_MAX)));
  }
  const readLog = () => { try { return JSON.parse(store.get(localStorage, LKEY) || '[]'); } catch { return []; } };
  const clearLog = () => store.del(localStorage, LKEY);

  // Hộp nhập mã user; trả về Promise<user|null>
  function ask(deptId) {
    return new Promise(resolve => {
      const dlg = document.createElement('dialog');
      dlg.style.cssText = 'border:1px solid #e3e6eb;border-radius:12px;padding:22px 24px;width:min(340px,calc(100% - 32px));font:14px system-ui,sans-serif';
      dlg.innerHTML = '<form method="dialog" style="display:flex;flex-direction:column;gap:10px"><b style="font-size:16px"></b>' +
        '<label style="font-size:12px;color:#6a7285">Mã user<input type="password" autocomplete="off" inputmode="numeric" style="display:block;width:100%;margin-top:4px;font:inherit;padding:8px 10px;border:1px solid #e3e6eb;border-radius:8px"></label>' +
        '<span class="err" style="color:#dc2626;font-size:13px;min-height:16px"></span>' +
        '<div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="x" style="font:inherit;padding:7px 14px;border:1px solid #e3e6eb;border-radius:8px;background:#fff;cursor:pointer">Huỷ</button>' +
        '<button class="ok" style="font:inherit;padding:7px 14px;border:0;border-radius:8px;background:#2f5bea;color:#fff;cursor:pointer">Vào</button></div></form>';
      dlg.querySelector('b').textContent = 'Nhập mã user để vào ' + deptName(deptId);
      const inp = dlg.querySelector('input'), err = dlg.querySelector('.err');
      let done = false;
      const finish = v => { if (done) return; done = true; dlg.close(); dlg.remove(); resolve(v); };
      dlg.querySelector('.ok').onclick = e => {
        e.preventDefault();
        const u = find(inp.value);
        if (!u) { log('Đăng nhập thất bại', deptName(deptId)); err.textContent = 'Mã user không đúng'; inp.select(); return; }
        if (!can(u, deptId)) { log('Bị từ chối', deptName(deptId), u); err.textContent = 'Mã này không có quyền vào mục ' + deptName(deptId); inp.select(); return; }
        store.set(sessionStorage, SKEY, u.code);
        log('Đăng nhập', deptName(deptId));
        finish(u);
      };
      dlg.querySelector('.x').onclick = () => finish(null);
      dlg.addEventListener('cancel', () => finish(null));
      document.body.appendChild(dlg); dlg.showModal(); inp.focus();
    });
  }

  // Vào phòng ban: đã có quyền thì đi luôn, chưa thì hỏi mã
  async function enter(deptId, url) {
    let u = current();
    if (!can(u, deptId)) u = await ask(deptId);
    if (!can(u, deptId)) return;
    log('Vào phòng ban', deptName(deptId));
    location.href = url;
  }

  // Chặn truy cập trực tiếp bằng URL: gọi trên trang con
  function guard(deptId) {
    if (can(current(), deptId)) return true;
    log('Bị chặn (vào trực tiếp)', location.pathname.split('/').pop() + location.search);
    document.documentElement.style.visibility = 'hidden';
    location.replace('index.html?need=' + encodeURIComponent(deptId));
    return false;
  }

  // Tự bảo vệ trang con theo tên file (trang báo cáo hoặc href của phòng ban)
  function autoGuard() {
    const file = location.pathname.split('/').pop() || 'index.html';
    if (file === 'index.html' || file === '') return;
    if (file === 'phong-ban.html') {
      const d = new URLSearchParams(location.search).get('d');
      if (!DEPTS.some(x => x.id === d)) return;
      if (guard(d)) log('Mở danh sách báo cáo', deptName(d));
      return;
    }
    const dept = DEPTS.find(d => d.href === file || d.pages.some(p => p.href === file));
    if (!dept) return;
    if (!guard(dept.id)) return;
    const pg = dept.pages.find(p => p.href === file);
    log(pg ? 'Mở báo cáo' : 'Mở trang', deptName(dept.id) + (pg ? ' / ' + pg.name : ''));
    document.addEventListener('click', e => {          // ghi log mọi lần bấm Download
      const b = e.target.closest && e.target.closest('#dl');
      if (b && !b.disabled) log('Download', deptName(dept.id) + ' / ' + (pg ? pg.name : file));
    }, true);
  }

  const logout = () => { log('Đăng xuất'); store.del(sessionStorage, SKEY); };
  return { USERS, find, current, can, deptName, log, readLog, clearLog, ask, enter, guard, logout, autoGuard };
})();
SOLAuth.autoGuard();
