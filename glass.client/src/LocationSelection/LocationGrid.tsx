import { Box, Grid } from "@radix-ui/themes";
import React from "react";

const LocationGrid = ({ children }: any) => {
  return (
    <Grid columns={{ md: "1", sm: "1", xs: "1" }} gap="3" width="auto">
      {children}
    </Grid>
  );
};

export default LocationGrid;
