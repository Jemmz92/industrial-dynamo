Hooks.once("init", () => {
  console.log("Integrated Dynamo | init");
});

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    if (!app?.actor) return;
    if (html.find(".dynamo-nav-item").length > 0) return;

    console.log("Integrated Dynamo | injecting tab for", app.actor.name);

    // --- 1) Add navigation button
    const nav = html.find(".sheet-navigation");
    if (nav.length === 0) return;

    const navButton = $(
      `<a class="item dynamo-nav-item" data-tab="dynamo"><i class="fas fa-bolt"></i> Dynamo</a>`
    );
    nav.append(navButton);

    // --- 2) Add tab container
    const body = html.find(".sheet-body");
    const tabContainer = $(`<div class="tab dynamo" data-tab="dynamo"></div>`);
    body.append(tabContainer);

    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);
    tabContainer.html(rendered);

    // --- 3) Recharge button
    html.on("click", ".dynamo-recharge", async (ev) => {
      ev.preventDefault();
      const actor = app.actor;
      const resources = actor.system?.resources;
      if (resources && resources.primary) {
        const max = Number(resources.primary.max ?? 0);
        if (max > 0) {
          await actor.update({ "system.resources.primary.value": max });
          ui.notifications.info("Dynamo charges recharged!");
        }
      } else {
        ui.notifications.warn("No primary resource set for Dynamo charges.");
      }
    });

    // --- 4) Activate tab on click
    html.on("click", ".dynamo-nav-item", (ev) => {
      ev.preventDefault();
      const tabName = $(ev.currentTarget).data("tab");
      html.find(".tab").removeClass("active");
      html.find(`.tab[data-tab="${tabName}"]`).addClass("active");
      html.find(".sheet-navigation .item").removeClass("active");
      $(ev.currentTarget).addClass("active");
    });

  } catch (err) {
    console.error("Integrated Dynamo | Error injecting tab:", err);
  }
});
