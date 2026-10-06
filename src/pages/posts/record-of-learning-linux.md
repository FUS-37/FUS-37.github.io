---
layout: ../../layouts/PostLayout.astro
title: "linux学习日记"
description: "学习linux高级编程中，顺便写点记录,持续更新中（=y=才不是摸鱼呢"
publishedAt: 2026-01-04
category: "linux"
readingTime: 4 min
cover: "https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/reoenl%20(4).jpg"
tags:
  - "linux"
draft: false
---

## DAY1 线程和进程

#### 概念与区别

在Windows中，线程和进程是**两种不同的内核对象**，概念区分明确，但常常协同工作，因此在实际讨论中有时不做严格区分。

在Linux中，线程和进程在**内核实现上是相似的概念**，都被抽象为统一的“任务”（Task）。这种设计使得使用线程时需要特别注意资源共享和同步的问题。

> **进程**是程序的一次动态执行实例，是操作系统进行**资源分配的基本单位**。每个进程都有独立的虚拟地址空间和系统资源。

> **线程**是进程内的一个执行流，是**CPU调度的基本单位**。在Linux中，线程本质上是一种**共享地址空间的轻量级进程**，多个线程共同组成一个进程，它们共享进程的资源（如内存空间、文件描述符等）。

#### 函数式API

与Windows的面向对象API（如**CreateProcess**、**CreateThread**）不同，Linux提供了基于函数的系统api来操作进程和线程。你可以通过**man 章节号 函数名**在命令行中查看相关手册。其中**第2章是系统调用**，**第3章是库函数**。

##### 1. 进程信息获取函数

在Linux中，以下几个是基础的进程信息获取函数：

```c++
#include <unistd.h>  // Unix标准头文件，包含POSIX操作系统API

pid_t getpid(void);    // 返回当前进程的进程ID（PID）
pid_t getppid(void);   // 返回当前进程的父进程ID（PPID）
```

其中 **unistd.h** 是Unix标准头文件，名称源于"Unix Standard"。它定义了POSIX操作系统API，包含大量系统调用和常量的声明。**pid_t** 是进程ID的类型定义，通常定义为int或int32_t，用于存储进程ID。

我们来编写一个简单的测试案例：

```c++
#include <unistd.h>
#include <iostream>
using namespace std;

int main(){
  cout << getpid() << endl;
  pid_t parent;
  parent = getppid();
  cout << "parent = " << parent << endl;
  getchar();
}
```

> 返回结果:
10044
parent = 9323

每次运行程序时，返回的PID通常都不同，因为进程ID是由操作系统动态分配的。暂时不要关闭这个程序，我们尝试在进程树中找到它。在命令行中输入：

```bash
pstree -p
```

如果找不到a.out进程，可能是因为getchar()在某些环境下不阻塞导致程序已退出。你可以让程序进入一个死循环来确保它持续运行。

我们可以看到所有进程都是从systemd(1)（或较老系统中的init(1)）派生出的树状结构。其中一个分支是bash(9323)，而我们的程序a.out(10044)是它的子进程。这里的bash是运行a.out的终端shell，也就是a.out的父进程。systemd（或init）是Linux系统的第一个进程（PID为1），它是所有用户进程的最终祖先。

***

##### 2. 创建进程函数

手册中的函数定义如下：

```c++
#include <unistd.h>

pid_t fork(void);
```

返回值说明:
1. 成功时：会返回2次，一次在父进程中返回子进程的PID，一次在子进程中返回0，在宏观上是同步并行执行的
2. 失败时：在父进程中返回-1，不会创建子进程，同时设置errno来指示具体错误

让我们再来编写一个简单的测试案例：

```c++
#include <unistd.h>
#include <iostream>
using namespace std;

int main(){
  cout << "child = " << fork()<< endl;
  cout << "parent = " << getppid()<< endl;
  cout << "self = " << getpid()<< endl;
  getchar();
}
```
> 返回结果:
child = 11375
parent = 9323
self = 11374
child = 0
parent = 11374
self = 11375

**fork**函数的作用是复制当前进程及其资源，创建出一个子进程，之后父子进程并发执行。虽然输出显示父进程先执行、子进程后执行，但这只是cout调用的时序问题，在宏观上是同步并行的。

如果你循环调用cout的话，就可以看到父子的输出的先后顺序会不时地改变。你可以自己编译并执行一下下面这个测试案例：

```c++
#include <unistd.h>
#include <iostream>
using namespace std;

int main(){
  pid_t flag;
  flag = fork();
  while(1){
    if(0 == flag){
        cout << "I am child" << endl;
        sleep(1); //暂停1s
    }
    else{
        cout << "I am parent" << endl;
        sleep(1);
    }
  }
}
```
>返回结果(截取):
I am parent
I am child
I am parent
I am child
I am child
I am parent
I am parent
I am child

这也可以进一步说明fork()创建的子进程与父进程是并发的。在linux服务器的许多高并发场景中，会频繁地需要创建进程。

我们再来看一个测试案例：

```c++
#include <unistd.h>
#include <iostream>
using namespace std;

int main(){
    pid_t p1;
    pid_t p2;
    p1 = fork();
    p2 = fork();
    cout << "========" << endl;
    cout << p1 << endl;
    cout <<  p2 << endl;
    getchar();
}
```
>返回结果：
\=\=\=\=\=\=\=\=
11888
11889
\=\=\=\=\=\=\=\=
11888
0
\=\=\=\=\=\=\=\=
0
11890
\=\=\=\=\=\=\=\=
0
0

我们先假设有一个父进程a，首先它创建了一个子进程b（11888）；然后a再次创建子进程c（11889），b创建了d（11890）。在创建子进程时会复制父进程的资源，所以你会看到子进程d能够拿到b的pid值11888，但是它自己是0。

顺便了解一下，Linux系统会对进程创建过程进行优化，采用写时复制（Copy-On-Write, COW）技术：子进程创建时不立即复制父进程的资源，而是共享同一份资源；只有当某个进程试图修改共享资源时，系统才会为该资源创建独立的副本。

##### 3. 子进程监控函数

##### 4. 线程创建函数
