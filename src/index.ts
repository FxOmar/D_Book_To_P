import puppeteer, { Page, Browser } from "puppeteer";
import UserAgent from "user-agents";

const userAgent = new UserAgent();

const resourcePath = "https://www.goodreads.com";

let bookCollection: string[];

/**
 * Takes a collection of books
 *
 * @param books
 * @returns Random book from the collection.
 */
const GetRandomBook = (books: Array<string>): string =>
  books[Math.floor(Math.random() * books.length)];

/**
 * Takes new instance of the browser and returns new page.
 *
 * @param browser
 * @returns New page
 */
const newPage = async (browser: Browser): Promise<Page> => {
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);

  return page;
};

/**
 * @param page
 */
const GetTheBook = (page: Page): void => {
  // Get one random book.
  const book = GetRandomBook(bookCollection);

  // search for book on Amazon.
  searchOnAmazon(page, book).then(async () => {
    // Add book to the cart
    await addBookToCart(page);
  });
};

/**
 * Add book to the cart.
 *
 * @param page
 */
const addBookToCart = async (page: Page): Promise<void> => {
  await page.waitForNavigation();

  page.$("#add-to-cart-button").then((addToCart) => {
    addToCart ? addToCart.click() : GetTheBook(page);
  });
};

const searchOnAmazon = async (page: Page, title: string): Promise<void> => {
  // Navigate to Amazon an search for the given book.
  await Promise.all([
    await page.goto("https://www.amazon.com", { waitUntil: "networkidle2" }),
    await page.type("#twotabsearchtextbox", title),
    await page.click("#nav-search-submit-button"),
  ]);

  await page.waitForNavigation();

  const linkHandlers = await page.$x("//a[contains(text(), 'Paperback')]");

  linkHandlers.length > 0
    ? await linkHandlers[0].click()
    : () => {
        throw new Error("This book Paperback version not found!");
      };
};

/**
 * Collect all the books from the selected genre.
 *
 * @param page
 * @returns Array of books
 */
const getListOfBooks = async (page: Page): Promise<string[]> => {
  await page.goto(`${resourcePath}/choiceawards/best-books-2020`, {
    waitUntil: "networkidle2",
  });

  let isCategoryPage = false;

  /**
   * Wait for the user to navigate to the selected genre to collect the books,
   * Return a list of books names.
   **/
  while (!isCategoryPage) {
    await page.waitForNavigation();

    const url = await page.url();

    const extractGenreFromUrl = url.includes("best-")
      ? url.split("best-")[1].split("-books-2020")
      : ""; // TODO: use Regex to make it shorter.

    if (extractGenreFromUrl.length > 1) {
      isCategoryPage = true;
    }
  }

  return await page.$$eval(".pollAnswer__bookLink > img", (options) =>
    options.map((option) => option.getAttribute("alt"))
  );
};

(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    // TODO: Add support for cross-platform.
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    defaultViewport: null,
  });

  try {
    const page: Page = await newPage(browser);

    const [, books] = await Promise.all([
      // To bypass reCAPTCHA -- I'm not a robot ^_~
      page.setUserAgent(userAgent.toString()),
      // Get books collection.
      getListOfBooks(page),
    ]);

    bookCollection = books;

    GetTheBook(page);
  } catch (err) {
    await browser.close();
    throw new Error(err.message);
  }
})();
