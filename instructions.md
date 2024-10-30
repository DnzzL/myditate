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

## Nuxt Form Actions

Title: Form Actions - Form Actions

URL Source: https://form-actions-nuxt.pages.dev/usage/form-actions

Markdown Content:
Form Actions are an alternative to api routes, and `useFetch`/`useAsyncData` composables. They allow you to submit data to your server using native HTML forms that can be progressively enhanced.

Let's start by creating a Nuxt page in `pages/login.vue` :

```

If you navigate to /login and you click the button on a form like this, the browser will send a POST request to the current path, which is /login.

Note: The path matched by your page is very important, as it respects the default behaviour of the browser.

In order to handle such a request with Nuxt, you need to create a route handler. With this module, you can create a form action to handle this using the /server/actions directory. Let’s create an action in /server/actions/login.ts :

export default defineFormActions({
  default: () => {
    console.log("Login called !")
  }
})


Note: It’s important that the file name matches the path of the page, and that you use a default export with the defineFormActions composable.

defineFormActions accepts an object of h3 event handlers. The key that you use only matters if you want to handle more than 1 action on the same route. By convention we use default for the main action.

You have now a working form action, but it doesn’t do much. Let’s add some logic to it.

Continuing with the previous example, let’s add some dummy logic to our form action :

// Replace with real logic
const createSession = (user: unknown) => "session-id"
// Replace with real logic
const getUser = (email: string, password: string) => ({ name: "Luke" })
// Replace with real validation
const validValue = (v: unknown): v is string => typeof v === "string" && v.length > 0
export default defineFormActions({
  signIn: async (event) => {
    // h3 exports a readFormData to obtain a FormData object
    const formData = await readFormData(event)
    const email = formData.get("email")
    const password = formData.get("password")
    // Handle your errors
    if (!validValue(email)) {
      return actionResponse(event, { email, invalid: true },
        { error: { message: "Invalid email" } })
    }
    if (!validValue(password)) {
      return actionResponse(event, { email, invalid: true },
        { error: { message: "Invalid password" } })
    }
    // Load the user
    const user = getUser(email, password)
    if (!user) {
      return actionResponse(event, { email, incorrect: true },
        { error: { message: "Invalid login" } })
    }
    // Attach a session cookie to the response
    setCookie(event, "session", createSession(user))
    // Respond with the user
    return actionResponse(event, { user })
  }
})


Now on succesful submissions, our server route will respond with a JSON payload containing the user data, and a session cookie.

Server composables defineFormActions and actionResponse are auto-imported, but you can explicitly import them from #form-actions.

Now that we have a working form action, we can progressively enhance the form to use it.

The useFormAction composable expose multiple helpers to help you with this.

enhance must be bound to the form element with the custom v-enhance directive.
data is a reactive object that will contain the response from the form action.

We can now use vue to display the response from the form action and to handle the error states. We can also bind the value of the inputs to the response from the form action, so that the form is pre-filled with the values that were submitted in case of error.

<script setup lang="ts">
const { enhance, data } = await useFormAction()
</script>
<template>
  <form v-enhance="enhance" method="POST" action="login">
    <p v-if="data.formResponse?.invalid" class="error">
      Invalid credentials.
    </p>
    <p v-if="data.formResponse?.incorrect" class="error">
      Invalid login.
    </p>
    <p v-if="data.formResponse?.user" class="success">
      {{ data.formResponse.user.name }} Found !
    </p>
    <label>
      Email
      <input name="email" type="email" :value="data.formResponse?.email ?? ''">
    </label>
    <label>
      Password
      <input name="password" type="password">
    </label>
    <button>Log in</button>
  </form>
</template>


It’s common to redirect the user after a successful form submission. Let’s first create a profile page to redirect our users to :

<template>
  <h1>Profile</h1>
</template>


Now let’s update our form action to redirect to this page. You can do this by using the 3rd argument of actionResponse :

export default defineFormActions({
  signIn: (event) => {
    // ...
    return actionResponse(event, { user }, { redirect: "/profile" })
  }
})


By default Nuxt will use server side navigation and hard navigate to /profile. However, if your form is progressively enhanced, Nuxt will use client side navigation instead.

It’s possible that you want to handle several actions in the same form actions. defineFormActions let you define multiple actions, and you can use the a query parameter to specify which action to call.

Let’s add some actions to our profile page :

<template>
  <h1>Profile</h1>
  <form method="POST">
    <button>Log out</button>
    <button formaction="profile?delete">
      Delete account
    </button>
  </form>
</template>


If you do not specify a formaction attribute on your button, the default action will be matched first. If no action is found, the first action will be called.

We need 2 event handlers to handle these actions. Let’s create a route handler for these 2 actions :

/server/actions/profile.ts

export default defineFormActions({
  logout: () => {
    console.log("logout ...")
  },
  delete: () => {
    console.log("delete ...")
  }
})


Now when we click on the buttons a POST request will be sent to /profile or /profile?delete. The route handler will execute the correct matching handler.

Refer to the simple template to see a full setup.
```

Title: Server Loaders - Form Actions

URL Source: https://form-actions-nuxt.pages.dev/usage/server-loaders

Markdown Content:
Server Loaders are a convenient way to load data from the server in your pages components. They can be used as an alternative to `useFetch` and `useAsyncData`, and other data fetching mechanisms. Under the hood, server loaders will create regular Nitro server handlers, meaning that they will _always_ run on the server. The returned data will be serialized and sent to the client, which means that while hydrating, they will run only once.

Server loaders _must_ be defined in the `/server/actions` directory. Let's start by creating a server loader in `/server/actions/books.ts` :

export const loader = defineServerLoader(async () => {
// This composable accepts an h3 event handler, you can use any logic that you
// want here, including database calls, etc.
return { books: [“title”], manybooks: [] }
})

The file name is _very_ important and will be used for the name of the loader (relative to `/server/actions`).

Your file _must_ use a `loader` named export.

Your loader is now ready to use in `pages` and `components`.

Let's create a Book component to illustrate the usage.

```

Note: This is very similar to useFetch and API routes. In fact, this module uses useFetch under the hood.

You can use route parameters in your server loaders. Let’s update our book loader to accept parameters and return them.

export const loader = defineServerLoader(async (event) => {
  // Use H3 helpers to grab the requests params
  const params = getQuery(event)
  return { books: ["title"], manybooks: [], params }
})


Now we can use this loader in a dynamic route like pages/books/[id].vue :

<script setup lang="ts">
const { result } = await useLoader("books")
</script>
<template>
  <div>
    <h1>Params</h1>
    {{ result.params }} <!-- params will be typed like this : { id: string } -->
  </div>
</template>


You can pass options to your loader using the useLoader 2nd argument. A subset of the useFetch options are supported.

You can specify watch sources to automatically reload your loader. This is useful if you want to reload your loader when a specific store value changes. You can also specify custom query parameters :

<script setup lang="ts">
const { result } = await useLoader("books", { params: { id: "1" } })
</script>


Note: useLoader 2nd argument and useFormAction({ loaderOptions }) can both be used to pass loader options to the underlying useFetch call.

Here’s the typescript signature of the accepted options :

interface LoaderOptions {
  watch?: MultiWatchSources
  params?: SearchParameters
}
```
