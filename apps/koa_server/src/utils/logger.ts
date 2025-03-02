// 简单的日志工具
export const logger = {
  info: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.log(message, ...args)
  },
  error: (message: string, ...args: any[]) => {
    // eslint-disable-next-line no-console
    console.error(message, ...args)
  },
}
