import { AppConfig } from "../../config";

export function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          INFORCE Url Shortener
        </a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href={AppConfig.ABOUT_PAGE_URL}>
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
