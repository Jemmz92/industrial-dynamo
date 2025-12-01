/**
 * Debug-ready Dynamo tab injector
 * Logs every step to help diagnose why the tab may not appear
 */

Hooks.once("init", () => {
  console.log("Integrated Dynamo | init hook fired");
});

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    if (!app?.actor) {
      console.warn("Integrated Dynamo | No actor found");
      return;
    }

    console.log("Integrated Dynamo | Rendering sheet for", app.actor.name);

    // Prevent duplicate injection
    if (html.find(".dynamo-nav-item").length > 0) {
      console.log("Integrated Dynamo | Dynamo tab already injected");
      return;
    }

    // --- Add navigation button
    const nav = html.find(".sheet-navigation");
    if (nav.length === 0) {
      console.error("Integrated Dynamo | .sheet-navigation not found!");
      return;
    }
    console.log("Integrated Dynamo | Navigation container found");

    const navButton = $(
      `<a class="item dynamo-nav-item" data-tab="dynamo"><i class="fas fa-bolt"></i> Dynamo</a>`
    );
    nav.append(navButton);
    console.log("Integrated Dynamo | Nav button appended");

    // --- Add tab container
    const body = html.find(".sheet-body");
    if (body.length === 0) {
      console.error("Integrated Dynamo | .sheet-body not found!");
      return;
    }
    console.log("Integrated Dynamo | Sheet body found");

    const tabContainer = $(`<div class="tab dynamo" data-tab="dynamo"></div>`);
    body.append(tabContainer);
    console.log("Integrated Dynamo | Tab container appended");

    // --- Render template
    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);
    tabContainer.html(rendered);
    console.log(`Integrated Dynamo | Template rendered from ${templatePath}`);

    // --- Recharge button
    html.on("click", ".dynamo-recharge", async (ev) => {
      ev.preventDefault();
      const actor = app.actor;
      const resources = actor.system?.resources;
      if (resources && resources.primary) {
        const max = Number(resources.primary.max ?? 0);
        if (max > 0) {
          await actor.update({ "system.resources.primary.value": max });
          ui.notifications.info("Dynamo charges recharged!");
          console.log("Integrated Dynamo | Charges recharged to max");
        } else {
          console.warn("Integrated Dynamo | Primary resource max not set");
        }
      } else {
        console.warn("Integrated Dynamo | No primary resource found for actor");
      }
    });

    // --- Activate tab on click
    html.on("click", ".dynamo-nav-item", (ev) => {
      ev.preventDefault();
      const tabName = $(ev.currentTarget).data("tab");
      html.find(".tab").removeClass("active");
      html.find(`.tab[data-tab="${tabName}"]`).addClass("active");
      html.find(".sheet-navigation .item").removeClass("active");
      $(ev.currentTarget).addClass("active");
      console.log(`Integrated Dynamo | Tab "${tabName}" activated`);
    });

    // --- Debug: log what was injected
    console.log("Integrated Dynamo | nav buttons:", html.find(".dynamo-nav-item").length);
    console.log("Integrated Dynamo | tab containers:", html.find(".tab.dynamo").length);

  } catch (err) {
    console.error("Integrated Dynamo | Error during sheet rendering:", err);
  }
});
