import UserMenuNotificationItem from "discourse/components/user-menu/notification-item";
import { formatUsername } from "discourse/lib/utilities";
import I18n from "I18n";

export default class UserMenuLikedNotificationItem extends UserMenuNotificationItem {
  get count() {
    return this.notification.data.count;
  }

  get username2() {
    return formatUsername(this.notification.data.username2);
  }

  get label() {
    if (this.count === 2) {
      return I18n.t("notifications.liked_by_2_users", {
        username: this.username,
        username2: this.username2,
      });
    } else if (this.count > 2) {
      return I18n.t("notifications.liked_by_multiple_users", {
        username: this.username,
        username2: this.username2,
        count: this.count - 2,
      });
    } else {
      return super.label;
    }
  }

  get labelWrapperClasses() {
    if (this.count === 2) {
      return "double-user";
    } else if (this.count > 2) {
      return "multi-user";
    }
  }
}
