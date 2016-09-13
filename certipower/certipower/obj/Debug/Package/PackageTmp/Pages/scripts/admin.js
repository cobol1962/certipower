setTimeout(function() {
    var message = JSON.stringify({ action: 'loadTable', tableid: "Users", fnc: "fillTable", tablename:"users" });
    ws.send(message);
   var message = JSON.stringify({ action: 'loadTable', tableid: "Groups", fnc: "fillTable", tablename: "group_table" });
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
    $("#firstname").html(usr.FirstName + " " + usr.LastName);
    $("#username").html(usr.UserName);
  
},1000);

 
var users_datatable = null;
var group_table_datatable = null;
function fillTable(tablename, dta) {
      var data = $.parseJSON(dta);
      var nmb = data.length;
      var done = 0;
      $.each(data, function () {
          var dta = this;
          var tr = document.createElement("TR");
          $.each($("#" + tablename).find("th"), function () {
              var td = document.createElement("TD");
              td.style.display = this.style.display;
              $(td).html(dta[$(this).attr("target")]);
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
            });
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='add']").hide();
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='delete']").show();
            $("#" + this.parentNode.parentNode.getAttribute("frm")).find("button[formrole='prepareadd']").show();
        }
    });
}
function setEvents(formname, tablename, table) {
  
    $.each($("#" + formname).find("input"), function () {
        $(this).unbind("change");
        $(this).bind("change", function (e) {
            if ($("#" + formname + " input[target='" + "ID" + "']").val() == "") {
                return false;
            }
            var trr = table.$('tr.selected');
           
            var td = $("#" + tablename + " tbody tr.selected td[target='" + $(this).attr("target") + "']");
            var tr = $("#" + tablename + " tbody tr.selected");
            $(td).html($(this).val());
            //table
            //  .row(trr)
            //  .invalidate()
            //  .draw();

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
     });
    $(f).find("button[formrole='add']").show();
    $(f).find("button[formrole='delete']").hide();
    $('#' + f.getAttribute("target") + ' tbody tr.selected').removeClass("selected");
}
var currenttable = null;
var currform = null;
var currformid = "";
function addRecord(obj) {
    var dbt = $(obj).attr("db");
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
    into = into.substring(0, into.length - 1) + ")";
    vls = vls.substring(0, vls.length - 1) + ")";
    var qvr = "insert into " + dbt + " " + into + " values " + vls;
    var message = JSON.stringify({ action: 'insertRow', query: qvr, fnc: "refreshTable", table: dbt });
    ws.send(message);
}
function refreshTable(data) {
  
    var newData = new Array();
    var targets = new Array();
    $.each(currform.find("input"), function () {
        newData.push($(this).val());
        targets.push($(this).attr("target"));
        if (!this.disabled) {
            $(this).val("");
        }
    });

    newData[0] = data[0].lastid;
    var rw = currenttable.row.add(newData).invalidate().draw().node();
    $.each($(rw).find("td"), function (index) {
        var th = document.getElementById(currform.attr("target")).getElementsByTagName("TR")[0].getElementsByTagName("TH")[index];
        $(this).attr("target", targets[index]);
        this.style.display = th.style.display;
    });
    var oTable = $('#' + currform.attr("target")).dataTable();
    oTable.fnPageChange('last');
    settableRowEvents(currform.attr("target"));
    
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
function recordDeleted(tb) {
    swal({
        title: "Success ",
        text: "Delete succesfull ",
        type:"success"
    });
    eval("var table = " + tb + "_datatable");
    table.row('.selected').remove().draw(false);
}