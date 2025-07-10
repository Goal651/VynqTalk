# VynqTalk Front-end

[![CI](https://github.com/goal651/vynqtalk/actions/workflows/ci.yml/badge.svg)](https://github.com/goal651/vynqtalk/actions/workflows/ci.yml)
[![Tests](https://github.com/goal651/vynqtalk/actions/workflows/test.yml/badge.svg)](https://github.com/goal651/vynqtalk/actions/workflows/test.yml)

Welcome to the front-end of **VynqTalk**, a real-time chat application built with React and TypeScript. This repository handles the user interface and client-side logic, connecting to the VynqTalk back-end for messaging and authentication.

---

## 🚀 Features

- 💬 Real-time chat interface
- 🔐 User authentication (login/signup)
- 📱 Responsive design with React Router for navigation

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)
- A running instance of the VynqTalk back-end

---

## ⚙️ Setup Instructions

1. **Clone the repository:**  
   📋 Copy the following commands:

   ```sh
   git clone https://github.com/goal651/vynqtalk.git
   cd vynqtalk
   ```

2. **Install dependencies:**  
   📋 Copy the following command:

   ```sh
   pnpm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the project root.
   - Add the back-end API URL (replace `http://localhost:8080` with your back-end URL if different).

4. **Run the application:**  
   📋 Copy the following command:

   ```sh
   npm start
   ```

   The app will open at [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🐞 Troubleshooting

- Ensure the back-end server is running before starting the front-end.
- Check the console for errors related to API connectivity.
- Verify Node.js and npm versions with `node -v` and `npm -v`.

---

## 🧪 Running Tests

To run all tests:

```sh
pnpm test
```

To run tests in watch mode:

```sh
pnpm test:watch
```

To view coverage:

```sh
pnpm test:coverage
```

---

## 🤝 Contribution Guidelines

- Fork the repository and create your branch from `main`.
- Ensure your code passes linting and tests before submitting a PR.
- Add tests for new features or bug fixes.
- Write clear, descriptive commit messages.

---

## 🤝 Contributing

Feel free to fork the repo, submit pull requests, or open issues for bugs or features!

---

## ⭐ Support

If you like this project, please give it a ⭐ on GitHub!
