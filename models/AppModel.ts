import { NextPage } from "next";
import { AppProps } from "next/app";
import { FC, PropsWithChildren } from "react";
import { IProfileResponse } from "./ProfileModel";

export interface ILayoutProps {
  Layout?: FC<PropsWithChildren>;
}

export interface IAppProps<P = {}> extends AppProps<P> {
  Component: AppProps["Component"] & ILayoutProps;
}

export type IPage<P = {}, IP = P> = NextPage<P, IP> & ILayoutProps;
export type IPSNPage<P = {} & IProfileResponse, IP = P> = NextPage<P, IP> &
  ILayoutProps;
