/**
 * 控制侧边栏
 */
$(".button-collapse").sideNav({
    draggable: true
});
var isopen = true;
function switchnav() {
    if (isopen) {
        isopen = false;
        $(".button-collapse").sideNav("show");
    }
    else {
        isopen = true;
        $(".button-collapse").sideNav("hide");
    }
}
/**
 * 控制多语言及文本
 */
var lang;
var isinitial = true;
$(document).ready(function () {
    $('select').material_select();
});
var txt = document.cookie.split(";");
lang = $("#select-language").find("option:selected").val();
for (var i = 0; i < txt.length; i++) {
    if (txt[i].match("\{.*\}")) {
        lang = JSON.parse(txt[i]).lang;
    }
}
function catalog_id(sect, exam) {
    return "s" + sect + "e" + exam + "id";
}
function selected_lang() {
    if (!isinitial) {
        lang = $("#select-language").find("option:selected").val();
    } else isinitial = false;
    $.getJSON("text/" + lang + ".json", function (data) {
        $("#text-catalog").text(data.catalog);
        $("#text-tooltip-sidenav").attr("data-tooltip", data.tooltip_sidenav);
        $("#text-tooltip-help").attr("data-tooltip", data.tooltip_help);
        $("#text-tooltip-info").attr("data-tooltip", data.tooltip_info);
        $(".text-yes").text(data.yes);
        $(document).ready(function () {
            $('.tooltipped').tooltip({delay: 50});
        });
    });
    $.getJSON("catalog/" + lang + ".json", function (data) {
        var co_wrapper = $("#catalog").find(".collapsible");
        co_wrapper.remove();
        $("#catalog").append("<ul class='collapsible' data-collapsible='accordion'></ul>");
        for (var i = 0; i < data.length; i++) {
            var temp_li = co_wrapper.append("<li id='" + catalog_id(i, 0) + "'></li>");
            temp_li.find("#" + catalog_id(i, 0)).append("<div class='collapsible-header'><a class='waves-effect btn-flat' href='" + data[i].href + "'>" + data[i].text + "</a></div>");
            var temp_inner = temp_li.find("#" + catalog_id(i, 0)).append("<div class='collapsible-body'></div>");
            if (data[i].child != undefined) {
                var temp_colle = temp_inner.find(".collapsible-body").append("<div class='collection'></div>");
                for (var j = 0; j < data[i].child.length; j++) {
                    temp_colle.find(".collection").append("<a href='" + data[i].child[j].href + "' class='collection-item waves-effect btn-flat'>" + data[i].child[j].text + "</a>");
                }
            }
        }
        $(document).ready(function () {
            $('.collapsible').collapsible();
        });
    });
    document.cookie = JSON.stringify({"lang": lang});
}
selected_lang();
$(document).ready(function () {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});