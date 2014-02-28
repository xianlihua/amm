function request (url, callback, charset) {
    var script = doc.createElement('script');
    script.async = 'async';
    script.charset = charset || 'utf-8';
    script.onload = script.onerror = script.onreadystatechange = function () {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onerror = script.onreadystatechange = null;
            script.parentNode.removeChild(script);
            script = null;
            callback();
        }
    };
    script.src = url;
    currentlyAddingScript = script;
    head.appendChild(script);
    currentlyAddingScript = null;
}

var currentlyAddingScript, interactiveScript;
function getCurrentScript() {
    if (currentlyAddingScript) {
        return currentlyAddingScript;
    }

    // For IE6-9 browsers, the script onload event may not fire right
    // after the script is evaluated. Kris Zyp found that it
    // could query the script nodes and the one that is in "interactive"
    // mode indicates the current script
    // ref: http://goo.gl/JHfFW
    if (interactiveScript && interactiveScript.readyState === "interactive") {
        return interactiveScript;
    }

    var scripts = head.getElementsByTagName("script");

    for (var i = scripts.length - 1; i >= 0; i--) {
        var script = scripts[i];
        if (script.readyState === "interactive") {
            interactiveScript = script;
            return interactiveScript;
        }
    }
}
