Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    const actor = app.actor;
    if (!actor) return;

    // Find the Special Traits tab
    const traitsTab = html.find(".tab[data-tab='traits']");
    if (!traitsTab.length) {
      console.warn("Integrated Dynamo | Special Traits tab not found");
      return;
    }

    // Avoid duplicate injection
    if (traitsTab.find(".dynamo-panel").length > 0) return;

    // Inject Dynamo panel inside Special Traits
    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);

    traitsTab.append(`
      <div class="dynamo-panel">
        <h3><i class="fas fa-bolt"></i> Integrated Dynamo</h3>
        ${rendered}
      </div>
    `);

    // Recharge button inside the panel
    html.on("click", ".dynamo-recharge", async (ev) => {
      ev.preventDefault();
      const resources = actor.system?.resources;
      if (resources && resources.primary) {
        const max = Number(resources.primary.max ?? 0);
        if (max > 0) {
          await actor.update({ "system.resources.primary.value": max });
          ui.notifications.info("Dynamo charges recharged!");
        }
      } else {
        ui.notifications.warn("No primary resource found for Dynamo charges.");
      }
    });

    console.log("Integrated Dynamo | Panel injected into Special Traits");

  } catch (err) {
    console.error("Integrated Dynamo | Error injecting Dynamo panel:", err);
  }
});
