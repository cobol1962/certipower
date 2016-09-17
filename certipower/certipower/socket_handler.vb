Imports System.Web
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
        If msgObj("action") = "loadTable" Then
            Me.Send(loadTable(msgObj))
        End If
        If msgObj("action") = "changePassword" Then
            Me.Send(passChange(msgObj))
        End If
        If msgObj("action") = "execQuery" Then
            Me.Send(execQuery(msgObj))
        End If
        If msgObj("action") = "insertRow" Then
            Me.Send(insertRow(msgObj))
        End If
        If msgObj("action") = "setGroupPrivileges" Then
            Me.Send(setGroupPrivileges(msgObj))
        End If
        If msgObj("action") = "addGroupUser" Then
            Me.Send(addGroupUser(msgObj))
        End If
        If msgObj("action") = "getTableData" Then
            Me.Send(getTableData(msgObj))
        End If
    End Sub
    Public Function execQuery(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim command As New SqlCommand(message("query"), connection)
        command.Connection.Open()
        command.ExecuteNonQuery()
        connection.Close()
        command.Dispose()
        Return message("fnc")
    End Function
    Public Function insertRow(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim command As New SqlCommand(message("query"), connection)
        command.Connection.Open()
        command.ExecuteNonQuery()
        Dim sql As String = "SELECT IDENT_CURRENT('" & message("table") & "') as 'lastid'"
        Dim id As Integer = 0
        command = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = readerToJson(rdr)
        Return message("fnc") & "(" & rstr & ");"

    End Function
    Public Function checkLogin(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = "Select * from Group_Users where (email='" & message("email") & "' and password='" & message("password") & "')"
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = readerToJson(rdr)
        rdr.Close()
        connection.Close()
        connection.Dispose()
        Return message("fnc") & "(" & rstr & ");"
    End Function
    Public Function loadTable(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = "SELECT * from " & message("tableid") & " " & message("where") & " order by 'ID'"
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = readerToJson(rdr)
        rdr.Close()
        connection.Close()
        connection.Dispose()
        Return message("fnc") & "('" & message("tablename") & "','" & rstr & "');"
    End Function
    Public Function getTableData(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = message("query")
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = readerToJson(rdr)
        rdr.Close()
        connection.Close()
        connection.Dispose()
        Return message("fnc") & "('" & rstr & "');"
    End Function
    Public Function passChange(message As Object)
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim command As New SqlCommand("update Group_Users set password='" & message("newpassword") & "' where ID='" & message("id") & "'", connection)
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
    Public Function setGroupPrivileges(message As Object) As String
        Dim idg As String = message("groupid")
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = "SELECT * from Privileges"
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        Dim rdr As SqlDataReader = command.ExecuteReader()
        Dim rstr As String = ""
        While rdr.Read
            Dim sql1 As String = "insert into Group_Privileges (group_id,privileg_id) VALUES ('" & idg & "','" & rdr("ID") & "');"
            Dim connection1 As New SqlConnection(My.Settings.connstring)
            connection1.Open()
            Dim command1 As SqlCommand = New SqlCommand(sql1, connection1)
            command1.ExecuteNonQuery()
            connection1.Close()
            command1.Dispose()
        End While
        'Return "alert('insert into Group_Privileges (group_id,privileg_id) VALUES ('" & idg & "','" & rdr("ID") & "')';"
        Return "show('" & rstr & "');"
    End Function
    Public Function addGroupUser(message As Object) As String
        Dim connection As New SqlConnection(My.Settings.connstring)
        Dim sql As String = "insert into Users (id) values ('" & message("userid") & "')"
        connection.Open()
        Dim command As SqlCommand = New SqlCommand(sql, connection)
        command.ExecuteNonQuery()
        Return ""
    End Function
    Public Sub sendToAll(ByVal msg As String)
        For Each item In clients
            item.Send("someone logged")

        Next
    End Sub
    Public Sub send_js(ByVal message As String)
        For Each item In clients ' .Where(Function(r) DirectCast(r, ErpagWebSocketHandler).name = tc_id)
            Dim ism As socket_handler = DirectCast(item, socket_handler)
            item.Send(message)
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
