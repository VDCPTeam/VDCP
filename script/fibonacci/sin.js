//实时获取窗口宽度
var width;
var height;
var elementMarginY = Math.round(height / 30);
var topMargin = Math.round(height * 0.05);
var halfT = Math.round(height / 7);
var svg = d3.select("body").append("div").classed("container well", true).append("svg").classed("sin", true).style("width", "100%");
//var span = script.select("body").append("span").style("font-size", "8px");
resize();
function resize() {
    width = $("div.container").width();
    height = $(window).height();
    elementMarginY = Math.round(height / 30);
    topMargin = Math.round(height * 0.08);
    halfT = Math.round(height / 7);
    //span.text(width + ", " + height);
    if (fiData != undefined)
        render(duration);
}
//生成原始数列
var fiData = new Array();
fiData.push(1);
fiData.push(1);
for (var i = 2; i < 30; i++) {
    fiData.push(fiData[i - 2] + fiData[i - 1]);
}
//生成元素的位置
function elementPosition(i) {
    var result = {
        i: i,
        x: 0,
        y: 0,

    }
    result.y = Math.round(topMargin + elementMarginY * i);
    result.x = Math.round(Math.round(width * 11 / 23) * Math.sin((Math.PI / halfT) * result.y - Math.PI) + width / 2);
    return result;
}
svg.style("height", function (d, i) {
    return elementPosition(fiData.length + 1).y + "px";
});
$("div#setting .dropdown-menu").append("<li class='list-group-item'>图形设置</li><li class='list-group-item'>曲线张合幅度<br /><input id='sinpath' type='range' min='0' max='100' onchange='rangeOnChange()'/></li>");
$("div#info .dropdown-menu").append("<li class='list-group-item list-group-item-info'>斐波那契数列</li><li class='list-group-item list-group-item-info'><i>F(N)=F(N-1)+F(N-2)<br />(n≥2,n∈N*)</i><br />斐波那契数列的每一项都会以同种颜色指向作为其和的前两项</li>");
$("div#info .dropdown-menu i").css("font-family", "Times New Roman");
//生成两点中位线上点
var quadraticCurveDistance = 0.15;
function quadraticCurvePoint(i1, i2, r) {
    x1 = elementPosition(i1).x;
    y1 = elementPosition(i1).y;
    x2 = elementPosition(i2).x;
    y2 = elementPosition(i2).y;
    k = (x2 - x1) / (y1 - y2);
    x = (x1 + x2) / 2;
    y = (y1 + y2) / 2;
    cos = Math.sqrt(1 / (1 + k * k));
    sin = cos * k;
    d = distance({
        x: x1,
        y: y1
    }, {
        x: x2,
        y: y2
    });
    var result = {
        x: x + d * Math.pow(-1, i2 - i1) * r * cos,
        y: y + d * Math.pow(-1, i2 - i1) * r * sin,
        i1: i1,
        i2: i2,
        d: d
    }
    return result;
}
//计算两点间距离
function distance(a, b) {
    return Math.round(Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)));
}
//根据数据生成颜色
function fillColor(d, i) {
    var color = d % 0xffffff;
    var RmG = Math.round(color / 0xffff) - Math.round(color % 0xffff / 0xff);
    var GmB = Math.round(color % 0xffff / 0xff) - Math.round(color % 0xff);
    var BmR = Math.round(color % 0xff) - Math.round(color / 0xffff);
    color += Math.round(RmG * 0xffff + GmB * 0xff + BmR);
    color = color > 0xffffff ? color % 0xffffff : (color < 0x000000 ? color + 0xffffff : color);
    switch (color.toString(16).length) {
        case 0:
            return "#000000";
        case 1:
            return "#00" + color.toString(16) + "00" + color.toString(16);
        case 2:
            return "#" + color.toString(16) + color.toString(16) + color.toString(16);
        case 3:
            return "#00" + color.toString(16) + "0" + color.toString(16);
        case 4:
            return "#00" + color.toString(16);
        case 5:
            return "#0" + color.toString(16);
        case 6:
            return "#" + color.toString(16);
        default:
            return "#000000";
    }
}
//图像生成器
function initialRender(t) {
    var rate = quadraticCurveDistance;
    //生成文字
    svg.selectAll("text").data(fiData).enter().append("text").transition().duration(t).ease(d3.easePolyInOut)
        .text(function (d, i) {
            return d;
        })
        .attr("x", function (d, i) {
            if (elementPosition(i).x < $(window).width() * 0.13)
                return (elementPosition(i).x) + "px";
            else if (elementPosition(i).x > $(window).width() * 0.77)
                return (elementPosition(i).x - d.toString().length * Math.round(height * 0.025 * 0.51)) + "px";
            else
                return (elementPosition(i).x - d.toString().length * Math.round(height * 0.025 / 2)) + "px";
        })
        .attr("y", function (d, i) {
            return (elementPosition(i).y - 8) + "px";
        })
        .style("font-size", Math.round(height * 0.025) + "px")
        .style("fill", function () {
            var color;
            color = Math.round(((height / 2000) * 0xff) % 0xff);
            var str = "#" + color.toString(16) + color.toString(16) + color.toString(16);
            return str;
        })
        .attr("id", function (d, i) {
            return "t" + i.toString();
        });
    //生成线条
    svg.selectAll("path").data(fiData).enter().append("path").transition().duration(t).ease(d3.easePolyInOut).attr("d", function (d, i) {
        var path = d3.path();
        if (i > 1) {
            path.moveTo(elementPosition(i).x, elementPosition(i).y);
            path.quadraticCurveTo(quadraticCurvePoint(i, i - 1, rate).x, quadraticCurvePoint(i, i - 1, rate).y, elementPosition(i - 1).x, elementPosition(i - 1).y);
            path.moveTo(elementPosition(i).x, elementPosition(i).y);
            path.quadraticCurveTo(quadraticCurvePoint(i, i - 2, rate).x, quadraticCurvePoint(i, i - 2, rate).y, elementPosition(i - 2).x, elementPosition(i - 2).y)
        }
        return path.toString();
    }).style("stroke", function (d, i) {
        return fillColor(d, i);
    }).style("fill", "none").style("stroke-width", (1 + Math.round(height / 400)).toString()).attr("id", function (d, i) {
        return "p" + i.toString();
    }).style("z-index", "0");
    //生成圆点
    svg.selectAll("circle").data(fiData).enter().append("circle").transition().duration(t).ease(d3.easePolyInOut)
        .attr("r", "5px")
        .attr("cx", function (d, i) {
            return elementPosition(i).x + "px";
        })
        .attr("cy", function (d, i) {
            return elementPosition(i).y + "px";
        })
        .style("fill", function (d, i) {
            return fillColor(d, i);
        })
        .attr("id", function (d, i) {
            return "c" + i.toString();
        })
        .style("z-index", "1000");
}
initialRender(duration);
function render(t) {
    svg.style("height", function (d, i) {
        return elementPosition(fiData.length + 1).y + "px";
    });
    var rate = quadraticCurveDistance;
    svg.selectAll("path").data(fiData).transition().duration(t).ease(d3.easeBounceIn).attr("d", function (d, i) {
        var path = d3.path();
        if (i > 1) {
            path.moveTo(elementPosition(i).x, elementPosition(i).y);
            path.quadraticCurveTo(quadraticCurvePoint(i, i - 1, rate).x, quadraticCurvePoint(i, i - 1, rate).y, elementPosition(i - 1).x, elementPosition(i - 1).y);
            path.moveTo(elementPosition(i).x, elementPosition(i).y);
            path.quadraticCurveTo(quadraticCurvePoint(i, i - 2, rate).x, quadraticCurvePoint(i, i - 2, rate).y, elementPosition(i - 2).x, elementPosition(i - 2).y)
        }
        return path.toString();
    }).style("stroke", function (d, i) {
        return fillColor(d, i);
    }).style("fill", "none").style("stroke-width", (1 + Math.round(height / 400)).toString());
    svg.selectAll("text").data(fiData).transition().duration(t).ease(d3.easePolyInOut)
        .text(function (d, i) {
            return d;
        })
        .attr("x", function (d, i) {
            if (elementPosition(i).x < $(window).width() * 0.13)
                return (elementPosition(i).x) + "px";
            else if (elementPosition(i).x > $(window).width() * 0.77)
                return (elementPosition(i).x - d.toString().length * Math.round(height * 0.025 * 0.51)) + "px";
            else
                return (elementPosition(i).x - d.toString().length * Math.round(height * 0.025 / 2)) + "px";
        })
        .attr("y", function (d, i) {
            return (elementPosition(i).y - 8) + "px";
        })
        .style("font-size", Math.round(height * 0.025) + "px")
        .style("fill", function () {
            var color;
            color = Math.round(((height / 2000) * 0xff) % 0xff);
            var str = "#" + color.toString(16) + color.toString(16) + color.toString(16);
            return str;
        });
    svg.selectAll("circle").data(fiData).transition().duration(t).ease(d3.easePolyInOut)
        .attr("r", function () {
            var r;
            r = 5 * height / 500;
            return r + "px";
        })
        .attr("cx", function (d, i) {
            return elementPosition(i).x + "px";
        })
        .attr("cy", function (d, i) {
            return elementPosition(i).y + "px";
        })
        .style("fill", function (d, i) {
            return fillColor(d, i);
        });
}
var duration = 1000;
var id;
$(this).scroll(function () {
    //alert($(this).scrollTop() - elementPosition(fiData.length - 30).y);
    if ($(this).scrollTop() - elementPosition(fiData.length - 32).y > elementMarginY) {
        var i = fiData.length;
        fiData.push(fiData[i - 2] + fiData[i - 1]);
        render();
        svg.selectAll("path").data(fiData).exit();
        svg.selectAll("circle").data(fiData).exit();
        svg.selectAll("text").data(fiData).exit();
        initialRender(duration);
        hover();
    }
});
function hover() {
    $("circle").hover(function () {
        $(this).attr("r", function () {
            var r;
            r = 9 * height / 500;
            return r + "px";
        }).css("stroke", "red");
        id = $(this).attr("id");
        id = id.replace("c", "p");
        $("path#" + id).css("strokeWidth", (2 + Math.round(height / 400) * 3).toString()).css("stroke", "red");
        id = id.replace("p", "t");
        $("text#" + id).css("fill", "transparent");
    }, function () {
        $(this).css("stroke", "darkgrey").attr("r", function () {
            var r;
            r = 5 * height / 500;
            return r + "px";
        });
        id = $(this).attr("id");
        id = id.replace("c", "p");
        $("path#" + id).css("strokeWidth", (1 + Math.round(height / 400) * 1).toString()).css("stroke", $(this).css("fill"));
        id = id.replace("p", "t");
        $("text#" + id).css("fill", function () {
            var color;
            color = Math.round(((height / 2000) * 0xff) % 0xff);
            var str = "#" + color.toString(16) + color.toString(16) + color.toString(16);
            return str;
        });
    });
}
hover();
function rangeOnChange() {
    var range = $("input#sinpath");
    quadraticCurveDistance = range.val() / 200;
    render(duration);
}