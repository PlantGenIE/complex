/*
 *  File:         complex.js
 *  Description:  Main script for ComPlEX
 *  Author:   	  Chanaka Mannapperuma
 *  Created:      Thu May 15 10:04:04 GMT+02:00 2014
 */
function populate_select_options(e, t, n) {
    $(t).html("");
    $(e).each(function(r) {
        if (e[r].value == n) {
            $(t).append('<option selected value="' + e[r].value + '">' + e[r].display + "</option>")
        } else {
            $(t).append('<option value="' + e[r].value + '">' + e[r].display + "</option>")
        }
    })
}

function align_or_compare(e) {
    if (typeof e === "undefined") {
        e = "align";
        $("#newtrok_mode").html(" <font color='#b94a48'>- Aligning " + $("#sp_1 option:selected").text() + '..</font><img src="images/btnloader.GIF" /> ')
    } else {
        $("#newtrok_mode").html(" <font color='#b94a48'>- Compairing " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text() + '</font>..<img src="images/btnloader.GIF" /> ')
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
                $("#newtrok_mode").html(" - Aligned " + $("#sp_1 option:selected").text())
            } else {
                $("#newtrok_mode").html(" - Comapred " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text())
            }
        },
        success: function(t) {
            if (e === "align") {
                $("#newtrok_mode").html(" - Aligned " + $("#sp_1 option:selected").text())
            } else {
                $("#newtrok_mode").html(" - Comapred " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text())
            }
            $("#loader").hide();
            var n = JSON.parse(t);
            var r = n["tmp_array1"];
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
    $("#newtrok_mode").html(' <font color="#b94a48">- Adding co-expression genes..</font><img src="images/btnloader.GIF"/>');
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
        url: "service/post.php",
        data: v,
        error: function(e, t, n) {},
        success: function(e) {
            $("#loader").hide();
            var t = JSON.parse(e);
            var n = t["tmp_array1"];
            n = JSON.stringify(n).replace(/\\"/g, "");
            n = JSON.parse(n);
            var r = t["tmp_array2"];
            r = JSON.stringify(r).replace(/\\"/g, "");
            r = JSON.parse(r);
            if ((n.nodes.length + n.edges.length) > 5e3) {
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
                complexmessage.warning("There will be " + n.nodes.length + " nodes and " + n.edges.length + " connections. Please select higher threshold.", "Too many edges..");
                $("#newtrok_mode").html(" - too many edges for adding co-expression genes")
            } else {
                initPanels(n, r);
                $("#newtrok_mode").html(" - Added co-expression genes")
            }
            $("#newtrok_mode").html(" - Added co-expression genes")
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
    $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text());
    $("#compare_with_species_button").html("Compaire " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
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
        $("#sink" + t).val("POPTR_0001s00710,POPTR_0003s05690,POPTR_0007s10830,POPTR_0011s10440,POPTR_0015s10230,POPTR_0001s01510,POPTR_0008s21090,POPTR_0001s15190,POPTR_0001s09390,POPTR_0001s17730,POPTR_0003s10790,POPTR_0004s08390,POPTR_0005s06810,POPTR_0016s05210,POPTR_0002s19670,POPTR_0018s08990,POPTR_0003s08060,POPTR_0003s09980,POPTR_0005s14110,POPTR_0003s12760,POPTR_0004s07930,POPTR_0004s15260,POPTR_0002s09400,POPTR_0005s16620,POPTR_0014s11520,POPTR_0001s18590,POPTR_0002s23380")
    }
    if ($("#sp_" + t).val() == "at") {
        $("#sink" + t).val("AT1G06590,AT1G15570,AT1G34065,AT1G48270,AT1G79820,AT2G23380,AT2G31650,AT3G14740,AT3G19080,AT3G25100,AT4G08690,AT4G11450,AT4G16970,AT4G33130,AT5G06940,AT5G37630,AT5G45560,AT5G62410,AT5G63920")
    }
    if ($("#sp_" + t).val() == "os") {
        $("#sink" + t).val("Os10g0563500,Os06g0199800,Os06g0275500,Os09g0134500,Os03g0307800,Os11g0128400,Os12g0124700,Os03g0105800,Os01g0904400,Os02g0102800,Os02g0274900,Os02g0752000")
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
        if (t == undefined) {
            loadexample(1)
        } else {
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
        if (n == undefined) {
            loadexample(2)
        } else {
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

function sendtogenebaskets() {
    var e = [];
    for (var t in vis1.selected("nodes")) {
        e.push(vis1.selected("nodes")[t].data.label)
    }
    var n = [];
    for (var r in vis2.selected("nodes")) {
        n.push(vis2.selected("nodes")[r].data.label)
    }
    var i = "sp1=" + $("#sp_1").val() + "&sp1_genes=" + e + "&sp2=" + $("#sp_2").val() + "&sp2_genes=" + n;
    if (vis1.selected("nodes").length != 0) {
        $.ajax({
            type: "POST",
            url: "service/getgenelist.php",
            data: i,
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
    var t = e.toString();
    var n = $("#sink" + t).val();
    var r = $("#sp_" + t).val();
    var i;
    if (r == "at") {
        i = "AT"
    }
    if (r == "pt") {
        i = "PO"
    }
    if (r == "os") {
        i = "Os"
    }
    console.log(n, i);
    return n.indexOf(i) === 0
}
window.onload = function() {
    visibilitychange();
    $("#loader").hide();
    var e = [{
        display: "A. thaliana",
        value: "at"
    }, {
        display: "P. trichocarpa",
        value: "pt"
    }, {
        display: "P. abies",
        value: "os"
    }];
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
    populate_select_options(t, "#sp_1");
    populate_select_options(e, "#sp_2");
    var n = "P. trichocarpa";
    var r = "A. thaliana";
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
    $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text());
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
        e = t;
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
        $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text());
        $("#compare_with_species_button").html("Compaire " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
        loadexample(1);
        loadexample(2);
        align_or_compare()
    });
    $("#sp_2").change(function() {
        var t = [];
        var n = $(this).val();
        t = e;
        t = jQuery.grep(t, function(e) {
            return e.value != n
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
        $("#align_to_species_button").html("Align " + $("#sp_1 option:selected").text());
        $("#compare_with_species_button").html("Compare " + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text());
        loadexample(1);
        loadexample(2);
        align_or_compare("compare")
    });
    $("#th1").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(" + t.value + ")");
        align_or_compare()
    });
    $("#consth1").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(" + t.value + ")");
        align_or_compare()
    });
    $("#th2").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(" + t.value + ")");
        align_or_compare("compare")
    });
    $("#consth2").bind("slider:changed", function(e, t) {
        $("#" + this.id + "_span").html("(" + t.value + ")");
        align_or_compare("compare")
    })
}

/*Only change the visibility*/
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