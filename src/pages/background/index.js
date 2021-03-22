console.log("background正在执行~");
import axios from "axios";
// 发送消息给popup
const sendToPopup = (data, callback) => {
  const params = {
    target: "background",
    from: "popup",
    data
  };
  // console.log('contents向background发送请求', params)
  chrome.runtime.sendMessage(params, callback);
};

// 发送消息给content
const sendToContents = (data, sendID, callback) => {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        from: "background",
        target: "contents",
        data
      };
      // console.log('background向contents发送信息', params)
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        console.log("sendToContents", tabs);
        chrome.tabs.sendMessage(tabs[0].id, params, {}, res => {
          console.log("res", res);
          // callback(res);
          resolve(res);
          // console.log("callback", callback());
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};
class Controller {}
class ControllerInject extends Controller {}
class ControllerPopup extends Controller {
  injectApp(request, sender, sendResponse) {
    return new Promise((resolve, reject) => {
      try {
        axios({
          method: "get",
          url: `http://localhost/tema_extension/${request.data.value}/inject.js`
        })
          .then(res => {
            console.log("res", res);
            sendToContents(
              { ...request.data, res: res.data },
              sender.id,
              sendResponse
            )
              .then(res => {
                resolve(res);
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            console.log("请求失败了", err);
            reject(err);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
}
// const content = new Controller();
const inject = new ControllerInject();
const popup = new ControllerPopup();

// 接受多个来源的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.target !== "background") {
    return;
  }
  if (request.from === "popup") {
    console.log("来自popup", request, sender, sendResponse);
    (async () => {
      const res = await popup[request.data.command](
        request,
        sender,
        sendResponse
      );
      sendResponse(res);
    })();
    return true;
  } else if (request.from === "content") {
    console.log("来自content", request, sender, sendResponse);
  } else if (request.from === "inject") {
    console.log("来自inject", request, sender, sendResponse);
    inject[request.data.command](request, sender, sendResponse);
  }
});
