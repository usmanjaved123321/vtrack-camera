const net = require("net");
const ftpu = require("./file_transfer_protocol_utils.js");
//const ftpu = require("./new");
const cliProgress = require("cli-progress");
const _colors = require("colors");
require("events").EventEmitter.defaultMaxListeners = 0;
const GPRS = require("./GPRS");
var options;
server = net.createServer(options, handleConnection);
server.listen(7056, function () {
  // ftpu.LogString("[SERVER] listening to " + server.address()["port"] + " port");
  var text= "[SERVER] listening to 7056 port"
  console.log(text.rainbow);
});

const buffer_size = 20000; //20MB

function handleConnection(conn) {
  const bar1 = new cliProgress.SingleBar(    
    {
      format:
        "Download Progress |" +
        _colors.blue("{bar}") +
        "| {percentage}% || {value}/{total} Chunks || ETA: {eta} seconds",
      barsize: 50,
      hideCursor: true,
    },
    cliProgress.Presets.shades_grey
  );

  let tcp_buff = Buffer.alloc(0);

  let remoteAddress = conn.remoteAddress + ":" + conn.remotePort;
  let stateMachine = 0;
  let deviceStatus = new ftpu.DeviceDescriptor();
  // ftpu.LogString("[SERVER] client connected: " + remoteAddress);
  console.log("[SERVER] client connected: " + remoteAddress);
  conn.on("data", onConnData);
  conn.once("close", onConnClose);
  conn.on("error", onConnError);
  conn.on("timeout", onConnTimeout);

  function onConnData(d) {
    let cmd_size = 0;
    let cmd_id = 0;
   console.log("onconndata",d)
 //   console.log("buffer_size",buffer_size,d.length)
     console.log("bar324567", bar1.lastDrawnString ) // progress bar send to client portal
    if (d.length < buffer_size) {
    //  tcp_buff = Buffer.concat([tcp_buff, d]);
    tcp_buff = Buffer.concat([tcp_buff, d]);
      // ftpu.LogString(
      //   "Data from: " + remoteAddress + "[" + tcp_buff.toString("hex") + "]"
      // );
      /* while (1) {
        if (tcp_buff.length >= 4) {
          cmd_id = ftpu.ParseCmd(tcp_buff);
          console.log("cmd_id: ",cmd_id,ftpu.IsCmdValid(cmd_id),ftpu.CmdHasLengthField(cmd_id))
          //// ftpu.LogString("Received command id " + cmd_id);
          if (ftpu.IsCmdValid(cmd_id)) {
            if (ftpu.CmdHasLengthField(cmd_id)) {
              cmd_size = tcp_buff.readUInt16BE(2) + 4;
            } else {
              cmd_size = ftpu.GetExpectedCommandLength(cmd_id);
            }
            console.log("cmd_size: ",cmd_size)



            // ftpu.LogString("CMD size: " + cmd_size);
            if (tcp_buff.length >= cmd_size) {
              // Time to parse
              // ftpu.LogString("Passing CMD with ID " + cmd_id);
              // console.log("Passing CMD with ID " + cmd_id);
              stateMachine = ftpu.StateMachine(
                stateMachine,
                conn,
                cmd_id,
                tcp_buff,
                deviceStatus,
                bar1
              );
              if (tcp_buff.length > cmd_size) {
                tcp_buff = tcp_buff.slice(cmd_size, tcp_buff.length);
                // ftpu.LogString("Remaining in buffer " + tcp_buff.length);
              } else {
                // ftpu.LogString("Clearing buffer");
                tcp_buff = Buffer.alloc(0);
              }
            } else {
              break;
            }
          } else {
            // drop the buffer load
            tcp_buff = Buffer.alloc(0);
            break;
          }
        } else {
          break;
        }
      } */
      while (tcp_buff.length >= 4) {
        
        const cmd_id = ftpu.ParseCmd(tcp_buff);
        if (!ftpu.IsCmdValid(cmd_id)) {
            // Drop the buffer if the command is invalid
            tcp_buff = Buffer.alloc(0);
            break;
        }
        const cmd_size = ftpu.CmdHasLengthField(cmd_id) ? tcp_buff.readUInt16BE(2) + 4 : ftpu.GetExpectedCommandLength(cmd_id);

        if (tcp_buff.length >= cmd_size) {
            // Process the command
            stateMachine = ftpu.StateMachine(
                stateMachine,
                conn,
                cmd_id,
                tcp_buff,
                deviceStatus,
                bar1
            );

            // Remove processed data from the buffer
            tcp_buff = tcp_buff.slice(cmd_size);
        }
        else {
          // Incomplete command, wait for more data
          break;
      }
      }
    } else {
      // Too much data now
     
    }
  }

  function onConnClose() {
    // ftpu.LogString("[SERVER] connection from " + remoteAddress + " closed");
  }

  function onConnError(err) {
    // ftpu.LogString(
    //   "[SERVER] connection " + remoteAddress + " error: " + err.message
    // );
    // Delete file
  } 

  function onConnTimeout() {
    // ftpu.LogString("[SERVER] connection from " + remoteAddress + " timeouted");
  }
}

//MUNIB WORK 
// const net = require("net");
// const ftpu = require("./file_transfer_protocol_utils.js");
// const cliProgress = require("cli-progress");
// const _colors = require("colors");
// require("events").EventEmitter.defaultMaxListeners = 0;
// const GPRS = require("./GPRS");
// var options;
// server = net.createServer(options, handleConnection);
// server.listen(7056, function () {
//   // ftpu.LogString("[SERVER] listening to " + server.address()["port"] + " port");
//   var text= "[SERVER] listening to 7056 port"
//   console.log(text.rainbow);
// });
// const buffer_size = 20000; //20MB

// function handleConnection(conn) {
//   const bar1 = new cliProgress.SingleBar(    
//     {
//       format:
//         "Download Progress |" +
//         _colors.blue("{bar}") +
//         "| {percentage}% || {value}/{total} Chunks || ETA: {eta} seconds",
//       barsize: 50,
//       hideCursor: true,
//     },
//     cliProgress.Presets.shades_grey
//   );

//   let tcp_buff = Buffer.alloc(0);

//   let remoteAddress = conn.remoteAddress + ":" + conn.remotePort;
//   let stateMachine = 0;
//   let deviceStatus = new ftpu.DeviceDescriptor();
//   // ftpu.LogString("[SERVER] client connected: " + remoteAddress);
//   console.log("[SERVER] client connected: " + remoteAddress);
//   conn.on("data", onConnData);
//   conn.once("close", onConnClose);
//   conn.on("error", onConnError);
//   conn.on("timeout", onConnTimeout);

//   function onConnData(d) {
//     let cmd_size = 0;
//     let cmd_id = 0;
//     console.log("onconndata",d)
//     console.log("buffer_size",buffer_size,d.length)
//     if (d.length < buffer_size) {
//     //  tcp_buff = Buffer.concat([tcp_buff, d]);
//     tcp_buff = Buffer.concat([tcp_buff, d]);
//       // ftpu.LogString(
//       //   "Data from: " + remoteAddress + "[" + tcp_buff.toString("hex") + "]"
//       // );
//       /* while (1) {
//         if (tcp_buff.length >= 4) {
//           cmd_id = ftpu.ParseCmd(tcp_buff);
//           console.log("cmd_id: ",cmd_id,ftpu.IsCmdValid(cmd_id),ftpu.CmdHasLengthField(cmd_id))
//           //// ftpu.LogString("Received command id " + cmd_id);
//           if (ftpu.IsCmdValid(cmd_id)) {
//             if (ftpu.CmdHasLengthField(cmd_id)) {
//               cmd_size = tcp_buff.readUInt16BE(2) + 4;
//             } else {
//               cmd_size = ftpu.GetExpectedCommandLength(cmd_id);
//             }
//             console.log("cmd_size: ",cmd_size)



//             // ftpu.LogString("CMD size: " + cmd_size);
//             if (tcp_buff.length >= cmd_size) {
//               // Time to parse
//               // ftpu.LogString("Passing CMD with ID " + cmd_id);
//               // console.log("Passing CMD with ID " + cmd_id);
//               stateMachine = ftpu.StateMachine(
//                 stateMachine,
//                 conn,
//                 cmd_id,
//                 tcp_buff,
//                 deviceStatus,
//                 bar1
//               );
//               if (tcp_buff.length > cmd_size) {
//                 tcp_buff = tcp_buff.slice(cmd_size, tcp_buff.length);
//                 // ftpu.LogString("Remaining in buffer " + tcp_buff.length);
//               } else {
//                 // ftpu.LogString("Clearing buffer");
//                 tcp_buff = Buffer.alloc(0);
//               }
//             } else {
//               break;
//             }
//           } else {
//             // drop the buffer load
//             tcp_buff = Buffer.alloc(0);
//             break;
//           }
//         } else {
//           break;
//         }
//       } */
//       while (tcp_buff.length >= 4) {
        
//         const cmd_id = ftpu.ParseCmd(tcp_buff);
//         if (!ftpu.IsCmdValid(cmd_id)) {
//             // Drop the buffer if the command is invalid
//             tcp_buff = Buffer.alloc(0);
//             break;
//         }
//         const cmd_size = ftpu.CmdHasLengthField(cmd_id) ? tcp_buff.readUInt16BE(2) + 4 : ftpu.GetExpectedCommandLength(cmd_id);

//         if (tcp_buff.length >= cmd_size) {
//             // Process the command
//             stateMachine = ftpu.StateMachine(
//                 stateMachine,
//                 conn,
//                 cmd_id,
//                 tcp_buff,
//                 deviceStatus,
//                 bar1
//             );

//             // Remove processed data from the buffer
//             tcp_buff = tcp_buff.slice(cmd_size);
//         }
//         else {
//           // Incomplete command, wait for more data
//           break;
//       }
//       }
//     } else {
//       // Too much data now
     
//     }
//   }

//   function onConnClose() {
//     // ftpu.LogString("[SERVER] connection from " + remoteAddress + " closed");
//   }

//   function onConnError(err) {
//     // ftpu.LogString(
//     //   "[SERVER] connection " + remoteAddress + " error: " + err.message
//     // );
//     // Delete file
//   } 

//   function onConnTimeout() {
//     // ftpu.LogString("[SERVER] connection from " + remoteAddress + " timeouted");
//   }
// }