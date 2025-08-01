# Concepts

This section is dedicated to all general concepts about Xen Orchestra backups.

## Interface

### Overview

This is the welcome panel for the backup view. It recaps all existing scheduled jobs. This is also where the backup logs are displayed.

### Logs

All the scheduled operations (backup, snapshots and even DR) are displayed in the main backup view.

A successful backup task will be displayed in green, a faulty one in red. You can click on the arrow to see each entry detail.

You also have a filter to search anything related to these logs.

:::tip
Logs are not "live" tasks. If you restart XOA during a backup, the log associated with the job will stay in orange (in progress), because it wasn't finished. It will stay forever unfinished because the job was cut in the middle.
:::

#### Send XO logs to an external syslog server

##### About syslog

Syslog is a standard protocol used for logging system messages in a network. It allows devices such as servers, routers, firewalls and applications to send log or event messages to a centralized log server, called a **syslog server** or syslog daemon. 

This protocol simplifies log analysis and eliminates the need to connect to each machine individually. It's particularly useful for identifying common patterns and correlations among events, greatly aiding in debugging issues. Additionally, since logs are sent to a remote location, they remain intact on the destination machine even if deleted locally, which is beneficial in the event of intrusions.

##### Log format

A typical syslog message is a structured line of text that includes several components (typically in this order): **priority**, **timestamp**, **hostname**, **process name**, **PID**, and the **actual message**.

Here's an example:

`<34>Jun 24 14:32:01 server1 CRON[1234]: (root) CMD (/usr/bin/backup.sh)`

##### Using Syslog with Xen Orchestra

You can send all your XO logs to an external syslog server.

To enable syslog, add this to your configuration file: 

```
[logs.transport.syslog]
target = 'tcp://syslog.example.org:514'
```
All logs viewable from `journalctl -u xo-server` will now be sent to your central syslog server. 

##### Compatibility

This setup is compatible with any syslog server, such as [Rsyslog](https://www.rsyslog.com/windows-agent/about-rsyslog-windows-agent/), [Splunk](https://www.splunk.com/en_us/blog/learn/log-management.html), [Logstash](https://www.elastic.co/logstash), [Graylog](https://graylog.org/about/), and more.

### Backups execution

Each backups' job execution is identified by a `runId`. You can find this `runId` in its detailed log.

![](./assets/log-runId.png)

## Backup Encryption

Xen Orchestra ensures robust data security for backups stored remotely, by leveraging advanced encryption algorithms. Here's a closer look at how encryption works and the technology behind it:

### Authentication

The encryption algorithms are authenticated, meaning additional metadata is appended to the end of each saved file. During restoration, this metadata ensures that the restored data matches the original encrypted data, allowing the system to detect issues like bit rot or tampering by an attacker without the encryption key. However, it's important to note that this is not a recoverable error—if the verification fails, the file will be unusable.

### Configuring encryption

Encryption is opt-in and requires configuring an encryption key on the remote.

:::warning
- Encryption is only compatible with block-based remotes.
- Encryption cannot be changed (such as enabling, disabling or changing the encryption key) if a remote contains any backup.
:::

1. Go to the Settings → Remote menu.
2. Go to the section called **New file system remote**, or edit an existing remote.
3. In the subsection called **Encrypt all new data sent to this remote** you will find a text area. Enter your encryption key there.
4. Click the **Save configuration** Button to finish the encryption setup.

### `ChaCha20-Poly1305`

To improve flexibility and performance, Xen Orchestra will transition to the [`ChaCha20-Poly1305`](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) encryption algorithm by February 2025. This update addresses the file size limitations of `AES-256-GCM` while maintaining a high level of security and compliance with ANSSI guidelines.

Backup repositories that were encrypted with `AES-256-GCM` will remain accessible, to ensure a smooth transition.

### `AES-256-GCM`

> This algorithm was the default before February 2025 and has now been replaced by [`ChaCha20-Poly1305`](#chacha20-poly1305).

#### What is AES-256-GCM?

Currently, backups use the [`AES-256-GCM`](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption algorithm. While this is a highly secure option, it does have a file size limitation of 64 GiB. This isn't an issue when working with incremental backups, as the data is split into smaller blocks, making it fully compatible with any remote (S3-compatible or file-based). 

Full backups create one file per backup with all the data, that can go over 64 GB, even when using XCP-ng zstd encryption.

#### Compliance

The `AES-256-GCM` algorithm is fully compliant with [ANSSI guidelines (in French)](https://cyber.gouv.fr/sites/default/files/2021/03/anssi-guide-selection_crypto-1.0.pdf).

### Switching to the new encryption algorithm

If you see an exclamation mark next to the encryption icon on a remote, it means the encryption algorithm isn't the recommended one. 

To switch to `ChaCha20-Poly1305`, follow these steps:

1. Make sure the remote doesn't contain any backups encrypted with the old algorithm.
2. If the remote has `AES-256-GCM` backups, create a new remote and do a full backup to that location.
3. Once all backups with the old encryption are gone, set up encryption on the remote with the new algorithm.
4. The exclamation mark should disappear.

If the warning icon is still there, double-check that no encrypted backups remain before switching algorithms.

## Exclude disks

During a backup job, you can avoid saving all disks of the VM. To do that is trivial: just edit the VM disk name so it contains `[NOBAK]` somewhere, eg: `data-disk` will become `data-disk [NOBAK]` or perhaps `[NOBAK] data-disk` (with a space or not, doesn't matter).

The disks marked with `[NOBAK]` will be now ignored in all following backups.

## Schedule

### Introduction

Automating your backups is key to ensuring the safety and recoverability of your virtual machines.

By scheduling regular backups, you protect your infrastructure from accidental deletions, system failures, or data corruption. Xen Orchestra lets you easily set up flexible schedules for your backup jobs, making sure they run automatically at times and frequencies that work best for you.

### Viewing schedules for a backup job

To see the schedules associated with a specific backup job:

1. Navigate to the **Backup** menu.\
A list of backup jobs will be displayed.
2. For the backup job you're interested in, click the **pencil** ✏️ icon in the **Notes** column.\
This will open the backup job details screen.
3. In the **Schedules** section of the details screen, you'll find the list of schedules for that backup job:

    ![](./assets/backup-schedule-list.png)

### Creating a schedule

To set up a schedule for a backup job:

1. Navigate to the details page of your backup job (refer to the previous section, "Viewing Schedules for a Backup Job").
2. In the **Schedules** section of your backup job, click the **Add a schedule** button, represented by a ➕ icon.\
    A form for creating a schedule will appear:
    ![](./assets/create-backup-schedule.png)


3. Use the form to configure your schedule.\
    Here's a list of the parameters you can adjust:

| Parameter             | Description |
|-----------------------|-------------|
| **Name**              | A label to identify your schedule. Useful when managing multiple jobs. |
| **Pool retention** | Number of snapshots to keep for pool metadata. Older snapshots beyond this count will be automatically removed. |
| **XO retention** | Number of snapshots to keep for XO metadata. Older snapshots beyond this count will be automatically removed. | |
| **Replication retention** | Number of replicated snapshots to keep. Older snapshots beyond this count will be automatically removed. |
| **Health check**      | If enabled, a VM [health check](#backup-health-check) is performed after the backup to detect issues early (e.g., boot errors). |
| **Force full backup** | Forces a full backup at every run, even if incremental backups are enabled. |
| **Month(s)**          | Select specific months during which the schedule should run. |
| **Day(s)**            | Select days of the month for the job to execute. You can choose specific dates or all days. |
| **Hour**              | Choose the hour of the day the backup job should start. |
| **Minute**            | Choose the exact minute the job should start. |
| **Timezone**          | Determines the timezone in which the schedule should apply. You can also use your browser's local timezone. |
| **Cron Pattern**      | Automatically generated from your selections to define when the job will run. |
| **Preview**           | A list of upcoming executions based on your current configuration. Useful to verify the setup. |

:::tip

Depending on your backup type, not all settings may be visible, particularly those related to retention.

:::

4. Click the **OK** button.\
    Your schedule will be created and applied to the backup job.

## Smart Backup

There are two ways to select which VMs will be backed up:

1. Manually selecting multiple VM's
1. Smart backup

Picking VMs manually can be a limitation if your environment moves fast (i.e. having new VMs you need to backup often). In that situation you would previously need to constantly go back and edit the backup job to add new VM's.

But thanks to _smart backup_, you now have more flexibility: you won't select specific VMs, but VMs status/tag/placement **at the time backup job will be executed**. Let's see some examples!

### Backup all VMs on a pool

This job will backup all VMs on a pool "Lab Pool" when scheduled:

![](https://xen-orchestra.com/blog/content/images/2016/08/xo5smartbackup1.png)

It means: **every VM existing on this pool at the time of the backup job will be backed up**. Doesn't matter if you create a new VM, it will be backed up too without editing any backup job.

**You now have the ability to intelligently backup VM's in production pools!**

Want to narrow the job a bit? See below.

### Backup filters

You can also:

- backup only running (or halted) VMs when the job is executed
- backup only VMs with a specific tag

Remember the Prod VMs? I added a tag "prod" to each of them:

![](https://xen-orchestra.com/blog/content/images/2016/08/xo5smartbackuptag.png)

Now if you do this:

![](https://xen-orchestra.com/blog/content/images/2016/08/xo5smartbackup2.png)

It means any VMs on "Lab Pool" with the "prod" tag will be backed up.

## RAM Enabled backup

:::tip
This feature is **only compatible** with XCP-ng 8.0 or more recent. Citrix Hypervisor didn't yet merge our changes, despite we contributed to their code directly.
:::

![](https://xen-orchestra.com/blog/content/images/2020/03/REB.png)

XCP-ng modified XAPI is now able to create VMs in a `Suspended` state with a `suspend_VDI` property set. When a VM is suspended, all of its memory contents are written into a disk called `suspend_VDI`. When the VM is restored, the `suspend_VDI` is read to recreate the memory of the VM. Once the resuming is done it's as if the VM was never suspended.

### Use cases

It is already possible to snapshot a VM with its RAM, however when restoring a VM, the VM was created in the `Halted` state so it wasn't possible to restore the VM with its RAM. With our XAPI modification a VM can now be created in a `Suspended` state with preset memory contents, so when snapshotting a VM with RAM, the snapshotted VM will also have the RAM contents set.

This can be very useful when you're running a VM that needs RAM coherence to run:

- For instance, snapshotting a Windows VM used to be very tricky for this reason. The Citrix VSS script previously answered part of this problem, when snapshotted, the VM flushed its cache but if it happened that the snapshot had coherence issues, the restored VM would be broken. And the VSS script is no longer available.
- VMs running databases could also need such a feature in order to keep transient transactions.
- A VM can be restored on a different host, now the RAM can be as well.

In a nutshell this functionality can be seen as _hot copy_, similar to _hot migration_ but the original VM is not deleted.

### Continuous replication with RAM

This feature allows you to regularly send a copy of a VM to a target SR. The copied VM will be `Suspended` and ready to be resumed if the original VM encounters issues. As the copied VM is `Suspended`, no reboot will be required, resuming it is much faster.

For instance, if an hourly continuous replication is configured on a VM, if the VM is lost, you can quickly resume a running VM with a memory loss of one hour tops.

:::warning
In order to use this functionality, the CPU of the host the VM is restored on should be the same or more recent than the CPU of the host the VM was originally running on.
:::

### Future of RAM enabled backup

- Better analyze of compatible CPUs to avoid manual compatibility checks
- RAM snapshot using Xen copy-on-write memory capabilities (time to snapshot reduce to almost 0)

## Consistent backup

:::warning
This feature is being deprecated in XCP-ng and Citrix Hypervisor. It's now replaced by RAM enabled backup!
:::

All backup types rely on snapshots. But what about data consistency? By default, Xen Orchestra will try to take a **quiesced snapshot** every time a snapshot is done (and fall back to normal snapshots if it's not possible).

Snapshots of Windows VMs can be quiesced (especially MS SQL or Exchange services) after you have installed Xen Tools in your VMs. However, [there is an extra step to install the VSS provider on windows](https://xen-orchestra.com/blog/xenserver-quiesce-snapshots/). A quiesced snapshot means the operating system will be notified and the cache will be flushed to disks. This way, your backups will always be consistent.

To see if you have quiesced snapshots for a VM, just go into its snapshot tab, then the "info" icon means it is a quiesced snapshot:

![](./assets/quiesced1.png)

The tooltip confirms this:

![](./assets/quiesced2.png)

## Remotes

Remotes are places where your _backup_ and _delta backup_ files will be stored.

To add a _remote_, go to the **Settings/Remotes** menu.

Supported remote types:

- Local (any folder in XOA filesystem)
- NFS
- SMB (CIFS)

:::warning
The initial "/" or "\\" is automatically added.
:::

### NFS

On your NFS server, authorize XOA's IP address and permissions for subfolders. That's all!

### SMB

We support SMB storage on _Windows Server 2012 R2_.

:::warning
For continuous delta backup, SMB is **NOT** recommended (or only for small VMs, eg < 50GB)
:::

Also, read the UI twice when you add an SMB store. If you have:

- `192.168.1.99` as SMB host
- `Backups` as folder
- no subfolder

You'll have to fill it like this:

![](./assets/smb_fill.png)

:::warning
PATH TO BACKUP is only needed if you have subfolders in your share.
:::

### Local

:::warning
**This is for advanced users**. Using the local XOA filesystem without extra mounts/disks will **use the default system disk of XOA**.
:::

If you need to mount an unsupported store (FTP for example), you can always do it manually:

1. mount your remote store inside the XOA filesystem manually, e.g in `/media/myStore`
2. in the web interface, select a "local" store and point it to your `/media/myStore` folder.

Any Debian Linux mount point could be supported this way, until we add further options directly in the web interface.

### Amazon S3

Xen Orchestra supports Amazon S3 storage and other S3-compatible providers, so you can back up your data to a variety of cloud storage services.

:::warning
- Not all S3-compatible providers adhere perfectly to Amazon S3 standards. Make sure to test your setup before trusting it with critical backups.
- Losing your encryption key means your backups will be permanently inaccessible. If you enable encryption, make sure your key is stored securely, and outside of the backed up infrastructure, as there's no way to recover your data without it.
:::

![](./assets/XO-Amazon-S3-remote.png)

## Restore a backup

All your scheduled backups are accessible in the "Restore" view in the backup section of Xen Orchestra.

1. Search the VM Name and click on the blue button with a white arrow
2. Choose the backup you want to restore
3. Select the SR where you want to restore it and click "OK"

:::tip
You can restore your backup even on a brand new host/pool and on brand new hardware.
:::

## Differential restore

Differential restores come in handy when you need to restore a VM to a storage unit that already contains your original VM, with **optimal restoration time**.

### How it works

Instead of performing a full restore, Xen Orchestra leverages the existing VM disk or snapshot as a foundation and restores only the differential data to a new disk. This method significantly cuts down on restore time, especially for large VMs. For instance, with a transfer rate of 60 MiB/s and a 200 GiB VM, a typical restore would take around an hour. However, with a differential restore, even a 600 GiB disk can be restored in just minutes.

Most importantly, this process prioritizes **data integrity**. The original VM disk remains untouched throughout the restore; we simply read from the latest snapshot to use it as a foundation for creating the new VM and disk.

### Step-by-step guide

:::warning

**Prerequisites**

Make sure the following conditions are met in order to do a differential restore:

- Restore the VM to the **same Storage Repository** that contains the VM to be restored.
- The backup you're restoring must be a **delta backup** (not a full backup).
- The delta chain — from the original snapshot to the backup you're restoring, excluding the base VM — must be **uninterrupted**.

:::

To perform a differential restore:

1. Go to the **Backup → Restore** menu.\
A list of VMs appears.
2. Choose the VM you want to restore from the list. In the last column, click the **Restore** icon.\
A pop-up window with a drop-down list appears.
3. Choose the backup you want to restore from the drop-down list.\
More parameters appear, including a drop-down list for your destination Storage Repository (SR).
4. From that drop-down list, choose your destination SR.
5. Activate the switch called **Use differential restore**:
![](./assets/use-differential-restore.png)
6. Click **OK** to start the restore.

## File level restore

You can also restore specific files and directories inside a VM. It works with all your existing delta backups.

:::warning
- File level restore **is only possible on incremental backups**. Also, due of some technical limitations, you won't be able to do file level restore if you have a chain longer than 99 (ie retention longer than 99 records without any full between). Take a look at the [key backup interval section](/incremental_backups/#key-backup-interval) to set this correctly.
- File level restore **is only possible on a single VDI**, it does not support LVM Volume Groups that span multiple VDIs.
- The following Microsoft solutions are **not supported**:
   - [Data Deduplication](https://learn.microsoft.com/en-us/windows-server/storage/data-deduplication/overview)
   - [Logical Disk Manager](https://en.wikipedia.org/wiki/Logical_Disk_Manager) (LDM)
   - [Resilient File System](https://learn.microsoft.com/en-us/windows-server/storage/refs/refs-overview) (ReFS)
:::

### Restore a file

1. Go to the **Backup → File restore** section:
   ![](https://xen-orchestra.com/blog/content/images/2016/12/filelevelrestore1.png)
2. Choose the VM whose files you want to restore and click the **Restore** icon at the corresponding line.
3. Follow the instructions as shown below:
   ![](../static/img/vm-files-restore.png)

That's it! Your chosen file will be restored.

## About backup compression

By default, _Backups_ are compressed (using GZIP or zstd, done on host side). There is no absolute rule but in general uncompressed backups are faster than GZIP backups (but sometimes much larger).

Citrix Hypervisor uses Gzip compression, which is:

- slow (single threaded)
- space efficient
- consumes less bandwidth (helpful if your NFS share is far away)

However, XCP-ng is using `zstd`, which is far better.

:::tip
If you have compression on your NFS share (or destination filesystem like ZFS), you can disable compression in Xen Orchestra.
:::

## Add a disk for local backups

If you want to use XOA to locally store all your backups, you need to attach a large disk to it. This can be done live.

First, after your disk is attached to XOA, you'll have to find the new disk name with `fdisk -l`. It's probably `xvdb`.

Then, create a filesystem on it:

```sh
mkfs.ext4 /dev/xvdb
```

If you already have backups done, you can move them to the new disk. The orignal backups folder is in `/var/lib/xoa-backups`.

To make the mount point persistent in XOA, edit the `/etc/fstab` file, and add:

```
/dev/xvdb /var/lib/xoa-backups ext4 defaults 0 0
```

This way, without modifying your previous scheduled snapshot, they will be written to this new local mountpoint!

## HA behavior

Replicated VMs HA are taken into account by XCP-ng. To avoid the resultant troubles, HA will be disabled from the replicated VMs and a tag indicating this change will be added.

![](./assets/disabled-dr-ha-tag.png)
![](./assets/disabled-cr-ha-tag.png)

:::tip
The tag won't be automatically removed by XO on the replicated VMs, even if HA is re-enabled.
:::

## Backup Concurrency

Xen Orchestra 5.20 introduces new tools to manage backup concurrency. Below is an overview of the backup process and ways you can control concurrency in your own environment.

### Backup process

#### 1. Snapshot creation

When you perform a backup in XCP-ng/XenServer, the first operation performed is to "freeze" the data at a specific time - this is done by **making a snapshot**. This operation is pretty quick, only a few seconds in general. However it uses a lot of I/O on your storage, therefore more I/O activity means longer times to snapshot. Still, the order of magnitude is seconds per VM.

#### 2. Export

Xen Orchestra will fetch the content of the snapshot made in step 1. This operation can be very long, obviously depending on the size of the snapshot to export: exporting 1TiB of data will take far longer than exporting 1GiB!

#### 3. Snapshot removal

When it's done exporting, we'll remove the snapshot. Note: this operation will trigger a coalesce on your storage in the near future (a coalesce is required every time a snapshot is removed).

### Concurrency

Concurrency is a parameter that let you define how many VMs your backup job will manage simultaneously.

:::tip

- Default concurrency value is 2 if left empty.
  :::

Let's say you want to backup 50 VMs (each with 1x disk) at 3:00 AM. There are **2 different strategies**:

1. backup VM #1 (snapshot, export, delete snapshots) **then** backup VM #2 -> _fully sequential strategy_
2. snapshot all VMs, **then** export all snapshots, **then** delete all snapshots for finished exports -> _fully parallel strategy_

The first purely sequential strategy will lead to the fact that: **you can't predict when a snapshot of your data will occur**. Because you can't predict the first VM export time (let's say 3 hours), then your second VM will have its snapshot taken 3 hours later, at 6 AM.

:::tip
If you need your backup to be done at a specific time you should consider creating a specific backup task for this VM.
:::

Strategy number 2 is to parallelise: all the snapshots will be taken at 3 AM. However **it's risky without limits**: it means potentially doing 50 snapshots or more at once on the same storage. **Since XCP-ng/XenServer doesn't have a queue**, it will try to do all of them at once. This is also prone to race conditions and could cause crashes on your storage.

By default the _parallel strategy_ is, on paper, the most logical one. But you need to be careful and give it some limits on concurrency.

:::danger
High concurrency could impact your dom0 and network performances.
:::

You should be aware of your hardware limitation when defining the best concurrency for your XCP-ng infrastructure, never put concurrency too high or you could impact your VMs performances.
The best way to define the best concurrency for you is by increasing it slowly and watching the result on backup time.

So to summarize, if you set your concurrency at 6 and you have 20 Vms to backup the process will be the following:

- We start the backup of the first 6 VMs.
- When one VM backup has ended we will launch the next VM backup.
- We keep launching new VM backups until the 20 VMs are finished, keeping 6 backups running.

Removing the snapshot will trigger the coalesce process for the first VM, this is an automated action not triggered directly by the backup job.

## Backup modifier tags

When a backup job is configured using Normal snapshot mode, it's possible to use VM tags to apply a different snapshot mode to individual VMs.

- **xo-offline-backup** to apply offline snapshotting mode (VM will be shut down prior to snapshot)
- **xo-memory-backup** to apply RAM-enabled snapshotting
- **xo-backup-healthcheck-xenstore** to use a script during [backup healthcheck](#backup-health-check)
- **xo:no-health-check** ignore this VM during [backup healthcheck](#backup-health-check)

For example, you could have a regular backup job with 10 VMs configured with Normal snapshotting, including two which are database servers. Since database servers are generally more sensitive to being restored from snapshots, you could apply the **xo-memory-backup** tag to those two VMs and only those will be backed up in RAM-enabled mode. This will avoid the need to manage a separate backup job and schedule.

## Retention and Scheduling

Just a refresher/summary: You can select multiple backup methods for the same job:

- Full: _Backup_ and _Disaster Recovery_ (DR)
- Deltas: _Delta Backup_ and _Continuous Replication_ (CR)

The Full and Delta options are mutually exclusive; Rolling Snapshots are compatible with both. The Backup and Delta Backup go to a remote Target (e.g, NFS); DR and CR back up to another XCP-ng storage repository (i.e., not the one on which the VM's being backed up reside). In the Schedule configuration, you will have the option to select the number of "Backup Retention" if your backup includes a _Backup_ (or _Delta Backup_); you will have the option to select the number "Replication Retention" if you have selected _DR_ or _CR_ in the backup configuration.

### Rolling Snapshots

Vates recommends keeping the Rolling Snapshots retention to a minimum; if you check Dashboard>Health, you'll see a table for 'Too Many Snapshots,' which shows VMs that have more than 5 snapshots saved; this includes the snapshots used for any kind of backup, not simply the rolling snapshots.

### Retention of Backups and CR/DR

If your backup includes both a (Delta) Backup _and_ a CR/DR, you will have the option to select the number you wish for both "Backup retention" and "Replication retention" in the Schedule configuration; make sure to assign the number you want to the correct retention.

If you need to restore a (Delta) Backup (or clone and spin up a VM from CR/DR), you will be able to select all the available backups or VMs, regardless of the retention or delta scheme. If you have multiple backup jobs backing up the same VM, you'll see all the backups in the restore list, sorted by date.

### Decreasing Retention Frequency with Age

It is often a good idea to configure retention of older backups with decreasing frequency. For example, you may want a nightly backup, but you don't want 365 backups to be able to restore from a year ago. The solution is to set several different schedules/retention policies for the same backup job. A reasonable approach might be to schedule...

- a nightly backup, except on Sunday (retaining 6)
- a weekly backup on Sunday (retaining 4)
- a monthly backup (retaining 12)

Again, all of these can be assigned to the same backup job. Note that if you do a weekly and a monthly backup, at some point, these will fall on the same day. Xen Orchestra is designed to fail gracefully (with an error message) if a backup job for a VM is already running. For this reason, you will want to set the time on the monthly job to run before the weekly job so that if one fails, it will be the weekly rather than the monthly one; if the weekly one fails, the monthly will be there for that spot in the retention plan; if the monthly one fails, the weekly one will only be retained for 4 weeks, and then there will be a gap in the monthly retention.

### Long-term Backup Retention with GFS Strategy

Xen Orchestra supports the **Grandfather-Father-Son (GFS)** backup retention strategy, providing an efficient way to manage long-term backups. Backups are organized into daily, weekly, and monthly intervals, optimizing storage while keeping important recovery points over time.

#### FAQ

- **What happens if I change my GFS retention policy?**\
  Excess backups will be deleted during the next job execution to match the updated retention settings.

- **Is GFS retention applied globally or per repository?**\
  GFS retention is applied on a per-repository basis, allowing you to manage retention independently for different storage locations.

- **How does Xen Orchestra decide which backups to retain?**\
  The oldest backup within each retention period (daily, weekly, or monthly) is preserved. For example, the first backup of the week is saved as the weekly backup.

:::warning
- **Definition of a week:**\
The start of the week is computed with the timezone set in the schedule.
- **What GFS isn't:**\
GFS in Xen Orchestra stands for Grandfather-Father-Son. It's a backup strategy, and is not related to the file system called GFS2 (or Global File System 2), supported by XenServer.
- GFS retention is defined per schedule. For example, if a backup has two schedules, two independent GFS backups will be created.
:::

#### Enabling GFS Retention

To enable GFS retention:

1. Go to the **Backup** menu.
2. Create a new backup job or open an existing one.
3. Click the **Delta Backup** button.\
The section called **Long-term retention of backups** appears.
4. In that section, you can define the following:
- **Daily backups**: The number of daily backups to keep.
- **Weekly backups** (Son): The number of weekly backups to keep.
- **Monthly backups** (Father): The number of monthly backups to keep.
- **Yearly backups** (Grandfather): The number of monthly backups to keep.
5. Click the **Save** button.

During each backup run, Xen Orchestra evaluates existing backups and removes any excess backups based on the configured policy.

### Implementation in Xen Orchestra

To enable GFS retention, configure the settings in the backup job's "Retention" section. During each backup run, Xen Orchestra evaluates existing backups and removes any excess backups based on the configured policy.

## Backup Health Check

Backup health check ensures the backups are ready to be restored.

### Different level of checking

#### Check for boot

XO will restore the VM, either by downloading it for a delta/full backup or by cloning it for a disaster recovery or continuous replication and then wait for the guest tools to be loaded before the end of a timeout of 10 minutes (boot + guest tools).

A VM without guest tools will fail its health check.

The restored VM is then deleted.

#### Execute a script

If a VM has the tag **xo-backup-healthcheck-xenstore** during a backup health check, then XO will wait for a script to change the value of the xenstore `vm-data/xo-backup-health-check` key to be either `success` or `failure`.

In case of `failure`, it will mark the health check as failed, and will show the (optional) message contained in `vm-data/xo-backup-health-check-error`

The script needs to be planned on boot. It can check if the record `vm-data/xo-backup-health-check` of the local xenstore contains `planned`
to differentiate a normal boot and a boot during health check.
On success it must write `success`in `vm-data/xo-backup-health-check`.
On failure it must write `failure` in `vm-data/xo-backup-health-check`, and may optionally add details in `vm-data/xo-backup-health-check-error` .

The total timeout of a backup health check (boot + guest tools + scripts) is 10min.

The restored VM is then deleted.

An example in bash is shown in `@xen-orchestra/backups/docs/healthcheck example/wait30seconds.sh`

### Running Health checks

#### Checking a backup

Go to backup > restore and click on the tick to launch a health check.

![](./assets/restorehealthcheck.png)

Then, you will select the backup to be checked and a destination SR, which must have enough space for the full restore.

#### Scheduling health check after backups

Go to Backup > overview > edit.

Then edit the schedule and check the healthcheck box.

![](./assets/scheduled_healthcheck.png)

You will then need to select the SR used, which must have enough space to restore the VMs. Healthcheck will be done after each VM backup, before starting the next one.

You can filter the VMs list by providing tags, only the VMs with these tags will be checked.
