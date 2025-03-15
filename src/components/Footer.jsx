const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 text-center text-white bg-gray-800">
      &copy; {new Date().getFullYear()} Info Hub. All rights reserved.
    </footer>
  );
};

export default Footer;
