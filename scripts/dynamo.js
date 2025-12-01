Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    const actor = app.actor;
    if (!actor) return;

    // --- 1) Sidebar navigation container for right-hand tabs
    const sidebarNav = html.find('.tabs[data-group="primary"]');
    if (!sidebarNav.length) {
      console.warn("Integrated Dynamo | Sidebar primary tabs container not found");
      return;
    }

    // Prevent duplicate
    if (sidebarNav.find(".dynamo-tab").length > 0) return;

    // --- 2) Add Dynamo tab button
    const dynButton = $(`
      <a class="item dynamo-tab" data-tab="dynamo">
        <i class="fas fa-bolt"></i> Dynamo
      </a>
    `);
    sidebarNav.append(dynButton);

    // --- 3) Add content container
    const tabContainer = $(`<div class="tab dynamo" data-tab="dynamo"></div>`);
    html.find(".sheet-body").append(tabContainer);

    // --- 4) Render template
    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);
    tabContainer.html(rendered);

    // --- 5) Tab click behavior
    dynButton.on("click", (ev) => {
      ev.preventDefault();
      const tabName = $(ev.currentTarget).data("tab");

      // Deactivate all tabs in the sheet body
      html.find(".tab").removeClass("active");

      // Activate the selected tab
      html.find(`.tab[data-tab="${tabName}"]`).addClass("active");

      // Update sidebar nav active state
      sidebarNav.find(".item").removeClass("active");
      $(ev.currentTarget).addClass("active");
    });

    // Optional: make Dynamo tab active on sheet open
    // dynButton.trigger("click");

    // --- 6) Recharge button
    html.on("click", ".dynamo-recharge", async (ev) => {
      ev.preventDefault();
      const resources = actor.system?.resources;
      if (resources?.primary) {
        const max = Number(resources.primary.max ?? 0);
        if (max > 0) {
          await actor.update({ "system.resources.primary.value": max });
          ui.notifications.info("Dynamo charges recharged!");
        }
      }
    });

    console.log("Integrated Dynamo | Dynamo tab successfully added to sidebar");
  } catch (err) {
    console.error("Integrated Dynamo | Error injecting sidebar tab:", err);
  }
});
