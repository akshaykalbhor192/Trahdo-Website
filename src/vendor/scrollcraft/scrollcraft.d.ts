export interface ScrollCraftInstance {
  layout: () => void
  read: () => void
  destroy: () => void
}

export interface ScrollCraftGlobal {
  mount: (root?: Element | Document | string, opts?: Record<string, unknown>) => ScrollCraftInstance
  reduce: boolean
  instances: ScrollCraftInstance[]
}

declare global {
  interface Window {
    ScrollCraft: ScrollCraftGlobal
  }
}
