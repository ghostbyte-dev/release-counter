import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitch from './themeSwitch';

const Navbar = () => {
  return (
    <div className="fixed w-full z-20">
      <div className="border-b border-border py-2 bg-bg flex justify-center">
        <div className="w-full md:w-[90%] px-4 lg:px-8 flex justify-between items-center">
          <div>
            <Link href="/" className="">
              <div className="flex space-x-3 items-center p-2">
                <Image
                  src="/logo.svg"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                  alt=""
                />

                <div>
                  <span className="font-bold text-xl">Github Release Stats</span>

                  <div className="text-xs font-medium">A Ghostbyte Production</div>
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitch />

            <Link
              href="https://github.com/ghostbyte-dev/github-release-stats"
              rel="noopener noreferrer"
              target="_blank"
              className="btn"
            >
              View on Github
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
