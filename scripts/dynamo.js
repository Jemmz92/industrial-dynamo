// Add Dynamo content to Special Traits tab
Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    const actor = app.actor;
    if (!actor) return;

    // Locate Special Traits tab content
    const specialTraits = html.find(".tab[data-tab='traits']");
    if (!specialTraits.length) return;

    // Avoid duplicate injection
    if (specialTraits.find(".dynamo-panel").length > 0) return;

    // Render template
    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);

    specialTraits.append(rendered);

    // Recharge button
    specialTraits.on("click", ".dynamo-recharge", async (ev) => {
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

    console.log("Integrated Dynamo | Dynamo panel added to Special Traits");
  } catch (err) {
    console.error("Integrated Dynamo | Error adding Dynamo panel:", err);
  }
});
