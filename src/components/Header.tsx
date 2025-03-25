import { Link } from 'lucide-react';

const Header = () => {
  return (
    <header className="p-4 flex items-center bg-background">
      <div className="flex items-center gap-2">
        <Link className="h-5 w-5" />
        <span className="font-semibold text-lg">StayLinker</span>
      </div>
    </header>
  );
};

export default Header;
