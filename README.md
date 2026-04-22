# FoodieLand 🍳

A modern, full-stack community-driven platform where food enthusiasts can share recipes, write culinary blogs, and connect with fellow cooking lovers. Built with Django REST Framework backend and React frontend.

## 🌟 Key Features

### 🔐 User Authentication & Security
- **Multi-platform Registration**: Email/password and social media login (Google, Facebook)
- **Email Verification**: Secure account activation process
- **Password Recovery**: Forgot password functionality with email reset
- **Form Validation**: Comprehensive client and server-side validation
- **Security**: JWT token-based authentication with secure password hashing

### 🏠 Dynamic Home Experience
- **Interactive Navigation**: Seamless navigation between recipes, blogs, and profiles
- **Hero Slider**: Dynamically showcased featured recipes from database
- **Category Filtering**: Smart recipe categorization with real-time filtering
- **Recipe Discovery**: Grid-based recipe browsing with thumbnails and ratings
- **Featured Chefs**: Spotlight on community contributors

### 📖 Recipe Management
- **Detailed Recipe Views**: Complete ingredient lists, step-by-step instructions
- **Recipe Creation**: Intuitive form for adding new recipes with image upload
- **Author Profiles**: Direct links to chef profiles and their other recipes
- **Smart Recommendations**: "You May Also Like" suggestions based on categories
- **User-Generated Content**: Community-driven recipe database

### ✍️ Blogging Platform
- **Rich Content Creation**: Full-featured blog post editor with image support
- **Content Discovery**: Browse all blogs with filtering and search capabilities
- **Sidebar Navigation**: Recent posts and category-based browsing
- **Author Attribution**: Full author profiles and related content linking

### 👤 User Profiles & Communication
- **Profile Management**: Editable user profiles with bio and profile pictures
- **Content Portfolio**: View all user's recipes and blog posts
- **Messaging System**: Contact form integration with user message inbox
- **Account Control**: Profile editing and account deletion options

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 4.x with Django REST Framework
- **Database**: SQLite (configurable)
- **Authentication**: JWT tokens with social auth integration
- **Media Storage**: Django file handling with cloud storage support
- **API Design**: RESTful API architecture

### Frontend
- **Framework**: React 18+ with modern hooks
- **Styling**: CSS3/SCSS with responsive design
- **State Management**: React Context API and local state
- **HTTP Client**: Axios for API communication
- **Routing**: React Router for SPA navigation

### Development Tools
- **Version Control**: Git with feature branch workflow
- **Package Management**: npm/yarn and pip

## 🚀 Getting Started

### Prerequisites
```bash
- Python 3.8+
- Node.js 16+
-  SQLite
```

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/AKJilani/Foodieland_Backend.git
cd foodieland

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Database setup
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 📱 User Access Levels

### Public Users (No Authentication Required)
- Browse and view all recipes
- Read all blog posts
- View chef profiles
- Access contact information

### Authenticated Users
- Create, edit, and delete personal recipes
- Write, edit, and delete blog posts
- Edit profile information
- Upload and manage media files
- Receive and manage contact messages
- Full account management

## 🎯 Project Architecture

### Database Schema
- **User Model**: Extended Django user with profile fields
- **Recipe Model**: Title, description, ingredients, steps, category, author
- **Blog Model**: Title, content, author, publication date, featured image
- **Category Model**: Recipe categorization system
- **Message Model**: Contact form submissions linked to users

### API Endpoints
```

Auth and Firebase Authentication
==================================
| Method | Endpoint                          | Description                         |
| ------ | --------------------------------- | ----------------------------------- |
| POST   | /api/auth/firebase-verify-email/  | Verify email using Firebase         |
| GET    | /api/auth/me/                     | Get current authenticated user      |
| PUT    | /api/auth/me/                     | Update authenticated user           |
| PATCH  | /api/auth/me/                     | Partially update authenticated user |
| POST   | /api/auth/register/               | Register a new user                 |
| POST   | /api/auth/request-password-reset/ | Request password reset email        |
| POST   | /api/auth/reset-password/         | Reset password                      |
| POST   | /api/auth/token/                  | Get JWT token                       |
| POST   | /api/auth/token/refresh/          | Refresh JWT token                   |

Blogs
====================
| Method | Endpoint                               | Description           |
| ------ | -------------------------------------- | --------------------- |
| GET    | /api/blogs/blogs/                      | List all blogs        |
| POST   | /api/blogs/blogs/                      | Create a new blog     |
| GET    | /api/blogs/blogs/{id}/                 | Get blog by ID        |
| PUT    | /api/blogs/blogs/{id}/                 | Replace blog by ID    |
| PATCH  | /api/blogs/blogs/{id}/                 | Update blog partially |
| DELETE | /api/blogs/blogs/{id}/                 | Delete blog           |
| POST   | /api/blogs/blogs/{id}/increment\_view/ | Increment blog views  |

Categories
====================
| Method | Endpoint                          | Description               |
| ------ | --------------------------------- | ------------------------- |
| GET    | /api/blogs/blogs/categories/      | List all categories       |
| POST   | /api/blogs/blogs/categories/      | Create a category         |
| GET    | /api/blogs/blogs/categories/{id}/ | Get category by ID        |
| PUT    | /api/blogs/blogs/categories/{id}/ | Replace category          |
| PATCH  | /api/blogs/blogs/categories/{id}/ | Update category partially |
| DELETE | /api/blogs/blogs/categories/{id}/ | Delete category           |

Comments
====================
| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | /api/blogs/blogs/comments/      | List all comments        |
| POST   | /api/blogs/blogs/comments/      | Create a comment         |
| GET    | /api/blogs/blogs/comments/{id}/ | Get comment by ID        |
| PUT    | /api/blogs/blogs/comments/{id}/ | Replace comment          |
| PATCH  | /api/blogs/blogs/comments/{id}/ | Update comment partially |
| DELETE | /api/blogs/blogs/comments/{id}/ | Delete comment           |

Contact-Message
====================
| Method | Endpoint                                       | Description              |
| ------ | ---------------------------------------------- | ------------------------ |
| GET    | /api/interactions/contact-messages/            | List contact messages    |
| POST   | /api/interactions/contact-messages/            | Create a contact message |
| GET    | /api/interactions/contact-messages/{id}/       | Get message by ID        |
| PUT    | /api/interactions/contact-messages/{id}/       | Replace message          |
| PATCH  | /api/interactions/contact-messages/{id}/       | Update message partially |
| DELETE | /api/interactions/contact-messages/{id}/       | Delete message           |
| POST   | /api/interactions/contact-messages/{id}/reply/ | Reply to a message       |

Contact-US
===============

| Method | Endpoint                           | Description                 |
| ------ | ---------------------------------- | --------------------------- |
| GET    | /api/interactions/contact-us/      | List contact-us submissions |
| POST   | /api/interactions/contact-us/      | Create a submission         |
| GET    | /api/interactions/contact-us/{id}/ | Get submission by ID        |
| PUT    | /api/interactions/contact-us/{id}/ | Replace submission          |
| PATCH  | /api/interactions/contact-us/{id}/ | Update submission partially |
| DELETE | /api/interactions/contact-us/{id}/ | Delete submission           |

Follows
==========
| Method | Endpoint                            | Description             |
| ------ | ----------------------------------- | ----------------------- |
| GET    | /api/interactions/follows/          | List all follows        |
| POST   | /api/interactions/follows/          | Create a follow         |
| GET    | /api/interactions/follows/{id}/     | Get follow by ID        |
| PUT    | /api/interactions/follows/{id}/     | Replace follow          |
| PATCH  | /api/interactions/follows/{id}/     | Update follow partially |
| DELETE | /api/interactions/follows/{id}/     | Delete follow           |
| POST   | /api/interactions/follows/unfollow/ | Unfollow a user         |

Newsletter
==========

| Method | Endpoint                           | Description                     |
| ------ | ---------------------------------- | ------------------------------- |
| GET    | /api/interactions/newsletter/      | List all newsletter subscribers |
| POST   | /api/interactions/newsletter/      | Subscribe to newsletter         |
| GET    | /api/interactions/newsletter/{id}/ | Get subscriber by ID            |
| PUT    | /api/interactions/newsletter/{id}/ | Replace subscriber              |
| PATCH  | /api/interactions/newsletter/{id}/ | Update subscriber partially     |
| DELETE | /api/interactions/newsletter/{id}/ | Delete subscriber               |

Useres
==========

| Method | Endpoint                      | Description    |
| ------ | ----------------------------- | -------------- |
| GET    | /api/interactions/users/      | List all users |
| GET    | /api/interactions/users/{id}/ | Get user by ID |

Recipes
==========

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /api/recipes/      | List all recipes        |
| POST   | /api/recipes/      | Create a recipe         |
| GET    | /api/recipes/{id}/ | Get recipe by ID        |
| PUT    | /api/recipes/{id}/ | Replace recipe          |
| PATCH  | /api/recipes/{id}/ | Update recipe partially |
| DELETE | /api/recipes/{id}/ | Delete recipe           |

Categories
==========

| Method | Endpoint                      | Description                |
| ------ | ----------------------------- | -------------------------- |
| GET    | /api/recipes/categories/      | List all recipe categories |
| POST   | /api/recipes/categories/      | Create a category          |
| GET    | /api/recipes/categories/{id}/ | Get category by ID         |
| PUT    | /api/recipes/categories/{id}/ | Replace category           |
| PATCH  | /api/recipes/categories/{id}/ | Update category partially  |
| DELETE | /api/recipes/categories/{id}/ | Delete category            |

Favorites
==========

| Method | Endpoint                        | Description               |
| ------ | ------------------------------- | ------------------------- |
| GET    | /api/recipes/my/favorites/      | List my favorite recipes  |
| POST   | /api/recipes/my/favorites/      | Add recipe to favorites   |
| GET    | /api/recipes/my/favorites/{id}/ | Get favorite by ID        |
| PUT    | /api/recipes/my/favorites/{id}/ | Replace favorite          |
| PATCH  | /api/recipes/my/favorites/{id}/ | Update favorite partially |
| DELETE | /api/recipes/my/favorites/{id}/ | Remove from favorites     |

Ratings
==========
| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | /api/recipes/my/ratings/      | List my ratings         |
| POST   | /api/recipes/my/ratings/      | Add a rating            |
| GET    | /api/recipes/my/ratings/{id}/ | Get rating by ID        |
| PUT    | /api/recipes/my/ratings/{id}/ | Replace rating          |
| PATCH  | /api/recipes/my/ratings/{id}/ | Update rating partially |
| DELETE | /api/recipes/my/ratings/{id}/ | Delete rating           |



```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Interactive Elements**: Hover effects, smooth transitions, and loading states
- **Image Optimization**: Automatic image compression and lazy loading
- **Search & Filter**: Real-time recipe and blog search functionality
- **Social Integration**: Easy sharing and social media connectivity

## 🔒 Security Features

- **Input Sanitization**: XSS prevention and SQL injection protection
- **CSRF Protection**: Django's built-in CSRF middleware
- **Rate Limiting**: API endpoint protection against abuse
- **Secure File Upload**: File type validation and secure storage
- **Password Security**: Bcrypt hashing with strength requirements

## 📈 Performance Optimizations

- **Database Optimization**: Efficient queries with select_related and prefetch_related
- **Caching Strategy**: Redis integration for frequently accessed data
- **Image Processing**: Automatic thumbnail generation and optimization
- **Code Splitting**: React lazy loading for improved initial load times
- **API Pagination**: Efficient large dataset handling


## 📊 Project Statistics

- **Backend**: Django models with comprehensive relationships
- **Frontend**: React components with modern hooks
- **API Endpoints**: RESTful endpoints
- **Authentication**: Multi-provider auth integration
- **Database**: Normalized schema with optimized queries
- **Testing**: Unit and integration test coverage

## 🤝 Contributing

This is a demonstration project showcasing full-stack development skills. The codebase follows industry best practices and is structured for scalability and maintainability.

## 📄 License

This project is created for educational and portfolio demonstration purposes.

## 👨‍💻 Developer

1. Abdul Kader Jilani (Leader)
2. Khandakar Zareer
3. Faiyaz Mahmud
4. Shafayet Salehin
5. Al Amin


---

*Built with ❤️ using Django, React, and modern web technologies*

## 📞 Contact

For any inquiries about this project:
- **Email**: [akjilani691995@gmail.com]
- **LinkedIn**: [https://www.linkedin.com/in/abdul-kader-jilani-67b04a165/]

---

**Note**: This project demonstrates proficiency in full-stack development, RESTful API design, modern frontend frameworks, user authentication, database design, and deployment-ready application architecture.
