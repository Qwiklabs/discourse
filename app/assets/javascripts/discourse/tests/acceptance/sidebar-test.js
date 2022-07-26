import I18n from "I18n";

import { test } from "qunit";
import { click, currentRouteName, visit } from "@ember/test-helpers";
import {
  acceptance,
  exists,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";

acceptance("Sidebar - Anon User", function () {
  // Don't show sidebar for anon user until we know what we want to display
  test("sidebar is not displayed", async function (assert) {
    await visit("/");

    assert.ok(
      !document.body.classList.contains("has-sidebar-page"),
      "does not add sidebar utility class to body"
    );

    assert.ok(!exists(".sidebar-container"));
  });
});

acceptance(
  "Sidebar - Experimental sidebar and hamburger setting disabled",
  function (needs) {
    needs.user();

    needs.settings({
      enable_experimental_sidebar_hamburger: false,
    });

    test("clicking header hamburger icon displays old hamburger drodown", async function (assert) {
      await visit("/");
      await click(".hamburger-dropdown");

      assert.ok(exists(".menu-container-general-links"));
    });
  }
);

acceptance(
  "Sidebar - Experimental sidebar and hamburger setting enabled - Sidebar disabled",
  function (needs) {
    needs.user();

    needs.settings({
      enable_experimental_sidebar_hamburger: true,
      enable_sidebar: false,
    });

    test("showing and hiding sidebar", async function (assert) {
      await visit("/");
      await click(".hamburger-dropdown");

      assert.ok(
        exists(".sidebar-hamburger-dropdown"),
        "displays the sidebar dropdown"
      );

      await click(".hamburger-dropdown");

      assert.notOk(
        exists(".sidebar-hamburger-dropdown"),
        "hides the sidebar dropdown"
      );
    });
  }
);

acceptance(
  "Sidebar - Experimental sidebar and hamburger setting enabled - Sidebar enabled",
  function (needs) {
    needs.user();

    needs.settings({
      enable_experimental_sidebar_hamburger: true,
      enable_sidebar: true,
    });

    test("navigating to about route using sidebar", async function (assert) {
      await visit("/");
      await click(".sidebar-footer-link-about");

      assert.strictEqual(currentRouteName(), "about");
    });

    test("viewing keyboard shortcuts using sidebar", async function (assert) {
      await visit("/");
      await click(
        `.sidebar-footer-actions-keyboard-shortcuts[title="${I18n.t(
          "keyboard_shortcuts_help.title"
        )}"]`
      );

      assert.ok(
        exists("#keyboard-shortcuts-help"),
        "keyboard shortcuts help is displayed"
      );
    });

    test("navigating to site setting route using sidebar", async function (assert) {
      await visit("/");
      await click(".sidebar-footer-link-site-settings");

      assert.strictEqual(currentRouteName(), "adminSiteSettingsCategory");
    });

    test("site setting link is not shown in sidebar for non-admin user", async function (assert) {
      updateCurrentUser({ admin: false });

      await visit("/");

      assert.notOk(exists(".sidebar-footer-link-site-settings"));
    });

    test("showing and hiding sidebar", async function (assert) {
      await visit("/");

      assert.ok(
        document.body.classList.contains("has-sidebar-page"),
        "adds sidebar utility class to body"
      );

      assert.ok(
        exists(".sidebar-container"),
        "displays the sidebar by default"
      );

      await click(".hamburger-dropdown");

      assert.ok(
        !document.body.classList.contains("has-sidebar-page"),
        "removes sidebar utility class from body"
      );

      assert.ok(!exists(".sidebar-container"), "hides the sidebar");

      await click(".hamburger-dropdown");

      assert.ok(exists(".sidebar-container"), "displays the sidebar");
    });
  }
);
