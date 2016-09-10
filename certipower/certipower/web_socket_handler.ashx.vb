Imports System.Web
Imports System.Web.Services
Imports System.Threading
Imports Microsoft.Web.WebSockets

Public Class web_socket_handler
    Implements System.Web.IHttpHandler

    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        If (context.IsWebSocketRequest) Then

            context.AcceptWebSocketRequest(New socket_handler)

        End If
    End Sub

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return True
        End Get
    End Property


End Class