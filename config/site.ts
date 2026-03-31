export type NavItem = {
    label: string;
    href: string;
  };
  
  export const siteConfig = {
    name: "Unified Self Evolution",
    shortName: "USE",
    description:
      "A structured platform for growth, learning, practice, and progression.",
    marketingNav: [
      { label: "About", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Courses", href: "/courses" },
    ] satisfies NavItem[],
    footerNav: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Courses", href: "/courses" },
      { label: "My Courses", href: "/my-courses" },
      { label: "My Certificates", href: "/my-certificates" },
    ] satisfies NavItem[],
  };