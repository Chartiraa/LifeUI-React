
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faChartPie, faCog, faMapMarked, faDatabase, faCamera } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Navbar } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from "../routes";
import Logo from "../assets/img/Tatek.svg";
import { socket } from "../services/socket";

export default () => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const NavItem = (props) => {
    const { title, link, external, target, icon } = props;
    const classNames = "d-flex justify-content-between"
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} style={{ display: 'flex', justifyContent: 'space-between' }} >
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            <p style={{ display: 'inline', fontSize: "1.3rem" }}>{title}</p>
          </span>
        </Nav.Link>
      </Nav.Item>
    );
  };

  const LogoNavItem = (props) => {
    const { link, external, target, image, badgeText } = props;
    const classNames = "d-flex justify-content-center align-items-center"
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            <Image src={image} width={200} className="sidebar-icon svg-icon" style={{ marginLeft: '12px', marginBottom: '10px' }} />
          </span>
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={Routes.DashboardOverview.path}>
          <Image src={Logo} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <Nav className="flex-column pt-3 pt-md-0">
              <LogoNavItem title="TatekBOT" link={Routes.DashboardOverview} image={Logo} />

              <Dropdown.Divider className=" border-indigo" />

              <NavItem title="Kontrol Paneli" link={Routes.DashboardOverview.path} icon={faChartPie} />
              <NavItem title="Kameralar" icon={faCamera} link={Routes.Cameras.path} />
              <NavItem title="Veriler" icon={faDatabase} link={Routes.Log.path} />
              <NavItem title="Harita" icon={faMapMarked} link={Routes.Mapping.path} />
              <NavItem title="Ayarlar" icon={faCog} link={Routes.Settings.path} />

              <Button onClick={() => socket.emit("Stop", 'Stop')} className="upgrade-to-pro bg-danger"><FontAwesomeIcon icon={faExclamationTriangle} className="me-1" />Acil Stop</Button>
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
