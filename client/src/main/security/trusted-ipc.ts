import {
  BrowserWindow,
  ipcMain,
  type IpcMainEvent,
  type IpcMainInvokeEvent,
} from 'electron'
import logger from '../modules/logger.ts'
import { isTrustedRendererUrl } from './renderer-origin.ts'

type InvokeHandler = (event: IpcMainInvokeEvent, ...args: any[]) => any
type EventHandler = (event: IpcMainEvent, ...args: any[]) => any

function assertTrustedIpcSender(event: IpcMainEvent | IpcMainInvokeEvent): void {
  const ownerWindow = BrowserWindow.fromWebContents(event.sender)
  const senderFrame = event.senderFrame
  const senderUrl = senderFrame?.url || event.sender.getURL()

  if (!ownerWindow || ownerWindow.isDestroyed()) {
    throw new Error('IPC sender is not owned by an application window')
  }

  if (!senderFrame || (senderFrame.top && senderFrame !== senderFrame.top)) {
    throw new Error('IPC calls from child frames are not allowed')
  }

  if (!isTrustedRendererUrl(senderUrl)) {
    throw new Error(`IPC sender URL is not trusted: ${senderUrl || 'unknown'}`)
  }
}

export const trustedIpcMain = {
  handle(channel: string, listener: InvokeHandler): void {
    ipcMain.handle(channel, (event, ...args) => {
      assertTrustedIpcSender(event)
      return listener(event, ...args)
    })
  },

  on(channel: string, listener: EventHandler): void {
    ipcMain.on(channel, (event, ...args) => {
      try {
        assertTrustedIpcSender(event)
      } catch (error) {
        logger.warn('[ipc] rejected untrusted renderer event', {
          channel,
          error: (error as Error).message,
        })
        return
      }

      try {
        const result = listener(event, ...args)
        if (result && typeof result.catch === 'function') {
          result.catch((error: unknown) => {
            logger.warn('[ipc] asynchronous renderer event failed', {
              channel,
              error: error instanceof Error ? error.message : String(error),
            })
          })
        }
      } catch (error) {
        logger.warn('[ipc] renderer event failed', {
          channel,
          error: (error as Error).message,
        })
      }
    })
  },
}
