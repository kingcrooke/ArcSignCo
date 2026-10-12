/** Legacy ?palette= support for template pages — loads version-config if present. */
(function () {
  if (window.NOVASTAGE_VERSION_CONFIG && window.NOVASTAGE_applyVersion) {
    return;
  }
  var params = new URLSearchParams(window.location.search);
  var v = params.get("v");
  if (v && parseInt(v, 10) >= 1 && parseInt(v, 10) <= 7) {
    document.body.setAttribute("data-version", v);
    var map = { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e", 6: "f", 7: "g" };
    document.body.setAttribute("data-palette", map[v] || "a");
    return;
  }
  var p = (params.get("palette") || "a").toLowerCase();
  if (!/^[a-e]$/.test(p)) {
    p = "a";
  }
  document.body.setAttribute("data-palette", p);
})();
