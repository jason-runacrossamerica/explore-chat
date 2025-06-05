"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./ExploreBackButton.module.css";

export function ExploreBackButton({ as: _Component = _Builtin.Block }) {
  return (
    <_Component tag="div" id="topopage">
      <_Builtin.BlockContainer
        className={_utils.cx(_styles, "container")}
        grid={{
          type: "container",
        }}
        tag="div"
      >
        <_Builtin.Link
          className={_utils.cx(_styles, "back-link")}
          button={false}
          data-onclick="window.history.back()"
          block=""
          options={{
            href: "#",
          }}
        >
          {"Explore"}
        </_Builtin.Link>
      </_Builtin.BlockContainer>
    </_Component>
  );
}
