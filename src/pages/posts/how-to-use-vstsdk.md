---
layout: ../../layouts/PostLayout.astro
title: "【开发日记】如何使用vst3sdk进行插件开发"
description: "vst3sdk许可证改为MIT了你敢信吗！？(更新至创建自己的插件)"
publishedAt: 2026-02-24
category: "开发"
readingTime: 4 min
cover: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(7).jpg"
tags:
  - "vst插件开发"
draft: false
---

## 前言

我一直有自己开发 VST 插件的想法。之前尝试过 JUCE，但不太喜欢它的架构设计，加上文档也有些抽象难懂。最近看到 Steinberg 将 VST3 SDK 的许可证改为 MIT，我意识到这或许是开始尝试自己开发插件的好时机。

直接使用官方 SDK 的方案可能更适合有 C++ 基础的朋友，而且 MIT 许可证比 JUCE 的许可证更加宽松自由。由于 SDK 不像 JUCE 那样高度封装，代码更加透明直接，或许会更适合 AI 辅助编程开发？

这个文档会详细记录并持续更新我在开发过程中遇到的事情，目标是创建一个自己的增益控制插件，并初步理解其代码架构。

参考文献：
1. [MIT许可证简介](https://tlo.mit.edu/understand-ip/exploring-mit-open-source-license-comprehensive-guide)
2. [VST 3 SDK – Steinberg 官方](https://www.steinberg.net/developers/vstsdk/)
3. [VST 3 开发者门户——许可常见问题解答](https://steinbergmedia.github.io/vst3_dev_portal/pages/FAQ/Licensing.html)
4. [用VST3 SDK 3.8构建自定义增益插件“MyGain”，并在DAW中运行](https://dev.classmethod.jp/en/articles/build-vst3-plugin-mygain-with-vst3sdk/#about-vst3-sdk's-mit-licensing)

***

## 1. 准备工作

开发方案：**VST3 SDK + CMake + Visual Studio**

1/ **安装 CMake**

CMake 最低版本要求为 3.25（VST3 SDK 3.8.0 需要），你可以从 [CMake官网](https://cmake.org/) 下载最新版本。

2/ **安装 Visual Studio**

根据官方文档，推荐使用 Visual Studio 2022。我使用的是 2026 预览版，如果你也打算使用较新版本，后面可能需要根据实际情况调整 CMakeLists.txt 中的生成器配置。

Visual Studio 有面向企业和个人开发者等多种版本，初学者可以选择免费的**社区版**，功能完全够用。

3/ **获取 VST3 SDK**

如果你还不熟悉 Git，它是一个分布式版本控制工具。建议先注册 GitHub 账号，并了解 Git 的基本安装和使用。

建议单独创建一个工程文件夹，并使用 Git 克隆官方仓库：

```bash
mkdir work
cd work
git clone --recursive https://github.com/steinbergmedia/vst3sdk.git
```

注意 **--recursive** 参数很重要，它会同时下载需要的子模块（包括 VSTGUI）。完成后，你会在 work 文件夹内看到 vst3sdk 文件夹，里面包含了我们需要的示例代码。

***

## 2. 使用 SDK 快速构建示例工程

首先创建 build 文件夹并使用 CMake 构建 Visual Studio 工程。如果你使用的是 Visual Studio 2022，可以直接执行：

```bash
cd vst3sdk
mkdir build
cd build
cmake -G "Visual Studio 17 2022" -A x64 .. -DSMTG_CREATE_PLUGIN_LINK=OFF
```

关于 **-DSMTG_CREATE_PLUGIN_LINK=OFF** 参数，官方文档中有如下解释：
> 我们使用这个参数是因为在 Windows 中创建符号链接通常需要管理员权限，这可能会因环境差异导致错误。这里我们采用手动复制的方式来完成后续构建。

由于我使用的是 Visual Studio 2026，所以改为执行如下命令：

```bash
cmake -G "Visual Studio 18 2026" -A x64 .. -DSMTG_CREATE_PLUGIN_LINK=OFF
```

进入 build 文件夹后，你会得到 Visual Studio 2026 的工程文件。双击打开 "vstsdk.slnx"，在 Release 配置下点击生成。构建完成后可能会弹出一个运行失败的提示，这是正常的——因为 VST 插件不能单独运行，需要加载到 DAW（数字音频工作站）中才能工作。因此构建得到的 .exe 文件也不能直接运行！

在 **\build\VST3** 文件夹下，你可以看到构建好的示例插件。将其复制到 **C:\Program Files\Common Files\VST3** 目录下，DAW 就能识别并加载它了。

如果你一路做到这里都没有问题，那么恭喜你，已经成功配置好了 VST3 插件的开发和测试环境！

***

## 3. 基于示例工程，生成自己插件的解决方案并构建测试

为了加快开发速度，我们只需要根据自己的需要在 **\vst3sdk\public.sdk** 目录下寻找合适的示例工程，把它复制出来即可。

接下来我们来看看如何创建自己的增益插件，所有示例插件的源代码都在 **\vst3sdk\public.sdk\samples\vst** 这一目录下，我们可以使用 **\again** 的内容。

1/ 创建文件夹并复制文件

建议在 **\vst3sdk** 的同级目录下新建文件夹，比方说命名为 **MyFirstVstPlugin** ，或者是任何你喜欢的名字。然后将 **\vst3sdk\public.sdk\samples\vst\again** 内的 **resource** ， **source** ， **CMakeLists.txt** 复制到 **MyFirstVstPlugin** 内，你可以手动复制，也可以执行如下命名：

```bash
mkdir MyFirstVstPlugin
cd MyFirstVstPlugin

mkdir source
mkdir resource

cp ../vst3sdk/public.sdk/samples/vst/again/*.h source/
cp ../vst3sdk/public.sdk/samples/vst/again/*.cpp source/
cp ../vst3sdk/public.sdk/samples/vst/again/resource/* resource/
cp ../vst3sdk/public.sdk/samples/vst/again/CMakeLists.txt
```

下面是你现在的文件目录：

|── MyFirstVstPlugin/  # 你的新插件项目（新建）
    ├── CMakeLists.txt
    ├── source/        # 存放源代码（从again复制）
    └── resource/      # 存放资源文件（从again复制）

2/ 修改 CMakeLists.txt

如果你了解 CMake语法 的话可以使用官方sdk提供的CMakeLists.txt，并根据你自己的需要自行修改。官方提供的版本已经很好地支持了跨平台开发。

如果你和我一样是仅在win下开发的个人开发者，以下是简化后的CMakeLists.txt：

```txt
# 指定 cmake 的最小版本
cmake_minimum_required(VERSION 3.25.0)

# 指定 项目名称 和 版本号
project(MyFirstVstPlugin
    VERSION 1.0.0
    DESCRIPTION "My first gain plug-in"
)

# 指定 VST3 SDK 的位置（相对路径，假设和MyFirstVstPlugin平级）
set(vst3sdk_SOURCE_DIR "${CMAKE_CURRENT_LIST_DIR}/../vst3sdk")

# 添加 SDK 作为子目录
add_subdirectory(${vst3sdk_SOURCE_DIR} ${PROJECT_BINARY_DIR}/vst3sdk)

# 启用 SDK 的 CMake 功能
smtg_enable_vst3_sdk()

# 插件源文件（沿用 again 的文件名）
set(myvst_sources
    source/again.cpp
    source/again.h
    source/againcids.h
    source/againcontroller.cpp
    source/againcontroller.h
    source/againentry.cpp
    source/againparamids.h
    source/againprocess.h
    source/againsidechain.cpp
    source/againsidechain.h
    source/againuimessagecontroller.h
    source/version.h
    resource/again.uidesc
)

set(target MyFirstVstPlugin)

# 添加 VST3 插件
smtg_add_vst3plugin(${target} ${myvst_sources})
smtg_target_configure_version_file(${target})

target_compile_features(${target} PUBLIC cxx_std_17)

target_link_libraries(${target}
    PRIVATE
        sdk
        vstgui_support
)

# 添加资源文件
smtg_target_add_plugin_resources(${target}
    RESOURCES
        resource/again.uidesc
        resource/background.png
        resource/slider_background.png
        resource/slider_handle.png
        resource/slider_handle_2.0x.png
        resource/vu_on.png
        resource/vu_off.png
)
```

3/ 创建build文件夹并生成 Visual Studio 解决方案

```bash
# 在 MyFirstVstPlugin 文件夹下
mkdir build
cd build
cmake -G "Visual Studio 18 2026" -A x64 .. -DSMTG_CREATE_PLUGIN_LINK=OFF
```

成功后会生成 MyFirstVstPlugin.sln，用 Visual Studio 打开即可。选择 Release 配置和 x64 平台，点击运行，然后重复之前的方法，在daw中测试运行即可。

## 4. 阅读学习示例代码

![文件目录](https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/2026%E5%B9%B43%E6%9C%883%E6%97%A5-1.png "文件目录")

visual studio会自动归类头文件和源文件，并用 **\Resources** 存放图片。首先我们来阅读头文件：


【未完待续】
