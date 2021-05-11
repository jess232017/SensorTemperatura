function downloadJSAtOnload() {
    loadScripts([
        "https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js",
        "https://www.gstatic.com/firebasejs/8.3.2/firebase-auth.js",
        "https://www.gstatic.com/firebasejs/8.3.2/firebase-database.js",
        "https://www.gstatic.com/firebasejs/8.3.2/firebase-storage.js",
        "https://www.gstatic.com/firebasejs/8.3.2/firebase-firestore.js",
        "https://unpkg.com/localbase/dist/localbase.min.js",
        "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js",
        "https://unpkg.com/@popperjs/core@2.9.2/dist/umd/popper.min.js",
        "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js",
        "./js/min/perfect-scrollbar.min.js",
        "https://unpkg.com/@coreui/coreui@3.4.0/dist/js/coreui.js",
        "https://cdn.jsdelivr.net/npm/bs-stepper/dist/js/bs-stepper.min.js",
        "https://cdn.datatables.net/v/bs4/dt-1.10.20/datatables.min.js",
        "https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js",
        "https://cdn.jsdelivr.net/npm/chart.js@3.2.0/dist/chart.min.js",
        "https://bernii.github.io/gauge.js/dist/gauge.min.js",
        "../js/apis.js",
        "./js/min/main.min.js"
    ])
}

function loadScripts(sources) {
    sources.forEach(src => {
        var script = document.createElement('script');
        script.src = src;
        script.async = false; //<-- desactivar la asincronia
        document.body.appendChild(script); //<-- agregar al final del body 
    });
}

if (window.addEventListener)
    window.addEventListener("load", downloadJSAtOnload, false);
else if (window.attachEvent)
    window.attachEvent("onload", downloadJSAtOnload);
else window.onload = downloadJSAtOnload;