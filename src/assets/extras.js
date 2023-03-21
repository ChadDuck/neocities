export function checkAgent(userAgent) {
    switch (true) {
        case userAgent.indexOf("edge") > -1: return "EdgeOG";

        case userAgent.indexOf("edg/") > -1: return "Edge";

        case userAgent.indexOf("opr") > -1 && !!window.opr: return "Opera";

        case userAgent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";

        case userAgent.indexOf("trident") > -1: return "IE";

        case userAgent.indexOf("firefox") > -1: return "Firefox";

        case userAgent.indexOf("safari") > -1: return "Safari";

        default: return false;
    }
};

export function getRanNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // ROUND, not FLOOR.  Keep in mind when using in ranges or selecting array values.
};