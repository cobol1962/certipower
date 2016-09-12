Public Class _Default
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim dEnTry As DictionaryEntry
        For Each dEnTry In HttpContext.Current.Cache
            HttpContext.Current.Cache.Remove(dEnTry.Key.ToString())
        Next

    End Sub

End Class