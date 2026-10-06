---
layout: ../../layouts/PostLayout.astro
title: "【开发日记】如何使用iplug2架构开发vst3插件"
description: "记录踩过的一些坑（缓慢更新中）"
publishedAt: 2026-06-25
category: "开发"
readingTime: 4 min
cover: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(7).jpg"
tags:
  - "vst插件开发"
draft: false
---

# 前言

传统的开发无论是使用juce架构和iplug2架构，都需要使用vst3sdk来封装成vst3插件。vst3sdk目前是MIT开源，vst2和aax是需要单独授权的，建议自行查看avid和斯坦伯格的相关条款。

然而我了解到目前有一些更为前沿的开发方式，使用rust编写的iamdsp库开发，或者是使用python，但我不太理解他们是怎么使用vst3sdk来封装vst3插件的，如果你打算使用rust或者python，你可能需要自行查找其他的文档。

# 准备工作

win/mac的电脑一台，如果使用mac的话你需要注册开发者账号，便于软件后续的公证。开发相关的配置，如github，visual studio，xcode，python等。

github和git命令工具用于代码的版本管理与远程协作，python用于运行iplug2事先写好的一些脚本，IDE推荐visual studio和xcode，iplug2事先已经准备好了对应的项目工程，所以实际上非常轻松。

iplug2架构具体的环境配置，推荐阅读github上的wiki:[快速上手](https://github.com/iPlug2/iPlug2/wiki)

简单来说，你需要：1、克隆下iplug2的仓库,你会得到一个名为**iPlug2**或者**iPlug2main**的目录，2、下载**vst3sdk**到对应的目录，3、建议在**iPlug2**下新建一个**Projects**子目录，4、从**Examples**里把示例工程复制过来，就可以开始开发了。

# 踩过的坑

### 0. vst3是插件不是软件

它是一个被daw调用的插件，确切的说，它只是提供了一个被daw循环调用的dsp函数。所以debug，性能优化之类都相当困难，但是好处是你也不需要考虑线程等等复杂的问题，实际上你也考虑不了。vst3插件的开发代码部分很简单，因此你需要注意**不要过度设计！不要过度设计！不要过度设计！**工作的重心还是dsp算法。

### 1. 自定义资源

你应该资源文件正确放在Resources文件夹内。在IDE里面引入这些文件有两种方式，iplug2架构更常见的方式是编译成二进制直接写入插件里面，但你也可以尝试使用相对地址。无论哪种都是一堆的坑。。。

以下是**config.h**的最后，你可以自定义一个宏，然后在**main.rc**中使用**资源包括**，这样就可以以二进制包含你的资源文件，并在cpp中通过宏来使用资源文件。

```c++
#define ROBOTO_FN "Roboto-Regular.ttf"

```
请注意资源包括的写法参考**ROBOTO_FN TTF ROBOTO_FN**后面还有一个换行的**\0**！所以记得每次添加完之后多打一个换行，以及在**config.h**的最后也是要多打一个换行！

### 2. 文件结构

在iplug2中没有像vst3sdk和juce那样的ui的控制器，只有一个头文件和cpp文件。如果你愿意使用它提供的一个C++写的UI库，那么绝大多数时候我们都只会使用到这两个文件。

以侧链的示例代码为例，头文件的结构为：

```c++
#pragma once

#include "IPlug_include_in_plug_hdr.h"
#include "ISender.h"
#include "IControls.h"

const int kNumPresets = 1;

///参数枚举
enum EParams
{
  kGain = 0,
  kNumParams
};

///自定义的数据结构
enum ECtrlTags
{
  kCtrlTagInputMeter = 0,
  kCtrlTagOutputMeter,
  kNumCtrlTags
};

enum EMsgTags
{
  kMsgTagConnectionsChanged = 0,
  kNumMsgTags
};


///插件主类
using namespace iplug;
using namespace igraphics;

class IPlugSideChain final : public Plugin
{
public:
  IPlugSideChain(const InstanceInfo& info);

  void OnIdle() override;
#if IPLUG_DSP
  void ProcessBlock(sample** inputs, sample** outputs, int nFrames) override;
  void OnActivate(bool enable) override;
  void OnReset() override;
  void GetBusName(ERoute direction, int busIdx, int nBuses, WDL_String& str) const override;
#endif

  bool mInputChansConnected[4] = {};
  bool mOutputChansConnected[2] = {};
  bool mSendUpdate = false;
  
  IPeakAvgSender<4> mInputPeakSender;
  IPeakAvgSender<2> mOutputPeakSender;
#if IPLUG_EDITOR
  IVMeterControl<4>* mInputMeter = nullptr;
  IVMeterControl<2>* mOutputMeter = nullptr;
#endif
};

```

比较推荐的做法是，在开发初期在cpp中设计和测试你的dsp算法。随着项目扩大，使用自定义的数据结构，尤其是类来封装你的dsp算法。

### 2. DSP函数

```c++
#if IPLUG_DSP
  void OnActivate(bool enable) override;
  void OnReset() override;
  void ProcessBlock(sample** inputs, sample** outputs, int nFrames) override;
  void GetBusName(ERoute direction, int busIdx, int nBuses, WDL_String& str) const override;
#endif
```

#### `OnActivate(bool enable)`

**插件加载/卸载时调用**。**enable=true**插件开始干活，**false**准备收工。用于开关插件，分配内存，初始化延迟线、FFT缓冲区等。

#### `OnReset()`

采样率或缓冲区大小变化时调用。插件启动时也会调一次。重置DSP内部状态（清空延迟线、重置滤波器），重置缓冲区，以及**设置延迟补偿**：

```c++
void OnReset() override {
  // 如果你的算法有延迟，告诉DAW
  SetLatency(512); // 512样本延迟
}
```

DAW知道后会自动把其他轨道对齐，用户听不出时间偏移。

#### `ProcessBlock(sample** inputs, sample** outputs, int nFrames)`

核心音频处理函数。DAW循环调用，每次给你一帧数据，你处理完还给DAW。不要想太多！它是实时线程，所以各种骚操作都不可以哦！

#### `GetBusName(...)`

给通道起名，显示在DAW的路由界面。用来告诉DAW哪个是主输入，哪个是侧链输入，这样DAW就知道你有两路输入：一路是音频信号，一路是侧链信号。


### 3. 侧链通道配置

`PLUG_CHANNEL_IO`告诉DAW你的插件支持什么通道布局。

基本写法：

```c++
"主输入通道数-主输出通道数"          // 不带侧链
"主输入.侧链输入-主输出.侧链输出"    // 带侧链
```

例如：
```c++
#define PLUG_CHANNEL_IO "\
1-1 \
1.1-1 \
1.2-1 \
1.2-2 \
2.1-1 \
2.1-2 \
2-2 \
2.2-2"
```

对于ProcessBlock而言，inputs数组的顺序是：主输入通道在前，侧链在后，所以是这样拿到数据的：

```c++
sample* mainL = inputs[0];
sample* mainR = inputs[1];
sample* sideL = inputs[2];   // 有侧链配置时才有
sample* sideR = inputs[3];
```
