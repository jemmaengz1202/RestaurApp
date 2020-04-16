import React from "react";
import { storiesOf } from "@storybook/react";
import WithTheme from "../components/WithTheme";
import SignIn from "./SignIn";
import { lightTheme } from "../themes";

storiesOf("SignInForm", module)
  .add("Dark theme", () => (
    <WithTheme>
      <SignIn />
    </WithTheme>
  ))
  .add("Light theme", () => (
    <WithTheme theme={lightTheme}>
      <SignIn />
    </WithTheme>
  ));
