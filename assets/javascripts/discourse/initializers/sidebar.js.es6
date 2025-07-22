import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "sidebar",
  initialize() {
    withPluginApi("0.8", (api) => {
      api.decorateWidget("sidebar:after", (helper) => {
        // 这个可以用于插入你的 sidebar 组件
        return helper.attach("sidebar");
      });

      // 获取新用户列表
      const store = api.container.lookup("service:store");
      const controller = api.container.lookup("controller:application");
      store
        .findAll("user")
        .then((users) => {
          const newUsers = users
            .sortBy("created_at")
            .reverse()
            .slice(0, parseInt(settings.sidebar_welcome_user_count, 10));
          controller.set("newUsers", newUsers);
        });
    });
  },
};
