# JS Engineer Tech Challenge

Help customers decide which book to purchase by selecting their preferred genre.

## Demo

[![Watch demo]()](https://res.cloudinary.com/di8rsna4o/video/upload/v1647571832/Screen_Recording_2022-03-18_at_3.46.07_AM_fcm1td.mov)

## Tech Stack

**Server:** Node, Puppeteer, TypeScript

## Run Locally

Clone the project

```bash
  git clone git@github.com:the-code-studio/matterway-omar-challenge.git
```

Go to the project directory

```bash
  cd matterway-omar-challenge
```

Make sure that you're using node`v14.18.2`

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Appendix

If you're not using MacOs, unfortunately, you have to change a piece of code

```javascript
 const browser: Browser = await puppeteer.launch({
     ...
    executablePath:
      "/path/chrome", // Chnage this with your Google Chrome path
    ...
  });
```
