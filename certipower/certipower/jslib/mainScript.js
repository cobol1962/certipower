function login() {
   
    var message = JSON.stringify({ action: 'login', email: $("#email").val(), password: $("#password").val(),fnc:"loginResponse" });
    ws.send(message)
}
function loginResponse(response) {
   
    if (response.length == 0) {
        swal({
            title: "Error !",
            text: "Wrong login data. Contact administrator.",
            type: "error",
            animate: true
        
        });
    }
    if (response.length == 1) {
        localStorage.user = JSON.stringify(response[0]);
        loadAdmin("admin.html");
    }
    if (response.length == 2) {
        var slct = "<select id='uname'>";
        $.each(response, function (index) {
            slct += "<option value='" + index + "' " + ((index == 0) ? "selected" : "") + ">" + this.UserName + "</option>";
        });
        
        var txt = "Select username " + slct;
        swal({
            title: "Multiple users with same email/password",
            html: txt,
            type: "question",
            allowOutsideClick: false,
            animate: true,
            allowEscapeKey:false,
            showCancelButton: true
        }).then(function () {
          
            localStorage.user = JSON.stringify(response[uname.value]);
            console.log(localStorage.user);
            loadAdmin("admin.html");
        });
    }
}
function loadAdmin(page) {
   
    $.ajax({
        url: "Pages/" + page,
        success: function (data) {
            
            document.body.innerHTML = data;
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "Pages/scripts/admin.js?v=" + new Date().getTime();
            $("head").append(s);
        },
        cache: false
    });
 /*   $.get("Pages/" + page, function (data) {
        document.body.innerHTML = data;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.src = "Pages/scripts/admin.js";
        $("head").append(s);
    });*/
}
function changePassword() {
    var html = '<center><form style="width:300px;"><div class="form-group left">'+
                    ' <label for="oldpassword">Old password</label>' +
                   '  <input type="password" class="form-control" id="oldpassword" placeholder="Old password" />'+
                     ' </div>'+
                 ' <div class="form-group left">'+
                   '  <label for="newpassword">New password</label>'+
                  '   <input type="password" class="form-control" id="newpassword" placeholder="New password" />'+
                 '</div>' +
                  ' <div class="form-group left">' +
                   '  <label for="newpassword1">Confirm new password</label>' +
                  '   <input type="password" class="form-control" id="newpassword1" placeholder="Confirm new password" />' +
                 '</div>' +
                 '<div><center><p id="errormessage"></p></center></div></form></center>';
    swal({
        title: "Change password",
        html: html,
        type: "warning",
        allowOutsideClick: false,
        animate: true,
        allowEscapeKey: false,
        showCancelButton: true,
        preConfirm: function () {
            return new Promise(function (resolve, reject) {
                var ok = true;
                var err = "";
              $("#errormessage").html("");
                var usr = $.parseJSON(localStorage.user);
                if ($("#oldpassword").val() != usr.Password) {
                    ok = false;
                    err = "Old password incorrect !";
                }
                if ($("#newpassword").val() != $("#newpassword1").val()) {
                    ok = false;
                    err = "New password does not match";
                }
                if (ok) {
                    resolve();
                } else {
                    reject(err);
                }

            });
        }
    }).then(function () {
        var usr = $.parseJSON(localStorage.user);
        var message = JSON.stringify({ action: 'changePassword', id: usr.ID, newpassword: $("#newpassword").val(), fnc: "changePasswordSuccess" });
        ws.send(message);
    });
}
function changePasswordSuccess() {
    swal({
        type: 'success',
        title: 'Success!',
        text: "You can login with new password"
    }).then(function() {
        window.location.href ="http://www.certipower.org";
    });
}
function switchPage(pageid) {
     var active = $(".active")[0].getAttribute("target");
    $(".navbar").find("li").removeClass("active");
    $("#" + active).slideToggle("slow", function () {
        $("#" + pageid).slideToggle();
    });
    $("li[target='" + pageid + "']").addClass("active");
}