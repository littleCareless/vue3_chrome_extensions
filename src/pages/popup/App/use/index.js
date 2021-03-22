const sendToBackground = (data, callback) => {
  console.log("发送消息", data);
  const params = {
    target: "background",
    from: "popup",
    data
  };
  chrome.runtime.sendMessage(params, res => {
    console.log("res", res);
  });
};
const sendToContents = (data, callback) => {
  const params = {
    from: "popup",
    target: "contents",
    data
  };
  console.log("发消息给content", data);
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, params, {}, res => {
      console.log("res", res);
      callback(res);
    });
  });
};

export { sendToBackground, sendToContents };
