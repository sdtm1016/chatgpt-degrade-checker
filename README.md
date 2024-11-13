
## ChatGPT服务降级检测工具（Chrome扩展程序）
由于 ChatGPT 会对某些 ip 进行无提示的服务降级，此Chrome扩展程序用于检测你的 IP 是否被 ChatGPT 判定为高风险。在一定程度上可以用于辅助判断你的 IP 是否遭到服务降级。

## 安装及使用


## 什么是服务降级？
ChatGPT 会对一些被判断为高风险的 IP 降级服务，偷偷将模型切换为 GPT-4o-mini 或者更差，并且没有任何提示。

## 服务降级有什么影响？
降级后，即便你是 Plus 用户，在使用 4o 模型时会发现无法使用联网搜索、图片生成等功能，使用 o1 模型时，会发现模型不进行思考直接回答。



## 特别致谢
- https://github.com/KoriIku/chatgpt-degrade-checker