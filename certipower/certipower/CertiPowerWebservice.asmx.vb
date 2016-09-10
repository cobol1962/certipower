Imports System.Web
Imports System.Web.Services
Imports System.Xml
Imports System.Web.Services.Protocols
Imports System.Web.Script.Services
<WebService(Namespace:="http://tempuri.org/")>
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)>
<ScriptService()>
Public Class CertiPowerWebservice
    Inherits System.Web.Services.WebService
    <WebMethod()>
    Public Function HelloWorld() As String
        Return "Hello World"
    End Function

End Class