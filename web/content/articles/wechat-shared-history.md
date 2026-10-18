---
title: "One WeChat history for a dual-boot Windows and Linux PC"
date: "2026-10-17"
tag: "China tips"
excerpt: "WeChat desktop doesn't sync history between computers, so a dual-boot PC ends up with two histories that drift apart. Here is how I pointed both operating systems at one folder, and what went wrong on the way."
related: []
series: "field-notes"
seriesOrder: 7
hero: "/work/article-laptop.jpg"
heroAlt: "A glossy gold and blue laptop on a pale background, standing in for the PC that runs both Windows and Linux."
faq:
  - q: "Does WeChat desktop sync chat history between computers?"
    a: "WeChat desktop does not sync chat history between computers. Each client keeps only what arrives while it is running, plus whatever a phone-to-PC migration sends it."
  - q: "How can a dual-boot PC share one WeChat history?"
    a: "WeChat keeps everything in a folder called xwechat_files. The idea is to keep a single copy on the NTFS data partition that both operating systems can read, and point both clients at it."
  - q: "Is it safe for Windows and Linux to share one WeChat history folder?"
    a: "Two WeChat clients using one history folder at the same time will corrupt each other. A dual-boot machine can never run both operating systems at once, so that can't happen."
  - q: "What must be turned off in Windows for a shared NTFS partition?"
    a: "The other requirement is that Fast Startup must be off in Windows. With it on, Windows shuts down into a half-hibernated state and leaves the NTFS partition marked in use."
  - q: "What should I check after a WeChat update?"
    a: "Back up xwechat_files again before updating either side. After every Linux WeChat update, check that no second xwechat_files has appeared."
howto:
  name: "How to share one WeChat history between Windows and Linux on a dual-boot PC"
  steps:
    - name: "Before you start: back up"
      text: "Copy the whole xwechat_files folder somewhere else first, on a different drive if you can."
    - name: "The fix: one xwechat_files folder"
      text: "On Windows, open WeChat, go to the storage settings, and move the storage location to D:\\Wechat. WeChat moves the files itself."
    - name: "Make a symlink on Linux"
      text: "On Linux, quit WeChat and move the old ~/Documents/xwechat_files aside. Then make a symlink:"
    - name: "Mounting the NTFS partition on Linux"
      text: "Mount the partition the same way every time, or the files will appear owned by the wrong user."
    - name: "Turn off Fast Startup in Windows"
      text: "Set HiberbootEnabled to 0."
    - name: "After a WeChat update"
      text: "Update one system, open WeChat there, and confirm your history is still all there before touching the other."
---

Your supplier sent the drawing at 9 a.m. on Windows. At 9 p.m. you are in Linux and it isn't there. If you work in China, WeChat is where the work happens: quotes, photos of parts, voice messages from the factory. I run a dual-boot PC, Windows 11 and Ubuntu 24.04, and I wanted the same WeChat history in both.

A caveat first: I have tested this for only about an hour in each direction so far. It worked, but I haven't lived with it through a few weeks or a WeChat update. Read it as "this worked for me", not "this is proven".

## The problem

WeChat desktop does not sync chat history between computers. Each client keeps only what arrives while it is running, plus whatever a phone-to-PC migration sends it.

On a dual-boot PC that means two clients and two histories. Messages received under Windows are missing in Linux, and the reverse. Mine was about 30 GB, and doubling that is the smaller cost. The real cost is the drift.

## Before you start: back up

You are about to point two operating systems at one copy of your history. Copy the whole `xwechat_files` folder somewhere else first, on a different drive if you can. If anything goes wrong, you want the original, not a half-moved folder.

## The fix: one xwechat_files folder

WeChat keeps everything in a folder called `xwechat_files`. The idea is to keep a single copy on the NTFS data partition that both operating systems can read, and point both clients at it. In my case:

- Windows: `D:\Wechat\xwechat_files`
- Linux: `~/Data/Wechat/xwechat_files`

**On Windows**, open WeChat, go to the storage settings, and move the storage location to `D:\Wechat`. WeChat moves the files itself.

**On Linux**, quit WeChat and move the old `~/Documents/xwechat_files` aside. Then make a symlink:

```
ln -s ~/Data/Wechat/xwechat_files ~/Documents/xwechat_files
```

Both clients use the same layout (`all_users/`, then `wxid_…/db_storage/` with `message`, `contact`, `session` and so on). That is why the Linux client could open the history Windows had written without any conversion.

### Mounting the NTFS partition on Linux

Mount the partition the same way every time, or the files will appear owned by the wrong user. Use the partition's UUID in `/etc/fstab` rather than `/dev/sdXN`, which can change, and give it options along these lines:

```
UUID=<your-uuid>  /home/you/Data  ntfs3  uid=1000,gid=1000,umask=022,windows_names,nofail  0 0
```

`uid` and `gid` make your user own everything, `windows_names` stops Linux creating file names Windows can't open, and `nofail` keeps boot from hanging if the partition is missing. The older `ntfs-3g` driver takes the same `uid`, `gid`, `umask` and `windows_names` options. If the partition mounts read-only, don't force it: boot Windows, shut it down fully (see below), and try again.

![A stylised blue desk telephone, a reminder that WeChat is how suppliers reach you.](/work/article-phone.jpg "The chat that has to follow you across both operating systems.")

## Why this is safe here, and only here

Two WeChat clients using one history folder at the same time will corrupt each other. A dual-boot machine can never run both operating systems at once, so that can't happen. Keep it that way: shut one system down completely before starting the other, and quit WeChat first so it can finish writing. Don't hibernate or suspend with WeChat open and then boot the other system.

The other requirement is that **Fast Startup must be off in Windows**. With it on, Windows shuts down into a half-hibernated state and leaves the NTFS partition marked in use. Linux may then mount it read-only, or worse. Set `HiberbootEnabled` to `0`.

## Gotchas I hit

**"Not on the same network" during phone migration.** Moving history from my phone to the PC kept saying the devices weren't on the same network, though both were on the same Wi-Fi. The PC was fine: network set to Private, firewall allowing `Weixin.exe` inbound, PC proxy off. The cause was the VPN app on my phone. In VPN mode Android doesn't report the phone as being on plain Wi-Fi, so WeChat refuses to migrate. Turn the phone's VPN off, or exclude `com.tencent.mm` from it.

**The wrong winget package.** `winget install Tencent.WeChat` gets you the old 3.9 client, which the servers now reject with "version too old". The 4.x client is `Tencent.WeChat.Universal`.

**The clock jumps 8 hours.** Not a WeChat problem, but anyone dual-booting in China will meet it. Windows treats the hardware clock as local time and Linux treats it as UTC, so the time shifts by 8 hours each time you switch. The fix is to make Windows read the hardware clock as UTC by setting `RealTimeIsUniversal` to `1`.

## After a WeChat update

1. Back up `xwechat_files` again before updating either side.
2. Update one system, open WeChat there, and confirm your history is still all there before touching the other.
3. On Linux, check the symlink still points where you set it, and that no second `xwechat_files` has appeared.
4. On Windows, check the storage location still says `D:\Wechat`.
5. Keep both clients on close versions, so one never opens data written by a much newer one.

## Honest caveats

- **It's unofficial.** Tencent doesn't support sharing one history between platforms. A future client update could change the format.
- **The Linux client lags.** Mine was 4.1.1 against 4.1.15 on Windows. Keep them close, and update Linux when Windows jumps ahead.
- **A Linux update can silently bypass the symlink.** The Arch wiki notes that some Linux builds keep data in `~/.local/share/WeChat_Data/Documents` rather than `~/Documents`, and AUR users report updates creating a duplicate `xwechat_files`. If that happens, Linux quietly starts a new, separate history. After every Linux WeChat update, check that no second `xwechat_files` has appeared.
- **Keep a backup until it has proven itself.** I deleted mine once both directions worked, because everything is also on my phone. That was my call, and you may not want to make it.

## What I measured

This was on an ASUS ROG Flow Z13 running Windows 11 26H2 and Ubuntu 24.04.

- The phone-to-Windows migration brought over about 30 GB across 145,000 files.
- In its first 5 minutes, Ubuntu wrote 138 files into the shared folder: messages, contacts, sessions and favorites. No second `xwechat_files` appeared anywhere.
- Windows then opened instantly, with the messages from the Ubuntu session already there.

That is the whole evidence so far: about an hour in each direction. I'll find out over the next few weeks, and through at least one WeChat update, whether it holds up.

Working on something like this? [Get in touch](/contact/).
