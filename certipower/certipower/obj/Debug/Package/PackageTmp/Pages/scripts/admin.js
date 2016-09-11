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
                    "  'colvis'" +
                  " ]" +
               "});");
              $('#' + tablename + ' tbody').on('click', 'tr', function () {
                  if ($(this).hasClass('selected')) {
                      $(this).removeClass('selected');
                  }
                  else {
                      $('#' + tablename).find('tr.selected').removeClass('selected');
                      $(this).addClass('selected');
                      $.each($(this).find("td"), function () {
                          $("input[target='" + $(this).attr("target") + "']").val(this.innerHTML);
                      });
                  }
              });
            /*  var dv = '<div class="dataTables_actions align-h">' +
               '<button type="button" onclick="' + $("#" + tablename).attr("addnew") + '" class="btn btn-info">Add new</button>' +
               '<button type="button" onclick="' + $("#" + tablename).attr("edit") + '"  class="btn btn-primary">Edit selected</button>' +
               '<button type="button" onclick="' + $("#" + tablename).attr("delete") + '"  class="btn btn-danger">Delete selected</button>';
              $(dv).insertBefore("#" + tablename + "_filter");*/
          }
          $.each($("#userform").find("input"), function () {
              $(this).unbind("change");
              $(this).bind("change", function (e) {
                  var td = $("#users tbody tr.selected td[target='" + $(this).attr("target") + "']");
                  $(td).html($(this).val());
                  users_datatable
                    .row(tr)
                    .invalidate()
                    .draw();
              });
          })
      }, 100);
    
  }
