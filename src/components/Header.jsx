import { Divider, Grid } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Header({ brand, item1, item2, item3, item4 }) {
    const { theme } = useContext(AppContext);

    return (
        <Grid
            container
            spacing={{ xs: 1, sm: 2 }}
            alignItems={"center"}
            bgcolor={theme ? "#363636" : "#dedede"}
            p={1}
        >
            <Grid item xs={12} sm={"auto"}>
                {brand}
            </Grid>

            <Grid item xs={12} sm={"auto"}>
                <Divider />
            </Grid>

            <Grid item xs={5} sm={3} lg={2}>
                {item1}
            </Grid>

            <Grid item>{item2}</Grid>

            <Grid item>{item3}</Grid>

            <Grid
                item
                display={{ xs: "flex", sm: "unset" }}
                flexGrow={1}
                justifyContent={{ xs: "flex-end", sm: "unset" }}
            >
                {item4}
            </Grid>
        </Grid>
    );
}

export default Header;
