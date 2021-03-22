/* eslint-disable */
console.log('content正在执行~', chrome)
// 发消息给background
const sendToBackground = (data, callback) => {
  const params = {
    target: 'background',
    from: 'contents',
    data,
  }
  // console.log('contents向background发送请求', params)
  chrome.runtime.sendMessage(params, callback)
}
// 中转站，专门用来转发消息。
// 处理一部分逻辑.
class Controller {
  // constructor(request, sendResponse) {
  //   this.request = request
  //   this.sendResponse = sendResponse
  // }
}
class ControllerPopup extends Controller {}
class ControllerBackground extends Controller {
  injectApp(request, sender, sendResponse) {
    return new Promise((resolve, reject) => {
      try {
        console.log('插入injectApp', request, sender, sendResponse)
        const { res } = request.data
        // sendToBackground(request,(source) => {
        //   console.log('获取到将要插入的代码段...', source)
        // })
        const contentScriptStart = document.createComment(
          ' Content Script Start '
        )
        document.head.appendChild(contentScriptStart)

        const script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        const scriptBlob = new Blob([res], { type: 'text/javascript' })
        script.src = URL.createObjectURL(scriptBlob)
        script.onload = () => {
          const contentScriptEnd = document.createComment(
            ' Content Script end '
          )
          document.head.appendChild(contentScriptEnd)
          // console.log('插入成功', sendResponse('123'))
          // sendResponse('插入成功~')
          resolve('插入成功')
        }
        document.head.appendChild(script)
      } catch {
        reject('插入失败')
      }
    })
    // sendResponse()
  }
}
const popup = new ControllerPopup()
const background = new ControllerBackground()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.target !== 'contents') {
    return
  }
  if (request.from === 'popup') {
    console.log('来自popup', request, sender, sendResponse)
    popup[request.data.command](request, sender, sendResponse)
  } else if (request.from === 'background') {
    console.log('来自background', request, sender, sendResponse);
    (async () => {
      const res = await background[request.data.command](
        request,
        sender,
        sendResponse
      )
      sendResponse(res)
    })();
    return true;
  }
})
