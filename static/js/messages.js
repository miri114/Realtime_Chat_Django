let loc = window.location;
let wsStart = "ws://";
let input_message = $("#input-message");
let message_body = $(".msg_card_body");
let send_msg_form = $("#send-message-form");

if (location.protocol === "https") {
  wsStart = "wss://";
}

let endpoint = wsStart + loc.host + loc.pathname;
// so we are looking for something like , ws://127.0.0.1:8000/chat/
// or wss://127.0.0.1:8000/chat/ is the protocol is https (which means ), uses SSL

var socket = new WebSocket(endpoint);

socket.onopen = async function (e) {
  console.log("open", e);

  send_msg_form.on("submit", function (e) {
    e.preventDefault();
    let message = input_message.val();
    let data = {
      message: message,
    };
    data = JSON.stringify(data);
    socket.send(data);
    $(this)[0].reset();
  });
};

socket.onmessage = async function (e) {
  console.log("message", e);
  let data = JSON.parse(e.data);
  let message = data["message"];
  newMessage(message);
};

socket.onerror = async function (e) {
  console.log("error", e);
};

socket.onclose = async function (e) {
  console.log("close", e);
};

function newMessage(message) {
  if ($.trim(message) === "") {
    return false;
  }

  const message_element = `
    <div class="d-flex mb-4 replied">
      <div class="msg_container_send">
        ${message}
        <span class="msg_time_send">8:55 AM, Today</span>
      </div>
      <div class="img_cont_msg">
        <img src="#"></img>
      </div>
    </div>
    `;

  message_body.append($(message_element));
  message_body.animate(
    {
      scrollTop: $(document).height(),
    },
    100
  );
  input_message.val(null);
}
