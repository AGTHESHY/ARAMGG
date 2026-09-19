export type XhrRuleAction = 'networkError' | 'rewriteResponse'

export interface XhrRequestMeta {
  method: string
  url: string
  async: boolean
}

export type XhrRuleMatcher = string | RegExp | ((meta: XhrRequestMeta) => boolean)

export interface XhrRule {
  id: string
  match: XhrRuleMatcher
  action: XhrRuleAction
  response?: string | boolean | number | null | ((meta: XhrRequestMeta, xhr: XMLHttpRequest) => unknown)
  status?: number
  statusText?: string
  description?: string
}

export interface XhrMatchedRule extends XhrRule {
  action: XhrRuleAction
}
