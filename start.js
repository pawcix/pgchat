const { ipcRenderer, remote } = require("electron");
const $ = require("jquery");
const io = require("socket.io-client");
const axios = require("axios");
let data = {};

$(".server-login").hide();
$(".loading").hide();
$(".info").hide();

$("#form-login").submit(e => {
    e.preventDefault();

    data.login = document.getElementById("login").value;
    window.open("index.html");
    ipcRenderer.send("socketCredentials", data);
});

$("#form").submit(e => {
    e.preventDefault();

    $(".loading").show();

    data.addr = document.getElementById("addr").value;

    let conn = io(data.addr);
    let timer = 1;

    axios
        .get(`${data.addr}/status`)
        .then(res => {
            if (res.status == 200 && res.data.status == 1) {
                // server running
                $(".server-login").show();
                $(".server-connect").hide();
                $(".loading").hide();
                $(".info").hide();
            } else {
                // server not running..
                $(".info").show();
                $(".loading").hide();
            }
        })
        .catch(err => {
            // server not running..
            $(".info").show();
            $(".loading").hide();
        });
});
