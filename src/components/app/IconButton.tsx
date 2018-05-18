import * as React from "react";
import MuiIconButton, { ButtonProps } from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    minWidth: 32,
    minHeight: 32,
    height: 32,
    padding: "0 8px",
    lineHeight: "32px",
    borderRadius: 0,
  },
};

export default withStyles(styles)((props: ButtonProps) => <MuiIconButton {...props} />);
