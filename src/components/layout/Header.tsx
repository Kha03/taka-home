import { Logo } from "./Logo";
import { MainMenu } from "./MainMenu";
import { LanguageSelector } from "./LanguageSelector";
import { IconActions } from "./IconActions";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="w-full max-w-[1595px] mx-auto flex items-end justify-between bg-[var(--color-bg-main)]">
      <Logo />
      <div className="flex-1 flex items-center justify-center pb-2">
        <MainMenu />
      </div>
      <div className="flex items-center gap-6 ">
        <LanguageSelector />
        <IconActions />
        <UserMenu />
      </div>
    </header>
  );
}
