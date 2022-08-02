/*
KWin Script Minimum Dimensions
(C) 2022 GT <788449+gtgt@users.noreply.github.com>
GNU General Public License v3.0
*/

// initialization
const config = {
  width: readConfig("width", 50),
  height: readConfig("height", 50),
  classList: readConfig("classList", "")
    .toLowerCase()
    .split("\n")
    .map((s) => s.trim()),
  allowMode: readConfig("allowMode", true),
  denyMode: readConfig("denyMode", false),
  debugMode: readConfig("debugMode", true)
};

  function debug(...args) {
    if (config.debugMode) console.debug("minimum-dimensions:", ...args);
  }
  debug("initializing");

// when a client is added
workspace.clientAdded.connect(client => {
    debug("client", JSON.stringify(client, undefined, 2));

    // abort conditions
    if (!client // null
        //|| (config.allowMode && !config.classList.includes(String(client.resourceClass))) // using allowmode and window class is not in list
        //|| (config.denyMode && config.classList.includes(String(client.resourceClass)))  // using denymode and window class is in list
        || !client.resizeable // not resizable
        || !client.normalWindow // only do normal windows for now
    ) {
      debug("skipping client", client.caption);
      return;
    }

    // clip and move client into bounds of screen dimensions
    var area = workspace.clientArea(KWin.MaximizeArea, client);
    debug("area size is ", area.width, "x", area.height, "; current size: ", client.width, "x", client.height, "; calculated dimensions: ", area.width * (config.width / 100), "x", area.height * (config.height / 100));
    // calculate new width / height
    var newWidth = Math.max(client.width, area.width * (config.width / 100)), newHeight = Math.max(client.height, area.height * (config.height / 100));

    debug("resizing client", client.caption, "to ", newWidth, "x", newHeight);
    // set dimensions
    client.geometry.width = newWidth;
    client.geometry.height = newHeight;
    // left/top window edge between left and right/top and bottom screen edges
    client.geometry.x = Math.max(area.x, Math.min(area.x + area.width - client.width, client.x));
    client.geometry.y = Math.max(area.y, Math.min(area.y + area.height - client.height, client.y));
});
