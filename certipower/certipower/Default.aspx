<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="certipower._Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>certipower.org</title>
    <link rel="stylesheet" type="text/css" href="Content/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="Content/font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/sweetalert2/4.2.7/sweetalert2.css" />
      <link rel="stylesheet" type="text/css" href="Content/site.css" />
   <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/b-1.2.2/b-colvis-1.2.2/b-flash-1.2.2/b-html5-1.2.2/b-print-1.2.2/r-2.1.0/se-1.2.0/datatables.min.css"/>
    <script type="text/javascript" src="Scripts/jquery-3.1.0.js"></script>
    <script type="text/javascript" src="Scripts/bootstrap.js"></script>
   <script type="text/javascript" src="jslib/MainScript.js"></script>
   
 </head>
<body>
 
    <div class="contentContainer login">
        <div class="loginbox align-both rounded">
            <form id="form1" runat="server">
                
                <div class="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                 </div>
                 <div class="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Password" />
                </div>
                <div style="float:right;min-width:100%;">
                    <button style="float:right;" type="button" class="btn btn-primary" onclick="login();return false;">Login</button>
                </div>
            </form>
        </div>
    </div>
   
 
 
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/b-1.2.2/b-colvis-1.2.2/b-flash-1.2.2/b-html5-1.2.2/b-print-1.2.2/r-2.1.0/se-1.2.0/datatables.min.js"></script>
     <script type="text/javascript" src="https://cdn.datatables.net/plug-ins/1.10.12/api/row().show().js"></script>
     <script type="text/javascript" src="https://cdn.jsdelivr.net/sweetalert2/4.2.7/sweetalert2.js"></script>
    <script type="text/javascript" src="jslib/socket.js"></script>
    <div id="tempdiv" style="display:none;"></div>
</body>
    <script type="text/javascript">
        $(document).ready(function () {
            localStorage.user = null;
        });
    </script>
</html>
