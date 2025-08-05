import { NextRequest, NextResponse } from 'next/server'

const CIRCLE_API_KEY = "TEST_API_KEY:b8d14b0a7d5a878b9090cf5399924554:e13cfa73db3190226250138957455eff"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, params, chainName } = body

    // Use public RPC endpoints for now
    const rpcUrls = {
      polygonAmoy: 'https://rpc-amoy.polygon.technology',
      arbitrum: 'https://arb1.arbitrum.io/rpc',
      optimism: 'https://mainnet.optimism.io'
    }
    
    const rpcUrl = rpcUrls[chainName as keyof typeof rpcUrls] || rpcUrls.polygonAmoy
    
    console.log('Proxying request to RPC:', {
      url: rpcUrl,
      method,
      params
    })

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('RPC error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      return NextResponse.json(
        { 
          error: 'RPC request failed', 
          details: errorText,
          status: response.status 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('RPC response:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Handle GET requests for transport configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const chainName = searchParams.get('chain') || 'polygonAmoy'
    
    // Return transport configuration
    return NextResponse.json({
      type: 'rpc',
      url: `https://rpc-amoy.polygon.technology`,
      chain: chainName
    })
  } catch (error) {
    console.error('GET request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 