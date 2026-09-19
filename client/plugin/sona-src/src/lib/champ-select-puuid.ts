/**
 * 英雄选择匿名模式使用固定 16 字节掩码对 UUID 做异或。
 * 异或运算可逆，因此同一过程可以将 obfuscatedPuuid 还原为真实 PUUID。
 */
const CHAMP_SELECT_PUUID_MASK = [
  129, 112, 118, 169, 244, 81, 80, 155,
  149, 152, 104, 19, 206, 145, 23, 231,
] as const

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * 将英雄选择会话里的 obfuscatedPuuid 还原成可用于 LCU / SGP 查询的 PUUID。
 * 输入格式异常时返回空字符串，避免把无效标识送入查询接口。
 */
export function deobfuscateChampSelectPuuid(obfuscatedPuuid: string): string {
  const normalized = obfuscatedPuuid.trim().toLowerCase()
  if (!UUID_PATTERN.test(normalized)) return ''

  const sourceHex = normalized.replace(/-/g, '')
  let resultHex = ''

  for (let index = 0; index < CHAMP_SELECT_PUUID_MASK.length; index++) {
    const sourceByte = Number.parseInt(sourceHex.slice(index * 2, index * 2 + 2), 16)
    resultHex += (sourceByte ^ CHAMP_SELECT_PUUID_MASK[index]).toString(16).padStart(2, '0')
  }

  return [
    resultHex.slice(0, 8),
    resultHex.slice(8, 12),
    resultHex.slice(12, 16),
    resultHex.slice(16, 20),
    resultHex.slice(20),
  ].join('-')
}
