<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="Default.aspx.vb" Inherits="certipower._Default" ValidateRequest="false" %>

<%@ Register Assembly="CKEditor.NET" Namespace="CKEditor.NET" TagPrefix="CKEditor" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>certipower.org</title>
    <link rel="stylesheet" type="text/css" href="Content/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="Content/font-awesome.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/sweetalert2/4.2.7/sweetalert2.css" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.11.2/css/bootstrap-select.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/b-1.2.2/b-colvis-1.2.2/b-flash-1.2.2/b-html5-1.2.2/b-print-1.2.2/r-2.1.0/se-1.2.0/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="Content/site.css" />

    <link rel="stylesheet" type="text/css" href="Content/countrySelect.css" />
    <script type="text/javascript" src="Scripts/jquery-3.1.0.js"></script>
    <script type="text/javascript" src="Scripts/bootstrap.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.11.2/js/bootstrap-select.min.js"></script>
    <script type="text/javascript" src="jslib/MainScript.js"></script>
    <script type="text/javascript" src="Scripts/ckeditor/ckeditor.js"></script>
    <script type="text/javascript">
        function uploadStarted() {
            document.getElementById("user_image").src = "images/squares.gif";
        }
        function uploadCompleted(seneder, args) {
            setUserImage(args._fileName);
        }
        function uploadCompleted2(seneder, args) {
            setNote(args._fileName);
          
        }
        function uploadCompleted3(seneder, args) {
            var message = JSON.stringify({ action: 'moveUploadedFile', currentUploadFolder:  localStorage.currentUploadFolder,fname: args._fileName.replace(/ /g,"_") });
            ws.send(message);

        }
        function uploadStart3(seneder, args) {
            localStorage.currentUploadFolder = $("#folder").val();
            $("#currentF").val($("#folder").val());
          
        }
        function setFolder(fld) {
            $("#folder").val(fld.replace(/[\\]/g,"/"));
            $("#folder").trigger('change');
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <CKEditor:CKEditorControl runat="server" style="display:none;"  BasePath="/Scripts/ckeditor/" Visible="False"></CKEditor:CKEditorControl>
        <ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload1"  Style="display: none; overflow: hidden;" runat="server" AllowedFileTypes="jpg,jpeg,gif,png,svg"
            MaximumNumberOfFiles="10" OnUploadComplete="File_Upload" BorderStyle="None" AutoStartUpload="True" OnClientUploadStart="uploadStarted" OnClientUploadComplete="uploadCompleted" />
         <ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload2"   runat="server"  Style="display: none; overflow: hidden;"
            MaximumNumberOfFiles="10" OnUploadComplete="File_Upload2" BorderStyle="None" AutoStartUpload="True" OnClientUploadComplete="uploadCompleted2" />  
           <ajaxToolkit:AjaxFileUpload ID="AjaxFileUpload3"   runat="server"  Style="display: none; overflow: hidden;"
            MaximumNumberOfFiles="10" OnUploadComplete="File_Upload3" BorderStyle="None" AutoStartUpload="True" OnClientUploadComplete="uploadCompleted3" OnClientUploadStart="uploadStart3" />  
         <asp:TextBox Visible="false" ID="TextBox2" runat="server" Text="here"></asp:TextBox>
           <asp:TextBox  ID="TextBox1" Visible="false" runat="server" Text="here"></asp:TextBox>
        <ajaxToolkit:PopupControlExtender ID="PopEx" runat="server"
            TargetControlID="TextBox2"
            PopupControlID="Panel1"
            
            Position="Bottom" />
        <asp:Panel ID="Panel1" runat="server" Width="200" style="display:none;">
        </asp:Panel>
        <asp:Panel ID="Panel2" runat="server" Width="200" style="display:none;"></asp:Panel>
        <input type="text" id="currentF" runat="server" />
        <div id="pages">

            <div class="contentContainer login">
                <div class="loginbox align-both rounded">


                    <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>
                    <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Password" />
                    </div>
                    <div style="float: right; min-width: 100%;">
                        <button style="float: right;" type="button" class="btn btn-primary" onclick="login();return false;">Login</button>
                    </div>


                </div>
            </div>
        </div>
        <asp:TextBox ID="wheretogo" runat="server"></asp:TextBox>
    </form>


    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/b-1.2.2/b-colvis-1.2.2/b-flash-1.2.2/b-html5-1.2.2/b-print-1.2.2/r-2.1.0/se-1.2.0/datatables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/plug-ins/1.10.12/api/row().show().js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/sweetalert2/4.2.7/sweetalert2.js"></script>
    <script type="text/javascript" src="jslib/countrySelect.js"></script>
    <script type="text/javascript" src="jslib/base64.js"></script>
    <script type="text/javascript" src="jslib/exif.js"></script>
    <script type="text/javascript" src="jslib/socket.js"></script>
    <div id="tempdiv" style="display: none;"></div>
</body>
<script type="text/javascript">
    $(document).ready(function () {
        localStorage.user = null;
    });
</script>
</html>
