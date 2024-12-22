# NoteQ
## Description

A NextJs Realtime Note Taking App built using Liveblocks, Blocknote, Firebase, Clerk Auth, Tailwind, React.It includes various components and utilities to manage and interact with Firebase services.

## Project Structure
```
.env.local
.eslintrc.json
.gitignore
.next/
actions/
app/
components/
firebase-admin.ts
firebase.ts
lib/
liveblocks.config.ts
middleware.ts
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
public/
README.md
service_key.json
tailwind.config.ts
tsconfig.json
types/
utils/
```

## Setup
### Prerequisites
- **Node.js**
- **npm or yarn**


## Installation
1. Clone the repository:

```
git clone <repository-url>
cd <repository-directory>
```
2. Install dependencies:
```
npm install
# or
yarn install
```


3. Create a .env.local file in the root directory and add the following environment variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your-firebase-measurement-id>
PRIVATE_KEY=<your-private-key>
CLIENT_EMAIL=<your-client-email>
```

4. Running the Project

To start the development server, run:
```
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

## Firebase Setup
### Firebase Admin Initialization
The Firebase Admin SDK is initialized in firebase-admin.ts. It ensures that all required environment variables are present and initializes the Firebase Admin app.

### Firebase Client Initialization
The Firebase client SDK is initialized in firebase.ts. It configures the Firebase app with the provided environment variables and initializes Firestore.

### Available Scripts
dev: Runs the development server.

build: Builds the application for production.

start: Starts the production server.

lint: Runs ESLint to check for linting errors.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

