---
title: How I hacked my Airbnb neighbor’s smart lock (and you can, too!)
description: Why (unique) passwords matter
date: "2020-01-07"
image: /images/content/airbnb-smart-lock/home-assistant-login.png
---

In early 2020, I found a major oversight that let me open my Airbnb neighbor’s smart lock. It wasn’t difficult, and the company never resolved it while I was there, despite my efforts to report it.

I left the company unnamed at the time to protect its guests. It was Sonder, which shut down and filed for Chapter 7 bankruptcy in November 2025.

## Step One: Connect to WiFi

It started when I first stayed in an Airbnb hosted by the company a few months ago — it was significantly less expensive than alternatives, and clearly operated at scale since there were multiple that were colocated in the same apartment complex. From day one, it was clear that the **password format used to connect to the WiFi network was reused across rooms**.

![Your WiFi is so… pattern-ey](/images/content/airbnb-smart-lock/wifi-password-pattern.jpeg)

_Your WiFi is so… pattern-ey_

Not a huge deal, except for the fact that being able to connect to someone’s WiFi could be a huge deal if you know what you’re doing. Luckily, I don’t know what I’m doing! I didn’t think much of it, even though it was clear there were even more issues with the networking setup, because I could see what my neighbor was watching on my Pixel 3 — **a notification would automatically pop up whenever anyone on my floor was watching Netflix on the Chromecast in their room**. This meant that I could control anyone’s Chromecast, and they could control mine.

![](/images/content/airbnb-smart-lock/chromecast-notification.png)

Again, no big deal. However, my Mad Men streaming did stop a few times throughout the night, which I was convinced was someone else in another room messing with me.

## Step Two: Find a Pi

I am a curious Airbnb’er, and I love to explore the rooms to see what little amenities they offer. Tiny shampoos and hairdryers make my day. I stayed again in the same unnamed Airbnb complex, this time on a different floor in the same building. I was looking in the linen closet and found a Raspberry Pi plugged into the socket alongside the WiFi router for the room.

![Look ma, a hidden Raspberry Pi!](/images/content/airbnb-smart-lock/raspberry-pi.jpeg)

_Look ma, a hidden Raspberry Pi!_

Since I know what a Raspberry Pi is and I’ve watched my fair share of Mr. Robot, I thought it was a strange thing to be in my Airbnb closet. There was a **Aeotec Z-Stick Gen5 dongle** sticking out of it, with nothing else plugged in. I am a home automation geek, and this piqued my interest. I definitely needed to find out what devices were connected to the network.

I plugged the Pi into the TV with an HDMI cord in the room, and this boot-up screen appeared:

![Bootup screen](/images/content/airbnb-smart-lock/balena-boot.jpeg)

_Bootup screen_

I admittedly had no idea what the OS was, but a quick Google Image search revealed it was for **balenaOS**, an operating system to run Docker containers on embedded devices. Of course, I immediately took the SD card out and attached it to my computer to learn more. A quick lookup of the balenaOS docs revealed that the _config.json_ was used to configure the OS on boot.

![](/images/content/airbnb-smart-lock/balena-config.png)

I did a bit more digging and found that there was a [poorly-documented way of adding SSH keys](https://github.com/balena-os/meta-balena#sshkeys) to the device, and quickly added my own machine’s public SSH key to the config.json under _os.sshKeys_. And after reconnecting the Pi to power and booting it back up, it was go-time.

![SSH command to get onto the Pi](/images/content/airbnb-smart-lock/ssh-command.png)

_SSH command to get onto the Pi_

I looked up the [SSH docs](https://www.balena.io/docs/learn/manage/ssh-access/#using-a-standalone-ssh-client) for balenaOS, and used that to find the port/username combo to get in. **And just like that, I had access to everything.** I explored the machine for a little while, and found some Docker containers that were running with **balena ps**.

![HomeAssistant Docker container](/images/content/airbnb-smart-lock/home-assistant-container.jpeg)

_HomeAssistant Docker container_

It turns out, there’s a [HomeAssistant](https://www.home-assistant.io/) container running on the machine. Bingo. It’s a classic choice when beginning with home automation, but nevertheless I was pretty surprised that a company that raised $135 million in late 2018 was using it. This must have been what was interacting with the smart Z Wave USB stick and controlling devices. I went to _10.70.44.29:8123_ in my browser, and got the login screen for HASS:

![HASS login screen](/images/content/airbnb-smart-lock/home-assistant-login.png)

_HASS login screen_

Now all I needed was a password… Where do you get one of those? With a quick inspection, of course!

![HASS environment variable password](/images/content/airbnb-smart-lock/home-assistant-environment.jpeg)

_HASS environment variable password_

And voila, I was in!

![Nothing to see here…](/images/content/airbnb-smart-lock/home-assistant-dashboard.png)

_Nothing to see here…_

So, that’s what this was all for — monitoring the front door lock! All of this Raspberry Pi’ing for one device and a few scripts. I unlocked and locked my front door remotely with glee. Cool!

**The story could have easily ended here, if the system was designed properly**. But without divulging the actual password to the HomeAssistant portal, I can tell you that it was extremely recognizable. And given their engineer’s affinity for reusing WiFi passwords, I assumed that they were also reusing this one. I mean, it was too good to not reuse, right?

So I connected to my neighbor’s WiFi network, did a port scan of the devices on the network, and easily found its Raspberry Pi’s IP address. And just like mine, I used the same password that worked to unlock mine. Sure enough, it worked like a charm. Spooky. Not only could I access their HomeAssistant controls, I could also see history of the Z Wave devices on the network.

![Z Wave history](/images/content/airbnb-smart-lock/z-wave-history.png)

_Z Wave history_

So I did what any normal person would do, I walked down the hall and tried to see if the door would unlock when I pressed that digital switch. And when I walked by and clicked it, **the resounding sound of the lock whirring to “open” was immediate and loud.**

I immediately went back to my room and unplugged my Pi. If I can do this, who else can? It was alarming — this company has **locations across the globe**, with the engineering team potentially using this same password across every single room!! Yeah, it’s a clever password, but is it worth the danger you are exposing your customers to? I emailed the CEO of the company, and he never returned my message. Hence, I wrote this story to hopefully shame engineering practices like this in the future.

## TLDR

- Engineers must be careful when creating passwords which are used for important functions in a company. A reused password is _never_ a good thing — it only provides opportunity for hackers to use it against someone.

- I should never be able to access my neighbor’s WiFi network (again, password reuse). I could have done so many more things just with that ability!

- Smart devices should be left to the people who know what they are doing. **Especially smart locks.** Custom HomeAssistant scripts with business value only provide a finite amount of upside, but someone accessing your room without your consent can ruin a companies reputation.

### Follow me on Twitter for more: [https://twitter.com/0xcadams](https://twitter.com/0xcadams).
