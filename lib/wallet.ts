import { toModularTransport, toCircleSmartAccount } from '@circle-fin/modular-wallets-core'
import { createPublicClient } from 'viem'
import { polygonAmoy, arbitrum, optimism } from 'viem/chains'
import { toWebAuthnAccount } from 'viem/account-abstraction'

// Environment variables
const clientUrl = process.env.NEXT_PUBLIC_CIRCLE_CLIENT_URL
const clientKey = process.env.NEXT_PUBLIC_CIRCLE_CLIENT_KEY
const defaultChain = process.env.NEXT_PUBLIC_DEFAULT_CHAIN || 'polygonAmoy'

// Chain configuration
const chainConfig = {
  polygonAmoy: {
    chain: polygonAmoy,
    usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS_POLYGON_AMOY || '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582'
  },
  arbitrum: {
    chain: arbitrum,
    usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS_ARBITRUM || '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'
  },
  optimism: {
    chain: optimism,
    usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS_OPTIMISM || '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'
  }
}

// Create modular transport
export function createModularTransport(chainName: string = defaultChain) {
  if (!clientUrl || !clientKey) {
    throw new Error('Circle client URL and key are required')
  }
  
  const chain = chainConfig[chainName as keyof typeof chainConfig]
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`)
  }
  
  return toModularTransport(`${clientUrl}/${chainName}`, clientKey)
}

// Create public client
export function createClient(chainName: string = defaultChain) {
  const chain = chainConfig[chainName as keyof typeof chainConfig]
  if (!chain) {
    throw new Error(`Unsupported chain: ${chainName}`)
  }
  
  const transport = createModularTransport(chainName)
  return createPublicClient({ chain: chain.chain, transport })
}

// WebAuthn utilities
export async function createWebAuthnCredential(username: string) {
  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge: new Uint8Array(32),
    rp: {
      name: "Smart Wallet",
      id: window.location.hostname,
    },
    user: {
      id: new Uint8Array(16),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256
    ],
    timeout: 60000,
    attestation: "direct",
  }

  try {
    const credential = await navigator.credentials.create({
      publicKey: publicKeyOptions,
    }) as PublicKeyCredential

    if (!credential) {
      throw new Error('Failed to create WebAuthn credential')
    }

    return credential
  } catch (error) {
    console.error('WebAuthn credential creation failed:', error)
    throw error
  }
}

export async function getWebAuthnCredential() {
  const publicKeyOptions: PublicKeyCredentialRequestOptions = {
    challenge: new Uint8Array(32),
    rpId: window.location.hostname,
    timeout: 60000,
    userVerification: "preferred",
  }

  try {
    const credential = await navigator.credentials.get({
      publicKey: publicKeyOptions,
    }) as PublicKeyCredential

    if (!credential) {
      throw new Error('Failed to get WebAuthn credential')
    }

    return credential
  } catch (error) {
    console.error('WebAuthn credential retrieval failed:', error)
    throw error
  }
}

// Smart account creation
export async function createSmartAccount(credential: PublicKeyCredential, chainName: string = defaultChain) {
  try {
    const client = createClient(chainName)
    const webAuthnAccount = toWebAuthnAccount({ credential })
    
    const smartAccount = await toCircleSmartAccount({
      client,
      owner: webAuthnAccount,
    })

    return smartAccount
  } catch (error) {
    console.error('Smart account creation failed:', error)
    throw error
  }
}

// USDC transfer - simplified implementation
export async function sendUSDC(
  smartAccount: any,
  toAddress: string,
  amount: bigint,
  chainName: string = defaultChain
) {
  try {
    // For now, we'll simulate the transaction
    // In a real implementation, you would use the Circle SDK to send the transaction
    console.log('Sending USDC transaction:', {
      toAddress,
      amount: amount.toString(),
      chainName
    })

    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Return mock transaction hash
    const userOpHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    return { 
      userOpHash, 
      receipt: { 
        transactionHash: userOpHash,
        status: 'success'
      } 
    }
  } catch (error) {
    console.error('USDC transfer failed:', error)
    throw error
  }
}

// Get USDC balance
export async function getUSDCBalance(smartAccount: any, chainName: string = defaultChain) {
  try {
    // In a real implementation, you would query the USDC contract
    // For now, return a mock balance
    return "1234.56"
  } catch (error) {
    console.error('Failed to get USDC balance:', error)
    throw error
  }
}

// Wallet utilities
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function parseUSDCAmount(amount: string): bigint {
  const numericAmount = parseFloat(amount)
  if (isNaN(numericAmount) || numericAmount <= 0) {
    throw new Error('Invalid amount')
  }
  // USDC has 6 decimals
  return BigInt(Math.floor(numericAmount * 1000000))
} 