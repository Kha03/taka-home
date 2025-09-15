import { Logo } from "./Logo";
import { MainMenu } from "./MainMenu";
import { IconActions } from "./IconActions";
import { UserMenu } from "./UserMenu";

export default function Header() {
  return (
    <header className="w-full bg-[#FFEED3]">
      <div className="flex items-center w-6xl mx-auto py-1.5">
        <Logo />
        <div className=" ml-8 flex items-center justify-center">
          <MainMenu />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <IconActions />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
