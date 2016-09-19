Imports System.IO
Imports AjaxControlToolkit

Public Class _Default
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim dEnTry As DictionaryEntry
        For Each dEnTry In HttpContext.Current.Cache
            HttpContext.Current.Cache.Remove(dEnTry.Key.ToString())
        Next

    End Sub
    Protected Sub File_Upload(sender As Object, e As AjaxFileUploadEventArgs)

        Dim filename As String = e.FileName
        Dim strDestPath As String = Server.MapPath("~/Data/User_Images/")
        AjaxFileUpload1.SaveAs(strDestPath & filename)

    End Sub

End Class