// ...省略前面部分...
export default apiInitializer((api) => {
  function mountSidebar() {
    // ...省略前面部分...
    const settings = api.container.lookup("service:site-settings");
    const { links, ads } = getSidebarConfig(settings);

    // 读取公告内容
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

    // ...extraHtml部分改成这样：
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
    // ...剩余不变...
  }
  // ...不变...
});
