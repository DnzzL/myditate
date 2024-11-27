# Product Requirements Document (PRD): Personalized Meditation App

## Project Overview

The Personalized Meditation App aims to provide users with custom audio meditations based on selected topics and preferences, delivered as on-demand experiences. By combining an AI language model to generate unique meditation scripts and a text-to-speech (TTS) model for audio output, users can select meditation length, tone, voice, and background sound, creating a tailored experience every time.

## Technologies

- **Frontend:** Nuxt.js, TailwindCSS, shadcn, lucide-vue-next icons
- **Backend:** Node.js API with Docker for containerization
- **Audio:** ElevenLabs (TTS)
- **Authentication:** Social and email login (OAuth)

## 1. Core Functionalities

### 1.1 User Authentication & Account Management

- **Sign-Up/Log-In:** Users can register via email or social login
- **Forgot Password:** Reset option via email
- **Profile Management:** Basic details and preferences update

**Implementation Requirements:**

- Authentication to be managed using a Nuxt.js-compatible library, with middleware for protecting certain pages

### 1.2 Meditation Generation

- **Topic Selection:** User selects or inputs a meditation topic, such as "Stress Relief" or "Focus"
- **Duration Selection:** Options for 5, 10, or 15-minute sessions
- **Voice Selection:** Choose among different voice types (e.g., "Calm," "Energetic")
- **Background Sound Selection:** Optional background sounds (e.g., rain, ocean, or silence)
- **Generate Meditation:** The backend receives inputs to create a script with the LLM, which the TTS converts into audio

**Implementation Requirements:**

- A backend API endpoint for generating the meditation
- A UI to guide users through selecting preferences
- Background sound as an optional overlay to the meditation audio

### 1.3 Meditation Playback & Library

- **Meditation Library:** Users can view their saved meditations
- **Playback Controls:** Options to play, pause, stop, and track progress
- **Download Option:** Audio downloads for offline use
- **Progress Tracking:** Visual and numeric progress bar and countdown timer during playback

**Implementation Requirements:**

- Meditation storage and library views
- Audio player component with download and playback options

### 1.4 Meditation Management

- **Regenerate Meditation:** Option to create a new version with different settings
- **Delete Meditation:** Remove saved meditations from the library

**Implementation Requirements:**

- Update meditation options in the user library
- Display deletion confirmation

### 1.5 User Feedback and Quality Control

- **Rating & Feedback:** After each meditation, users can provide a rating and comments
- **Usage Tracking:** Record key interactions to improve personalized suggestions

**Implementation Requirements:**

- Feedback UI following meditation completion
- Backend API to store and analyze feedback and usage data

### 1.6 Notifications & Error Handling

- **Loading Indicators:** Show progress during meditation generation
- **Error Notifications:** Notify users of errors (e.g., generation issues or connectivity problems) with retry options

## 2. File Structure

```bash
.
├── Dockerfile
├── README.md
├── app.vue
├── assets
│   └── css
│       └── main.css                 # Global Tailwind styles
├── components
│   ├── ui                           # Reusable UI components
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── LoadingSpinner.vue
│   ├── meditation                   # Meditation-specific components
│   │   ├── MeditationPlayer.vue
│   │   └── MeditationCard.vue
├── lib
│   ├── utils.ts                     # Utility functions
├── pages
│   ├── index.vue                    # Home/landing page
│   ├── login.vue                    # Login page
│   ├── signup.vue                   # Signup page
│   └── meditation
│       ├── index.vue                # Meditation Library page
│       ├── create.vue               # Meditation Creation page
│       └── [id].vue                 # Individual Meditation view page
├── server
│   ├── api                          # API route handlers
│   │   ├── auth.ts                  # Authentication endpoints
│   │   ├── meditation.ts            # Meditation generation endpoints
│   └── tsconfig.json
├── public
│   ├── favicon.ico
│   └── robots.txt
├── store
│   └── index.ts                     # Pinia store configuration if necessary
├── middleware
│   └── auth.js                      # Authentication middleware
├── composables                      # Vue composables
│   ├── useMeditation.ts             # Meditation handling
│   └── useAuth.ts                   # Authentication
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.js
└── tsconfig.json
```

## 3. Technical Requirements and Notes

- **Frontend Framework:** Nuxt.js with TailwindCSS for styling, shadcn for custom design elements, and lucide-vue-next icons for a polished UI experience
- **State Management:** Use either LocalStorage or Pinia for managing authentication, meditation library, and user settings globally
- **Authentication:** Middleware protects routes requiring login and social login for faster onboarding
- **Composables:** useMeditation.ts for meditation logic, and useAuth.ts for login and authentication flows

## 4. User Stories

1. As a new user, I want to sign up with my email or social media so I can quickly start using the app
2. As a user, I want to choose a meditation topic, length, voice, and background sound so my meditation feels personalized
3. As a user, I want to save and access past meditations so I can revisit my favorite sessions
4. As a user, I want to be able to download my meditation audio so I can listen offline
5. As a user, I want to be able to rate and provide feedback on a meditation so the app can improve future experiences

## 5. Success Metrics

- **User Retention:** Track user return rate after meditation completion
- **Feedback Utilization:** Measure the quality and utility of user feedback for improvements
- **Engagement:** Frequency of meditation creation, playback, and downloads

# Documentation
