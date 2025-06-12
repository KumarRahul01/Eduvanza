import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="w-full px-12 bg-gray-800 text-white py-6 mt-20">
      <div className="flex flex-col space-y-10 md:flex-row justify-between items-center">
        {/* Company Info */}
        <div className="lg:w-1/3 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">Eduvanza</h2>
          <p className="text-sm mt-2">Address: Noida, Uttar Pradesh</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>

        {/* Social Media Links */}
        <div className="lg:w-1/3 flex space-x-4 justify-center mb-4 md:mb-0 text-black">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="hover:bg-slate-200 dark:bg-slate-100 dark:hover:bg-slate-300 dark:hover:text-black"
            >
              Facebook
            </Button>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="hover:bg-slate-200 dark:bg-slate-100 dark:hover:bg-slate-300 dark:hover:text-black"
            >
              Twitter
            </Button>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="hover:bg-slate-200 dark:bg-slate-100 dark:hover:bg-slate-300 dark:hover:text-black"
            >
              Instagram
            </Button>
          </a>
        </div>

        {/* Contact Button */}
        <div className="lg:w-1/3 text-current">
          <p>© 2025 Eduvanza. All Rights Reserved.</p>
        </div>
      </div>

      {/* Footer Bottom */}
    </footer>
  );
};

export default Footer;
