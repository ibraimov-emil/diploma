import * as React from "react"
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material"
import { FiMenu } from "react-icons/fi"
import { HiArrowSmRight } from "react-icons/hi"
// mock data
const links = ["About", "Docs", "Pricing", "Blog"]
const Logo = () => (  
  <Box
    sx={{   
      fontSize: "2xl",
      fontWeight: 800,
      textDecoration: "none",
      color: "gray.700",
    }}
  >
    ❍ UI Kit
  </Box>
)
// simple nav
export default function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget)
  }
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "background.paper",
        py: 1,
      }}
    >
      <Container>
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo />
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {links.map(link => (
              <Button
                component="a"
                href="#"
                key={link}
                onClick={handleCloseNavMenu}
                sx={{ fontWeight: 500 }}
              >
                {link}
              </Button>
            ))}
            <Button
              component="a"
              href="#"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 999,
              }}
              endIcon={<HiArrowSmRight size={16} />}
            >
              Get Started
            </Button>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="medium"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <FiMenu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
              disablePortal={true}
            >
              {links.map(link => (
                <MenuItem key={link} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{link}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}