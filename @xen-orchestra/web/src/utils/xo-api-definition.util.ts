import type { ApiDefinition } from '@/types/xo'
import type { XoAlarm } from '@/types/xo/alarm.type.ts'
import type { XoHost } from '@/types/xo/host.type'
import type { XoNetwork } from '@/types/xo/network.type'
import type { XoPci } from '@/types/xo/pci.type'
import type { XoPgpu } from '@/types/xo/pgpu.type'
import type { XoPif } from '@/types/xo/pif.type'
import type { XoPool } from '@/types/xo/pool.type'
import type { XoServer } from '@/types/xo/server.type'
import type { XoSr } from '@/types/xo/sr.type'
import type { XoTask } from '@/types/xo/task.type'
import type { XoVbd } from '@/types/xo/vbd.type'
import type { XoVdi } from '@/types/xo/vdi.type'
import type { XoVif } from '@/types/xo/vif.type'
import type { XoVmController } from '@/types/xo/vm-controller.type'
import type { XoVmTemplate } from '@/types/xo/vm-template.type'
import type { XoVm } from '@/types/xo/vm.type'

export const xoApiDefinition = {
  alarm: {
    type: 'collection',
    path: 'alarms',
    fields: 'id,time,body,object',
    handler: (record: XoAlarm) => record,
    stream: false,
  },
  pool: {
    type: 'collection',
    path: 'pools',
    fields:
      'id,name_label,master,default_SR,tags,otherConfig,auto_poweron,HA_enabled,migrationCompression,suspendSr,crashDumpSr,haSrs',
    handler: (record: XoPool) => record,
    stream: false,
  },
  host: {
    type: 'collection',
    path: 'hosts',
    fields:
      'id,name_label,name_description,power_state,controlDomain,residentVms,$pool,current_operations,address,startTime,version,bios_strings,cpus,CPUs,memory,tags,iscsiIqn,powerOnMode,build,otherConfig,multipathing,logging,enabled,agentStartTime,PGPUs',
    handler: (record: XoHost) => record,
    stream: false,
  },
  vm: {
    type: 'collection',
    path: 'vms',
    fields:
      'id,name_label,name_description,power_state,$container,$pool,other,current_operations,CPUs,addresses,tags,os_version,virtualizationMode,secureBoot,VTPMs,viridian,isNestedVirtEnabled,memory,VGPUs,high_availability,auto_poweron,startDelay,vga,videoram,pvDriversVersion,cpuWeight,cpuCap,cpuMask,coresPerSocket,mainIpAddress,nicType,affinityHost,suspendSr,blockedOperations,hasVendorDevice,startTime,installTime,pvDriversDetected',
    handler: (record: XoVm) => record,
    stream: false,
  },
  sr: {
    type: 'collection',
    path: 'srs',
    fields: 'id,name_label,name_description,$pool,content_type,physical_usage,size,SR_type,VDIs',
    handler: (record: XoSr) => record,
    stream: false,
  },
  task: {
    type: 'collection',
    path: 'tasks',
    fields: 'id,start,end,properties,status,progress,tasks',
    handler: (record: XoTask) => record,
    stream: false,
  },
  pif: {
    type: 'collection',
    path: 'pifs',
    fields:
      '$host,$network,attached,carrier,device,dns,gateway,id,ip,ipv6,mac,management,mode,mtu,netmask,speed,vlan,isBondMaster,bondSlaves',
    handler: (record: XoPif) => record,
    stream: false,
  },
  vbd: {
    type: 'collection',
    path: 'vbds',
    fields: 'id,name_label,name_description,VDI,is_cd_drive,position',
    handler: (record: XoVbd) => record,
    stream: false,
  },
  vdi: {
    type: 'collection',
    path: 'vdis',
    fields: 'id,name_label,name_description,$VBDs,$SR,size,$pool',
    handler: (record: XoVdi) => record,
    stream: false,
  },
  vif: {
    type: 'collection',
    path: 'vifs',
    fields: '$VM,$network,attached,device,txChecksumming,id,lockingMode,MAC,MTU',
    handler: (record: XoVif) => record,
    stream: false,
  },
  network: {
    type: 'collection',
    path: 'networks',
    fields: 'id,defaultIsLocked,name_label,nbd,tags,$pool,name_description,MTU,PIFs,other_config',
    handler: (record: XoNetwork) => record,
    stream: false,
  },
  'vm-template': {
    type: 'collection',
    path: 'vm-templates',
    fields:
      'id,uuid,name_label,name_description,$pool,template_info,VIFs,$VBDs,boot,CPUs,memory,tags,isDefaultTemplate',
    handler: (record: XoVmTemplate) => record,
    stream: false,
  },
  'vm-controller': {
    type: 'collection',
    path: 'vm-controllers',
    fields: 'id,name_label,power_state,memory,$container',
    handler: (record: XoVmController) => record,
    stream: false,
  },
  server: {
    type: 'collection',
    path: 'servers',
    fields:
      'host,httpProxy,username,readOnly,allowUnauthorized,label,poolId,poolNameLabel,id,status,master,error,poolNameDescription',
    handler: (record: XoServer) => record,
    stream: false,
  },
  pci: {
    type: 'collection',
    path: 'pcis',
    fields: 'id,device_name',
    handler: (record: XoPci) => record,
    stream: false,
  },
  pgpu: {
    type: 'collection',
    path: 'pgpus',
    fields: 'id,pci',
    handler: (record: XoPgpu) => record,
    stream: false,
  },
} satisfies ApiDefinition
