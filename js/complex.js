/*
 *  File:           complex.js
 *  Author          Chanaka Mannapperuma
 *  Description:    Main script for ComPlEX2
 *  Created:        Thu May 15 10:04:04 GMT+02:00 2014
 */
function populate_select_options(data, element, selected_option) {
    $(element).html("");
    $(data).each(function(i, val) {
        if (val.name == selected_option) {
            $(element).append('<option selected value="' + val.id + '">' + val.name + "</option>")
        } else {
            $(element).append('<option value="' + val.id + '">' + val.name + "</option>")
        }
    })
}

function align_or_compare(e) {
    if (typeof e === "undefined") {
        e = "align";
        $("#newtrok_mode").html(" <font color='#b94a48'>- Aligning " + $("#sp_1 option:selected").text() + '..</font><img src="images/btnloader.GIF" /> ')
    } else {
        $("#newtrok_mode").html(" <font color='#b94a48'>- Comparing " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text() + '</font>..<img src="images/btnloader.GIF" /> ')
    }
    var t = "cytoscapeweb1";
    var n = "cytoscapeweb2";
    var r = $("#sink1").val();
    var i = $("#sp_1").val();
    var s = $("#th1").val();
    var o = $("#consth1").val();
    var u = $("#sink2").val();
    var a = $("#sp_2").val();
    var f = $("#th2").val();
    var l = $("#consth2").val();
    $("#at_num_span").removeClass("notificationcount2").addClass("notificationcount");
    $("#pt_num_span").removeClass("notificationcount2").addClass("notificationcount");
    $("#os_num_span").removeClass("notificationcount2").addClass("notificationcount");
    $("#at_image").removeClass("collage2").addClass("collage");
    $("#pt_image").removeClass("collage2").addClass("collage");
    $("#os_image").removeClass("collage2").addClass("collage");
    $("#" + i + "_image").removeClass("collage").addClass("collage2");
    $("#" + a + "_image").removeClass("collage").addClass("collage2");
    $("#" + i + "_num_span").removeClass("notificationcount").addClass("notificationcount2");
    $("#" + a + "_num_span").removeClass("notificationcount").addClass("notificationcount2");
    $("#loader").show();
    var c = "sink1=" + r + "&sp1=" + $("#sp_1").val() + "&th1=" + s + "&consth1=" + o + "&sink2=" + u + "&sp2=" + $("#sp_2").val() + "&th2=" + f + "&consth2=" + l + "&view_state=" + e;
    $.ajax({
        type: "POST",
        url: "service/final_post.php",
        data: c,
        error: function(t, n, r) {
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.error("Please enter correct genes.", "Invalid input..");
            if (e === "align") {
                $("#newtrok_mode").html(" - Aligned " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text())
            } else {
                $("#newtrok_mode").html(" - Compared " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text())
            }
        },
        success: function(t) {
            k = JSON.parse(t);
            k = k["msc"];
            if (e === "align") {
                $("#newtrok_mode").html(" - Aligned " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text() + " (Exec time:" + k + " s)")
            } else {
                $("#newtrok_mode").html(" - Compared " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text() + " (Exec time:" + k + " s)")
            }
            $("#loader").hide();
            var n = JSON.parse(t);
            var r = n["tmp_array1"];
            if (r == undefined) {
                complexmessage.error("Please enter correct genes.", "Invalid input..");
                if (e === "align") {
                    $("#newtrok_mode").html(" - Aligned " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text())
                } else {
                    $("#newtrok_mode").html(" - Compared " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text())
                }
                $("#loader").hide();
                return
            }
            r = JSON.stringify(r).replace(/\\"/g, "");
            r = JSON.parse(r);
            var i = n["tmp_array2"];
            i = JSON.stringify(i).replace(/\\"/g, "");
            i = JSON.parse(i);
            listening_ARRAY_1 = [];
            listening_ARRAY_2 = [];
            initPanels(r, i)
        }
    })
}

function add_co_expressions(e, t, n, r, i) {
    listening_ARRAY_1 = [];
    listening_ARRAY_2 = [];
    $("#newtrok_mode").html(' <font color="#b94a48">- Adding co-expressed genes..</font><img src="images/btnloader.GIF"/>');
    var s = "cytoscapeweb1";
    var o = "cytoscapeweb2";
    var u = $("#sink1").val();
    var a = $("#sp_1").val();
    var f = $("#th1").val();
    var l = $("#consth1").val();
    var c = $("#sink2").val();
    var h = $("#sp_2").val();
    var p = $("#th2").val();
    var d = $("#consth2").val();
    $("#loader").show();
    var v = "op=" + e + "&sp=" + t + "&thexp=" + n + "&selG=" + r + "&allG=" + i + "&sink1=" + u + "&sp1=" + $("#sp_1").val() + "&th1=" + f + "&consth1=" + l + "&sp2=" + $("#sp_2").val() + "&th2=" + p + "&consth2=" + d;
    $.ajax({
        type: "POST",
        url: "service/final_post.php",
        data: v,
        error: function(e, t, n) {},
        success: function(e) {
            $("#loader").show();
            if (e.trim() == '"overflow"' || e.trim() == "overflow") {
                complexmessage.options = {
                    closeButton: false,
                    debug: false,
                    positionClass: "toast-bottom-right",
                    onclick: null,
                    showDuration: "100",
                    hideDuration: "100",
                    timeOut: "8000",
                    extendedTimeOut: "1000",
                    showEasing: "linear",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut"
                };
                complexmessage.warning("There will be  more than 200 nodes connections. Please select higher threshold.", "Too many neighbors to display..");
                $("#newtrok_mode").html(" - too many edges for adding co-expressed genes");
                $("#loader").hide();
                return true
            }
            $("#loader").hide();
            var t = JSON.parse(e);
            var n = t["tmp_array1"];
            if (n == undefined) {
                complexmessage.warning("There are no connections. Please select lower threshold.", "Can not expand at this threshold..");
                $("#newtrok_mode").html(" - No neighbors at this threshold");
                $("#loader").hide();
                return
            }
            n = JSON.stringify(n).replace(/\\"/g, "");
            n = JSON.parse(n);
            var r = t["tmp_array2"];
            r = JSON.stringify(r).replace(/\\"/g, "");
            r = JSON.parse(r);
            var i = t["msc"];
            i = JSON.stringify(i).replace(/\\"/g, "");
            i = JSON.parse(i);
            if (n.edges == null) {
                complexmessage.options = {
                    closeButton: false,
                    debug: false,
                    positionClass: "toast-bottom-right",
                    onclick: null,
                    showDuration: "100",
                    hideDuration: "100",
                    timeOut: "8000",
                    extendedTimeOut: "1000",
                    showEasing: "linear",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut"
                };
                complexmessage.warning("Thereare no connections. Please select lower threshold.", "Can not expand at this threshold..");
                $("#newtrok_mode").html(" - No neighbors at this threshold");
                $("#loader").hide();
                return true
            }
            if (n.nodes.length + n.edges.length > 2e3) {
                complexmessage.options = {
                    closeButton: false,
                    debug: false,
                    positionClass: "toast-bottom-right",
                    onclick: null,
                    showDuration: "100",
                    hideDuration: "100",
                    timeOut: "8000",
                    extendedTimeOut: "1000",
                    showEasing: "linear",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut"
                };
                complexmessage.warning("There will be " + n.nodes.length + " nodes and " + n.edges.length + " connections. Please select higher threshold.", "Too many neighbors to display..");
                $("#newtrok_mode").html(" - too many edges for adding co-expressed genes");
                $("#loader").hide()
            } else {
                initPanels(n, r,"expand_only");
                $("#newtrok_mode").html(" - Added co-expressed genes (Exec time:" + i + " s)")
            }
            $("#newtrok_mode").html(" - Added co-expressed genes (Exec time:" + i + " s)")
        }
    })
}

function getCookie(e) {
    var t, n, r, i = document.cookie.split(";");
    for (t = 0; t < i.length; t++) {
        n = i[t].substr(0, i[t].indexOf("="));
        r = i[t].substr(i[t].indexOf("=") + 1);
        n = n.replace(/^\s+|\s+$/g, "");
        if (n == e) {
            return unescape(r)
        }
    }
}

function setCookie(e, t, n) {
    var r = new Date;
    r.setDate(r.getDate() + n);
    var i = escape(t) + (n == null ? "" : "; expires=" + r.toUTCString());
    document.cookie = e + "=" + i
}

function align_selected() {
    var e = [];
    var t = vis1.selected("nodes");
    for (var n in t) {
        e.push(t[n].data.label)
    }
    $("#sink1").val(e.join(","));
    align_or_compare();
    vis1.deselect("nodes")
}

function compare_selected() {
    var e = [];
    var t = [];
    var n = vis1.selected("nodes");
    for (var r in n) {
        e.push(n[r].data.label)
    }
    var i = vis2.selected("nodes");
    for (var r in i) {
        t.push(i[r].data.label)
    }
    $("#sink1").val(e.join(","));
    $("#sink2").val(t.join(","));
    align_or_compare("compare");
    vis1.deselect("nodes")
}

function init(callback) {
    $.ajax({
        url: "service/metadata.php",
        type: "POST",
        data: {method: "get_networks"},
        dataType: "JSON",
        success: function(data) {
            callback(data);
        }
    });
}

function fire_onchange_onclick(e) {
    return;
    $("#sp_1").val(e);
    var t = [{
        display: "P. trichocarpa",
        value: "pt"
    }, {
        display: "A. thaliana",
        value: "at"
    }, {
        display: "P. abies",
        value: "os"
    }];
    var n = [];
    var r = e;
    n = t;
    n = jQuery.grep(n, function(e) {
        return e.value != r
    });
    populate_select_options(n, "#sp_2", $("#sp_2").val());
    setCookie("sp_1_selection", r, 1);
    setCookie("sp_2_selection", $("#sp_2").val(), 1);
    $("#span_sp1").html($("#sp_1 option:selected").text());
    $("#span_l_sp1").html($("#sp_1 option:selected").text());
    $("#span_sp2").html($("#sp_2 option:selected").text());
    $("#span_l_sp2").html($("#sp_2 option:selected").text());
    $("#species_span_1").html($("#sp_1 option:selected").text());
    $("#species_span_2").html($("#sp_2 option:selected").text());
    $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text());
    $("#compare_with_species_button").html("Compare " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
    align_or_compare()
}

function visibilitychange() {
    var e = false;

    var t, n, r;
    if (typeof document.hidden !== "undefined") {
        t = "hidden", r = "visibilitychange", n = "visibilityState"
    } else if (typeof document.mozHidden !== "undefined") {
        t = "mozHidden", r = "mozvisibilitychange", n = "mozVisibilityState"
    } else if (typeof document.msHidden !== "undefined") {
        t = "msHidden", r = "msvisibilitychange", n = "msVisibilityState"
    } else if (typeof document.webkitHidden !== "undefined") {
        t = "webkitHidden", r = "webkitvisibilitychange", n = "webkitVisibilityState"
    }
    document.addEventListener(r, function() {
        switch (document[n]) {
            case "visible":
                if (e == true) {
                    download_genes2()
                }
                e = false;
                break;
            case "hidden":
                e = true;
                break
        }
    })
}

function loadexample(e) {
    var t = e.toString();
    if ($("#sp_" + t).val() == "pt") {
        $("#sink" + t).val("Potra000167g00627,Potra000342g01183,Potra000393g01809,Potra000740g05836,Potra000779g06142,Potra001021g08534,Potra001047g08885,Potra001066g09183,Potra001242g10676,Potra001542g12785,Potra001630g13406,Potra002004g15732,Potra002246g17253,Potra002409g18324,Potra002484g18790,Potra002574g19365,Potra002846g20119,Potra002888g20235,Potra002914g20296,Potra003265g21167,Potra003469g21770,Potra003868g23243,Potra003935g23615,Potra003972g23875,Potra004051g24387");
    }
    if ($("#sp_" + t).val() == "at") {
        $("#sink" + t).val("AT1G06590,AT1G15570,AT1G34065,AT1G48270,AT1G79820,AT2G23380,AT2G31650,AT3G14740,AT3G19080,AT3G25100,AT4G08690,AT4G11450,AT4G16970,AT4G33130,AT5G06940,AT5G37630,AT5G45560,AT5G62410,AT5G63920");
    }
    if ($("#sp_" + t).val() == "os") {
        $("#sink" + t).val("GRMZM2G445905,GRMZM2G111642,GRMZM2G113137,GRMZM2G037413,GRMZM2G074546,GRMZM2G018241,GRMZM2G150404,GRMZM2G028353,GRMZM2G082580,GRMZM2G002523,GRMZM2G039454,GRMZM2G122431,GRMZM2G055795,GRMZM2G122277,GRMZM2G011651");
    }
    complexmessage.options = {
        closeButton: false,
        debug: false,
        positionClass: "toast-bottom-right",
        onclick: null,
        showDuration: "100",
        hideDuration: "100",
        timeOut: "8000",
        extendedTimeOut: "1000",
        showEasing: "linear",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    complexmessage.success($("#sp_" + t + " option:selected").text() + " example genes loaded.", "Success!");
    align_or_compare()
}

function load_cookie(e) {
    var t = getCookie("sp_1_text");
    var n = getCookie("sp_2_text");
    if (e == "sp_1_text") {
        if (t == undefined) { /*loadexample(1)*/ } else {
            $("#sink1").val(t);
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "1000",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.success($("#sp_1 option:selected").text() + " genes loaded from previous search.", "Success!");
            align_or_compare()
        }
    }
    if (e == "sp_2_text") {
        if (n == undefined) { /*loadexample(2)*/ } else {
            $("#sink2").val(n);
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "1000",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.success($("#sp_2 option:selected").text() + " genes loaded from previous search.", "Success!")
        }
    }
}

function download_gene_completed(e) {
    if (e == 1) {
        complexmessage.options = {
            closeButton: false,
            debug: false,
            positionClass: "toast-bottom-right",
            onclick: null,
            showDuration: "100",
            hideDuration: "100",
            timeOut: "8000",
            extendedTimeOut: "1000",
            showEasing: "linear",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
        complexmessage.success($("#sp_1 option:selected").text() + " genes loaded from genelist.", "Success!");
        align_or_compare()
    } else {
        complexmessage.options = {
            closeButton: false,
            debug: false,
            positionClass: "toast-bottom-right",
            onclick: null,
            showDuration: "100",
            hideDuration: "100",
            timeOut: "8000",
            extendedTimeOut: "1000",
            showEasing: "linear",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
        complexmessage.success($("#sp_2 option:selected").text() + " genes loaded from genelist.", "Success!")
    }
}

function download_genes() {
    $("#prebox").delay(500).fadeOut();
    var e = "db=at&id=" + getCookie("atgenie_uuid");
    $.ajax({
        type: "GET",
        url: "service/basket.php",
        data: e,
        success: function(e) {
            var t = JSON.parse(e);
            if ($("#sp_1").val() == "at") {
                if (t.basket[0].harga == 0) {
                    load_cookie("sp_1_text")
                } else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink1").val(n);
                    download_gene_completed(1)
                }
            }
            if ($("#sp_2").val() == "at") {
                if (t.basket[0].harga == 0) {
                    load_cookie("sp_2_text")
                } else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink2").val(n);
                    download_gene_completed(2)
                }
            }
            var r = pad2(t.basket[0].harga);
            document.getElementById("at_num_span").innerHTML = r
        }
    });
    var t = "db=os&id=" + getCookie("congenie_uuid");
    $.ajax({
        type: "GET",
        url: "service/basket.php",
        data: t,
        success: function(e) {
            var t = JSON.parse(e);
            if ($("#sp_1").val() == "os") {
                if (t.basket[0].harga == 0) {
                    load_cookie("sp_1_text")
                } else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink1").val(n);
                    download_gene_completed(1)
                }
            }
            if ($("#sp_2").val() == "os") {
                if (t.basket[0].harga == 0) {
                    load_cookie("sp_2_text")
                } else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink2").val(n);
                    download_gene_completed(2)
                }
            }
            var r = pad2(t.basket[0].harga);
            document.getElementById("os_num_span").innerHTML = r
        }
    });
    var n = "db=pt&id=" + getCookie("popgenie_uuid");
    $.ajax({
        type: "GET",
        url: "service/basket.php",
        data: n,
        success: function(e) {
            var t = JSON.parse(e);
            if ($("#sp_1").val() == "pt") {
                if (t.basket[0].harga == 0) {
                    load_cookie("sp_1_text")
                } else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink1").val(n);
                    download_gene_completed(1)
                }
            }
            if ($("#sp_2").val() == "pt") {
                if (t.basket[0].harga == 0) {
                    load_cookie("sp_2_text")
                } else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink2").val(n);
                    download_gene_completed(2)
                }
            }
            var r = pad2(t.basket[0].harga);
            document.getElementById("pt_num_span").innerHTML = r
        }
    });
    glowme("#os_num_span")
}

function sendtogenebaskets(e) {
    var t = [];
    for (var n in vis1.selected("nodes")) {
        t.push(vis1.selected("nodes")[n].data.label)
    }
    var r = [];
    for (var i in vis2.selected("nodes")) {
        r.push(vis2.selected("nodes")[i].data.label)
    }
    var s = "sp1=" + $("#sp_1").val() + "&sp1_genes=" + t + "&sp2=" + $("#sp_2").val() + "&sp2_genes=" + r + "&replace=" + e;
    if (vis1.selected("nodes").length != 0) {
        $.ajax({
            type: "POST",
            url: "service/getgenelist.php",
            data: s,
            success: function(e) {
                complexmessage.options = {
                    closeButton: false,
                    debug: false,
                    positionClass: "toast-bottom-right",
                    onclick: null,
                    showDuration: "100",
                    hideDuration: "100",
                    timeOut: "1000",
                    extendedTimeOut: "1000",
                    showEasing: "linear",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut"
                };
                complexmessage.success(vis2.selected("nodes").length + " genes added to the " + $("#sp_2 option:selected").text() + " gene list.", "Success!");
                complexmessage.success(vis1.selected("nodes").length + " genes added to the " + $("#sp_1 option:selected").text() + " gene list.", "Success!");
                download_genes();
                var t = $("#sp_1").val();
                var n = $("#sp_2").val();
                $("#firsttable").stop();
                $("#firsttable").effect("transfer", {
                    to: "#" + t + "_num_span",
                    className: "ui-effects-transfer-2"
                }, 600);
                $("#secondtable").stop();
                $("#secondtable").effect("transfer", {
                    to: "#" + n + "_num_span", 
                    className: "ui-effects-transfer-2"
                }, 600)
            }
        })
    } else {
        complexmessage.options = {
            closeButton: false,
            debug: false,
            positionClass: "toast-bottom-right",
            onclick: null,
            showDuration: "100",
            hideDuration: "100",
            timeOut: "8000",
            extendedTimeOut: "1000",
            showEasing: "linear",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };
        complexmessage.error("Please select some genes.", "Empty selection")
    }
}

function pad2(e) {
    return (e < 10 ? 0 : "") + e
}

function glowme(e) {
    $(e).delay(60).css({
        opacity: .6
    }).animate({
        opacity: 1
    }, 60)
}

function basic_validation_function(e) {
    var t = e.toLowerCase();
    var n = $("#sink" + t).val();
    var r = $("#sp_" + t).val();
    var i;
    if (r == "at") {
        i = "AT"
    }
    if (r == "pt") {
        i = "Po"
    }
    if (r == "os") {
        i = "MA"
    }
    console.log(n, i);
    return n.indexOf(i) === 0
}

function download_genes2() {
    var e = "db=at&id=" + getCookie("atgenie_uuid");
    $.ajax({
        type: "GET",
        url: "service/basket.php",
        data: e,
        success: function(e) {
            var t = JSON.parse(e);
            if ($("#sp_1").val() == "at") {
                if (t.basket[0].harga == 0) {} else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink1").val(n)
                }
            }
            if ($("#sp_2").val() == "at") {
                if (t.basket[0].harga == 0) {} else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink2").val(n)
                }
            }
            var r = pad2(t.basket[0].harga);
            document.getElementById("at_num_span").innerHTML = r
        }
    });
    var t = "db=os&id=" + getCookie("congenie_uuid");
    $.ajax({
        type: "GET",
        url: "service/basket.php",
        data: t,
        success: function(e) {
            var t = JSON.parse(e);
            if ($("#sp_1").val() == "os") {
                if (t.basket[0].harga == 0) {} else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink1").val(n)
                }
            }
            if ($("#sp_2").val() == "os") {
                if (t.basket[0].harga == 0) {} else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink2").val(n)
                }
            }
            var r = pad2(t.basket[0].harga);
            document.getElementById("os_num_span").innerHTML = r
        }
    });
    var n = "db=pt&id=" + getCookie("popgenie_uuid");
    $.ajax({
        type: "GET",
        url: "service/basket.php",
        data: n,
        success: function(e) {
            var t = JSON.parse(e);
            if ($("#sp_1").val() == "pt") {
                if (t.basket[0].harga == 0) {} else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink1").val(n)
                }
            }
            if ($("#sp_2").val() == "pt") {
                if (t.basket[0].harga == 0) {} else {
                    var n = t.basket[0].genelist.join(",");
                    $("#sink2").val(n)
                }
            }
            var r = pad2(t.basket[0].harga);
            document.getElementById("pt_num_span").innerHTML = r
        }
    });
    glowme("#os_num_span");
    complexmessage.options = {
        closeButton: false,
        debug: false,
        positionClass: "toast-bottom-right",
        onclick: null,
        showDuration: "100",
        hideDuration: "100",
        timeOut: "8000",
        extendedTimeOut: "1000",
        showEasing: "linear",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    complexmessage.info("Please click align or compare button.", "Click to submit")
}

function coexpressiontrclick() {
    var e = $("#conservation_slider");
    if (e.is(":visible")) {
        $("#conservation_slider").fadeOut();
        $("#coexpressiontrclickbtn").html("Show conservation slider")
    } else {
        $("#conservation_slider").fadeIn();
        $("#coexpressiontrclickbtn").html("Hide conservation slider");
        $("#consth1").simpleSlider("setValue", $("#th1").val());
    }
}
window.onload = init(function(network_data) {
    visibilitychange()
    $("#loader").hide();
    populate_select_options(network_data, "#sp_1");
    populate_select_options(network_data, "#sp_2");
    var n;
    var r;
    var i = getCookie("sp_1_selection");
    var s = getCookie("sp_2_selection");
    if (i != null && i != undefined) {
        $("[name=sp1] option").each(function() {
            if ($(this).prop("value") == i) {
                $(this).prop("selected", "selected");

                n = $(this).html()
            }
        })
    }
    if (s != null && s != undefined) {
        $("[name=sp2] option").each(function() {
            if ($(this).prop("value") == s) {
                $(this).prop("selected", "selected");
                r = $(this).html()
            }
        })
    }
    $("#span_sp1").html(n);
    $("#span_sp2").html(r);
    $("#span_l_sp1").html(n);
    $("#span_l_sp2").html(r);
    $("#species_span_1").html(n);
    $("#species_span_2").html(r);
    $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text());
    $("#compare_with_species_button").html("Compare " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
    download_genes();
    $("#sink1").keyup(function() {
        if (basic_validation_function(1) == false) {
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.error("Please enter correct " + $("#sp_1 option:selected").text() + " gene ids.", "Invalid input..");
            return
        }
        setCookie("sp_1_text", $("#sink1").val(), 1)
    });
    $("#sink2").keyup(function() {
        if (basic_validation_function(2) == false) {
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.error("Please enter correct " + $("#sp_2 option:selected").text() + " gene ids.", "Invalid input..");
            return
        }
        setCookie("sp_2_text", $("#sink2").val(), 1)
    });
    $("#align_to_species_button").click(function(e) {
        if ($("#sink1").val() == "") {
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "1000",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.error(n + " text box is empty.", "Please eneter some genes..")
        } else {
            align_or_compare()
        }
    });
    $("#compare_with_species_button").click(function(e) {
        if ($("#sink2").val() == "") {
            complexmessage.options = {
                closeButton: false,
                debug: false,
                positionClass: "toast-bottom-right",
                onclick: null,
                showDuration: "100",
                hideDuration: "100",
                timeOut: "8000",
                extendedTimeOut: "1000",
                showEasing: "linear",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut"
            };
            complexmessage.error(r + " text box is empty.", "Please eneter some genes..")
        } else {
            align_or_compare("compare")
        }
    });
    $("#sp_1").change(function() {
        var e = [];
        var n = $(this).val();
        e = network_data;
        e = jQuery.grep(e, function(e) {
            return e.value != n
        });
        populate_select_options(e, "#sp_2", $("#sp_2").val());
        setCookie("sp_1_selection", n, 1);
        setCookie("sp_2_selection", $("#sp_2").val(), 1);
        $("#span_sp1").html($("#sp_1 option:selected").text());
        $("#span_l_sp1").html($("#sp_1 option:selected").text());
        $("#span_sp2").html($("#sp_2 option:selected").text());
        $("#span_l_sp2").html($("#sp_2 option:selected").text());
        $("#species_span_1").html($("#sp_1 option:selected").text());
        $("#species_span_2").html($("#sp_2 option:selected").text());
        $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text());
        $("#compare_with_species_button").html("Compare " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
        download_genes();
        align_or_compare()
    });
    $("#sp_2").change(function() {
        var t = [];
        var n = $(this).val();
        t = network_data;
        t = jQuery.grep(t, function(e) {
            return e.name != n
        });
        populate_select_options(t, "#sp_1", $("#sp_1").val());
        setCookie("sp_1_selection", $("#sp_1").val(), 1);
        setCookie("sp_2_selection", n, 1);
        $("#span_sp1").html($("#sp_1 option:selected").text());
        $("#span_l_sp1").html($("#sp_1 option:selected").text());
        $("#span_sp2").html($("#sp_2 option:selected").text());
        $("#span_l_sp2").html($("#sp_2 option:selected").text());
        $("#species_span_1").html($("#sp_1 option:selected").text());
        $("#species_span_2").html($("#sp_2 option:selected").text());
        $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text() + " with " + $("#sp_2 option:selected").text());
        $("#compare_with_species_button").html("Compare " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
        download_genes();
        align_or_compare()
    });
    $("#th1").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(>=" + t.value + ")");
        if (!$("#conservation_slider").is(":visible")) $("#consth1").simpleSlider("setValue", t.value);
        align_or_compare()
    });
    $("#consth1").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(>=" + t.value + ")");
        align_or_compare()
    });
    $("#th2").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(>=" + t.value + ")");
        align_or_compare()
    });
    $("#consth2").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(>=" + t.value + ")");
        align_or_compare()
    })
});
