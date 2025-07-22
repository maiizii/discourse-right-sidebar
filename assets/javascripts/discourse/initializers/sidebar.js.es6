import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {
  function parseList(settingList) {
    if (!settingList || !settingList.length) return [];
    return settingList.map(item => {
      try { return JSON.parse(item); } catch { return null; }
    }).filter(Boolean);
  }

  const siteSettings = api.container.lookup("service:siteSettings");
  const links = parseList(siteSettings.custom_links);
  const ads = parseList(siteSettings.ad_slots);

  function mountSidebar() {
    let sidebar = document.getElementById("discourse-right-sidebar");
    if (sidebar) sidebar.remove();

    sidebar = document.createElement("div");
    sidebar.id = "discourse-right-sidebar";
    sidebar.innerHTML = `
      <div class="sidebar">
        ${links.length ? `<div class="sidebar-links"><h4>推荐链接</h4><ul>${links.map(link => `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`).join("")}</ul></div>` : ""}
        ${ads.length ? `<div class="sidebar-ads">${ads.map(ad => `<a href="${ad.url}" target="_blank"><img src="${ad.image}" alt="广告" /></a>`).join("")}</div>` : ""}
        <div class="sidebar-new-users"><h4>欢迎新成员</h4><ul id="sidebar-new-users-list"></ul></div>
      </div>
    `;
    document.body.appendChild(sidebar);

    // 获取并渲染新用户
    fetch("/u.json").then(r => r.json()).then(data => {
      const count = siteSettings.sidebar_welcome_user_count || 5;
      const newUsers = data.users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, count);
      const ul = document.getElementById("sidebar-new-users-list");
      if (ul) {
        ul.innerHTML = newUsers.map(user => `<li><img src="${user.avatar_template}" alt="${user.username}" /><span>${user.username}</span></li>`).join("");
      }
    });
  }

  api.onPageChange(() => {
    setTimeout(mountSidebar, 500); // 确保主页面渲染后插入
  });
});
