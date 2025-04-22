## AI小记

AI小记，是一款基于AI的个人智能记账工具，通过自然语言交互实现「一句话极速记账、查账」。  
你只需说"早餐25元，支付宝付款"或"工资到账银行卡18000元"，系统将自动解析金额、分类、支付方式并记录到账本中。
而且支持🔥MCP客户端使用。

---

**小记特点：**

- 极速记账：通过自然语言交互实现「极速记账」。
- 多种方式：除了文本，还支持图片、语音以及文件等方式翻译成自然语言实现记账。*（需要MCP Client的支持）*
- 智能分类：AI自动识别自然语言进行精准分类。分类范围仅限于你自己配置的分类。
- 多端支持：支持微信小程序、MCP Client。

**视频演示：**

【用自然语言记账】  
https://www.bilibili.com/video/BV1TsdLYMEEb/

【用支付宝的账单截图记账】  
https://www.bilibili.com/video/BV16VoEYKEGe/

## 👇🏻这些应用可直接使用AI小记
- [Claude for Desktop](https://claude.ai/download)
- [Cursor](https://www.cursor.com/)
- [Trae](https://www.trae.ai/)
- [VS Code](https://code.visualstudio.com/)
- [Cherry Studio](https://cherry-ai.com/)
- [Cline](https://cline.bot/)

### 🎉 在任意支持MCP的应用中配置即可：
打开应用，找到 MCP Server 配置，然后根据应用提示将下面的配置添加即可。
```json
{
  "mcpServers": {
    "ledger-mate-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@big_mouth_cn/ledger-mate-mcp-server"
      ],
      "env": {
        "LEDGER_MATE_ACCESS_KEY": "<YOUR_ACCESS_KEY>"
      }
    }
  }
}
```

## 演示：在Claude中使用AI小记

**1. 前提准备**  

1. 需要准备一个支持MCP的客户端，如：[Claude for Desktop](https://claude.ai/download)
2. 打开微信小程序，搜索"爱小记"，进入小程序后点击复制密钥，保管下来后面需要用到。

![microprogram.png](docs%2Fmicroprogram.png)

**2. 添加小记MCP Server**

首先打开计算机上的 Claude 菜单并选择“Settings...”请注意，这些不是应用程序窗口本身中的 Claude 帐户设置。

在 Mac 上它应该是这样的：
![claude-settings.png](docs%2Fclaude-settings.png)

单击“Settings”窗格左侧栏中的“Developer”，然后单击“Edit Config”：
![quickstart-developer.png](docs%2Fquickstart-developer.png)

这将在以下位置创建一个配置文件：

- macOS：`~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows：`%APPDATA%\Claude\claude_desktop_config.json`
如果您还没有，则会在您的文件系统中显示该文件。

在任何文本编辑器中打开配置文件。将文件内容替换为以下内容：

```MacOS/Linux/Windows
{
  "mcpServers": {
    "ledger-mate-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@big_mouth_cn/ledger-mate-mcp-server"
      ],
      "env": {
        "LEDGER_MATE_ACCESS_KEY": "替换成准备步骤中获取的密钥"
      }
    }
  }
}
```

为确保此程序正常运行，您的计算机上还需要安装Node.js。要验证是否已安装 Node，请在您的计算机上打开命令行。

在 macOS 上，从“应用程序”文件夹打开“终端”
在 Windows 上，按 Windows + R，输入“cmd”，然后按 Enter
进入命令行后，输入以下命令验证是否已安装 Node：

```shell
node --version
```

如果出现错误“未找到命令”或“无法识别节点”，请从[nodejs.org](https://nodejs.org/)下载 Node 。

**3. 重启Claude**

更新配置文件后，您需要重新启动 Claude for Desktop。

重新启动后，您应该会在输入框的右下角看到一个锤子图标：
![tools.png](docs%2Ftools.png)

单击锤子图标后，您应该会看到 Ledger-Mate MCP Server 附带的工具：
![tools-list.png](docs%2Ftools-list.png)

**4. 尝试一下！**

现在你可以和 Claude 对话，询问它关于记账的问题了。它应该知道何时调用相关工具。

你可以尝试问克劳德以下问题：

* 帮我记一下账：今天用支付宝打车20元、吃早饭18.5元，还买了水果53元，不过是微信付的；昨天工资收入12000元，存入了银行卡。
* 我想查下这个月收支汇总。
* 我想查下这个月开支前5的项目是哪些。

_根据需要，Claude 会调用相关工具并征求您的同意后再采取行动。_

## 问题
- 除了通过MCP客户端查看和管理我的账本，还有其他方式吗？  
现在可以通过微信小程序“爱小记”查看和管理，提供了传统的操作方式。小程序还将提供自然语言、语音等方式交互。正在开发中 🚧


- 支持哪些MCP客户端？  
除了Claude，理论上支持所有MCP Client，只要能够执行 Node。接下来还会有 Python 版本。