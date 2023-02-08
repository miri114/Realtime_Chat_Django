let loc = window.location;
let wsStart = "ws://";
let input_message = $("#input-message");
let message_body = $(".msg_card_body");
let send_msg_form = $("#send-message-form");

const USER_ID = $("#logged-in-user").val();

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
    let send_to;
    if (USER_ID == 1) send_to = 4;
    else send_to = 1;
    let data = {
      message: message,
      sent_by: USER_ID,
      send_to: send_to,
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
  let sent_by_id = data["sent_by"];
  newMessage(message, sent_by_id);
};

socket.onerror = async function (e) {
  console.log("error", e);
};

socket.onclose = async function (e) {
  console.log("close", e);
};

function newMessage(message, sent_by_id) {
  if ($.trim(message) === "") {
    return false;
  }

  const now = new Date();
  hour = now.getHours();
  minute = now.getMinutes();

  let message_element;
  if (sent_by_id == USER_ID) {
    message_element = `
            <div class="d-flex mb-4 replied">
              <div class="msg_container_send">
                ${message}
                <span class="msg_time_send">${hour}:${minute}, Today</span>
              </div>
              <div class="img_cont_msg">
                <img class="rounded-circle user_img_msg"></img>
              </div>
            </div>
            `;
  } else {
    message_element = `
    <div class="d-flex mb-4 received">
      <div class="img_cont_msg">
        <img
          src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
          class="rounded-circle user_img_msg"
        />
      </div>
      <div class="msg_container">
       ${message}
        <span class="msg_time">
          ${hour}:${minute}, Today
        </span>
      </div>
    </div>`;
  }

  message_body.append($(message_element));
  message_body.animate(
    {
      scrollTop: $(document).height(),
    },
    100
  );
  input_message.val(null);
}
