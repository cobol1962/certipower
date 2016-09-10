var message = JSON.stringify({ action: 'loadAllUsers', fnc: "fillTable" });

setTimeout(function() {
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

 

  function fillTable(data) {
      var nmb = data.length;
      var done = 0;
      $.each(data, function () {
          console.log(data);
          var dta = this;
          var tr = document.createElement("TR");
          $.each($("#users").find("th"), function () {
              var td = document.createElement("TD");
              $(td).html(dta[$(this).attr("target")]);
              tr.appendChild(td);
          });
          $("#users").find("tbody").append($(tr));
          done++;
      });
      var ww = setInterval(function () {
          console.log(done);
          if (done == nmb) {
              clearInterval(ww);
              $('#users').DataTable({
                  dom: 'Bfrtip',
                  buttons: [
                        {
                             extend: 'copyHtml5',
                            exportOptions: {
                                columns: [':visible']
                            }
                        },
                       {
                           extend: 'excelHtml5',
                           exportOptions: {
                               columns: [':visible']
                           }
                       },
                        {
                            extend: 'csvHtml5',
                            exportOptions: {
                                columns: [ ':visible']
                            }
                        },
                     {
                         extend: 'pdfHtml5',
                         exportOptions: {
                             columns: [':visible']
                         }
                     },
                     'colvis'
                  ]
              });
          }
      },100);
  }