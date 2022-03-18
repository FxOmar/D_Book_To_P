import puppeteer, { Page, Browser } from "puppeteer";
import UserAgent from "user-agents";

const userAgent = new UserAgent();

const resourcePath = "https://www.goodreads.com";

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
 * Add book to the cart.
 *
 * @param page
 */
const addBookToCart = async (page: Page): Promise<void> => {
  await page.waitForNavigation();

  const addToCart = await page.$("#add-to-cart-button");

  // Check if add to cart button is exists.
  addToCart
    ? await addToCart.click()
    : () => {
        throw new Error("Something went wrong!");
      };
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

  /**
   * Wait for the user to navigate to the selected genre to collect the books,
   * Return a list of books names.
   **/
  await page.waitForNavigation();

  return await page.$$eval(".pollAnswer__bookLink > img", (options) =>
    options.map((option) => option.getAttribute("alt"))
  );
};

(async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    defaultViewport: null,
  });

  const page: Page = await newPage(browser);

  // To bypass reCAPTCHA -- I'm not a robot ^_~
  await page.setUserAgent(userAgent.toString());

  // Get books collection.
  const books = await getListOfBooks(page);

  // Get one random book.
  const book = GetRandomBook(books);

  // search for book on Amazon.
  searchOnAmazon(page, book).then(async () => {
    // Add book to the cart
    await addBookToCart(page);
  });
})();
