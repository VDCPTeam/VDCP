//实时获取窗口宽度
var width;
var height;
var minRadious = 0.00000000001;
var baseRadious = minRadious;
var speed = Math.sqrt(10);
var qcrate = 0.38;
//var span = script.select("body").append("span").style("font-size", "8px");
resize();
function resize() {
    width = $("div.container.well").width();
    height = $(window).height();
    //span.text(width + ", " + height);
}
var svg = d3.select("div.container.well").append("svg").classed("helix", true)
    .style("width", "100%")
    .style("height", Math.round(height * 0.75) + "px");
var fiData = new Array();
function dataMaker(max) {
    fiData[0] = {
        x: Math.round(width / 2),
        y: Math.round(Math.round(height * 0.75) / 2),
        data: 1
    };
    fiData[1] = {
        x: fiData[0].x + baseRadious,
        y: fiData[0].y + baseRadious,
        data: 1
    };
    var i;
    for (i = 2; i < max; i++) {
        fiData[i] = {
            x: 0,
            y: 0,
            data: fiData[i - 1].data + fiData[i - 2].data
        }
        switch (i % 4) {
            case 0:
                fiData[i].x = fiData[i - 1].x - fiData[i].data * baseRadious;
                fiData[i].y = fiData[i - 1].y + fiData[i].data * baseRadious;
                break;
            case 1:
                fiData[i].x = fiData[i - 1].x + fiData[i].data * baseRadious;
                fiData[i].y = fiData[i - 1].y + fiData[i].data * baseRadious;
                break;
            case 2:
                fiData[i].x = fiData[i - 1].x + fiData[i].data * baseRadious;
                fiData[i].y = fiData[i - 1].y - fiData[i].data * baseRadious;
                break;
            case 3:
                fiData[i].x = fiData[i - 1].x - fiData[i].data * baseRadious;
                fiData[i].y = fiData[i - 1].y - fiData[i].data * baseRadious;
                break;
        }
    }
}
dataMaker(70);
function distance(a, b) {
    return Math.round(Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)));
}
function quadraticCurvePoint(i1, i2, r) {
    x1 = i1.x;
    y1 = i1.y;
    x2 = i2.x;
    y2 = i2.y;
    var k = (x2 - x1) / (y1 - y2);
    var x = (x1 + x2) / 2;
    var y = (y1 + y2) / 2;
    var cos = Math.sqrt(1 / (1 + k * k));
    var sin = cos * k;
    var d = distance({
        x: x1,
        y: y1
    }, {
        x: x2,
        y: y2
    });
    var result = {
        x: x + d * r * cos,
        y: y + d * r * sin,
        i1: i1,
        i2: i2,
        d: d
    }
    return result;
}
function initRender() {
    dataMaker(50);
    svg.selectAll("circle").data(fiData).enter()
        .append("circle")
        .attr("cx", function (d, i) {
            return d.x + "px";
        })
        .attr("cy", function (d, i) {
            return d.y + "px";
        })
        .attr("r", "3px")
        .style("stroke", "steelblue")
        .style("fill", "steelblue");
    svg.selectAll("path").data(fiData).enter()
        .append("path")
        .attr("d", function (d, i) {
            var path = d3.path();
            path.moveTo(d.x, d.y);
            if (i > 0) {
                var qp = quadraticCurvePoint(fiData[i - 1], fiData[i], i % 4 < 2? -qcrate : qcrate);
                path.quadraticCurveTo(qp.x, qp.y, fiData[i - 1].x, fiData[i - 1].y);
            }
            path.closePath();
            return path.toString();
        })
        .style("stroke", "steelblue")
        .style("fill", "none");
    svg.selectAll("text").data(fiData).enter().append("text")
        .text(function (d, i) {
            return d.data;
        })
        .attr("x", function (d, i) {
            return (d.x) + "px";
        })
        .attr("y", function (d, i) {
            return (d.y) + "px";
        })
        .style("font-size", Math.round(height * 0.025) + "px")
        .style("fill", function (d, i) {
            if (distance(d, fiData[0]) < 20 && i != 0)
                return "transparent";
            var color;
            color = Math.round(((height / 2000) * 0xff) % 0xff);
            var str = "#" + color.toString(16) + color.toString(16) + color.toString(16);
            return str;
        });
}
initRender();
function render() {
    dataMaker(70);
    svg.selectAll("circle").data(fiData).transition().duration(5000)
        .attr("cx", function (d, i) {
            return d.x + "px";
        })
        .attr("cy", function (d, i) {
            return d.y + "px";
        })
        .attr("r", "3px")
        .style("stroke", "steelblue")
        .style("fill", "steelblue");
    svg.selectAll("path").data(fiData).transition().duration(5000)
        .attr("d", function (d, i) {
            var path = d3.path();
            path.moveTo(d.x, d.y);
            if (i > 0) {
                var qp = quadraticCurvePoint(fiData[i - 1], fiData[i], i % 4 < 2? -qcrate : qcrate);
                path.quadraticCurveTo(qp.x, qp.y, fiData[i - 1].x, fiData[i - 1].y);
            }
            path.closePath();
            return path.toString();
        })
        .style("stroke", "steelblue")
        .style("fill", "none");
    svg.selectAll("text").data(fiData).transition().duration(5000)
        .text(function (d, i) {
            return d.data;
        })
        .attr("x", function (d, i) {
            return (d.x) + "px";
        })
        .attr("y", function (d, i) {
            return (d.y) + "px";
        })
        .style("font-size", Math.round(height * 0.025) + "px")
        .style("fill", function (d, i) {
            if (distance(d, fiData[0]) < 20 && i != 0)
                return "transparent";
            var color;
            color = Math.round(((height / 2000) * 0xff) % 0xff);
            var str = "#" + color.toString(16) + color.toString(16) + color.toString(16);
            return str;
        });
}
var mult = true;
var ishalt = false;
setInterval(function () {
    if (ishalt)
        return;
    if (baseRadious > width / 2)
        mult = false;
    else if (baseRadious < minRadious)
        mult = true;
    if (mult)
        baseRadious *= speed;
    else
        baseRadious /= speed;
    render();
}, 5000);
$("div#info .dropdown-menu").append("<li class='list-group-item list-group-item-info'>斐波那契数列</li><li class='list-group-item list-group-item-info'><i>F(N)=F(N-1)+F(N-2)<br />(n≥2,n∈N*)</i><br />斐波那契螺旋线也同样展示了其前两项之和为下一项的特性</li>");
$("div#info .dropdown-menu i").css("font-family", "Times New Roman");

var control = 0;
function halt() {
    if (control == 1000)
        control = 0;
    if (control % 2 == 0) {
        $("button#auto").attr("class", "btn btn-success glyphicon glyphicon-play");
        control++;
        ishalt = true;
    }
    else {
        $("button#auto").attr("class", "btn btn-danger glyphicon glyphicon-pause");
        control++;
        ishalt = false;
    }
}
function plus() {
    baseRadious *= speed;
    speed *= 1.1;
    render();
}
function minus() {
    baseRadious /= speed;
    speed /= 1.1;
    render();
}