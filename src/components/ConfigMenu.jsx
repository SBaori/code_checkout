import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";

import {
    FormControl,
    FormControlLabel,
    IconButton,
    Menu,
    MenuItem,
    Switch,
} from "@mui/material";
import { useState } from "react";

function ConfigMenu({
    isProgRunning,
    interactiveState,
    termResetOnRunState,
    themeState,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [interactive, setInteractive] = interactiveState;
    const [termResetOnRun, setTermResetOnRun] = termResetOnRunState;
    const [theme, setTheme] = themeState;

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                id="basic-button"
                onClick={handleClick}
                sx={{ color: theme ? "#ababab" : "none" }}
            >
                <SettingsRoundedIcon
                    sx={{
                        fontSize: "1.4rem",
                    }}
                />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem>
                    <FormControl size="small" disabled={isProgRunning}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={interactive}
                                    onChange={() =>
                                        setInteractive(
                                            (interactive) => !interactive,
                                        )
                                    }
                                />
                            }
                            label="Interactive"
                        />
                    </FormControl>
                </MenuItem>
                <MenuItem>
                    <FormControl size="small" disabled={isProgRunning}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={termResetOnRun}
                                    onChange={() =>
                                        setTermResetOnRun(
                                            (termResetOnRun) => !termResetOnRun,
                                        )
                                    }
                                />
                            }
                            label="Autoclear"
                        />
                    </FormControl>
                </MenuItem>
                <MenuItem>
                    <FormControl size="small" disabled={true}>
                        <FormControlLabel
                            // sx={{ display: "flex", alignItems: "center" }}
                            control={
                                <Switch
                                    checked={theme}
                                    onChange={() => setTheme((theme) => !theme)}
                                />
                            }
                            label={theme ? "Dark Theme" : "Light Theme"}
                        />
                    </FormControl>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default ConfigMenu;
