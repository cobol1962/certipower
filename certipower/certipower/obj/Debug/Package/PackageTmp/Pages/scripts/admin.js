﻿setTimeout(function() {
   var message = JSON.stringify({ action: 'loadTable', tableid: "Groups", fnc: "fillTable", where: "", tablename: "group_table" });
   ws.send(message);
   var message = JSON.stringify({ action: 'getTableData', query: "select * from Groups order by group_name", fnc: "setGroupList" });
   ws.send(message);
    $('.navbar a.dropdown-toggle').on('click', function (e) {
        var elmnt = $(this).parent().parent();
        if (!elmnt.hasClass('nav')) {
            var li = $(this).parent();
            var heightParent = parseInt(elmnt.css('height').replace('px', '')) / 2;
            var widthParent = parseInt(elmnt.css('width').replace('px', '')) - 10;

            if (!li.hasClass('open')) li.addClass('open')
            else li.removeClass('open');
            $(this).next().css('top', heightParent + 'px');
            $(this).next().css('left', widthParent + 'px');
            $(this).next().css('background', '#B7C6D0');
            return false;
        }
    });
    var usr = ($.parseJSON(localStorage.user));
    $("#firstname").html(usr.display_name);
    $("#username").html(usr.UserName);
    fixExifOrientation($("#user_image"));
//    $("#nationality").countrySelect();
},1000);

 
var users_datatable = null;
var group_table_datatable = null;
var group_users_datatable = null;
function setGroupList(dta) {
    var data = $.parseJSON(dta);
    
    $.each(data, function () {
        $("#select_group").append("<option value='" + this.Id + "'>" + this.group_name + "</option>");
    });
    $("#select_group").selectpicker();
    $("#user_type").selectpicker();
    $("#gender").selectpicker();
    $('#select_group').on('changed.bs.select', function (e,clickedIndex,newValue,oldValue) {
        document.getElementById("group_users").getElementsByTagName("TBODY")[0].innerHTML = "";
        $("#group_usersform").show();
        $("#user_subform").hide();
        if (group_users_datatable != null) {
            group_users_datatable.destroy();
        }
        var message = JSON.stringify({ action: 'loadTable', tableid: "Group_Users", fnc: "fillTable", where: " where (group_id='" + $('#select_group').find("option").eq(clickedIndex).attr("value") + "')", tablename: "group_users" });
        ws.send(message);
        prepareAdd($("#addgroupusers")[0]);
    });
}
function fillTable(tablename, dta) {
    var data = $.parseJSON(dta);
    document.getElementById(tablename).getElementsByTagName("TBODY")[0].innerHTML = "";
    var nmb = data.length;
      var done = 0;
      $.each(data, function () {
          var dta = this;
          var tr = document.createElement("TR");
          $.each($("#" + tablename).find("th"), function () {
              var td = document.createElement("TD");
              td.style.display = this.style.display;
              if (!this.hasAttribute("type")) {
                  $(td).html(dta[$(this).attr("target")]);
              } else {
                  if (this.getAttribute("type") == "select") {
                      $(td).html($("#" + this.getAttribute("selectid")).find("option[value='" + dta[$(this).attr("target")] + "']").text());
                  }
              }
              td.setAttribute("target", $(this).attr("target"));
              tr.appendChild(td);
          });
          $("#" + tablename).find("tbody").append($(tr));
          done++;
      });
      var ww = setInterval(function () {
          if (done == nmb) {
              clearInterval(ww);
             
              eval(tablename + "_datatable = $('#' + tablename).DataTable({" +
                   "dom: 'Bfrtip'," +
                   "bStateSave: true,"+
                   "buttons: [" +
                        " {" +
                        "      extend: 'copyHtml5'," +
                         "    exportOptions: {" +
                         "        columns: [':visible']" +
                         "    }" +
                       "  }," +
                       " {" +
                       "     extend: 'excelHtml5'," +
                        "    exportOptions: {" +
                         "       columns: [':visible']" +
                         "   }" +
                      "  }," +
                       "  {" +
                        "     extend: 'csvHtml5'," +
                        "     exportOptions: {" +
                         "        columns: [ ':visible']" +
                         "    }" +
                       "  }," +
                    "  {" +
                    "      extend: 'pdfHtml5'," +
                    "      exportOptions: {" +
                    "          columns: [':visible']" +
                     "     }" +
                     " }," +
                       " {" +
                    "    extend: 'print'," +
                    "      exportOptions: {" +
                    "          columns: [':visible']" +
                     "     }" +
                     " }," +
                    "  'colvis'" +
                  " ]" +
               "});");
       
          }
       
          settableRowEvents(tablename);
          setEvents("userform","users",users_datatable);
          setEvents("groupform", "group_table", group_table_datatable);
          setEvents("group_usersform", "group_users", group_users_datatable);
      }, 100);
    
}
function settableRowEvents(tablename) {
    eval("var table = " + tablename + "_datatable;");
    $('#' + tablename + ' tbody').off('click', 'tr');
    $('#' + tablename + ' tbody').on('click', 'tr', function () {
       
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $.each($(this).find("td"), function () {
             var $_inp = $("input[target='" + $(this).attr("target") + "']");
                if (!this.disabled) {
                    $("input[target='" + $(this).attr("target") + "']").val("");
                }
            });
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='add']").show();
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='delete']").hide();
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='prepareadd']").hide();
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $.each($(this).find("td"), function () {
                $("input[target='" + $(this).attr("target") + "']").val(this.innerHTML);
                var ths = this;
                $.each($("select[target='" + $(this).attr("target") + "']").find("option"), function () {
                    if ($(this).html() == ths.innerHTML) {
                      $("select[target='" + $(ths).attr("target") + "']").val($(this).attr("value"));
                    }
                });
                $("select[target='" + $(this).attr("target") + "']").selectpicker("refresh");
            });
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='add']").hide();
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='delete']").show();
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='prepareadd']").show();
            eval("currenttable = " + tablename + "_datatable");
            eval($("#" + tablename).attr("afterselect") + ";");
        }
    });
}
function setEvents(formname, tablename, table) {
  
    $.each($("#" + formname).find("input,select"), function () {
        $(this).unbind("change");
        $(this).bind("change", function (e) {
            
            if ($("#" + formname + " input[target='" + "ID" + "']").val() == "") {
                return false;
            }
            var trr = table.$('tr.selected');
           
            var td = $("#" + tablename + " tbody tr.selected td[target='" + $(this).attr("target") + "']");
            var tr = $("#" + tablename + " tbody tr.selected");
            if (this.nodeName == "SELECT") {
                $(td).html($(this).find("option:selected").text());
                $(this).selectpicker("refresh");
            } else {
                $(td).html($(this).val());
            }
            var newData = new Array();
            $.each($("#" + tablename + " tbody tr.selected td"), function () {
                newData.push($(this).html());
            });
            table
             .row(trr)
             .data(newData)
             .draw( false )
             .show();
           
            var message = JSON.stringify({ action: 'execQuery', query: "update " + $("#" + tablename).attr("db") + " set " + $(e.target).attr("target") + "='" + $(this).val() + "' where ID='" + $("#" + formname + " input[target='" + "ID" + "']").val() + "'",fnc:"" });
             ws.send(message);
        });
    });
}
function prepareAdd(obj) {
   
    $(obj).hide();
    var f = obj.parentNode.parentNode;
    $.each(f.getElementsByTagName("INPUT"), function () {
      
        if (!this.disabled) {
            $(this).val("");
        } else {
            
        }
        if (this.hasAttribute("datasource")) {
            $(this).val($("#" + this.getAttribute("datasource")).val());
        }
     });
    $(f).find("button[formrole='add']").show();
    $(f).find("button[formrole='delete']").hide();
    $('#' + f.getAttribute("target") + ' tbody tr.selected').removeClass("selected");
    document.getElementById("privileges").getElementsByTagName("TBODY")[0].innerHTML = "";
    $("#user_subform").hide();
}
var currenttable = null;
var currform = null;
var currformid = "";
var lastInsertedId = "";
var afterInsert = "";
function addRecord(obj) {
    var dbt = $(obj).attr("db");
    afterInsert = $(obj).attr('after');
    var frm = $(obj).attr("target");
    currformid = frm;
    currform = $("#" + frm);
    eval("currenttable = " + $("#" + frm).attr("target") + "_datatable;");
    var into = "(";
    var vls = "(";
    $.each($("#" + frm).find("input"), function () {
        if ($(this).attr("target") != "ID") {
            into += "[" + $(this).attr("target") + "],";
            vls += "'" + $(this).val() + "',";
        }
    });
    $.each($("#" + frm).find("select"), function () {
        if ($(this).attr("target") != "ID") {
            into += "[" + $(this).attr("target") + "],";
            vls += "'" + $(this).val() + "',";
        }
    });
    into = into.substring(0, into.length - 1) + ")";
    vls = vls.substring(0, vls.length - 1) + ")";
    var qvr = "insert into " + dbt + " " + into + " values " + vls;
    var message = JSON.stringify({ action: 'insertRow', query: qvr, fnc: "refreshTable", table: dbt });
    ws.send(message);
}

function refreshTable(data) {
 
    var newData = new Array();
    var targets = new Array();
    $.each(currform.find("input,select"), function () {
        if (this.nodeName != "SELECT") {
            newData.push($(this).val());
        } else {
            newData.push($(this).find("option:selected").text());
        }
        targets.push($(this).attr("target"));
        if (!this.disabled) {
            $(this).val("");
        }
    });

    newData[0] = data[0].lastid;
    lastInsertedId = data[0].lastid;
    var rw = currenttable.row.add(newData).invalidate().draw().node();
    $.each($(rw).find("td"), function (index) {
        var th = document.getElementById(currform.attr("target")).getElementsByTagName("TR")[0].getElementsByTagName("TH")[index];
        $(this).attr("target", targets[index]);
        this.style.display = th.style.display;
    });
    var oTable = $('#' + currform.attr("target")).dataTable();
    oTable.fnPageChange('last');
    settableRowEvents(currform.attr("target"));
    eval(afterInsert);
}
function deleteRecord(obj) {
    swal({
        title: "Are you sure ?",
        text: "selected record will be deleted permanently !",
        type: "question",
        showCancelButton: true
    }).then(function () {
        var qvr = "delete from " + $(obj).attr("db") + " where [ID]='" + $("#" + $(obj).attr("target") + " input[target='ID']").val() + "'";
        var message = JSON.stringify({ action: 'execQuery', query: qvr, fnc: "recordDeleted('" + $("#" + $(obj).attr("target")).attr("target") + "');" });
        ws.send(message);
    });
}
function deleteGroupRecord(obj) {
    swal({
        title: "Are you sure ?",
        text: "Selected group will be deleted permanently !",
        type: "question",
        showCancelButton: true
    }).then(function () {
        var qvr = "delete from " + $(obj).attr("db") + " where [ID]='" + $("#" + $(obj).attr("target") + " input[target='ID']").val() + "'";
        var message = JSON.stringify({ action: 'execQuery', query: qvr, fnc: "" });
        ws.send(message);

        var qvr = "delete from Group_Privileges where [group_id]='" + $("#" + $(obj).attr("target") + " input[target='ID']").val() + "'";
        var message = JSON.stringify({ action: 'execQuery', query: qvr, fnc: "recordDeleted('" + $("#" + $(obj).attr("target")).attr("target") + "');" });
        ws.send(message);
      
    });
}
function deleteGroupUser(obj) {
    swal({
        title: "Are you sure ?",
        text: "Selected user will be deleted permanently !",
        type: "question",
        showCancelButton: true
    }).then(function () {
        var qvr = "delete from " + $(obj).attr("db") + " where [ID]='" + $("#" + $(obj).attr("target") + " input[target='ID']").val() + "'";
        var message = JSON.stringify({ action: 'execQuery', query: qvr, fnc: "" });
        ws.send(message);

        var qvr = "delete from Users where [ID]='" + $("#" + $(obj).attr("target") + " input[target='ID']").val() + "'";
        var message = JSON.stringify({ action: 'execQuery', query: qvr, fnc: "recordDeleted('" + $("#" + $(obj).attr("target")).attr("target") + "');" });
        ws.send(message);

    });
}
function recordDeleted(tb) {
    swal({
        title: "Success ",
        text: "Delete succesfull ",
        type:"success"
    });
    eval("var table = " + tb + "_datatable");
    table.row('.selected').remove().draw(false);
    document.getElementById("privileges").getElementsByTagName("TBODY")[0].innerHTML = "";
}
function setGroupPrivileges() {
    var message = JSON.stringify({ action: 'setGroupPrivileges', groupid: lastInsertedId });
    ws.send(message);
}
function addUser() {
  
    var message = JSON.stringify({ action: 'addGroupUser', userid: lastInsertedId });
    ws.send(message);
}
function show(data) {
    console.log(data);
}
function displayPrivilegTable() {
    var ww = setInterval(function () {
        try {
            clearInterval(ww);
            var dta = currenttable.row('.selected').data();
            var qvr = "select Group_Privileges.*,Privileges.name from Group_Privileges inner join  Privileges on Group_Privileges.privileg_id =  Privileges.ID   where  Group_Privileges.group_id='" + dta[0] + "'";
            var message = JSON.stringify({ action: 'getTableData', query: qvr, fnc: "showPrivileges" });
            ws.send(message);
        } catch (err) {

        }
    },50);
}
function showPrivileges(dta) {
    var data = $.parseJSON(dta);
    document.getElementById("privilegbody").innerHTML = "";
    $.each(data, function () {
        var dt = this;
        var tr = document.createElement("tr");
        $.each(document.getElementById("privileges").getElementsByTagName("TH"), function () {
            var td = document.createElement("td");
            td.setAttribute("target", this.getAttribute("target"));
            if (!this.hasAttribute("checkbox")) {
                td.innerHTML = dt[this.getAttribute("target")];
            } else {
                td.innerHTML = "<input onchange='changePrivileg(this);' privileg_id='" + dt["privileg_id"] + "' group_id='" + dt["group_id"] + "' target='" + this.getAttribute("target") + "' type='checkbox' " + ((dt[this.getAttribute("target")] == "1") ? "checked" : "") + "/>";

            }
            td.style.display = this.style.display;
            tr.appendChild(td);
        });
        document.getElementById("privilegbody").appendChild(tr);
    })
}
function changePrivileg(elm) {
    var qvr = "update Group_Privileges set [" + elm.getAttribute("target") + "]='" + ((elm.checked) ? "1" : "0") + "' where (group_id='" + elm.getAttribute("group_id") + "' and  privileg_id='" + elm.getAttribute("privileg_id") + "')";
    var message = JSON.stringify({ action: 'execQuery', query: qvr, fnc: "" });
    ws.send(message);
}
function displayGroupUser() {
    $("#user_subform").show();
    var tr = group_users_datatable.row('.selected').node();
    var id = $(tr).find("td[target='ID']").html();
    $("#user_id").val(id);
    var qvr = "select * from Users  where  ID='" + id + "'";
    var message = JSON.stringify({ action: 'getTableData', query: qvr, fnc: "setUserRecord" });
    ws.send(message);
    if ($("#uploadContainer").html() == "") {
        document.getElementById("uploadContainer").appendChild(document.getElementById("AjaxFileUpload1"));
        document.getElementById("AjaxFileUpload1").style.display = "";
        $("#AjaxFileUpload1_Html5DropZone").hide();
        $("#AjaxFileUpload1_FileStatusContainer").hide();
        $("#AjaxFileUpload1_QueueContainer").empty();
        $("#AjaxFileUpload1_QueueContainer").hide();
        $(".ajax__fileupload").css("overflow", "hidden");
        $("#AjaxFileUpload1_Footer").hide();
    }
}
function setUserImage(path) {
    if (path != "") {
        document.getElementById("user_image").className = "";
        document.getElementById("user_image").style.display = "none";
        //  fixExifOrientation($("#user_image"));
       document.getElementById("user_image").src = ('https:' == document.location.protocol ? 'https://' : 'http://') + window.location.host + "/Records/User_images/" + path;
    }
    $("#AjaxFileUpload1_QueueContainer").empty();
    $("#AjaxFileUpload1_Footer").hide();
    var qvr = "update Users set picture='" + document.getElementById("user_image").src + "' where ID='" + $("#user_id").val() + "'";
    var message = JSON.stringify({ action: 'execQuery', query: qvr,fnc: "" });
    ws.send(message);
   
}
function setUserRecord(dta) {
    document.getElementById("user_image").className = "";
    document.getElementById("user_image").style.display = "none";
    var data = $.parseJSON(dta);
    if (data[0].picture != null) {
        $.get(data[0].picture, function (im) {
      //      fixExifOrientation($("#user_image"));
            document.getElementById("user_image").src = data[0].picture;
        });
    }
}
function setNationality() {
    
}
function fixExifOrientation($img) {
    $img[0].className = "";
    $img.off('load');
    $img.on('load', function () {
        console.log($img[0]);
        setTimeout(function () {
            console.log(EXIF.getData($img[0]));
            EXIF.getData($img[0], function () {
                console.log('Exif=', EXIF.getTag(this, "Orientation"));
                switch (parseInt(EXIF.getTag(this, "Orientation"))) {
                    case 2:
                        $img.addClass('flip'); break;
                    case 3:
                        $img.addClass('rotate-180'); break;
                    case 4:
                        $img.addClass('flip-and-rotate-180'); break;
                    case 5:
                        $img.addClass('flip-and-rotate-270'); break;
                    case 6:
                        $img.addClass('rotate-90'); break;
                    case 7:
                        $img.addClass('flip-and-rotate-90'); break;
                    case 8:
                        $img.addClass('rotate-270'); break;
                }
            });
            setTimeout(function () {
                $img.show(300);
            }, 250);
        }, 1);
    });
}
$("#user_subform").find("input,select").on("change", function (e) {
    var el = e.target;
    alert(el.nodeName);
    alert(el.type);
});