---
title: "One WeChat history for a dual-boot Windows and Linux PC"
date: "2026-10-18"
tag: "China tips"
excerpt: "WeChat desktop doesn't sync history between computers, so a dual-boot PC ends up with two histories that drift apart. Here is how I pointed both operating systems at one folder, and what went wrong on the way."
---
<!-- DRAFT: Brian must read before this moves to web/content/articles/ -->

If you work in China, WeChat is where the work happens: quotes, photos of parts, voice messages from the factory. I run a dual-boot PC, Windows 11 and Ubuntu 24.04, and I wanted the same WeChat history in both.

A caveat first: I have tested this for only about an hour in each direction so far. It worked, but I haven't lived with it through a few weeks or a WeChat update. Read it as "this worked for me", not "this is proven".

## The problem

WeChat desktop does not sync chat history between computers. Each client keeps only what arrives while it is running, plus whatever a phone-to-PC migration sends it.

On a dual-boot PC that means two clients and two histories. Messages received under Windows are missing in Linux, and the reverse. Mine was about 30 GB, and doubling that is the smaller cost. The real cost is the drift.

## The fix: one xwechat_files folder

WeChat keeps everything in a folder called `xwechat_files`. The idea is to keep a single copy on the NTFS data partition that both operating systems can read, and point both clients at it. In my case:

- Windows: `D:\Wechat\xwechat_files`
- Linux: `~/Data/Wechat/xwechat_files`

**On Windows**, open WeChat, go to Settings > Storage, and move the storage location to `D:\Wechat`. WeChat moves the files itself.

**On Linux**, quit WeChat and move the old `~/Documents/xwechat_files` aside. Then make a symlink:

```
ln -s ~/Data/Wechat/xwechat_files ~/Documents/xwechat_files
```

Both clients use the same layout (`all_users/`, then `wxid_…/db_storage/` with `message`, `contact`, `session` and so on). That is why the Linux client could open the history Windows had written without any conversion.

## Why this is safe here, and only here

Two WeChat clients using one history folder at the same time will corrupt each other. A dual-boot machine can never run both operating systems at once, so that can't happen.

The other requirement is that **Fast Startup must be off in Windows**. With it on, Windows shuts down into a half-hibernated state and leaves the NTFS partition marked in use. Linux may then mount it read-only, or worse. Set `HiberbootEnabled` to `0`.

## Gotchas I hit

**"Not on the same network" during phone migration.** Moving history from my phone to the PC kept saying the devices weren't on the same network, though both were on the same Wi-Fi. The PC was fine: network set to Private, firewall allowing `Weixin.exe` inbound, PC proxy off. The cause was the VPN app on my phone. In VPN mode Android doesn't report the phone as being on plain Wi-Fi, so WeChat refuses to migrate. Turn the phone's VPN off, or exclude `com.tencent.mm` from it.

**The wrong winget package.** `winget install Tencent.WeChat` gets you the old 3.9 client, which the servers now reject with "version too old". The 4.x client is `Tencent.WeChat.Universal`.

**The clock jumps 8 hours.** Not a WeChat problem, but anyone dual-booting in China will meet it. Windows treats the hardware clock as local time and Linux treats it as UTC, so the time shifts by 8 hours each time you switch. The fix is to make Windows read the hardware clock as UTC by setting `RealTimeIsUniversal` to `1`.

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

## If you'd rather not do this alone

WeChat is where China work happens, and we live in it every day. You can absolutely do all of this yourself, and the steps above are the whole recipe. But a shared history folder is the easy part. The hard part is being on the ground in China, speaking the language, and having years of trusted supplier relationships that were built in person and can't be bought. If you'd rather hand the China side to people who already have those relationships, we can do it faster and better. [Get in touch](/contact/) and tell us what you're trying to get done.
