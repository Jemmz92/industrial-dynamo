Hooks.on("renderActorSheet5eCharacter", (app, html, data) => {
    const tabs = html.find(".tabs[data-group='primary']");
    const tabButton = $(
        `<a class="item" data-tab="dynamo"><i class="fas fa-bolt"></i> Dynamo</a>`
    );
    tabs.append(tabButton);

    const sheetBody = html.find(".sheet-body");
    const dynamoTab = $(`
        <div class="tab dynamo" data-group="primary" data-tab="dynamo">
            ${renderTemplate("modules/industrial-dynamo/templates/dynamo-tab.html", data)}
        </div>
    `);

    sheetBody.append(dynamoTab);

    // recharge button handler
    html.on("click", ".dynamo-recharge", async (ev) => {
        ev.preventDefault();
        const actor = app.actor;

        const max = actor.system.resources.primary.max;
        await actor.update({
            "system.resources.primary.value": max
        });

        ui.notifications.notify("Dynamo fully recharged!");
    });
});
