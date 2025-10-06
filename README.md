# Concero × Lanca Quiz

A web-based quiz application designed to test users' knowledge about Concero and Lanca projects.  
The quiz evaluates players through a series of multiple-choice questions and calculates an IQ-style score based on accuracy and speed.

---

## Features

- User authentication using X (Twitter) username  
- 10 randomly selected questions per session  
- 15-second countdown timer per question  
- Animated transitions and responsive design  
- Automatic scoring and IQ calculation  
- Dynamic result generation with downloadable image  
- Share results directly to X (Twitter)  
- Mobile and desktop friendly interface  

---

## Technologies Used

- **React.js** – Frontend framework  
- **Vite** – Development and build tool  
- **Tailwind CSS** – Styling  
- **Framer Motion** – Animations  
- **html2canvas** – Image capture for results  
- **React Router DOM** – Page navigation  

---

## Project Structure

```
src/
├── assets/           # Images and logos
├── data/             # Question data
├── pages/            # Application pages
│   ├── Login.jsx
│   ├── Start.jsx
│   ├── Quiz.jsx
│   └── Result.jsx
├── App.jsx           # Main app entry
└── main.jsx          # Application root
```

---

## Getting Started

### Prerequisites
Ensure that **Node.js** (version 16 or later) and **npm** are installed on your system.

### Installation
Clone this repository and install dependencies:
```bash
git clone https://github.com/Admuad/concero-quiz.git
cd concero-quiz
npm install
```

### Development
Start the local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Build for Production
To build the project for production deployment:
```bash
npm run build
```

---

## Deployment

This project can be easily deployed using **Vercel** or **Netlify**.  

### Vercel Deployment
1. Push the code to a GitHub repository.  
2. Go to [Vercel](https://vercel.com) and import the repository.  
3. Set the build command to `npm run build`.  
4. Set the output directory to `dist`.  
5. Deploy and get your live URL.

---

## License

This project is open-source and distributed under the **MIT License**.

---

## Author

Developed by [@adedir2](https://x.com/adedir2)
