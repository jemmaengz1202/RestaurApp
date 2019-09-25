import React from "react";
import { storiesOf } from "@storybook/react";
import WithTheme from "../components/WithTheme";
import SignIn from "./SignIn";

storiesOf('SignInForm', module)
  .add('Dark theme', () => (
    <WithTheme>
      <SignIn />
    </WithTheme>
  ));
