import React, { CSSProperties, HTMLAttributes, FunctionComponent } from "react";
import clsx from "clsx";
import Select from "react-select/async";
import {
  createStyles,
  emphasize,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField, { BaseTextFieldProps } from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import CancelIcon from "@material-ui/icons/Cancel";
import { ValueContainerProps } from "react-select/src/components/containers";
import { ControlProps } from "react-select/src/components/Control";
import { MenuProps, NoticeProps } from "react-select/src/components/Menu";
import { MultiValueProps } from "react-select/src/components/MultiValue";
import { OptionProps } from "react-select/src/components/Option";
import { PlaceholderProps } from "react-select/src/components/Placeholder";
import { SingleValueProps } from "react-select/src/components/SingleValue";
import { ValueType, ActionMeta, OptionTypeBase } from "react-select/src/types";
import adb from "awesome-debounce-promise";

export interface OptionType {
  label: string;
  value: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      minWidth: 170,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    input: {
      display: "flex",
      padding: 10,
      height: "auto",
    },
    valueContainer: {
      display: "flex",
      flexWrap: "wrap",
      flex: 1,
      alignItems: "center",
      overflow: "hidden",
    },
    chip: {
      margin: theme.spacing(0.5, 0.25),
    },
    chipFocused: {
      backgroundColor: emphasize(
        theme.palette.type === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
        0.08
      ),
    },
    noOptionsMessage: {
      padding: theme.spacing(1, 2),
    },
    singleValue: {
      fontSize: 16,
    },
    placeholder: {
      position: "absolute",
      left: 10,
      bottom: 10,
      fontSize: 16,
    },
    paper: {
      position: "absolute",
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
    },
    divider: {
      height: theme.spacing(2),
    },
  })
);

const NoOptionsMessage: FunctionComponent<NoticeProps<OptionTypeBase>> = (
  props: NoticeProps<OptionTypeBase>
) => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

type InputComponentProps = Pick<BaseTextFieldProps, "inputRef"> &
  HTMLAttributes<HTMLDivElement>;

function inputComponent({ inputRef, ...props }: InputComponentProps) {
  return <div ref={inputRef} {...props} />;
}

const Control: FunctionComponent<ControlProps<OptionTypeBase>> = (
  props: ControlProps<OptionTypeBase>
) => {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps },
  } = props;

  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps,
        },
      }}
      {...TextFieldProps}
    />
  );
};

const Option: FunctionComponent<OptionProps<OptionTypeBase>> = (
  props: OptionProps<OptionTypeBase>
) => {
  return (
    <MenuItem
      ref={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
};

// type MuiPlaceholderProps = Omit<PlaceholderProps<OptionTypeBase>, "innerProps"> &
//   Partial<Pick<PlaceholderProps<OptionTypeBase>, "innerProps">>;

const Placeholder: FunctionComponent<PlaceholderProps<OptionTypeBase>> = (
  props: PlaceholderProps<OptionTypeBase>
) => {
  const { selectProps, innerProps = {}, children } = props;
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  );
};

const SingleValue: FunctionComponent<SingleValueProps<OptionTypeBase>> = (
  props: SingleValueProps<OptionTypeBase>
) => {
  return (
    <Typography
      className={props.selectProps.classes.singleValue}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
};

const ValueContainer: FunctionComponent<ValueContainerProps<OptionTypeBase>> = (
  props: ValueContainerProps<OptionTypeBase>
) => {
  return (
    <div className={props.selectProps.classes.valueContainer}>
      {props.children}
    </div>
  );
};

const MultiValue: FunctionComponent<MultiValueProps<OptionTypeBase>> = (
  props: MultiValueProps<OptionTypeBase>
) => {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={clsx(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
};

const Menu: FunctionComponent<MenuProps<OptionTypeBase>> = (
  props: MenuProps<OptionTypeBase>
) => {
  return (
    <Paper
      square
      className={props.selectProps.classes.paper}
      {...props.innerProps}
    >
      {props.children}
    </Paper>
  );
};

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

type MyAsyncSelectProps = {
  label: string;
  onChange: (value: ValueType<OptionTypeBase>, action: ActionMeta) => void;
  value: ValueType<OptionType>;
  loadOptions: (
    inputValue: string,
    callback: (options: readonly OptionTypeBase[]) => void
  ) => void | Promise<any>;
};

export default function MyAsyncSelect({
  value,
  label,
  onChange,
  loadOptions,
}: MyAsyncSelectProps) {
  const classes = useStyles();
  const theme = useTheme();

  const selectStyles = {
    input: (base: CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="react-select-single"
          TextFieldProps={{
            label: label,
            InputLabelProps: {
              htmlFor: "react-select-single",
              shrink: true,
            },
          }}
          noOptionsMessage={(_) => "No encontrado"}
          placeholder="Selecciona un elemento"
          loadOptions={adb(loadOptions, 500)}
          components={components}
          value={value}
          onChange={onChange}
        />
      </NoSsr>
    </div>
  );
}
