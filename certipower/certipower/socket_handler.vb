﻿Imports System.Web
Imports System.Web.Services
Imports System.Threading
Imports System.Web.Script.Serialization
Imports System.Data.Sql
Imports System.Data.SqlClient
Imports Microsoft.Web.WebSockets
Imports Newtonsoft.Json
Imports System.IO

Public Class socket_handler
    Inherits WebSocketHandler
    Public myID As String
    Private Shared clients As New WebSocketCollection()
    Public Sub New()

    End Sub
    Public Overrides Sub OnOpen()
        clients.Add(Me)
        '  Me.Send("websocket ok connected")
    End Sub
    Public Overrides Sub OnMessage(ByVal message As String)

        Dim js As New JavaScriptSerializer
        Dim msgObj As Object = New JavaScriptSerializer().Deserialize(Of Object)(message)
        If msgObj("action") = "login" Then
            Me.Send(checkLogin(msgObj))
        End If
        If msgObj("action") = "loadAllUsers" Then
            Me.Send(allUsers(msgObj))
        End If
        If msgObj("action") = "changePassword" Then
            Me.Send(passChange(msgObj))
        End If
    End Sub
    Public Function checkLogin(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = "SELECT * from Users where (email='" & message("email") & "' and password='" & message("password") & "')"
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = readerToJson(rdr)
        rdr.Close()
        connection.Close()
        connection.Dispose()
        Return message("fnc") & "(" & rstr & ");"
    End Function
    Public Function allUsers(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = "SELECT * from Users order by 'ID'"
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = readerToJson(rdr)
        rdr.Close()
        connection.Close()
        connection.Dispose()
        Return message("fnc") & "(" & rstr & ");"
    End Function
    Public Function passChange(message As Object)
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim command As New SqlCommand("update Users set password='" & message("newpassword") & "' where ID='" & message("id") & "'", connection)
        command.Connection.Open()
        command.ExecuteNonQuery()
        connection.Close()
        command.Dispose()
        Return message("fnc") & "();"
    End Function
    Public Function readerToJson(rdr As SqlDataReader) As String
        Dim sb As New StringBuilder()
        Dim sw As New StringWriter(sb)
        Dim writer As New JsonTextWriter(sw)
        writer.WriteStartArray()
        If rdr.HasRows Then
            While rdr.Read
                writer.WriteStartObject()
                Dim fields As Integer = rdr.FieldCount
                For i = 0 To fields - 1
                    writer.WritePropertyName(rdr.GetName(i))
                    writer.WriteValue(rdr(i))
                Next
                writer.WriteEndObject()
            End While
        End If
        writer.WriteEndArray()
        Return sb.ToString
    End Function
    Public Sub sendToAll(ByVal msg As String)
        For Each item In clients
            item.Send("someone logged")

        Next
    End Sub
    Public Overrides Sub OnClose()
        MyBase.OnClose()
    End Sub
    Public Overrides Sub OnError()
        MyBase.OnError()
    End Sub
    Public Class user
        Public uid As String
        Public img As String
        Public displayName As String
    End Class
End Class