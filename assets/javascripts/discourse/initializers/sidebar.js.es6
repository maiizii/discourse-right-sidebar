import { withPluginApi } from "discourse/lib/plugin-api";
import { apiInitializer } from "discourse/lib/api";
import { getOwner } from "@ember/application";

export default apiInitializer("0.8", (api) => {
  function parseList(settingList) {
    if (!settingList || !settingList.length) return [];
    return settingList
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);
  }

  const siteSettings = api.container.lookup("service:siteSettings");
  const settings = siteSettings;
  // custom_links 和 ad_slots 是字符串数组
  const links = parseList(settings.custom_links);
  const ads = parseList(settings.ad_slots);

  api.decorateWidget("after-footer:after", (helper) => {
    return helper.attach("sidebar", {
      links,
      ads,
      settings
    });
  });

  const applicationController = getOwner(this).lookup("controller:application");
  applicationController.set("newUsers", []);

  fetch("/u.json")
    .then((r) => r.json())
    .then((data) => {
      let count = parseInt(settings.sidebar_welcome_user_count, 10) || 5;
      let newUsers = data.users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, count);
      applicationController.set("newUsers", newUsers);
    });
});
