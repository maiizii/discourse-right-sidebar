<script type="text/discourse-plugin" version="0.8">
console.log("right-sidebar.js loaded");

  // 默认链接和广告
  const DEFAULT_LINKS = [
    { text: "分类导航", url: "/categories" },
    { text: "标签页", url: "/tags" },
    { text: "关于本站", url: "/about" },
    { text: "新手指南", url: "/faq" },
    { text: "积分榜", url: "/leaderboard/1" },
  ];
  const DEFAULT_ADS = [
    {
      image: "https://via.placeholder.com/200x60?text=广告位",
      url: "https://your-ad-link.com",
      alt: "广告位",
    },
  ];

  function getSidebarConfig(settings) {
    let links = DEFAULT_LINKS;
    let ads = DEFAULT_ADS;

    if (settings.sidebar_links) {
      links = settings.sidebar_links
        .split("\n")
        .map(line => {
          const parts = line.split("|");
          return { text: (parts[0] || "").trim(), url: (parts[1] || "").trim() };
        })
        .filter(link => link.text && link.url);
    }
    if (settings.sidebar_ads) {
      ads = settings.sidebar_ads
        .split("\n")
        .map(line => {
          const parts = line.split("|");
          return {
            image: (parts[0] || "").trim(),
            url: (parts[1] || "").trim(),
            alt: (parts[2] || "广告").trim(),
          };
        })
        .filter(ad => ad.image && ad.url);
    }
    return { links, ads };
  }

  function mountSidebar(api) {
    const container = document.querySelector("#main-outlet-wrapper");
    if (!container) return;

    let sidebar = document.getElementById("custom-right-sidebar");
    if (sidebar) sidebar.remove();

    const currentUser = api.getCurrentUser && api.getCurrentUser();
    const settings = api.container.lookup("service:site-settings");
    const { links, ads } = getSidebarConfig(settings);

    // 用户信息部分
    let userInfoHtml = "";
    if (currentUser) {
      const trustLevels = ["小学生", "中学生", "大学生", "硕士", "博士"];
      const levelsUserIn = (currentUser.groups || [])
        .map(g => trustLevels.indexOf(g.name))
        .filter(i => i !== -1);
      let userLevel = "未知";
      if (levelsUserIn.length) {
        const maxLevel = Math.max(...levelsUserIn);
        userLevel = trustLevels[maxLevel];
      }
      userInfoHtml = `
        <div class="sidebar-user" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding-top: 4px;
          gap: 2px;
        ">
          <img src="${currentUser.avatar_template.replace("{size}", "80")}" alt="用户头像" 
            style="width:80px;height:80px;border-radius:50%;margin-bottom:8px;">
          <div style="font-size:1.1em;font-weight:bold;margin-bottom:2px;">
            ${currentUser.username}
          </div>
          <div style="margin-bottom:2px;">信任级别：${userLevel}</div>
          <div>
            <a href="/u/${currentUser.username}/summary" style="font-size:1em;color:#43a047;text-decoration:none;">用户信息</a>
          </div>
        </div>
      `;
    }

    // 链接区
    const linksHtml = `
      <div class="sidebar-links" style="text-align:left;padding:8px 0;">
        ${links
          .map(
            link =>
              `<div style="margin-bottom:6px;">
                <a href="${link.url}" style="color:#0077cc;">${link.text}</a>
              </div>`
          )
          .join("")}
      </div>
    `;

    // 广告区
    const adsHtml = `
      <div class="sidebar-ads" style="text-align:center;margin:6px 0;">
        ${ads
          .map(
            ad =>
              `<a href="${ad.url}" target="_blank" style="display:inline-block;margin-bottom:8px;">
                <img src="${ad.image}" alt="${ad.alt}" style="max-width:200px;border-radius:8px;">
              </a>`
          )
          .join("")}
      </div>
    `;

    // 公告区
    let announcementHtml = "";
    if (settings.sidebar_announcement) {
      announcementHtml = `
        <div class="sidebar-announcement" style="background:#f9f9f9;color:#444;padding:8px;margin:8px 0;text-align:center;border-radius:6px;">
          ${settings.sidebar_announcement
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .join("<br>")}
        </div>
      `;
    }

    // 其它内容
    const extraHtml = `
      <hr style="margin:8px 0;">
      ${linksHtml}
      <hr style="margin:8px 0;">
      ${adsHtml}
      ${announcementHtml}
      <div class="sidebar-custom" style="text-align:center;margin:8px 0;">
        <a href="https://github.com/seaone-code" target="_blank" style="color:#212121;">访问我的GitHub</a>
      </div>
    `;

    sidebar = document.createElement("div");
    sidebar.id = "custom-right-sidebar";
    sidebar.innerHTML = `
      <div class="sidebar-outer">
        ${userInfoHtml}
        ${extraHtml}
      </div>
    `;
    container.appendChild(sidebar);
  }

  // 注册挂载事件
  api.onPageChange(() => {
    setTimeout(() => mountSidebar(api), 500);
  });
</script>
