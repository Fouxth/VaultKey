interface RequestArguments {
  method: string
  params?: unknown[] | object
}

interface EthereumProvider {
  isMetaMask?: boolean
  request: (args: RequestArguments) => Promise<any>
  on(event: string, listener: (...args: any[]) => void): void
  removeListener(event: string, listener: (...args: any[]) => void): void
}

interface Window {
  ethereum?: EthereumProvider
}
