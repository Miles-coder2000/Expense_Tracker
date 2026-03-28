# Authentication Setup Guide

## Overview
Your Student Expense Tracker now has complete authentication functionality using Supabase. Students can register, login, manage their profiles, and track their personal expenses securely.

## Features Added

### Authentication System
- Student registration with email and password
- Secure login system
- Password reset functionality
- Session management with automatic redirects
- Logout functionality

### Student Profiles
- Full name
- Student ID (optional)
- School/University (optional)
- Major/Course (optional)
- Email (managed by authentication)

### Data Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure password storage handled by Supabase
- Database-level security policies

### User Interface
- Modern authentication pages with login and registration tabs
- Profile management modal
- User greeting in header
- Logout and profile buttons
- Responsive design for mobile and desktop

## How to Use

### For Students

1. **Registration**
   - Visit `auth.html` (or the app will redirect you there)
   - Click the "Register" tab
   - Fill in your details (Student ID, School, and Major are optional)
   - Create a password (minimum 6 characters)
   - Click "Register"

2. **Login**
   - Enter your email and password
   - Click "Login"
   - You'll be redirected to the main expense tracker

3. **Using the Tracker**
   - Add income and expenses
   - All transactions are private to your account
   - View your balance, income, and expense summaries
   - Filter and search your transactions

4. **Managing Your Profile**
   - Click the "Profile" button in the header
   - Update your information
   - Click "Save Profile"

5. **Logout**
   - Click the "Logout" button in the header

### Database Structure

#### student_profiles table
- Stores student information
- Links to authentication system
- Optional fields for flexibility

#### transactions table
- Stores all income and expense records
- Each transaction is linked to a user
- Includes RLS policies for data isolation

## Security Features

1. **Authentication**
   - Passwords are hashed and secure
   - JWT-based session management
   - Automatic session validation

2. **Row Level Security**
   - Users can only view their own transactions
   - Users can only modify their own profile
   - Database enforces security at the data layer

3. **Data Validation**
   - Required fields enforced
   - Transaction amounts must be positive
   - Type validation (income vs expense)

## Technical Details

### Frontend Files
- `auth.html` - Authentication page
- `auth.css` - Authentication styling
- `auth.js` - Authentication logic
- `supabaseClient.js` - Supabase configuration
- `script.js` - Main app logic (updated)
- `style.css` - Main app styling (updated)
- `index.html` - Main app page (updated)

### Database Tables
- `student_profiles` - User profile information
- `transactions` - Income and expense records

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Next Steps

Your app is now fully functional with authentication. Students can:
- Create their own accounts
- Track their personal expenses
- Manage their profiles
- Have complete data privacy

The old MongoDB-based backend (server.js, routes, models) is no longer needed as Supabase handles all database operations and authentication.
