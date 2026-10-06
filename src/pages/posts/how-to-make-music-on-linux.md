---
layout: ../../layouts/PostLayout.astro
title: "如何在linux上制作音乐"
description: "从系统介绍到完成一首歌曲的混音的详细过程"
publishedAt: 2025-11-21
readingTime: 4 min
cover: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(7).jpg"
tags: []
draft: false
---

## Linux是什么

Linux是开源的操作系统，并且基于Linux可以继续进行开发配置环境。有一些开发者把配置好环境的系统打包发行，这些就是Linux发行版。Linux发行版的种类很多，适合桌面应用社区最活跃的就不得不提Ubuntu了

Ubuntu自24起使用pipewire统一管理音频驱动的后端，相当优雅。有朋友推荐使用UbuntuStudio，但我使用下面感觉相当难受，默认安装了太多我不想要的软件，此外我也不喜欢它的桌面。我目前使用的是ZorinOS 18，这是基于Ubuntu24的发行版，并没有配置过于多的环境，留有自己手动配置的空间，以及一个简单优雅好看的桌面。

感兴趣可以查看：[ZorinOS](https://zorin.com/os/)

## 在Linux下制作音乐的优缺点

linux因为连内核都开源，它的音频驱动比win好太多了，我甚至感觉linux的音频驱动比mac还好。日常使用听歌会非常舒服，但是音乐制作还是太困难了。支持linux的daw和插件不是很全面，虽然有一些兼容的方案，但同样存在很大的问题。不过在linux下做音量平衡我感觉都会更好，当然这大概率是心理作用。

总结的话，日常使用linux和win差别不大，就是可能你需要安装一些日常的软件。如果你有其他的需要，比方说编程科研服务器等等，那我才会建议你使用linux，但是很多特殊的比如工业软件，只有win的方案，那你就只能试试看容器化是是否可行了。

## Ubuntu的安装

首先你需要下载在对应的官网下载系统镜像iso文件，然后找一个空的U盘制作启动盘。然后下载启动盘的制作软件，我推荐：[Rufus](https://rufus.ie/en/)，简单好用。

如果你考虑直接all in Linux的话，就无所谓了，但是如果你希望win和ubuntu双系统的话，那我建议你单独准备一块硬盘。我现在电脑里有两块硬盘，一块一个系统。

制作好启动盘后就可以安装啦！重启电脑进入bios，不同品牌的电脑可能方式不太一样，但都是在重启时按住某个按键。进入bios或者UFEI之后，选择从usb 存储启动。接下来应该就会进入ubuntu的安装环节。选择“安装或者尝试ubuntu”，然后依据引导安装系统。如果你只用ubuntu的话，可以选择“擦除整个硬盘以安装ubuntu”，如果你是双系统的话，你就需要手动选择硬盘进行安装。

详细情况你可以在b站搜索“ubuntu安装”观看社区的演示视频。我强烈建议你在安装完成后，安装一个输入法，比如搜狗和rime，ubuntu默认的输入法相当难受。


## Linux下制作音乐的选择

目前常用的daw中，原生支持linux的daw并不多，像是Studio one，reaper，mixbus和一些我没兴趣用的。其他的daw基本上只能用wine容器运行了。

随着容器化技术的飞速发展，我甚至可以在linux上畅玩黑夜君临。windows容器方案常用的有wine。wine目前以及更新到了10，可以安装ilok manager，但我测试下来ua connect能够安装但是无法打开界面。

在linux上有原生支持linvst，但是除了一些比较新的插件厂家和一些个人开发者外，支持不太全面，你可以在[LinuxDAW](https://linuxdaw.org/)这个网站寻找支持的插件。想使用window vst插件，你可以考虑桥接的方案[yabridge](https://github.com/robbert-vdh/yabridge)。根据社区的一则帖子的计算，通过容器化转译造成的额外性能开销是7%，而得益于linux优秀的音频驱动，你可以选择更大的缓存区来提升它的性能体验，我实际使用下性能差异不大。

比较遗憾的是，yabridge的上一次更新是在2024年，当时支持的是wine9.2，如今wine已经更新到10了。在Studio one中打开这些桥接插件，目前只有旋钮没有图形界面，而在很多其他宿主中无法打开这些桥接插件。来自社区的意见是将wine回滚至9.2。

不过你可以尝试在wine容器内允许windows版本的daw，这样不需要使用桥接，但是文档较少。

## mixbus11

大家还记得哈里森的daw吗，它更新到11了，而且原生支持linux。如果只有混音的需求，那么使用mixbus11和哈里森提供的插件，对我来说已经可以满足90%的需求了。正好linux上我目前没有办法很好地使用插件，也不失为一个好的方案。

下面是我使用mixbus完成的一个简单的混音，完全使用的哈里森32c的通道条，人声混响使用的是哈里森自带的一个混响。目前mixbus11的价格是基础版49美元，pro版149美元，5台电脑授权。详细见官网[mixbus](https://store.harrisonaudio.com/all-products/mixbus-11-daw)。


<div style="text-align: center; margin: 20px;">
    <p>失陷(remix)</p>
    <audio controls style="width: 80%; margin: auto;">
        <source src="https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/%E5%A4%B1%E9%99%B7-11-21.mp3" type="audio/mpeg">
    </audio>
</div>

我在linux下混完之后回到win简单地做了一下母带，我感觉我做音量平衡比在win下会好，而且由于进行的处理较少，呈现出来的质感也更高级，不过还是那句话，workflow这种东西只有自己跑一遍才知道合不合适，见仁见智吧。

虽然目前来说linux的软件生态还不太完善，但总的来说值得期待。
