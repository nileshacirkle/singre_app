require('console.table');

'use strict';
var dateTime = require('node-datetime');



const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var users = new Array();
var user_tabs = new Array();
var user_times = new Array();

// var mysql = require('mysql');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "soonerwj_snigre",
//     password: "5+KvR=C7G91F",
//     database: "soonerwj_snigre"

// });


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});









// con.connect(function(err) {
//     if (err) throw err;
//     //Select all customers and return the result object:
//     con.query("SELECT * FROM users", function (err, result, fields) {
//         if (err) throw err;
//         console.log(result);
//     });
// });












io.on('connection', function (socket) {

    //var cookie_string = socket.request.headers.cookie;
    //Object.keys(users).length
    //the above code is to find the length of the associative array
    //console.log(socket.id);






    // whenever there is a new connection request then create new room named (USERNAME PASSED WHEN CONNECTION SOOCKET IO AT CLIENT SIDE)
    if(socket.handshake.query.username!=undefined){
        socket.join(socket.handshake.query.username);

        console.log('connected '+socket.handshake.query.username);
        //console.log('total users are' +Object.keys(users).length);

        if(user_tabs[socket.handshake.query.username]==undefined){
            user_tabs[socket.handshake.query.username]=1;
        }else{
            user_tabs[socket.handshake.query.username]++;
        }

        //console.log('Total '+socket.handshake.query.username+' are' + user_tabs[socket.handshake.query.username]);

    }





    if(users[socket.handshake.query.username]!=undefined){

        var new_length = users[socket.handshake.query.username].length;
        users[socket.handshake.query.username][new_length] = socket;

    }else{
        users[socket.handshake.query.username] = new Array();
        users[socket.handshake.query.username][0] = socket;
        console.log('\n');
    }



    socket.on('disconnect', function() {
        if(socket.handshake.query.username!=undefined){
            console.log('disconnected '+socket.handshake.query.username);

            user_tabs[socket.handshake.query.username]--;
            if(user_tabs[socket.handshake.query.username]==0){
                //console.log(socket.handshake.query.username+ ' is totaly gone');
                //auto_logout(socket.handshake.query.username);

                // con.query("SELECT * FROM users", function (err) {
                //     if (err) throw err;
                //     //console.log(result);
                // });

                //auto_logout(socket.handshake.query.username);





            }



            //console.log("kyada users are "+users[socket.handshake.query.username].length);
            //console.table(socket);
        }



    });


    socket.on('logout event', function (login_id) {
        io.emit('logout event',login_id);
    });

    socket.on('login event', function () {
        io.emit('login event');
    });




    socket.on('send message event', function (msg_data) {

        console.table(msg_data);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE
        io.to(msg_data.from).emit('incoming message', msg_data);

        if(msg_data.groups==undefined){
            console.log('normal chat');
            io.to(msg_data.to).emit('incoming message', msg_data);
        }else{
            for(var i=0;i<msg_data.groups.length;i++){
                io.to('user'+msg_data.groups[i]).emit('incoming message', msg_data);
            }
            console.log('project chat');
            console.log(msg_data.groups);
        }
    });

    socket.on('chat_send_message_event', function (msg_data) {

        console.table(msg_data);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE
        io.to(msg_data.from).emit('chat_incoming_message', msg_data);

        if(msg_data.groups==undefined){
            console.log('normal chat');
            io.to(msg_data.to).emit('chat_incoming_message',msg_data);
        }else{
            for(var i=0;i<msg_data.groups.length;i++){
                io.to('user'+msg_data.groups[i]).emit('chat_incoming_message', msg_data);
            }
            console.log('project chat');
            console.log(msg_data.groups);
        }



    });


    socket.on('project_send_data', function (msg_data) {

        console.table(msg_data);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE

        console.log('project send');

        if(msg_data.team_leader_id)
        {
            var to = 'user'+msg_data.team_leader_id;
            console.log(to+ 'tooooooooo');
            io.to(to).emit('project_send_data', msg_data);

        }
        else
        {
            var strarray = msg_data.receiver_id.split(',');
            for (var i = 0; i < strarray.length; i++) {
                //alert(strarray[i])

                var to = 'user'+strarray[i];
                console.log(to+ 'tooooooooo');
                io.to(to).emit('project_send_data', msg_data);
            }

        }
    });


    socket.on('admin_send_data', function (msg_data) {

        console.table(msg_data);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE

        console.log('admin send');
        var to = 'user'+msg_data.receiver_id;
        console.log(to+ 'tooooooooo');
        io.to(to).emit('admin_send_data', msg_data);
    });

    socket.on('task_send_data', function (msg_data) {

        console.table(msg_data);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE

        console.log('normal chat');
        var to = 'user'+msg_data.worker_id;
        console.log(to+ 'tooooooooo');
        io.to(to).emit('task_send_data', msg_data);
    });


    socket.on('leave_send_event', function (msg_data) {

        console.table(msg_data);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE

        console.log('normal chat');
        var to = 'user'+msg_data.team_leader_id;
        var hr = 'user'+msg_data.hr_id;;
        var admin = 'user'+msg_data.admin_id;
        var user_id = 'user'+msg_data.user_id;
        //console.log(to+ 'tooooooooo');
        io.to(to).emit('leave_send_event', msg_data);
        io.to(hr).emit('leave_send_event', msg_data);
        io.to(user_id).emit('leave_send_event', msg_data);
        io.to(admin).emit('leave_send_event', msg_data);
    });


    socket.on('ticket_send_event', function (msg_data) {

        console.table(msg_data);

        for (var i = 0; i < msg_data.length; i++) {
            var to = 'user'+msg_data[i].ticket_send_id;
            console.log(to+ 'tooooooooo');
            io.to(to).emit('ticket_send_event', msg_data[i]);
        }

        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE

       // console.log('normal chat');

    });



    socket.on('send_chat_view_typing', function (data) {

        console.log(data.from);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE
        var to = 'user'+data.from;

        io.to(to).emit('incoming_chat_view_typing',data);

    });

    socket.on('send_chat_view_project_typing', function (data) {
        for (var i = 0; i < data.to.length; i++) {
            var to = 'user'+data.to[i].id;
            //console.log(to+ 'tooooooooo');
            io.to(to).emit('incoming_chat_view_project_typing', data);
        }

    });




    socket.on('send_chat_view_typing',function (sender_id) {

        console.log(sender_id);
        //SEND MESSAGE TO ROOM NAMED RECEIVER QUERY STRING WHEN CONNECTION SOOCKET IO AT CLIENT SIDE
        // var to = 'user'+sender_id;
        //  io.to(to).emit('incoming_chat_view_typing', sender_id);

        // if(msg_data.groups==undefined){
        //     console.log('normal chat');
        //     io.to(msg_data.to).emit('chat_incoming_message',msg_data);
        // }else{
        //     for(var i=0;i<msg_data.groups.length;i++){
        //         io.to('user'+msg_data.groups[i]).emit('chat_incoming_message', msg_data);
        //     }
        //     console.log('project chat');
        //     console.log(msg_data.groups);
        // }

    });




});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

// function auto_logout(user_handshake){
//
//
//
//     setTimeout(function () {
//         if(user_tabs[user_handshake]==0){
//             //console.log('user '+user_handshake+ 'will log out');
//
//
//             var id = user_handshake.split('r')[1];
//             console.log(' this will logout '+id);
//
//
//             //con.query("UPDATE users set status='0',designation='kallia' WHERE id='"+id+"'");
//
//             con.query("UPDATE users set status='0' WHERE id='"+id+"'");
//             con.query("UPDATE tasks set divert_time='0000-00-00 00:00:00', task_status='0', final_status='pause' WHERE worker_id='"+id+"' and task_status='1' and ( final_status='start' or final_status='resume' or final_status='start_again') ");
//
//
//
//             //con.query("SELECT * FROM users where id='"+id+"'");
//
//
//         }
//     }, 10000);
//
//
// }


