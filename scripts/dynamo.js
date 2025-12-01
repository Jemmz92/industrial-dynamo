Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    const actor = app.actor;
    if (!actor) return;

    // Find the sidebar tab container
    const sidebarTabs = html.find(".sheet-sidebar .tabs");
    if (!sidebarTabs.length) {
      console.warn("Integrated Dynamo | Sidebar tabs not found");
      return;
    }

    // Avoid duplicate injection
    if (sidebarTabs.find(".item.dynamo-tab").length > 0) return;

    // Add Dynamo tab to the sidebar
    const dynButton = $(`
      <a class="item dynamo-tab" data-tab="dynamo">
        <i class="fas fa-bolt"></i> Dynamo
      </a>
    `);
    sidebarTabs.append(dynButton);

    // Add the content container for the tab
    const tabContainer = $(`<div class="tab dynamo" data-tab="dynamo"></div>`);
    html.find(".sheet-body").append(tabContainer);

    // Render template into the tab container
    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);
    tabContainer.html(rendered);

    // Make Dynamo tab active when clicked
    html.on("click", ".dynamo-tab", (ev) => {
      ev.preventDefault();
      const tabName = $(ev.currentTarget).data("tab");
      html.find(".tab").removeClass("active");
      html.find(`.tab[data-tab="${tabName}"]`).addClass("active");
      html.find(".sheet-sidebar .tabs .item").removeClass("active");
      $(ev.currentTarget).addClass("active");
    });

    // Optional: make Dynamo active by default for testing
    // dynButton.trigger("click");

    // Recharge button inside Dynamo panel
    html.on("click", ".dynamo-recharge", async (ev) => {
      ev.preventDefault();
      if (!actor) return;
      const resources = actor.system?.resources;
      if (resources?.primary) {
        const max = Number(resources.primary.max ?? 0);
        if (max > 0) {
          await actor.update({ "system.resources.primary.value": max });
          ui.notifications.info("Dynamo charges recharged!");
        }
      }
    });

    console.log("Integrated Dynamo | Dynamo tab added to sidebar");

  } catch (err) {
    console.error("Integrated Dynamo | Error injecting sidebar tab:", err);
  }
});
