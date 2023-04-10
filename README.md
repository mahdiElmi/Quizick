# Quizick

Quizick is a web-based quiz application that allows users to test their knowledge on a variety of topics.
With a user-friendly interface and a wide range of categories, Quizick offers an engaging and educational experience for trivia lovers of all ages.
Features include a timed lightning mode, high score tracking, and personalized recommendations based on user performance.
Developed with React and powered by an API of curated questions from opentdb.

## technolgies used during this project:

* The app is written in **typescript** to have less bug-prone codebase and smoother
  development.

* Created custom interfaces to type application state and component props.
* Used React hooks, including useState for managing the application state and useEffect
  for configuring the timer and manipulating the DOM.
* Utilized **TailwindCSS** for styling the app with different screen sizes and UI accessibility
  in mind, including colorblind accessibility, text-background contrast ratio, and dark
  mode with user OS preferences in mind.
* Implemented local storage to store user preferences for question configuration and
  dark mode settings, improving user experience.
* Utilized session storage to store API access key and prevent users from receiving
  duplicate questions.
* Leveraged **react query** with **Axios** to fetch data from the API and created a loading
  skeleton to have a smoother transition and decrease perceived loading time.
* Created error components to render in case an error occurs.
* Incorporated **Framer Motion** for smoother and bouncier animations, including natural
  layout transitions and swipe events on touch devices.
* Utilized third-party packages, such as **Headless UI** and react-rewards, for accessible
  form inputs and congratulating users on perfect scores or high scores.
* Used **Vite** to have fast build times and instant feedback during development
* Used **pnpm** as the package manager to have fast install times and more efficient use of
  disk space and memory.
* Checked Core Web Vitals regularly, and tried to use lightweight packages to have a
  smaller js bundle and faster load time.
* Maintained clean code principles with code formatting using **Prettier**.
