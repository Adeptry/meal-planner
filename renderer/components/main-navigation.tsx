import Link from "next/link";
import { useRouter } from "next/router";
import { Nav, NavProps } from "react-bootstrap";

export interface MainNavProps {
  onNavLinkClick?: () => void;
  className?: string;
  navProps?: NavProps;
  navLinkClassName?: string;
}

export const MainNavigation = (props: MainNavProps) => {
  const router = useRouter();
  return (
    <Nav {...props.navProps}>
      <Link href="/" passHref>
        <Nav.Link
          className={props.navLinkClassName}
          active={router.pathname === "/"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Meal Plans
        </Nav.Link>
      </Link>
      <Link href="/profile" passHref>
        <Nav.Link
          className={props.navLinkClassName}
          active={router.pathname === "/profile"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Profile
        </Nav.Link>
      </Link>

      <Link href="/recipes" passHref>
        <Nav.Link
          className={props.navLinkClassName}
          active={router.pathname === "/recipes"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Recipes
        </Nav.Link>
      </Link>
      <Link href="/ingredients" passHref>
        <Nav.Link
          className={props.navLinkClassName}
          active={router.pathname === "/ingredients"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Ingredients
        </Nav.Link>
      </Link>
      <Link href="/data" passHref>
        <Nav.Link
          className={props.navLinkClassName}
          active={router.pathname === "/data"}
          onClick={() => {
            props.onNavLinkClick ? props.onNavLinkClick() : {};
          }}
        >
          Data
        </Nav.Link>
      </Link>
    </Nav>
  );
};
