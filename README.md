# JS Engineer Tech Challenge

Help customers decide which book to purchase by selecting their preferred genre.

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
