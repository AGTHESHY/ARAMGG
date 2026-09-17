import type { ElectronAPI } from '../shared/ipc-contract.ts'

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

export {}
