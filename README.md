# Dumbbell Weight Calculator

A little web app that calculates optimal plate combinations for adjustable dumbbells. Easily figures out exactly which plates to load on your dumbbells to achieve your target weight.

## Features

- **Plate Management** - Add, edit, and delete your available weight plates with quantities
- **Smart Calculations** - Uses Dynamic Programming to find the optimal combination using the fewest plates
- **Balanced Loading** - Ensures plates are distributed evenly on both sides of the dumbbell bar for balance
- **Two Modes**:
    - **Single Dumbbell** - Calculate for one dumbbell
    - **Combined** - Calculate for two identical dumbbells (splits target weight equally across the dumbells)
- **Local Storage** - Your plate collection is saved in the localStorage of your browser

## Tech Stack

- **[Astro](https://astro.build/)
- **[Svelte](https://svelte.dev/)
- **[Tailwind CSS](https://tailwindcss.com/)
- **TypeScript

## Getting Started

### Prerequisites

- Node.js 18.20.8 or higher
- npm 9.6.5 or higher

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:4321/`

### Other Commands

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## How to Use

### 1. Add Your Plates

In the **Manage Plates** section:

- Enter the weight of a plate type (in KG)
- Enter how many of that plate you have
- Click **Add Plate**

Default plates are provided: 1.25kg, 2.5kg, 5kg, and 10kg.

### 2. Calculate Target Weight

In the **Calculate Weight** section:

- Enter your target weight in KG
- Choose **Single Dumbbell** or **Combined (2 dumbbells)**
- Click **Calculate**

### 3. View Results

The app shows:

- A color-coded list of plates needed
- Total weight achieved
- A visual representation of how to load the plates on your dumbbell(s)

## How It Works

The calculator uses a **Dynamic Programming algorithm** (bounded knapsack) to find the optimal plate combination:

1. Calculates weight needed per side of the dumbbell bar
2. Accounts for quantity limits of each plate type
3. Finds the combination using the fewest plates
4. Ensures all dumbbells are balanced and identical (in combined mode)

If the target weight is impossible with your available plates, the app will let you know.

## Development

### Code Formatting

This project uses Prettier with:

- Tabs for indentation (width: 4 spaces)
- Single quotes
- Plugins for Astro and Svelte

Run `npm run format` to format all code.

## License

GPL-3.0 - This project is licensed under the GNU General Public License v3.0. Any modifications or distributions must remain open source.
