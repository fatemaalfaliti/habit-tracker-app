# HabitTracker User Story

HabitTracker is a React Native mobile app that helps users build good habits, track their daily progress, and stay motivated with daily quotes and reminders.

---

## 1. Login / Registration Screen

### User Story 1.1: Account Registration
**Title:** Register a new account

As a **new user**, I want to **register by entering my username, email, and password** so that **I can create a personal account and save my habits**.

**Acceptance Criteria:**
1. The Sign Up screen shows fields for Username, Email, and Password, and a "Sign Up" button.
2. When all fields are valid, tapping "Sign Up" creates the account and takes the user to the Login screen.
3. A link "Already have an account? Login" lets the user switch to the Login screen.

**Story Points:** 3

### User Story 1.2: Account Login
**Title:** Log in to my account

As a **registered user**, I want to **log in using my email and password** so that **I can access my habits and progress**.

**Acceptance Criteria:**
1. The Login screen shows fields for Email and Password, and a "Login" button.
2. Entering correct credentials redirects the user to the Home screen.
3. A link "Don't have an account? Sign Up" lets the user switch to the Sign Up screen.

**Story Points:** 3

### User Story 1.3: Error Feedback on Sign Up and Login
**Title:** Receive error feedback

As a **user**, I want to **see a clear message when I leave fields empty or enter wrong details** so that **I know what to fix**.

**Acceptance Criteria:**
1. If any field is empty on Sign Up or Login, an alert shows "Please fill in all fields."
2. If the email or password is incorrect, an alert shows "Invalid email or password."
3. If the email format is invalid on Sign Up, an error message is shown.

**Story Points:** 2

### User Story 1.4: Store User Data
**Title:** Save my account details locally

As a **user**, I want **my registration details to be stored on my device** so that **I can log in again in future sessions**.

**Acceptance Criteria:**
1. User details are saved in local storage (AsyncStorage) after registration.
2. The saved details are used to check the credentials during login.

**Story Points:** 2

---

## 2. Home Screen

### User Story 2.1: Personalized Greeting
**Title:** See a welcome message

As a **user**, I want to **see a greeting with my name** so that **I feel welcomed and motivated to work on my habits**.

**Acceptance Criteria:**
1. The Home screen displays "Hello, [username]" followed by the title "Let's build great habits today."

**Story Points:** 1

### User Story 2.2: Daily Progress Overview
**Title:** View today's progress at a glance

As a **user**, I want to **see an overview of today's progress on the Home screen** so that **I can monitor how many habits I have completed**.

**Acceptance Criteria:**
1. A progress card shows the number of habits completed today out of the total (e.g., "3 of 5 completed").
2. A progress bar shows the completion percentage.
3. The progress updates immediately when a habit is marked as done.

**Story Points:** 3

### User Story 2.3: Habit Cards
**Title:** Browse my habits

As a **user**, I want to **see my habits displayed as cards** so that **I can quickly choose a habit to view or complete**.

**Acceptance Criteria:**
1. Each card shows the habit image or icon, title, category (e.g., Health, Mindfulness, Learning), and frequency or duration.
2. Each card shows whether the habit is completed today.
3. Tapping a card opens the Habit Detail screen.

**Story Points:** 3

### User Story 2.4: Quick Navigation
**Title:** Navigate easily from the Home screen

As a **user**, I want **clear navigation icons on the Home screen** so that **I can move around the app easily**.

**Acceptance Criteria:**
1. The app logo is displayed in the top-left corner.
2. A settings icon is displayed in the top-right corner and opens the Settings screen.

**Story Points:** 1

### User Story 2.5: Add a New Habit
**Title:** Add my own habit

As a **user**, I want to **add a new habit from the Home screen** so that **I can track the habits that matter to me**.

**Acceptance Criteria:**
1. An "+ Add Habit" button is shown on the Home screen.
2. The user can enter the habit name, choose a category, and set a duration.
3. The new habit appears immediately in the "My Habits" list and is saved locally.
4. The user can delete a habit they no longer want to track.

**Story Points:** 3

---

## 3. Detail Screen

### User Story 3.1: Habit Information
**Title:** View detailed information about a habit

As a **user**, I want to **see detailed information about a selected habit** so that **I understand its benefits and how to practice it**.

**Acceptance Criteria:**
1. A banner image of the habit is shown at the top of the screen, with the title, category, and duration below it.
2. An "About" tab shows a short description of the habit and its benefits.
3. A "Tips" tab shows step-by-step guidance on how to practice the habit.

**Story Points:** 3

### User Story 3.2: Mark Habit as Done
**Title:** Complete a habit for today

As a **user**, I want to **mark a habit as done for today** so that **I can track my daily progress**.

**Acceptance Criteria:**
1. A "Mark as Done" button is shown on the Detail screen.
2. Tapping it marks the habit as completed for today and changes the button to "Completed ✓".
3. The streak (number of consecutive days) is displayed and updated.

**Story Points:** 3

### User Story 3.3: Save and Share a Habit
**Title:** Add to favorites and share

As a **user**, I want to **add a habit to my favorites and share it with others** so that **I can find it quickly and recommend it to friends**.

**Acceptance Criteria:**
1. An "Add to Favorites" button with an outlined heart is shown for habits not in favorites.
2. Tapping it adds the habit to favorites, changes the text to "Remove from Favorites", and fills the heart icon.
3. A share icon at the top of the screen opens the device share options (social media, email, messaging apps).
4. A back icon at the top returns the user to the Home screen.

**Story Points:** 3

### User Story 3.4: My Favorites Screen
**Title:** View and manage my favorite habits

As a **user**, I want a **"My Favorites" screen** so that **I can see and manage all my saved habits in one place**.

**Acceptance Criteria:**
1. The screen lists favorite habits with their title, category, and duration.
2. Tapping a habit opens its Detail screen.
3. A "Remove from Favorites" button removes the habit from the list.

**Story Points:** 2

---

## 4. Integrate Persistent Data

### User Story 4.1: Stay Logged In
**Title:** Keep my login session

As a **user**, I want **my login state to persist across sessions** so that **I don't need to log in every time I open the app**.

**Acceptance Criteria:**
1. After a successful login, the session is saved in local storage.
2. When the app is reopened, a logged-in user goes directly to the Home screen.
3. The session is removed only when the user logs out.

**Story Points:** 2

### User Story 4.2: Save Habits and Progress
**Title:** Keep my habits and progress saved

As a **user**, I want **my habits, completed days, and favorites to be saved on my device** so that **I don't lose my progress when I close the app**.

**Acceptance Criteria:**
1. Habit completion status, streaks, and favorites are saved in AsyncStorage.
2. All saved data is loaded correctly when the app restarts.

**Story Points:** 3

### User Story 4.3: Remember My Preferences
**Title:** Save my app settings

As a **user**, I want **my preferences such as dark mode and reminders to be saved** so that **the app remembers my settings**.

**Acceptance Criteria:**
1. The selected theme (light/dark) is saved and applied when the app restarts.
2. Notification settings and saved reminders remain after restarting the app.

**Story Points:** 2

---

## 5. Integrate External API

### User Story 5.1: Quote of the Day
**Title:** See a motivational quote

As a **user**, I want to **see a new motivational quote on the Home screen every day** so that **I stay inspired to keep my habits**.

**Acceptance Criteria:**
1. The app fetches a quote from an external quotes API and displays the quote text and author on the Home screen.
2. A loading indicator is shown while the quote is being fetched.
3. If the request fails (e.g., no internet), a default quote or a friendly message is shown instead.

**Story Points:** 3

### User Story 5.2: Refresh the Quote
**Title:** Get a new quote

As a **user**, I want to **refresh the quote** so that **I can read another motivational message**.

**Acceptance Criteria:**
1. A refresh icon next to the quote fetches a new quote from the API.
2. The new quote replaces the old one without restarting the screen.

**Story Points:** 1

---

## 6. Settings Menu

### User Story 6.1: Access Settings
**Title:** Open the settings menu easily

As a **user**, I want to **access the settings menu from the Home screen** so that **I can adjust my preferences at any time**.

**Acceptance Criteria:**
1. A settings icon in the top-right corner of the Home screen opens the Settings screen.
2. A back icon returns the user to the previous screen.

**Story Points:** 1

### User Story 6.2: Organized Settings Sections
**Title:** Find options quickly

As a **user**, I want to **see the settings grouped into clear sections** so that **I can quickly find the option I need**.

**Acceptance Criteria:**
1. The Menu screen shows a greeting "Hello, [username]!" and the message "Would you like to change any settings?"
2. The menu shows option cards with icons: Settings, My Favorites, Daily Reminders, and Reports.
3. Tapping a card opens the related screen.
4. A "Logout" button is shown at the bottom of the menu.

**Story Points:** 2

---

## 7. Settings Screen

### User Story 7.1: Dark Mode
**Title:** Switch between light and dark themes

As a **user**, I want to **switch between light and dark mode** so that **I can reduce eye strain and customize the app's look**.

**Acceptance Criteria:**
1. A "Dark Mode" switch is shown in the Appearance section.
2. The theme changes immediately across all screens without restarting the app.

**Story Points:** 2

### User Story 7.2: Notification Preferences
**Title:** Control my notifications

As a **user**, I want to **turn notifications on or off** so that **I only receive the alerts I want**.

**Acceptance Criteria:**
1. An "Enable Notifications" switch is shown in the Notifications section.
2. When it is off, no reminders are sent.

**Story Points:** 2

### User Story 7.3: Edit Profile
**Title:** Update my account details

As a **user**, I want to **view and edit my name and email in the Settings screen** so that **my account information stays up to date**.

**Acceptance Criteria:**
1. The Account section shows the user's current username and email.
2. An "Edit" button lets the user change the username and email.
3. Tapping "Save" updates the details in local storage and shows a confirmation message.

**Story Points:** 2

### User Story 7.4: Logout
**Title:** Log out securely

As a **user**, I want a **clear and visible logout button** so that **I can securely log out when I'm done**.

**Acceptance Criteria:**
1. A "Logout" button is shown on the Settings screen.
2. Tapping it clears the session data and redirects the user to the Login screen.

**Story Points:** 1

---

## 8. Notifications

### User Story 8.1: Daily Reminder
**Title:** Get a daily habit reminder

As a **user**, I want to **receive a daily reminder notification** so that **I don't forget to complete my habits**.

**Acceptance Criteria:**
1. The user can choose a time for a daily reminder (e.g., 8:00 PM).
2. A notification is sent at the chosen time saying "Don't forget to complete your habits today!"

**Story Points:** 3

### User Story 8.2: Schedule a Reminder with a Calendar
**Title:** Add a reminder for a specific date and time

As a **user**, I want to **select a date and time from a calendar and add a reminder** so that **I can schedule reminders for future days**.

**Acceptance Criteria:**
1. A calendar shows the current month with arrows to move between months.
2. The screen shows "Selected Date" and "Selected Time", and the user can pick both.
3. Tapping "Add Reminder" schedules the reminder.

**Story Points:** 3

### User Story 8.3: Manage Reminders
**Title:** View and delete my reminders

As a **user**, I want to **see a list of all my reminders** so that **I can manage them easily**.

**Acceptance Criteria:**
1. All reminders are listed with their date and time.
2. A red "Delete" button next to each reminder removes it.

**Story Points:** 2

---

## 9. Reports

### User Story 9.1: Weekly Progress Report
**Title:** View my weekly progress

As a **user**, I want to **see a summary of my progress for the current week** so that **I can understand how consistent I am with my habits**.

**Acceptance Criteria:**
1. The Reports screen is opened from the "Reports" card in the Menu.
2. A bar chart shows the number of habits completed on each day of the week.
3. Summary cards show the number of completed habits, pending habits for today, and the best streak.

**Story Points:** 3

### User Story 9.2: Completed vs Pending Habits
**Title:** See which habits are done and which are pending

As a **user**, I want to **see lists of completed and pending habits for today** so that **I know what is left to do**.

**Acceptance Criteria:**
1. The Reports screen shows two lists: "Completed" and "Pending".
2. Each item shows the habit name and category.

**Story Points:** 2
