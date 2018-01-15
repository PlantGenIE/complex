function initPanels(e, t, exp_o) {
    if (e.nodes == null) {
        return
    }
    $("#newtrok_mode2").html(' <font color="#b94a48">&nbsp;- Rendering  ' + $("#sp_1 option:selected").text() + " and " + $("#sp_2 option:selected").text() + ' Networks.... </font><img src="images/btnloader.GIF"/>');
    var n = {
        dataSchema: {
            nodes: [{
                name: "label",
                type: "string"
            }, {
                name: "conN",
                type: "array"
            }, {
                name: "tf",
                type: "string"
            }, {
                name: "col",
                type: "int"
            }],
            edges: [{
                name: "corr",
                type: "float"
            }, {
                name: "col",
                type: "int"
            }, {
                name: "conE",
                type: "array"
            }]
        },
        data: e
    };
    vis1_tmp_array = e.nodes;
    var r = {
        dataSchema: {
            nodes: [{
                name: "label",
                type: "string"
            }, {
                name: "selected",
                type: "string"
            }, {
                name: "tf",
                type: "string"
            }, {
                name: "cons",
                type: "int"
            }],
            edges: [{
                name: "corr",
                type: "string"
            }, {
                name: "cons",
                type: "int"
            }, {
                name: "consE",
                type: "string"
            }]
        },
        data: t
    };
    vis2_tmp_array = t.nodes;
    vis1.ready(function() {
        $("#newtrok_mode2").html(' <font color="#b94a48">&nbsp;- Rendering ' + $("#sp_2 option:selected").text() + ' network.... </font><img src="images/btnloader.GIF"/>');
        vis1.addContextMenuItem("export svg", "nodes", function menu(event) {
            send_image(vis1.svg(), "svg");
        });
        vis1.addContextMenuItem("export xml", "nodes", function menu(event) {
            send_image(vis1.graphml(), "xml");
        });
        vis1.addContextMenuItem("Select first neighbors", "nodes", function(e) {
            var t = e.target;
            var n = vis1.selected("nodes");
            var r = vis1.firstNeighbors([t]);
            var i = r.neighbors;
            vis1.select([t]).select(i)
        });
        vis1.addContextMenuItem("Remove selected genes", "nodes", function(e) {
            var t = new Array;
            var n = vis1.selected("nodes");
            for (var r in n) t.push(n[r].data["id"]);
            for (var r in t) vis1.removeNode(t[r], true)
        });
        vis1.addContextMenuItem("Add co-expressed genes", "nodes", function(e) {
            var t = new Array;
            var n = vis1.selected("nodes");
            for (var r in n) t.push(n[r].data["label"]);
            var i = new Array;
            var s = vis1.nodes();
            for (var r in s) i.push(s[r].data["label"]);
            var o = $("#th1").val();
            add_co_expressions("expand", "1", o, t, i)
        });
        vis1.addListener("mouseover", "", function(e) {
            tmp_nodes_flag = true;
            tmp_nodes_flag2 = false;
            tmp_edges_flag = true;
            tmp_edges_flag2 = false
        });
        vis1.addListener("select", "nodes", function(e) {
            if (tmp_nodes_flag == true) {
                var t = [];
                var n = [];
                for (var r in e.target) {
                    node_ids = e.target[r].data.conN;
                    n.push(e.target[r].data.id);
                    var i = {
                        selected: "1"
                    };
                    if (node_ids.length >= 1) {
                        var s = node_ids.join(",").split(",");
                        vis2.updateData("nodes", s, i);
                        vis2.select("nodes", s);
                        listening_ARRAY_2.push(s[0])
                    }
                }
                allsel = vis1.selected("nodes");
                for (var r in allsel) {
                    t.push(allsel[r].data.label);
                    listening_ARRAY_1.push(allsel[r].data.id)
                }
                selectitem();
                getthepvalue(n)
            }
        });
        vis1.addListener("select", "edges", function(e) {
            if (tmp_edges_flag == true) {
                for (var t in e.target) {
                    var n = e.target[t].data.conE;
                    var r = {
                        cons: 2
                    };
                    if (n.length > 0) {
                        var i = n.join(",").split(",");
                        if (i != null && i != "") {
                            vis2.updateData("edges", i, r);
                            vis2.select("edges", i)
                        }
                    }
                }
            }
        });
        vis1.addListener("deselect", "nodes", function(e) {
            for (var t in e.target) {
                node_ids = e.target[t].data.conN;
                var n = {
                    selected: "0"
                };
                var r = node_ids.join(",").split(",");
                vis2.updateData("nodes", r, n);
                vis2.deselect("nodes", r);
                listening_ARRAY_1 = $.grep(listening_ARRAY_1, function(n) {
                    return n != e.target[t].data.id
                })
            }
            selectitem()
        });
        vis1.addListener("deselect", "edges", function(e) {
            for (var t in e.target) {
                var n = e.target[t].data.conE;
                var r = {
                    cons: 1
                };
                var i = n.join(",").split(",");
                vis2.updateData("edges", i, r);
                vis2.deselect("edges", i)
            }
        });
        $("#newtrok_mode2").html("")
    });
    vis2.ready(function() {
        $("#newtrok_mode2").html("");
        vis2.addContextMenuItem("export svg", "nodes", function menu(event) {
            send_image(vis.svg(), "svg");
        });
        vis2.addContextMenuItem("export xml", "nodes", function menu(event) {
            send_image(vis.graphml(), "xml");
        });
        vis2.addContextMenuItem("Select first neighbors", "nodes", function(e) {
            var t = e.target;
            var n = vis2.firstNeighbors([t]);
            var r = n.neighbors;
            vis2.select([t]).select(r)
        });
        vis2.addContextMenuItem("Remove selected genes", "nodes", function(e) {
            var t = new Array;
            var n = vis2.selected("nodes");
            for (var r in n) t.push(n[r].data["id"]);
            for (var r in t) vis2.removeNode(t[r], true)
        });
        vis2.addListener("mouseover", "", function(e) {
            tmp_nodes_flag = false;
            tmp_nodes_flag2 = true;
            tmp_edges_flag = false;
            tmp_edges_flag2 = true
        });
        vis2.addListener("select", "nodes", function(e) {
            if (tmp_nodes_flag2 == true) {
                var t = [];
                for (var n in e.target) {
                    t.push(e.target[n].data.label);
                    listening_ARRAY_2.push(e.target[n].data.id)
                }
                var r = [];
                for (var i in vis1.drawOptions.network.data.nodes) {
                    for (var s in listening_ARRAY_2) {
                        if (vis1.drawOptions.network.data.nodes[i].conN.toString().indexOf(listening_ARRAY_2[s].toString()) != -1) {
                            r.push(vis1.drawOptions.network.data.nodes[i].id)
                        }
                    }
                }
                vis1.select("nodes", r);
                listening_ARRAY_1 = r;
                selectitem();
                getthepvalue_opposite(listening_ARRAY_2)
            }
        })
    });
    vis2.addListener("deselect", "nodes", function(e) {
        for (var t in e.target) {
            listening_ARRAY_2 = $.grep(listening_ARRAY_2, function(n) {
                return n != e.target[t].data.id
            })
        }
        vis1.deselect("nodes");
        selectitem()
    });
    vis2.addListener("select", "edges", function(e) {
        if (tmp_edges_flag2 == true) {
            var t = [];
            for (var n in vis1.drawOptions.network.data.edges) {
                for (var r in vis2.selected("edges")) {
                    if (vis1.drawOptions.network.data.edges[n].conE.toString().indexOf(vis2.selected("edges")[r].data.id.toString()) != -1) {
                        t.push(vis1.drawOptions.network.data.edges[n].id)
                    }
                }
            }
            vis1.select("edges", t)
        }
    });
    vis2.addListener("deselect", "edges", function(e) {
        vis1.deselect("edges")
    });
    vis1.draw({
        network: n,
        visualStyle: visual_style1,
        preloadImages: false
    });
    if (exp_o != "expand_only") {
        vis2.draw({
            network: r,
            visualStyle: visual_style2
        });
        $("#cytoscapeweb2").vis2 = vis2;
    }
    $("#cytoscapeweb1").vis1 = vis1;
    selectitem();
    var i;
    var s;
    var o;
    var u;
    if (e.edges != null && e.edges.length !== 0) {
        e.edges.length == 1 ? i = "1 edge" : i = e.edges.length + " edges"
    } else {
        i = "no edges"
    }
    if (t.edges != null && t.edges.length !== 0) {
        t.edges.length == 1 ? s = "1 edge" : s = t.edges.length + " edges"
    } else {
        s = "no edges"
    }
    if (e.nodes != null && e.nodes.length !== 0) {
        e.nodes.length == 1 ? o = "1 node" : o = e.nodes.length + " nodes"
    } else {
        o = "no nodes"
    }
    if (t.nodes != null && t.nodes.length !== 0) {
        t.nodes.length == 1 ? u = "1 node" : u = t.nodes.length + " nodes"
    } else {
        u = "no nodes"
    }
    $("#network_info").html('<font color="#3d7489">(' + $("#sp_1 option:selected").text() + "</font> " + o + ' <font color="#3d7489">and</font> ' + i + ' <font color="#3d7489">| ' + $("#sp_2 option:selected").text() + "</font> " + u + ' <font color="#3d7489">and</font> ' + s + '<font color="#3d7489">)</font>');
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
    complexmessage.success($("#sp_1 option:selected").text() + " " + o + " (" + i + ") and " + $("#sp_2 option:selected").text() + " " + u + " (" + s + ") have been added.", "Network loaded successfully!")
}

function search_first_table() {
    var e = $.map(vis1_tmp_array, function(e) {
        return e.label
    }).join(",");
    var t = $("#sp_1").val();
    firsttable.fnFilter(e, e)
}

function selectitem() {
    if (firsttable != null) {
        firsttable.fnDestroy();
        $("thead", firsttable).remove()
    }
    if (secondtable != null) {
        secondtable.fnDestroy();
        $("thead", secondtable).remove()
    }
    var e = $.map(vis1_tmp_array, function(e) {
        return e.label
    }).join(",");
    var t = $("#sp_1").val();
    var n = $.map(vis2_tmp_array, function(e) {
        return e.label
    }).join(",");
    var r = $("#sp_2").val();
    firsttable = $("#firsttable").dataTable({
        sAjaxSource: "service/search.php",
        fnServerData: function(n, r, i) {
            r.push({
                name: "id",
                value: e
            });
            r.push({
                name: "sp",
                value: t
            });
            $.ajax({
                dataType: "json",
                type: "POST",
                url: n,
                data: r,
                success: i,
                error: "something"
            })
        },
        aaSorting: [
            [1, "asc"]
        ],
        bAutoWidth: false,
        bProcessing: true,
        bDestroy: true,
        pagingType: "simple",
        bServerSide: true,
        bInfo: true,
        bLengthChange: true,
        bScrollCollapse: true,
        bSort: false,
        aoColumns: [{
            bVisible: 0,
            aTargets: 0,
            sWidth: "0px",
            sTitle: ""
        }, {
            aTargets: 1,
            sWidth: "10px",
            bVisible: 1,
            sTitle: ""
        }, {
            aTargets: 2,
            sWidth: "100px",
            bVisible: 1,
            sTitle: "Gene"
        }, {
            aTargets: 3,
            sWidth: "100px",
            bVisible: 1,
            sTitle: "PFAM"
        }, {
            aTargets: 4,
            sWidth: "100px",
            bVisible: 1,
            sTitle: "Description"
        }],
        aoColumnDefs: [{
            mRender: function(e, t, n) {
                return '<input class="checkboxSelector" style="width:20px;"  id="' + n[0] + '" type="checkbox" > '
            },
            aTargets: [1],
            bSortable: true,
            width: "10px"
        }, {
            sTitle: "Column1",
            aTargets: [2]
        }, {
            mRender: function(e, t, n) {
                var r;
                if (e != null) {
                    var i = $.unique(e.split(","));
                    var s = [];
                    $.each(i, function(e, t) {
                        if (e < 3) s.push('<a target="_blank" href=http://pfam.xfam.org/family/' + t + ">" + t + "</a>")
                    });
                    r = s.join(",")
                } else {
                    r = ""
                }
                return r
            },
            sTitle: "Column2",
            aTargets: [3]
        }, {
            sTitle: "Column3",
            aTargets: [4],
            mRender: function(e, t, n) {
                if (e.length > 50) {
                    return e.substr(0, 50) + "..."
                }
                return e
            }
        }],
        sDom: "<'clear'>lrtip",
        fnRowCallback: function(e, t, n) {
            if (jQuery.inArray(t[0], listening_ARRAY_1) != -1) {
                $(e).find(".checkboxSelector").prop("checked", true)
            } else {
                $(e).find(".checkboxSelector").prop("checked", $(".checkboxSelectorall").prop("checked"))
            }
            return e
        }
    });
    $("#firsttable thead th").each(function() {
        if ($(this).index() != 0) {
            var e = $("#firsttable thead th").eq($(this).index()).text();
            $(this).html(e + '</br><input id="' + e + '_index" type="text" placeholder="Search ' + e + '" />')
        }
    });
    $("#firsttable thead input").keyup(function() {
        if (this.value != "") {
            firsttable.fnFilter(this.value, $("#_" + this.id + "_index").val())
        }
    });
    secondtable = $("#secondtable").dataTable({
        sAjaxSource: "service/search.php",
        fnServerData: function(e, t, i) {
            t.push({
                name: "id",
                value: n
            });
            t.push({
                name: "sp",
                value: r
            });
            $.ajax({
                dataType: "json",
                type: "POST",
                url: e,
                data: t,
                success: i,
                error: "something"
            })
        },
        sScrollXInner: "100%",
        bAutoWidth: false,
        bProcessing: true,
        bDestroy: true,
        bServerSide: true,
        bInfo: true,
        pagingType: "simple",
        bLengthChange: true,
        bScrollCollapse: true,
        bSort: false,
        aoColumns: [{
            bVisible: 0,
            aTargets: 0,
            sWidth: "0px",
            sTitle: ""
        }, {
            aTargets: 1,
            sWidth: "10px",
            bVisible: 1,
            sTitle: ""
        }, {
            aTargets: 2,
            sWidth: "100px",
            bVisible: 1,
            sTitle: "Gene"
        }, {
            mRender: function(e, t, n) {
                var r;
                if (e != null) {
                    var i = $.unique(e.split(","));
                    var s = [];
                    $.each(i, function(e, t) {
                        if (e < 3) s.push('<a target="_blank" href=http://pfam.xfam.org/family/' + t + ">" + t + "</a>")
                    });
                    r = s.join(",")
                } else {
                    r = ""
                }
                return r
            },
            aTargets: 3,
            sWidth: "100px",
            bVisible: 1,
            sTitle: "PFAM"
        }, {
            aTargets: 4,
            sWidth: "100px",
            bVisible: 1,
            sTitle: "Description",
            mRender: function(e, t, n) {
                if (e.length > 50) {
                    return e.substr(0, 50) + "..."
                }
                return e
            }
        }],
        aoColumnDefs: [{
            mRender: function(e, t, n) {
                return '<input class="checkboxSelector" disabled  name="' + n[1] + '"   id="' + n[0] + '" type="checkbox" > '
            },
            aTargets: [1],
            bSortable: true
        }],
        sDom: "<'clear'>lrtip",
        fnRowCallback: function(e, t, n) {
            if (jQuery.inArray(t[0], listening_ARRAY_2) != -1) {
                $(e).find(".checkboxSelector").prop("checked", true)
            } else {
                $(e).find(".checkboxSelector").prop("checked", $(".checkboxSelectorall").prop("checked"))
            }
            return e
        }
    });
    $("#secondtable thead th").each(function() {
        if ($(this).index() != 0) {
            var e = $("#secondtable thead th").eq($(this).index()).text();
            $(this).html(e + '</br><input id="' + e + '2_index" type="text" placeholder="Search ' + e + '" />')
        }
    });
    $("#secondtable thead input").keyup(function() {
        if (this.value != "") {
            secondtable.fnFilter(this.value, $("#_" + this.id + "2_index").val())
        }
    });
    $(document).on("click", "#firsttable tbody td input", function() {
        tmp_nodes_flag = true;
        tmp_edges_flag = true;
        tmp_nodes_flag2 = true;
        tmp_edges_flag2 = true;
        var e = $(this).is(":checked");
        if (e) {
            listening_ARRAY_1.push(this.id)
        } else {
            var t = [];
            t.push(this.id);
            vis1.deselect("nodes", t)
        }
        vis1.select("nodes", listening_ARRAY_1)
    });
    $(document).on("click", "#secondtable tbody td input", function() {
        tmp_nodes_flag = true;
        tmp_edges_flag = true;
        tmp_nodes_flag2 = true;
        tmp_edges_flag2 = true;
        var e = $(this).is(":checked");
        if (e) {
            listening_ARRAY_2.push(this.id)
        } else {
            var t = [];
            t.push(this.id);
            vis2.deselect("nodes", t)
        }
        vis2.select("nodes", listening_ARRAY_2)
    })
}

function newtest() {
    vis1.select("nodes")
}

function getthepvalue(e) {
    vis1.visualStyleBypass(null);
    vis2.visualStyleBypass(null);
    var t = "ids=" + e + "&db1=" + $("#sp_1 option:selected").val() + "&db2=" + $("#sp_2 option:selected").val();
    $.ajax({
        type: "POST",
        url: "service/getthepvalue.php",
        data: t,
        success: function(e) {
            var t = JSON.parse(e);
            if (t != null) {
                var n = {
                    nodes: {},
                    edges: {}
                };
                for (var r = 0; r < t.length; r++) {
                    var i = t[r]["gene"];
                    var s = t[r]["id"];
                    var o = (new Number(t[r]["pval"])).toExponential(0);
                    var u = vis2.selected();
                    var a = {
                        labelFontSize: 13,
                        labelFontColor: "#CC0000",
                        labelFontWeight: "normal",
                        label: "p-val:" + o + "\n" + i + "\n" + "\n" + "\n"
                    };
                    for (var f = 0; f < u.length; f++) {
                        var l = u[f];
                        if (l.data.id == s) {
                            n[l.group][l.data.id] = a
                        }
                    }
                }
                if (vis1.selected().length == 1) {
                    vis2.visualStyleBypass(n)
                }
            }
        }
    })
}

function getthepvalue_opposite(e) {
    vis1.visualStyleBypass(null);
    vis2.visualStyleBypass(null);
    var t = "ids=" + e + "&db1=" + $("#sp_2 option:selected").val() + "&db2=" + $("#sp_1 option:selected").val();
    $.ajax({
        type: "POST",
        url: "service/getthepvalue.php",
        data: t,
        success: function(e) {
            var t = JSON.parse(e);
            var n = {
                nodes: {},
                edges: {}
            };
            for (var r = 0; r < t.length; r++) {
                var i = t[r]["gene"];
                var s = t[r]["id"];
                var o = (new Number(t[r]["pval"])).toExponential(0);
                var u = vis1.selected();
                var a = {
                    labelFontSize: 13,
                    labelFontColor: "#CC0000",
                    labelFontWeight: "normal",
                    label: "p-val:" + o + "\n" + i + "\n" + "\n" + "\n"
                };
                for (var f = 0; f < u.length; f++) {
                    var l = u[f];
                    if (l.data.id == s) {
                        n[l.group][l.data.id] = a
                    }
                }
            }
            if (vis2.selected().length == 1) {
                vis1.visualStyleBypass(n)
            }
        }
    })
}

function abbreviate(e, t, n, r) {
    e = Number(e);
    r = r || false;
    if (r !== false) {
        return annotate(e, t, n, r)
    }
    var i;
    if (e >= 1e12) {
        i = "T"
    } else if (e >= 1e9) {
        i = "B"
    } else if (e >= 1e6) {
        i = "M"
    } else if (e >= 1e3) {
        i = "K"
    } else {
        i = ""
    }
    return annotate(e, t, n, i)
}

function annotate(e, t, n, r) {
    var i = 0;
    switch (r) {
        case "T":
            i = e / 1e12;
            break;
        case "B":
            i = e / 1e9;
            break;
        case "M":
            i = e / 1e6;
            break;
        case "K":
            i = e / 1e3;
            break;
        case "":
            i = e;
            break
    }
    if (t !== false) {
        var s = new RegExp("\\.\\d{" + (t + 1) + ",}$");
        if (s.test("" + i)) {
            i = i.toFixed(t)
        }
    }
    if (n !== false) {
        i = Number(i).toFixed(n)
    }
    return i + r
}
var vis1;
var vis2;
var testss = false;
var selected_checkboxes = [];
var selected_checkboxes2 = [];
var selectallboolean = false;
var vis1_tmp_array;
var vis2_tmp_array;
var allnodes_id = [];
var listening_ARRAY_1 = [];
var listening_ARRAY_2 = [];
var tmp_edges_flag = false;
var tmp_edges_flag2 = false;
var tmp_nodes_flag = false;
var tmp_nodes_flag2 = false;
var firsttable;
var secondtable;
$(document).ready(function() {})

function send_image(image, type) {

    var variables = "image=" + image + "&type=" + type;
    $.ajax({
        type: "POST",
        url: "printimages.php",
        data: variables,
        success: function(data) {

            //alert(type);
            //document.location.href="'.$_SESSION['savePath'].'network_image_'.session_id().'.svg";
            window.open("'.$_SESSION['savePath'].'network_image_'.session_id().'." + type, "blank");
        }
    });
}

//vis1.addContextMenuItem("export svg","nodes",function menu(event){send_image(vis.svg(),"svg");});vis1.addContextMenuItem("export xml", "nodes",function menu(event){send_image(vis.graphml(),"xml");});

//vis2.addContextMenuItem("export svg","nodes",function menu(event){send_image(vis.svg(),"svg");});vis2.addContextMenuItem("export xml", "nodes",function menu(event){send_image(vis.graphml(),"xml");});