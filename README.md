Foodieland Project's FrontEnd (Ostad Pro Batch-2, Team-6)

//*Try to Keep the Project Structure like this one. We will modify this after completing the full Project*//

FoodieLand_FrontEnd/
│
├── public/                     # Static files like favicon, index.html
│
├── src/
│   ├── assets/                 # Images, icons, fonts
│   │
│   ├── components/             # Reusable UI components (buttons, inputs, cards)
│   │   ├── common/             # Buttons, Inputs, Loaders, Modals etc.
│   │   ├── layout/             # Navbar, Footer, Sidebar
│   │   └── specific/           # Component-specific like RecipeCard, BlogCard
│   │
│   ├── context/                # React Context for global state (auth, theme)
│   │
│   ├── hooks/                  # Custom React hooks (useAuth, useForm, useFetch)
│   │
│   ├── pages/                  # Pages (route targets)
│   │   ├── Auth/               # Login, Signup, ForgotPassword, EmailVerification
│   │   ├── Home/               # HomePage components
│   │   ├── Recipes/            # RecipeList, RecipeDetails, AddRecipe
│   │   ├── Blogs/              # BlogList, BlogPost, AddBlog
│   │   ├── Contact/            # ContactUs Page
│   │   └── Profile/            # User Profile, EditProfile, Messages
│   │
│   ├── services/               # API calls, Axios configs
│   │
│   ├── styles/                 # Tailwind customizations, globals.css, themes
│   │
│   ├── utils/                  # Utility functions/helpers
│   │
│   ├── App.jsx                 # Main app component, routing setup here
│   ├── main.jsx                # React entry point
│   └── index.css               # Tailwind base imports + global css
│
├── .env.example                # Environment variables example (API URLs, keys)
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js              # or react-scripts config if CRA used
