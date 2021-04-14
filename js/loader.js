function downloadJSAtOnload() {
    loadScripts(['../js/import/Sweetalert.js', '../js/import/Notifier.js', '../js/import/Howler.js',
        '../js/import/Gauge.js', '../js/import/Notyf.js', '../js/import/Push.js',
        /*'https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js',
        'https://www.gstatic.com/firebasejs/8.3.2/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/8.3.2/firebase-database.js',*/
        //'./js/main.js'
    ])

    /*loadScripts(['./js/import/Sweetalert.js', './js/import/Notifier.js', './js/import/Howler.js',
        './js/import/Chart.js', './js/import/Gauge.js', './js/import/Notyf.js', 'js/import/Push.js',
        'https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js',
        'https://www.gstatic.com/firebasejs/8.3.2/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/8.3.2/firebase-database.js',
        './js/main.js'
    ])*/
}

function loadScripts(sources) {
    sources.forEach(src => {
        var script = document.createElement('script');
        script.src = src;
        script.async = false; //<-- the important part
        document.body.appendChild(script); //<-- make sure to append to body instead of head 
    });
}

if (window.addEventListener)
    window.addEventListener("load", downloadJSAtOnload, false);
else if (window.attachEvent)
    window.attachEvent("onload", downloadJSAtOnload);
else window.onload = downloadJSAtOnload;