# Next.js with TypeScript & NeonDB

A simple project using **Next.js**, **TypeScript**, and **NeonDB** for serverless PostgreSQL database.

## Prerequisites

- **Node.js** (v14.x or higher) - [Install Node.js](https://nodejs.org/)
- **npm** (v7.x or higher) or **yarn** - [Install npm](https://www.npmjs.com/) or [Install Yarn](https://yarnpkg.com/)
- **NeonDB** account - [Sign Up on NeonDB](https://neon.tech)

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/username/repository-name.git
    cd repository-name
    ```

2. **Install dependencies**:

    Using **npm**:

    ```bash
    npm install
    ```

    Using **yarn**:

    ```bash
    yarn install
    ```

3. **Set up environment variables**:

    Create a `.env` file in the root directory and add the `DATABASE_URL`:

    ```bash
    DATABASE_URL=your_neondb_connection_string
    ```

4. **Run the application**:

    Using **npm**:

    ```bash
    npm run dev
    ```

    Using **yarn**:

    ```bash
    yarn dev
    ```

    Your app should now be running at [http://localhost:3000](http://localhost:3000).

---

## Deployment

Deploy your app to **Vercel**:

1. Connect your GitHub repository to **Vercel**.
2. Add the `DATABASE_URL` in the **Vercel environment variables** settings.
3. Click "Deploy" to go live.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
