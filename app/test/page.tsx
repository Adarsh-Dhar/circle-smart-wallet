"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/use-wallet'
import { getAddressBalance, resetSimulatedBalances } from '@/lib/wallet'

export default function TestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [testAmount, setTestAmount] = useState('1.00')
  const [testAddress, setTestAddress] = useState('0xf76daC24BaEf645ee0b3dfAc1997c6b838eF280D')
  const [checkAddress, setCheckAddress] = useState('0xf76daC24BaEf645ee0b3dfAc1997c6b838eF280D')
  const [checkBalance, setCheckBalance] = useState('0.00')
  const { usdcBalance, sendUSDCTransaction, refreshBalance } = useWallet()

  const testProxy = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/circle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'eth_blockNumber',
          params: [],
          chainName: 'polygonAmoy'
        })
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testBasicAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testUSDCTransaction = async () => {
    setLoading(true)
    try {
      // Check balances before transaction
      const senderBalanceBefore = usdcBalance
      const receiverBalanceBefore = await getAddressBalance(testAddress)
      
      setResult(`Before Transaction:
Sender (${usdcBalance} USDC) → Receiver (${receiverBalanceBefore} USDC)

Sending ${testAmount} USDC...`)

      const result = await sendUSDCTransaction(testAddress, testAmount)
      
      // Wait a moment for balance updates
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check balances after transaction
      await refreshBalance()
      const senderBalanceAfter = usdcBalance
      const receiverBalanceAfter = await getAddressBalance(testAddress)
      
      const senderChange = parseFloat(senderBalanceAfter) - parseFloat(senderBalanceBefore)
      const receiverChange = parseFloat(receiverBalanceAfter) - parseFloat(receiverBalanceBefore)
      
      if (result.success) {
        setResult(`✅ Transaction Successful!
Transaction Hash: ${result.hash}

Balance Changes:
Sender: ${senderBalanceBefore} → ${senderBalanceAfter} (${senderChange > 0 ? '+' : ''}${senderChange.toFixed(2)})
Receiver: ${receiverBalanceBefore} → ${receiverBalanceAfter} (${receiverChange > 0 ? '+' : ''}${receiverChange.toFixed(2)})

Status: ${receiverChange > 0 ? '✅ Tokens transferred successfully' : '⚠️ Transaction completed but no balance change detected'}`)
      } else {
        setResult(`❌ Transaction Failed!
Error: ${result.error}

Balance Changes:
Sender: ${senderBalanceBefore} → ${senderBalanceAfter} (no change)
Receiver: ${receiverBalanceBefore} → ${receiverBalanceAfter} (no change)

Status: ❌ No tokens were transferred`)
      }
    } catch (error) {
      setResult(`❌ Transaction Error: ${error instanceof Error ? error.message : 'Unknown error'}

No balances were updated due to transaction failure.`)
    } finally {
      setLoading(false)
    }
  }

  const testRefreshBalance = async () => {
    setLoading(true)
    try {
      await refreshBalance()
      setResult('Balance refreshed successfully')
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testCheckBalance = async () => {
    setLoading(true)
    try {
      const balance = await getAddressBalance(checkAddress)
      setCheckBalance(balance)
      setResult(`Balance for ${checkAddress}: ${balance} USDC`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testResetBalances = async () => {
    setLoading(true)
    try {
      resetSimulatedBalances()
      await refreshBalance()
      setCheckBalance('0.00')
      setResult('All simulated balances have been reset')
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testVerifyTransaction = async () => {
    setLoading(true)
    try {
      // Check if the transaction actually went through by verifying balances
      const senderBalanceBefore = usdcBalance
      const receiverBalanceBefore = await getAddressBalance(testAddress)
      
      setResult(`Verifying transaction state:
Sender: ${senderBalanceBefore} USDC
Receiver: ${receiverBalanceBefore} USDC

Checking blockchain state...`)

      // Simulate blockchain verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const senderBalanceAfter = usdcBalance
      const receiverBalanceAfter = await getAddressBalance(testAddress)
      
      const senderChange = parseFloat(senderBalanceAfter) - parseFloat(senderBalanceBefore)
      const receiverChange = parseFloat(receiverBalanceAfter) - parseFloat(receiverBalanceBefore)
      
      setResult(`Transaction Verification:
Sender: ${senderBalanceBefore} → ${senderBalanceAfter} (${senderChange > 0 ? '+' : ''}${senderChange.toFixed(2)})
Receiver: ${receiverBalanceBefore} → ${receiverBalanceAfter} (${receiverChange > 0 ? '+' : ''}${receiverChange.toFixed(2)})

Status: ${receiverChange > 0 ? '✅ Transaction successful' : '❌ No tokens transferred'}`)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testBlockchainConnection = async () => {
    setLoading(true)
    try {
      setResult('Testing blockchain connection...')
      
      const response = await fetch('/api/circle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'eth_blockNumber',
          params: [],
          chainName: 'polygonAmoy'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(`✅ Blockchain Connection Successful!
Current Block: ${parseInt(data.result, 16)}
Chain: Polygon Amoy
Status: Connected`)
      } else {
        setResult('❌ Blockchain Connection Failed!')
      }
    } catch (error) {
      setResult(`❌ Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={testBasicAPI} disabled={loading}>
              Test Basic API
            </Button>
            
            <Button onClick={testProxy} disabled={loading}>
              Test Circle Proxy
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>USDC Transaction Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Current Balance</Label>
              <div className="text-lg font-semibold">{usdcBalance} USDC</div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Send</Label>
              <Input
                id="amount"
                type="text"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                placeholder="1.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Recipient Address</Label>
              <Input
                id="address"
                type="text"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>

            <div className="space-y-2">
              <Button onClick={testUSDCTransaction} disabled={loading}>
                Test USDC Transaction
              </Button>
              
              <Button onClick={testRefreshBalance} disabled={loading}>
                Refresh Balance
              </Button>
              
              <Button onClick={testResetBalances} disabled={loading} variant="outline">
                Reset All Balances
              </Button>
              
              <Button onClick={testVerifyTransaction} disabled={loading} variant="outline">
                Verify Transaction
              </Button>
              
              <Button onClick={testBlockchainConnection} disabled={loading} variant="outline">
                Test Blockchain Connection
              </Button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Check Any Address Balance</h3>
              <div className="space-y-2">
                <Label htmlFor="checkAddress">Address to Check</Label>
                <Input
                  id="checkAddress"
                  type="text"
                  value={checkAddress}
                  onChange={(e) => setCheckAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div className="space-y-2 mt-2">
                <Label>Balance</Label>
                <div className="text-lg font-semibold">{checkBalance} USDC</div>
              </div>
              <Button onClick={testCheckBalance} disabled={loading} className="mt-2">
                Check Balance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
} 