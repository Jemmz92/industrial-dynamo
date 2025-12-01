/**
 * industrial-dynamo: robust tab injector for FoundryVTT v13 + dnd5e
 * Overwrites/extends the Actor sheet, injects a Dynamo tab,
 * shows charges, and wires a Recharge button.
 */

Hooks.once("init", () => {
  console.log("Integrated Dynamo | init");
});

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
  try {
    // Safety: only run for actors (not items, tokens, etc.)
    if (!app?.actor) return;

    // Avoid duplicate injection
    if (html.find(".dynamo-nav-item").length > 0) return;

    // Logging to help debug
    console.log("Integrated Dynamo | injecting tab for", app.actor.name);

    // --- 1) Add navigation button (sheet header / left nav)
    // Foundry has variations; try common selectors
    const nav = html.find(".sheet-navigation");
    if (nav.length === 0) {
      // fallback to older selector
      console.warn("Integrated Dynamo | .sheet-navigation not found - aborting injection");
      return;
    }

    const navButton = $(
      `<a class="item dynamo-nav-item" data-tab="dynamo" title="Integrated Dynamo"><i class="fas fa-bolt"></i> Dynamo</a>`
    );
    nav.append(navButton);

    // --- 2) Add tab container (sheet body)
    const body = html.find(".sheet-body");
    if (body.length === 0) {
      console.warn("Integrated Dynamo | .sheet-body not found - aborting injection");
      return;
    }

    // Create a placeholder tab. The data-tab attribute must match nav button.
    const tabContainer = $(`<div class="tab dynamo" data-tab="dynamo"></div>`);
    body.append(tabContainer);

    // Render the template into the tab (use same data object the sheet provided)
    const templatePath = "modules/industrial-dynamo/templates/dynamo-tab.html";
    const rendered = await renderTemplate(templatePath, data);
    tabContainer.html(rendered);

    // --- 3) Wire listeners for controls *inside this sheet instance*.
    // Note: use `html` which is the jQuery root for this sheet only.
    // Recharge button: update actor resource primary (fallback to flags if missing)
    html.on("click", ".dynamo-recharge", async (ev) => {
      ev.preventDefault();
      const actor = app.actor;
      if (!actor) return;

      // Prefer system.resources.primary, fallback to an actor flag
      const resources = actor.system?.resources;
      if (resources && resources.primary) {
        const max = Number(resources.primary.max ?? resources.primary.max ?? 0);
        if (!Number.isFinite(max) || max <= 0) {
          ui.notifications.warn("Dynamo: primary resource max not configured on this character.");
          return;
        }
        await actor.update({ "system.resources.primary.value": max });
        ui.notifications.info("Integrated Dynamo: Charges recharged to max.");
        return;
      }

      // Fallback: store under actor.flags.industrialDynamo.charges
      const flagPath = "flags.industrialDynamo.charges";
      const flagMaxPath = "flags.industrialDynamo.max";
      const maxFlag = actor.getFlag("industrialDynamo", "max") ?? actor.getFlag("industrialDynamo", "max") ?? 0;
      if (maxFlag && Number.isFinite(Number(maxFlag))) {
        await actor.setFlag("industrialDynamo", "charges", Number(maxFlag));
        ui.notifications.info("Integrated Dynamo: Charges recharged (flag fallback).");
        return;
      }

      ui.notifications.error("Integrated Dynamo: No resource or flag configured to store charges.");
    });

    // Activation: when user clicks the nav button, switch tabs (works with Foundry's tab logic)
    html.on("click", ".dynamo-nav-item", (ev) => {
      ev.preventDefault();
      const tabName = $(ev.currentTarget).data("tab");
      // Hide sibling tabs and show ours (use foundry's tab switching if available)
      html.find(".tab").removeClass("active");
      html.find(`.tab[data-tab="${tabName}"]`).addClass("active");
      // Update nav active class
      html.find(".sheet-navigation .item").removeClass("active");
      $(ev.currentTarget).addClass("active");
    });

    // Make sure the sheet's default active tab is not unexpectedly empty.
    // If you want Dynamo to be default: uncomment next line:
    // html.find('.dynamo-nav-item').trigger('click');

  } catch (err) {
    console.error("Integrated Dynamo | renderActorSheet5eCharacter error:", err);
  }
});
