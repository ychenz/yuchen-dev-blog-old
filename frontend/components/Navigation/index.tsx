import Link from "next/link";
import classNames from "classnames";
import { withRouter, NextRouter } from "next/router";
import React, { PureComponent, ReactElement } from "react";
import { WPRequest } from "wpapi";
import "./styles.scss";

const CLASS_NAME = "Navigation";

interface NavigationProps {
  router: NextRouter;
  menu: WPRequest;
}

interface NavigationStates {
  previousScrollPosition: number;
  shouldHide: boolean;
}

const getSlug = url => {
  const parts = url.split("/");

  return parts.length > 2 ? parts[parts.length - 2] : "";
};

class Navigation extends PureComponent<NavigationProps, NavigationStates> {
  menuRef = React.createRef<HTMLDivElement>();
  sliderRef = React.createRef<HTMLDivElement>();
  handlePageScrolledBound = this.handlePageScrolled.bind(this);

  constructor(props) {
    super(props);
    this.state = {
      previousScrollPosition: 0,
      shouldHide: false,
    };
  }

  static getPreviousSlider(): {
    previousSliderToMenuLeft: number;
    previousSliderWidth: number;
  } {
    const previousSliderToMenuLeft = parseFloat(localStorage.getItem("previousSliderToMenuLeft"));
    const previousSliderWidth =  parseFloat(localStorage.getItem("previousSliderWidth"));

    return { previousSliderToMenuLeft, previousSliderWidth };
  }

  static setSlider(distanceToMenuLeft: number, width: number): void {
    localStorage.setItem("previousSliderToMenuLeft", `${distanceToMenuLeft}`);
    localStorage.setItem("previousSliderWidth", `${width}`);
  }

  componentDidMount(): void {
    window.addEventListener("scroll", this.handlePageScrolledBound);
    this.moveSlider();
  }

  componentDidUpdate(): void {
    this.moveSlider();
  }

  componentWillUnmount(): void {
    window.removeEventListener("scroll", this.handlePageScrolledBound);
  }

  handlePageScrolled(): void {
    const currentScrollPosition = window.pageYOffset;
    const { previousScrollPosition } = this.state;
    const shouldHide = previousScrollPosition <= currentScrollPosition;

    this.setState({
      previousScrollPosition: currentScrollPosition,
      shouldHide
    });
  }

  moveSlider(): void {
    const activeMenuEntry = this.menuRef.current.querySelector(`.${CLASS_NAME}__menu-entry--active`);
    const { previousSliderToMenuLeft, previousSliderWidth } = Navigation.getPreviousSlider();

    if (!activeMenuEntry) {
      return;
    }

    const menuRec = this.menuRef.current.getBoundingClientRect();
    const activeMenuEntryRec = activeMenuEntry.getBoundingClientRect();
    const distance = activeMenuEntryRec.left - menuRec.left;
    const { width } = activeMenuEntryRec;
    Navigation.setSlider(distance, width);

    // Because SSR refreshes page on route change, we need to put slider to previous location first then animate
    this.sliderRef.current.setAttribute(
      "style",
      `display: block; left: ${previousSliderToMenuLeft}px; width: ${previousSliderWidth}px`
    );

    requestAnimationFrame(() => {
      this.sliderRef.current.setAttribute(
        "style",
        `display: block; left: ${distance}px; width: ${width}px`
      );
    });
  }

  render(): ReactElement {
    const { router, menu } = this.props;
    const { shouldHide } = this.state;

    return (
      <div className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--hidden`]: shouldHide
      })}>
        <div
          className={`${CLASS_NAME}__container`}
        >
          <div className={`${CLASS_NAME}__title`}>
            <Link href="/" >
              <a>Dev Life</a>
            </Link>
          </div>

          <div className={`${CLASS_NAME}__menu`} ref={this.menuRef}>
            <Link
              href="/"
            >
              <a className={classNames(`${CLASS_NAME}__menu-entry`, {
                [`${CLASS_NAME}__menu-entry--active`]: router.pathname === "/"
              })}>
                Blog
              </a>
            </Link>
            {menu.items.map(item => {
              if (item.object === "custom") {
                return null;
              }

              const slug = getSlug(item.url);
              const actualPage = item.object === "category" ? "category" : "post";
              const urlPathname = `/${item.object}/${slug}`;

              return (
                <Link
                  as={urlPathname}
                  href={`/${actualPage}?slug=${slug}&apiRoute=${item.object}`}
                  key={item.ID}
                >
                  <a className={classNames(`${CLASS_NAME}__menu-entry`, {
                    [`${CLASS_NAME}__menu-entry--active`]: router.pathname === `/${item.object}`
                  })}>
                    {item.title}
                  </a>
                </Link>
              );
            })}
            <Link
              href="/portfolio"
            >
              <a className={classNames(`${CLASS_NAME}__menu-entry`, {
                [`${CLASS_NAME}__menu-entry--active`]: router.pathname === "/portfolio"
              })}>
                Portfolio
              </a>
            </Link>
            <div className={`${CLASS_NAME}__menu-button`}>Subscribe</div>
            <div
              className={`${CLASS_NAME}__menu-slider`}
              ref={this.sliderRef}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Navigation);