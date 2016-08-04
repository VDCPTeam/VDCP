var lang = "";
if (navigator.language != null) {
    lang = navigator.language;
} else if (navigator.systemLanguage != null) {
    lang = navigator.systemLanguage;
}
$("#language").text(lang);
$("#useragent").text(navigator.userAgent);
switch (lang) {
    case "zh-CN":
    case "zh-cn":
    default:
        location.href = "webpage/zh-CN/index.html";
        break;
    case "en-US":
    case "en-us":
        location.href = "webpage/en-US/index.html";
        break;
}