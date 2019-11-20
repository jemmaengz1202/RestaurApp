import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { ValueType } from "react-select";
import { axiosInstance } from "../api";
import MyAsyncSelect, { OptionType } from "./MyAsyncSelect";
import WithTheme from "./WithTheme";

const simple = () => {
  const [value, setValue] = useState<ValueType<OptionType>>(null);
  return (
    <WithTheme>
      <MyAsyncSelect
        value={value}
        label="Categoría"
        onChange={v => {
          console.log(v);
          setValue(v as any);
        }}
        loadOptions={async inputValue => {
          const response = await axiosInstance({
            url: `/categorias?page=1&filter[where][q]=${
              inputValue ? inputValue : ""
            }`,
            method: "GET"
          });
          if (response) {
            return response.data.data.map((v: any) => ({
              label: v.nombre,
              value: v.id
            }));
          }
          return [];
        }}
      />
    </WithTheme>
  );
};

storiesOf("MyAsyncSelect", module).add("simple", simple);
