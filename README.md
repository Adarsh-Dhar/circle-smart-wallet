# Smart Wallet - Passkey Authentication & USDC Transfers

A modern smart wallet application built with Next.js, featuring passkey authentication and USDC transfers using Circle's Modular Wallets.

## Features

- 🔐 **Passkey Authentication** - Secure biometric authentication using WebAuthn
- 💰 **Smart Account** - Circle Modular Smart Contract Account (MSCA) on Polygon Amoy
- 🚀 **Gasless Transactions** - USDC transfers with Circle's bundler and paymaster
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Mobile Responsive** - Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Circle Modular Wallets, Viem
- **Authentication**: WebAuthn (Passkeys)
- **Chains**: Polygon Amoy (default), Arbitrum, Optimism

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your Circle API credentials:

```env
# Circle Modular Wallets Configuration
# Get your credentials from: https://developers.circle.com/
NEXT_PUBLIC_CIRCLE_CLIENT_URL=https://api.circle.com/v1/w3s
NEXT_PUBLIC_CIRCLE_CLIENT_KEY=your_circle_client_key_here

# USDC Contract Addresses
NEXT_PUBLIC_USDC_ADDRESS_POLYGON_AMOY=0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582
NEXT_PUBLIC_USDC_ADDRESS_ARBITRUM=0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
NEXT_PUBLIC_USDC_ADDRESS_OPTIMISM=0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85

# Chain Configuration
NEXT_PUBLIC_DEFAULT_CHAIN=polygonAmoy
```

### 3. Get Circle API Credentials

1. Visit [Circle Developers](https://developers.circle.com/)
2. Create an account and get your API credentials
3. Replace `your_circle_client_key_here` with your actual client key

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## How It Works

### Authentication Flow

1. **User Registration**: When a user first logs in, a WebAuthn credential is created
2. **Smart Account Creation**: The credential is used to create a Circle Smart Account
3. **Wallet Address**: The smart account address becomes the user's wallet address
4. **Persistent Login**: Credentials are stored securely in the browser

### USDC Transfer Process

1. **Transaction Review**: User enters recipient address and amount
2. **Risk Assessment**: System evaluates transaction risk based on amount and recipient
3. **Authentication**: High-risk transactions require additional passkey verification
4. **Bundler Submission**: Transaction is sent via Circle's bundler with gasless sponsorship
5. **Confirmation**: User receives confirmation of successful transaction

### Supported Chains

- **Polygon Amoy** (default) - Testnet for development
- **Arbitrum** - Mainnet and testnet
- **Optimism** - Mainnet and testnet

## Project Structure

```
smart-wallet/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout with providers
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── send-usdc-modal.tsx
│   └── navigation.tsx
├── hooks/                # Custom React hooks
│   └── use-wallet.tsx    # Wallet context and state management
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   └── wallet.ts         # Wallet and blockchain utilities
└── styles/               # Global styles
```

## Key Components

### `lib/wallet.ts`
Contains all blockchain-related functionality:
- WebAuthn credential creation and retrieval
- Smart account creation and management
- USDC transfer functions
- Chain configuration

### `hooks/use-wallet.tsx`
React context for wallet state management:
- Authentication state
- Smart account instance
- USDC balance
- Transaction functions

### `components/send-usdc-modal.tsx`
USDC transfer interface with:
- Address validation
- Risk assessment
- Transaction processing
- Error handling

## Development

### Adding New Chains

To add support for a new chain:

1. Update `lib/wallet.ts` with the new chain configuration
2. Add the USDC contract address to environment variables
3. Update the chain selection UI if needed

### Customizing Risk Assessment

Modify the risk assessment logic in `components/send-usdc-modal.tsx`:

```typescript
const isHighRisk = Number(amount) > 1000 || recipient.toLowerCase().includes("bad")
```

### Styling

The app uses Tailwind CSS with a custom color scheme:
- Primary: `#47D6AA` (green)
- Secondary: `#0B1F56` (dark blue)
- Accent: `#4EAAFF` (light blue)

## Troubleshooting

### WebAuthn Not Supported
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check that HTTPS is enabled (required for WebAuthn)

### Circle API Errors
- Verify your API credentials are correct
- Check that your Circle account has the necessary permissions
- Ensure you're using the correct chain configuration

### Transaction Failures
- Verify the recipient address is valid
- Check that you have sufficient USDC balance
- Ensure the transaction amount is within limits

## License

MIT License - see LICENSE file for details.
