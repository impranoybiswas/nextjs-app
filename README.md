This is a Store App For Get Component Easily

# Installation and Usage

## Better Auth
- install : npm install better-auth
- component : SignInForm, SignUpForm, SignOutButton, GoogleSignInButton
- api : api/auth/[...all]
- library : auth, auth-client
- env : BETTER_AUTH_SECRET, NEXT_PUBLIC_APP_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

## MongoDB
- install : npm install mongodb
- library : mongodb, collection
- env : MONGODB_URI, DATABASE_NAME

## Theme Toggle
- install : npm install next-themes
- component : ThemeToggle;
- provider : ThemeProvider from Next Theme;

## Color Toggle
- context : ColorContext;
- component : ColorToggle;
- provider : ColorProvider;

## Language Toggle
- install : npm install next-intl
- component : LanguageToggle;
- provider : IntlProvider from Next Intl;
- message : messages;
- i18n : i18n;
- proxy : proxy.ts;

## Font Toggle
- context : FontContext;
- component : FontToggle;
- provider : FontProvider;

## Mailer
- install : npm install nodemailer
- component : sendMail
- template : email-templates
- api : api/mailer
- env : EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS

## Groq Chat Bot
- install : npm install groq-sdk
- component : GroqChatbot
- api : api/groq-chat
- env : GROQ_API_KEY

## Generate PDF
- install : npm install jsPDF, autoTable
- component : FormToPDF
- library : generate-pdf

## ImageKit Upload
- install : npm install @imagekit/sdk
- component : ImageUpload
- hook : useImageKit
- env : NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PRIVATE_KEY
